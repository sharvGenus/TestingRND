const { Op } = require("sequelize");
const scheduler = require("node-schedule");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Tickets = require("../../database/operation/tickets");
const TicketsHistory = require("../../database/operation/tickets-history");
const FormWiseTicketMappings = require("../../database/operation/form-wise-ticket-mappings");
const FormAttrubutes = require("../../database/operation/form-attributes");
const ticketMappingService = require("../ticket-mappings/ticket-mappings.service");
const { getFormByCondition } = require("../forms/forms.service");
const { createNewTicketAssignedNotification, deleteNotificationByResponseId } = require("../form-notifications/form-notifications.service");
const ProjectWiseTicketMappings = require("../../database/operation/project-wise-ticket-mappings");
const SupervisorAssignments = require("../../database/operation/supervisor-assignments");
const { processFileTasks } = require("../files/files.service");
const EscalationMatrix = require("../../database/operation/escalation-matrix");
const EscalationLevels = require("../../database/operation/escalation-levels");
const TicketEmailTemplates = require("../../database/operation/ticket-email-template");
const { ticketEmailSender } = require("../smtp-configurations/smtp-configurations.service");
const Users = require("../../database/operation/users");

const ticketAlreadyExists = async (where) => {
    try {
        const ticket = new Tickets();
        const data = await ticket.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_TICKET_DETAILS, error);
    }
};

function parseTimeString(timeString) {
    const regex = /(\d+)([wdhms])?/g;
    let match = regex.exec(timeString);
    let totalMilliseconds = 0;
  
    while (match) {
        const [, value, unit] = match;
        const multiplier = GET_MULTIPLIER[unit] || 1;
        totalMilliseconds += parseInt(value) * multiplier;
        match = regex.exec(timeString);
    }
  
    return totalMilliseconds;
}

const GET_MULTIPLIER = {
    w: 7 * 24 * 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000
};

const ticketEscalationProcess = async (ticketId, escalationId, templateId) => {
    const tickets = new Tickets();
    const ticketData = await tickets.findOne({ id: ticketId }, undefined, true);
    if (ticketData.ticketStatus === "closed") return;
    const ticket = JSON.parse(JSON.stringify(ticketData));
    const escalationLevels = new EscalationLevels();
    const escalationLevelData = await escalationLevels.findOne({ escalationId, level: ticket.escalation });
    if (!escalationLevelData) return;
    // Update ticket and escalate the mail
    ticket.escalation += 1;
    await tickets.update(ticket, { id: ticket.id });
    const ticketEmailTemplates = new TicketEmailTemplates();
    const ticketEmailTemplateData = await ticketEmailTemplates.findOne({ id: templateId });
    if (!ticketEmailTemplateData) return;
    if (!ticketEmailTemplateData.subIssueIds?.includes(ticket.subIssueId)) return;
    const users = new Users();
    const [toEmailsData, ccEmailsData] = await Promise.all([
        users.findAll({ id: escalationLevelData.to }, ["email"]),
        users.findAll({ id: escalationLevelData.cc }, ["email"])
    ]);
    const toEmails = toEmailsData.map((data) => data.email);
    const ccEmails = ccEmailsData.map((data) => data.email);
    const { body, displayName, subject, from } = ticketEmailTemplateData;
    await ticketEmailSender(ticket, { body, displayName, subject, from, to: toEmails, cc: ccEmails });

    // Check for next escalation
    const nextEscalationLevelTime = await escalationLevels.findOne({ escalationId, level: ticket.escalation }, ["time"]);
    if (!nextEscalationLevelTime) return;
    const ticketCreateTime = new Date(ticket.createdAt);
    const milliseconds = parseTimeString(nextEscalationLevelTime?.time);
    const scheduledDate = new Date(ticketCreateTime.getTime() + milliseconds);
    if (scheduledDate < Date.now()) {
        ticketEscalationProcess(ticketId, escalationId, templateId);
    } else {
        scheduler.scheduleJob(scheduledDate, () => {
            ticketEscalationProcess(ticketId, escalationId, templateId);
        });
    }
};

const escalateTicket = async (ticket) => {
    const escalationMatrix = new EscalationMatrix();
    const escalationMatrixData = await escalationMatrix.findAll({ projectId: ticket.projectId }, undefined, true);
    let escalationId;
    let templateId;
    for (const escalation of escalationMatrixData) {
        const { subIssueIds } = escalation.ticket_email_template;
        if (subIssueIds.includes(ticket.subIssueId)) {
            escalationId = escalation.id;
            templateId = escalation.ticket_email_template.id;
            break;
        }
    }
    if (!escalationId) return;

    // Ticket escalation process
    const escalationLevel = new EscalationLevels();
    const escalationLevelZero = await escalationLevel.findOne({ escalationId, level: 0 });
    const escalationTime = escalationLevelZero.time;
    const milliseconds = parseTimeString(escalationTime);
    const ticketCreateTime = new Date(ticket.createdAt);
    const scheduledDate = new Date(ticketCreateTime.getTime() + milliseconds);
    const tickets = new Tickets();
    await tickets.update({ escalation: 0 }, { id: ticket.id });
    if (scheduledDate < Date.now()) {
        ticketEscalationProcess(ticket.id, escalationId, templateId);
    } else {
        scheduler.scheduleJob(scheduledDate, () => {
            ticketEscalationProcess(ticket.id, escalationId, templateId);
        });
    }
};

/** Method to create ticket */
const createTicket = async (ticketDetails, loggedInUserId) => {
    const { projectId } = ticketDetails;
    const ticket = new Tickets();
    // Check if the there already present a ticket for that responseID
    const existingTicket = await ticket.isAlreadyExists({ responseId: ticketDetails.responseId, ticketStatus: { [Op.not]: "closed" } });
    if (existingTicket) {
        throwError(statusCodes.BAD_REQUEST, statusMessages.TICKET_ALREADY_PRESENT);
    }
    const projectWiseMapping = new ProjectWiseTicketMappings();
    try {
        /** Retrieve the last ticket for the specific project */
        const [lastTicket, projectWiseMappingData] = await Promise.all([ticket.findOne({ projectId }, undefined, undefined, { order: [["createdAt", "DESC"]] }, true), projectWiseMapping.findOne({ projectId: ticketDetails.projectId })]);
        /** Calculate the next ticket number based on the last ticket */
        if (lastTicket) {
            ticketDetails.ticketNumber = lastTicket.ticketNumber + 1;
        } else {
            ticketDetails.ticketNumber = +projectWiseMappingData.ticketIndex;
        }

        if (ticketDetails?.attachments?.length) {
            const processedAttachments = await processFileTasks({
                reqFiles: ticketDetails.attachments,
                directory: `helpdesk-tickets-uploads/${projectWiseMappingData?.prefix || ""}${ticketDetails.ticketNumber}`
            });
            
            ticketDetails.attachments = processedAttachments.map((path) => `/${path}`);
        }
        /** Create a new ticket with the calculated ticket number */
        let newTicket = await ticket.create(ticketDetails);
        newTicket = JSON.parse(JSON.stringify(newTicket));
        await escalateTicket(newTicket);
        if (newTicket.assigneeType !== "nomc") {
            const userId = ticketDetails.assigneeType === "supervisor" ? ticketDetails.supervisorId : ticketDetails.assigneeId;
            await createNewTicketAssignedNotification(userId, newTicket.projectId, newTicket.formId, newTicket.responseId, loggedInUserId, newTicket.id);
        }
        newTicket.updatedTicketNumber = `${projectWiseMappingData.prefix || ""}${newTicket.ticketNumber}`;
        return newTicket;
    } catch (error) {
        console.error("Error creating ticket:", error);
        throw error;
    }
};

const getTicketByCondition = async (where) => {
    try {
        const ticket = new Tickets();
        const data = await ticket.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TICKET_FAILURE, error);
    }
};

const checkForInProgressTicketStatusforUser = async (ticketId, assigneeId) => {
    const ticket = new Tickets();
    return ticket.isAlreadyExists({ id: { [Op.not]: ticketId }, isActive: "1", assigneeId, ticketStatus: "in-progress" });
};

const updateTicket = async (ticketDetails, loggedInUserId, where) => {
    try {
        const ticket = new Tickets();
        const oldticket = await ticket.findOne({ id: ticketDetails.id });
        if (!oldticket) {
            throwError(statusCodes.BAD_REQUEST, statusMessages.TICKET_NOT_EXIST);
        }
        if (ticketDetails.ticketStatus === "in-progress") {
            const inProgressTIcketStatusUser = await checkForInProgressTicketStatusforUser(ticketDetails.id, ticketDetails.assigneeId);
            if (inProgressTIcketStatusUser) {
                throwError(statusCodes.BAD_REQUEST, statusMessages.TICKET_STATUS_ALREADY_EXIST);
            }
        }
        if (ticketDetails?.newAttachments?.length) {
            const processedAttachments = await processFileTasks({
                reqFiles: ticketDetails.newAttachments,
                directory: `helpdesk-tickets-uploads/${ticketDetails.updatedTicketNumber}`
            });
            if (ticketDetails.attachments) {
                ticketDetails.attachments = [...ticketDetails.attachments, ...processedAttachments.map((path) => `/${path}`)];
            } else {
                ticketDetails.attachments = processedAttachments.map((path) => `/${path}`);
            }
        }
        const data = await ticket.update(ticketDetails, where);
        if (ticketDetails.subIssueId !== oldticket.subIssueId) {
            const updatedTIcket = await ticket.findOne({ id: ticketDetails.id });
            escalateTicket(updatedTIcket);
        }
        let userId = null;
        const oldUser = oldticket.assigneeId;
        if (ticketDetails.assigneeType !== "nomc" && ticketDetails.ticketStatus !== "closed") {
            let flag = false;
            if (ticketDetails.supervisorId && ticketDetails.supervisorId !== oldticket.supervisorId) {
                userId = ticketDetails.supervisorId;
                flag = true;
            } else if (ticketDetails.assigneeId && ticketDetails.assigneeId !== oldticket.assigneeId) {
                userId = ticketDetails.assigneeId;
                flag = true;
            }
            if (flag) {
                await createNewTicketAssignedNotification(userId, ticketDetails.projectId, ticketDetails.formId, ticketDetails.responseId, loggedInUserId, ticketDetails.id, oldUser);
            }
        } else {
            await deleteNotificationByResponseId(ticketDetails.responseId, "handt", ticketDetails.id);
        }
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TICKET_UPDATE_FAILURE, error);
    }
};

const mobileUpdateTicket = async (where, ticketDetails, userId) => {
    try {
        const ticket = new Tickets();
        let existingTicket = await ticket.findOne(where);
        if (!existingTicket) {
            throwError(statusCodes.BAD_REQUEST, statusMessages.TICKET_NOT_EXIST);
        }
        existingTicket = JSON.parse(JSON.stringify(existingTicket));
        if (ticketDetails.ticketStatus === "in-progress") {
            const inProgressTIcketStatusUser = await checkForInProgressTicketStatusforUser(where.id, userId);
            if (inProgressTIcketStatusUser) {
                throwError(statusCodes.BAD_REQUEST, statusMessages.TICKET_STATUS_ALREADY_EXIST);
            }
        }
        existingTicket.ticketStatus = ticketDetails.ticketStatus;
        existingTicket.assigneeRemarks = ticketDetails.assigneeRemarks;
        const oldUser = existingTicket.assigneeId;
        if (ticketDetails.assigneeId === null) {
            if (existingTicket.supervisorId === existingTicket.assigneeId) {
                // ticket was assigned to supervisor
                existingTicket.supervisorId = null;
                existingTicket.assigneeId = null;
                existingTicket.assigneeType = "nomc";
                await deleteNotificationByResponseId(existingTicket.responseId, "handt", existingTicket.id);
            } else {
                existingTicket.assigneeId = null;
                if (existingTicket.assigneeType === "installer") {
                    existingTicket.assigneeType = "nomc";
                    await deleteNotificationByResponseId(existingTicket.responseId, "handt", existingTicket.id);
                } else if (existingTicket.assigneeType === "supervisor") {
                    existingTicket.assigneeId = existingTicket.supervisorId;
                    await createNewTicketAssignedNotification(existingTicket.supervisorId, existingTicket.projectId, existingTicket.formId, existingTicket.responseId, userId, existingTicket.id, oldUser);
                }
            }
        }
        const data = await ticket.update(existingTicket, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TICKET_UPDATE_FAILURE, error);
    }
};

/** Get ticket count data based on days */
const getTicketCountDaysWise = (data) => {
    /** Initialize the counts with the total number of tickets */
    const processData = { 0: 0, 1: 0, 2: 0, 3: 0, 5: 0, 7: 0, 8: 0, all: data.length };
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    data.forEach((data) => {
        const dataDate = new Date(data.createdAt);
        dataDate.setHours(0, 0, 0, 0);
        let dateDifference = Math.ceil((currentDate - dataDate) / (1000 * 60 * 60 * 24));
        if (dateDifference === 4 || dateDifference === 6) {
            dateDifference -= 1;
        }
        if (dateDifference > 7) {
            processData[8] += 1;
        } else {
            processData[dateDifference] += 1;
        }
    });
    return processData;
};

const getAllTicketsCount = async (where = {}) => {
    try {
        const ticket = new Tickets();
        const data = await ticket.findAndCountAll(where, undefined, true, true, undefined);
        const processedData = data?.rows.length > 0 ? getTicketCountDaysWise(data.rows) : {};
        return processedData;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TICKET_LIST_FAILURE, error);
    }
};

const getAllTickets = async (where = {}) => {
    try {
        const ticket = new Tickets();
        let data = await ticket.findAndCountAll(where, undefined, true, true, undefined);
        data = JSON.parse(JSON.stringify(data));
        data.rows.forEach((ticket) => { ticket.updatedTicketNumber = `${ticket.project_wise_ticket_mapping.prefix || ""}${ticket.ticketNumber}`; });
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TICKET_LIST_FAILURE, error);
    }
};

const getTicketHistory = async (where) => {
    try {
        const historyModelInstance = new TicketsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TICKETS_ID_REQUIRED, error);
    }
};

const getFormData = async ({ formId, responseId }) => {
    try {
        const formWiseTicketMapping = new FormWiseTicketMappings();
        const formAttributes = new FormAttrubutes();
        const formWiseTIcketMappingData = await formWiseTicketMapping.findOne({ formId });
        const displayFieldNames = await formAttributes.findAll({ id: formWiseTIcketMappingData.displayFields }, ["name", "columnName"], false, true, undefined, true);
        let geoLocationFieldName;
        if (formWiseTIcketMappingData.geoLocationField) {
            geoLocationFieldName = await formAttributes.findOne({ id: formWiseTIcketMappingData.geoLocationField }, ["id", "name", "columnName"], false.true, undefined, true);
        }
        const { tableName } = await getFormByCondition({ id: formId });
        const data = {};
        const displayColumnNames = [...displayFieldNames.map((field) => field.columnName)];
        if (geoLocationFieldName) {
            displayColumnNames.push(geoLocationFieldName.columnName);
        }
        data.data = await ticketMappingService.getFormData(
            { displayColumns: JSON.stringify(displayColumnNames), searchField: "id", searchValue: responseId, formId },
            tableName
        );
        data.columns = displayFieldNames;
        if (geoLocationFieldName) {
            data.location = data.data[0][geoLocationFieldName.name];
        }
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.GET_TICKET_FORM_DATA_FAILURE, error);
    }
};

const getGAAData = async ({ formId, responseId }) => {
    const { db } = new FormAttrubutes();
    const getGAALevelColumnQuery = `
    SELECT
        forms.table_name, fa.column_name, fa.name
    FROM
	    form_attributes as fa
    INNER JOIN
	    forms
    ON
	    forms.id=fa.form_id
    INNER JOIN
	    all_masters_list as aml
    ON
	    aml.id=(fa.properties->>'sourceTable')::uuid
    INNER JOIN
	    all_master_columns as amc
    ON
	    amc.id=(fa.properties->>'sourceColumn')::uuid
    WHERE
	    forms.id='${formId}' AND
	    fa.properties->>'sourceTable'='f38ec129-0b3f-4e9d-b1b3-cf0ea21688ee' AND
	    fa.properties->>'sourceColumn'='b8c68440-19de-4908-8362-d0d41b0c89a4' AND
        fa.properties ->> 'factoryTable' = ''
    ORDER BY fa.rank ASC
    `;
    const gaaLevelColumnNames = await db.sequelize.selectQuery(getGAALevelColumnQuery);
    if (!gaaLevelColumnNames || !gaaLevelColumnNames[0]?.length) {
        // No GAA Level column present
        return { };
    }
    const displayColumns = gaaLevelColumnNames[0].map((item) => item.column_name);
    const tableName = gaaLevelColumnNames[0][0].table_name;
    const [dataValue, dataIds] = await Promise.all([ticketMappingService.getFormData(
        { displayColumns: JSON.stringify(displayColumns), searchField: "id", searchValue: responseId, formId },
        tableName
    ), db.sequelize.selectQuery(`SELECT ${displayColumns.map((item) => `${tableName}.${item} as ${item}`).join(",")} from ${tableName} where id='${responseId}'`)]);
    const res = gaaLevelColumnNames[0].map((obj) => {
        const ids = dataIds[0][0];
        const data = {
            column_name: obj.column_name,
            name: obj.name,
            id: ids[`${obj.column_name}`][0],
            value: dataValue[0][`${obj.name}`]
        };
        return data;
    });
    const workAreaAssignmentData = await Promise.all(res.map((data) => db.sequelize.selectQuery(
        `
        SELECT
	        users.id
        FROM
	        users
        INNER JOIN
	        work_area_assignment as waa
        ON
	        waa.user_id = users.id
        WHERE
	        waa.gaa_level_entry_id @> ARRAY['${data.id}']::uuid[]
        `
    )));
    res.forEach((data, index) => {
        data.userIds = workAreaAssignmentData[index][0].map((user) => user.id);
    });
    return { data: res };
};

const deleteTicket = async (responseId, where) => {
    try {
        const ticket = new Tickets();
        const [data] = await Promise.all([ticket.delete(where), deleteNotificationByResponseId(responseId, "handt", where.id)]);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_TICKET_FAILURE, error);
    }
};

const getAllTicketsByCondition = async (where) => {
    try {
        const ticket = new Tickets();
        ticket.queryObject = {};
        const data = await ticket.findAll(where, ["projectWiseMappingId"], false, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TICKET_LIST_FAILURE, error);
    }
};

const getOccupiedUsers = async () => {
    try {
        const ticket = new Tickets();
        const ticketList = await ticket.findAll({ ticketStatus: { [Op.notIn]: ["closed", "resolved", "rejected"] } }, ["supervisorId", "assigneeId"]);
        const data = {};
        ticketList.forEach(({ supervisorId, assigneeId }) => {
            if (supervisorId === assigneeId) {
                if (data[supervisorId]) data[supervisorId] += 1;
                else data[supervisorId] = 1;
            } else {
                if (supervisorId) {
                    if (data[supervisorId]) data[supervisorId] += 1;
                    else data[supervisorId] = 1;
                }
                if (assigneeId) {
                    if (data[assigneeId]) data[assigneeId] += 1;
                    else data[assigneeId] = 1;
                }
            }
        });
        return { data };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TICKETS_LIST_FAILURE, error);
    }
};

const getSupervisorTickets = async (supervisorId) => {
    try {
        const ticket = new Tickets();
        const supervisorAssignment = new SupervisorAssignments();
        const installersData = await supervisorAssignment.findAll({ supervisorId }, ["userId"], true);
        const data = await ticket.findAll({ assigneeId: { [Op.in]: installersData.map((user) => user.userId) }, ticketStatus: { [Op.in]: ["assigned", "in-progress", "on-hold"] } }, undefined, true);
        return { data };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TICKETS_LIST_FAILURE, error);
    }
};

const getInstallerDetails = async (supervisorId) => {
    try {
        const { db } = new SupervisorAssignments();
        const data = await db.sequelize.selectQuery(`
        SELECT
            sa.user_id as "assigneeId",
            u.name as "name",
            u.code as "code",
            gh.name as "gaaName",
            string_agg(DISTINCT gle.name, ',') as "gaaValue",
            COUNT(DISTINCT tickets.id) as "totalTickets",
            COUNT(DISTINCT CASE WHEN tickets.ticket_status = 'assigned' THEN tickets.id END) as "assigned",
            COUNT(DISTINCT CASE WHEN tickets.ticket_status = 'in-progress' THEN tickets.id END) as "in-progress",
            COUNT(DISTINCT CASE WHEN tickets.ticket_status = 'on-hold' THEN tickets.id END) as "on-hold"
        FROM
            supervisor_assignments as sa
        INNER JOIN
            users as u ON u.id = sa.user_id
        LEFT JOIN
            work_area_assignment as waa ON waa.user_id = sa.user_id
        LEFT JOIN
            gaa_level_entries AS gle ON gle.id = ANY(waa.gaa_level_entry_id)
        LEFT JOIN
            tickets ON tickets.assignee_id = sa.user_id
        LEFT JOIN
            gaa_hierarchies as gh on gh.id = waa.gaa_hierarchy_id
        WHERE
            sa.supervisor_id = '${supervisorId}' AND u.is_active = '1' AND sa.is_active = '1'
        GROUP BY
            sa.user_id, u.name, u.code, gh.name
        ORDER BY 
	        sa.user_id
        `);
        return { data: data[0] };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TICKETS_LIST_FAILURE, error);
    }
};

const supervisorTicketUpdate = async (userId, ticketArr = [], unassign = false) => {
    try {
        if (unassign) {
            ticketArr.forEach((ticket) => {
                ticket.assigneeId = userId;
                ticket.supervisorId = userId;
                ticket.ticketStatus = "assigned";
                ticket.assigneeType = "supervisor";
                ticket.assignBy = "gaa";
            });
        }
        const data = await Promise.all(ticketArr.map((ticket) => updateTicket(ticket, userId, { id: ticket.id })));
        return { data };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TICKET_UPDATE_FAILURE, error);
    }
};

const activeTicketsForUserCheck = async (userId) => {
    try {
        const tickets = new Tickets();
        const data = await tickets.findAll({ assigneeId: userId, ticketStatus: { [Op.in]: ["assigned", "in-progress", "on-hold"] } });
        return data.length !== 0;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TICKET_UPDATE_FAILURE, error);
    }
};

const ticketSupervisorHandler = async (installerId, supervisorId) => {
    try {
        const whereCondition = { assigneeId: installerId };
        const tickets = new Tickets();
        
        const resultantTickets = [];
        if (!supervisorId) {
            // remove supervisor of the tickets
            whereCondition.supervisorId = { [Op.not]: null };
            const installerTickets = await tickets.findAll(whereCondition);
            installerTickets.forEach((ticket) => {
                resultantTickets.push({ ...JSON.parse(JSON.stringify(ticket)), supervisorId: null, assigneeType: "installer" });
            });
        } else {
            // add supervisor to the tickets
            whereCondition.supervisorId = null;
            const installerTickets = await tickets.findAll(whereCondition);
            installerTickets.forEach((ticket) => {
                resultantTickets.push({ ...JSON.parse(JSON.stringify(ticket)), supervisorId, assignBy: "organization", assigneeType: "supervisor" });
            });
        }

        const batchSize = 10;
        const totalBatches = Math.ceil(
            resultantTickets.length / batchSize
        );

        for (let i = 0; i < totalBatches; i++) {
            const start = i * batchSize;
            const end = (i + 1) * batchSize;

            try {
                // eslint-disable-next-line no-await-in-loop
                await Promise.all(
                    resultantTickets
                        .slice(start, end)
                        .map((ticket) => updateTicket(ticket, "577b8900-b333-42d0-b7fb-347abc3f0b5c", { id: ticket.id }))
                );
            } catch (error) {
                console.error(`Error in batch ${i + 1}:`, error);
            }
        }
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_SERVER_ERROR, error);
    }
};

const getTicketDashboard = async (ticketSource = "WFM") => {
    try {
        const { db } = new Tickets();

        const ticketDateWiseQuery = `
            SELECT
                SUM(CASE WHEN date_diff = 0 THEN 1 ELSE 0 END) AS "0",
                SUM(CASE WHEN date_diff = 1 THEN 1 ELSE 0 END) AS "1",
                SUM(CASE WHEN date_diff = 2 THEN 1 ELSE 0 END) AS "2",
                SUM(CASE WHEN date_diff = 3 THEN 1 ELSE 0 END) AS "3",
                SUM(CASE WHEN date_diff = 5 THEN 1 ELSE 0 END) AS "5",
                SUM(CASE WHEN date_diff = 7 THEN 1 ELSE 0 END) AS "7",
                SUM(CASE WHEN date_diff > 7 THEN 1 ELSE 0 END) AS "8",
                COUNT(*) AS "all"
            FROM (
                SELECT
                    CASE
                        WHEN EXTRACT(DAY FROM CURRENT_DATE - DATE_TRUNC('day', created_at)) = 4 THEN 3
                        WHEN EXTRACT(DAY FROM CURRENT_DATE - DATE_TRUNC('day', created_at)) = 6 THEN 5
                        WHEN EXTRACT(DAY FROM CURRENT_DATE - DATE_TRUNC('day', created_at)) > 7 THEN 8
                        ELSE EXTRACT(DAY FROM CURRENT_DATE - DATE_TRUNC('day', created_at))
                    END AS date_diff
                FROM tickets WHERE TICKET_STATUS NOT IN ('rejected', 'resolved', 'closed') AND ticket_source = '${ticketSource}'
            ) subquery;    
        `;

        const ticketStatusWiseQuery = `
            SELECT 
                SUM(CASE WHEN TICKET_STATUS = 'open' THEN 1 ELSE 0 END) AS "Un Assigned",
                SUM(CASE WHEN TICKET_STATUS = 'assigned' THEN 1 ELSE 0 END) AS "Assigned",
                SUM(CASE WHEN TICKET_STATUS = 'in-progress' THEN 1 ELSE 0 END) AS "In Progress",
                SUM(CASE WHEN TICKET_STATUS = 'on-hold' THEN 1 ELSE 0 END) AS "On Hold",
                SUM(CASE WHEN TICKET_STATUS = 'resolved' THEN 1 ELSE 0 END) AS "Resolved",
                SUM(CASE WHEN TICKET_STATUS = 'rejected' THEN 1 ELSE 0 END) AS "Rejected",
                SUM(CASE WHEN TICKET_STATUS = 'closed' THEN 1 ELSE 0 END) AS "Closed"
            FROM TICKETS
            WHERE ticket_source = '${ticketSource}';    
        `;
        
        const ticketPriorityWiseQuery = `
            SELECT 
                SUM(CASE WHEN PRIORITY = 'high' THEN 1 ELSE 0 END) AS "High",
                SUM(CASE WHEN PRIORITY = 'medium' THEN 1 ELSE 0 END) AS "Medium",
                SUM(CASE WHEN PRIORITY = 'low' THEN 1 ELSE 0 END) AS "Low"
            FROM TICKETS
            WHERE TICKET_STATUS NOT IN ('resolved', 'rejected', 'closed') AND ticket_source = '${ticketSource}';    
        `;

        const ticketFormWiseCountQuery = `
            SELECT 
                T.FORM_ID,
                F.NAME,
                COUNT(*) AS "count"
            FROM TICKETS AS T
            INNER JOIN FORMS AS F ON F.ID = T.FORM_ID
            WHERE TICKET_STATUS NOT IN ('resolved', 'rejected', 'closed') AND ticket_source = '${ticketSource}'
            GROUP BY 
                T.FORM_ID,
                F.NAME;    
        `;

        const ticketIssueWiseQuery = `
            SELECT 
                T.ISSUE_ID,
                PMM.NAME,
                COUNT(*) AS "count"
            FROM TICKETS AS T
            INNER JOIN PROJECT_MASTER_MAKERS AS PMM ON PMM.ID = T.ISSUE_ID
            WHERE TICKET_STATUS NOT IN ('resolved', 'rejected', 'closed') AND ticket_source = '${ticketSource}'
            GROUP BY 
                T.ISSUE_ID,
                PMM.NAME;    
        `;

        const supervisorTicketsQuery = `
            SELECT 
                TICKETS.SUPERVISOR_ID AS "id",
                USERS.NAME AS "name",
                COUNT(*) AS "total_tickets",
                SUM(CASE WHEN TICKETS.TICKET_STATUS = 'assigned' THEN 1 ELSE 0 END) AS "assigned",
                SUM(CASE WHEN TICKETS.TICKET_STATUS = 'in-progress' THEN 1 ELSE 0 END) AS "in_progress",
                SUM(CASE WHEN TICKETS.TICKET_STATUS = 'on-hold' THEN 1 ELSE 0 END) AS "on_hold"
            FROM TICKETS
            INNER JOIN USERS ON USERS.ID = TICKETS.SUPERVISOR_ID
            WHERE TICKETS.SUPERVISOR_ID IS NOT NULL AND ticket_source = '${ticketSource}'
            GROUP BY 
                TICKETS.SUPERVISOR_ID,
                USERS.NAME
            ORDER BY total_tickets DESC
            LIMIT 15;    
        `;

        const installerTicketQuery = `
            SELECT 
                TICKETS.SUPERVISOR_ID AS "supervisor_id",
                TICKETS.ASSIGNEE_ID AS "assignee_id", 
                USERS.NAME AS "name", 
                COUNT(*) AS "total_tickets",
                SUM(CASE WHEN TICKETS.TICKET_STATUS = 'assigned' THEN 1 ELSE 0 END) AS "assigned",
                SUM(CASE WHEN TICKETS.TICKET_STATUS = 'in-progress' THEN 1 ELSE 0 END) AS "in_progress",
                SUM(CASE WHEN TICKETS.TICKET_STATUS = 'on-hold' THEN 1 ELSE 0 END) AS "on_hold"
            FROM TICKETS
            INNER JOIN USERS ON USERS.ID = TICKETS.ASSIGNEE_ID
            WHERE TICKETS.ASSIGNEE_ID IS NOT NULL AND ticket_source = '${ticketSource}'
            GROUP BY TICKETS.ASSIGNEE_ID, TICKETS.SUPERVISOR_ID, USERS.NAME
            ORDER BY "total_tickets" DESC
            LIMIT 15;
        `;

        const [[ticketIssueData], [ticketFormData], [ticketStatusData], [ticketPriorityData], [ticketDateData], [supervisorTicketData], [installerTicketData]] = await Promise.all([
            db.sequelize.selectQuery(ticketIssueWiseQuery),
            db.sequelize.selectQuery(ticketFormWiseCountQuery),
            db.sequelize.selectQuery(ticketStatusWiseQuery),
            db.sequelize.selectQuery(ticketPriorityWiseQuery),
            db.sequelize.selectQuery(ticketDateWiseQuery),
            db.sequelize.selectQuery(supervisorTicketsQuery),
            db.sequelize.selectQuery(installerTicketQuery)
        ]);

        let processedInstallerData = JSON.parse(JSON.stringify(installerTicketData));
        processedInstallerData = processedInstallerData.filter(({ supervisor_id, assignee_id }) => supervisor_id !== assignee_id);

        return {
            data: {
                ticketIssue: ticketIssueData,
                ticketform: ticketFormData,
                ticketStatus: ticketStatusData[0],
                ticketPriority: ticketPriorityData[0],
                ticketDate: ticketDateData[0],
                supervisorTickets: supervisorTicketData,
                installerTickets: processedInstallerData
            }
        };

    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_SERVER_ERROR, error);
    }
};

const getSourceDropdown = async () => {
    try {
        const { db } = new Tickets();
        const sourceQuery = `
            SELECT 
                DISTINCT(TICKET_SOURCE) AS "source"
            FROM TICKETS;
        `;
        let [data] = await db.sequelize.selectQuery(sourceQuery);
        data = JSON.parse(JSON.stringify(data));
        const result = data.map((data) => ({
            id: data.source,
            name: data?.source?.toUpperCase()
        }));

        return { data: result };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_SERVER_ERROR, error);
    }
};

const getTicketStatusReport = async (reqQuery) => {
    try {
        const { assignBy, projectId, dateFrom, dateTo, pageSize, pageIndex } = reqQuery;
        let whereCondition = ` WHERE T.PROJECT_ID = '${projectId}'`;
        if (dateFrom) {
            whereCondition += ` AND T.CREATED_AT >= '${dateFrom}'::TIMESTAMP`;
        }
        if (dateTo) {
            whereCondition += ` AND t.CREATED_AT <= '${dateTo}'::TIMESTAMP`;
        }

        if (assignBy === "installer") {
            whereCondition += " AND T.ASSIGNEE_ID IS DISTINCT FROM T.SUPERVISOR_ID";
        }

        let pagination = "";
        if (pageSize && pageIndex) {
            pagination = `OFFSET ${(pageIndex - 1) * pageSize} LIMIT ${pageSize}`;
        }

        const { db } = new Tickets();

        const assignByType = assignBy === "supervisor" ? "SUPERVISOR_ID" : "ASSIGNEE_ID";
        const resultQuery = `
            SELECT T.${assignByType} AS "id",
                U.NAME,
                SUM(CASE WHEN T.TICKET_STATUS = 'open' THEN 1 ELSE 0 END) AS "open",
                SUM(CASE WHEN T.TICKET_STATUS = 'assigned' THEN 1 ELSE 0 END) AS "assigned",
                SUM(CASE WHEN T.TICKET_STATUS = 'in-progress' THEN 1 ELSE 0 END) AS "in_progress",
                SUM(CASE WHEN T.TICKET_STATUS = 'on-hold' THEN 1 ELSE 0 END) AS "on_hold",
                SUM(CASE WHEN T.TICKET_STATUS = 'resolved' THEN 1 ELSE 0 END) AS "resolved",
                SUM(CASE WHEN T.TICKET_STATUS = 'rejected' THEN 1 ELSE 0 END) AS "rejected",
                SUM(CASE WHEN T.TICKET_STATUS = 'closed' THEN 1 ELSE 0 END) AS "closed"
            FROM TICKETS AS T
            INNER JOIN USERS AS U ON U.ID = T.${assignByType}
            ${whereCondition}
            GROUP BY T.${assignByType},
                U.NAME
            ${pagination};     
        `;

        const countQuery = `
            SELECT COUNT(*) 
            FROM 
                (
                    SELECT COUNT(*) 
                    FROM TICKETS AS T
                    ${whereCondition} AND T.${assignByType} IS NOT NULL
                    GROUP BY T.${assignByType}
                ) AS SOURCE
        `;
        console.log(countQuery);
        const [[data], [[countData]]] = await Promise.all([db.sequelize.selectQuery(resultQuery), db.sequelize.selectQuery(countQuery)]);
        return { data: { rows: data, count: +(countData?.count || 0) } };
        
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_SERVER_ERROR, error);
    }
};

const getTicketReport = async (reqQuery) => {
    try {
        const { assignBy, assigneeId, ticketSource, projectId, dateFrom, dateTo } = reqQuery;
        const whereCondition = {};
        if (ticketSource && ticketSource !== "all") whereCondition.ticketSource = ticketSource;
        if (projectId) whereCondition.projectId = projectId;
        if (assignBy && assigneeId) whereCondition[assignBy === "supervisor" ? "supervisorId" : "assigneeId"] = assigneeId;
        if (dateFrom && dateTo) whereCondition.createdAt = { [Op.gte]: dateFrom, [Op.lte]: dateTo };
        else if (dateFrom) whereCondition.createdAt = { [Op.gte]: dateFrom };
        else if (dateTo) whereCondition.createdAt = { [Op.lte]: dateTo };

        const tickets = new Tickets();
        let data = await tickets.findAndCountAll(whereCondition, undefined, true);
        data = JSON.parse(JSON.stringify(data));
        data.rows.forEach((ticket) => {
            ticket.updatedTicketNumber = `${ticket.project_wise_ticket_mapping.prefix || ""}${ticket.ticketNumber}`;
        });
        return { data };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_SERVER_ERROR, error);
    }
};

module.exports = {
    ticketAlreadyExists,
    createTicket,
    getAllTicketsCount,
    getAllTickets,
    getTicketByCondition,
    updateTicket,
    mobileUpdateTicket,
    deleteTicket,
    getFormData,
    getGAAData,
    getTicketHistory,
    getTicketCountDaysWise,
    getAllTicketsByCondition,
    getOccupiedUsers,
    getSupervisorTickets,
    supervisorTicketUpdate,
    getInstallerDetails,
    activeTicketsForUserCheck,
    ticketSupervisorHandler,
    getTicketDashboard,
    getSourceDropdown,
    getTicketReport,
    getTicketStatusReport
};
