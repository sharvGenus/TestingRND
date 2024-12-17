const { Op, Sequelize } = require("sequelize");
const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ticketService = require("./tickets.service");

/**
 * Method to create ticket mappings
 * @param { object } req.body
 * @returns { object } data
 */
const createTicket = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_TICKET_DETAILS);
    const data = await ticketService.createTicket(req.body, req?.user?.userId);
    return { data };
};

/**
 * Method to update ticket mappings
 * @param { object } req.body
 * @returns { object } data
 */
const updateTicket = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TICKETS_ID_REQUIRED);
    const isTicketExists = await ticketService.ticketAlreadyExists({ id: req.params.id });
    throwIfNot(isTicketExists, statusCodes.DUPLICATE, statusMessages.TICKET_NOT_EXIST);
    const data = await ticketService.updateTicket(req.body, req?.user?.userId, { id: req.params.id });
    return { data };
};

/**
 * Method to get ticket mappings details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getTicketDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TICKETS_ID_REQUIRED);
    const data = await ticketService.getTicketByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all tickets by projectId.
 * @param { object } req.body
 * @returns { object } data
 */

const getAllTicketsCount = async (req) => {
    const { projectId, ticketStatus } = req.query;
    const condition = {};
    if (projectId) condition.projectId = projectId;
    if (ticketStatus && ticketStatus !== "all") condition.ticketStatus = ticketStatus === "closed" ? ticketStatus : { [Op.not]: "closed" };
    const data = await ticketService.getAllTicketsCount(condition);
    return { data };
};

/**
 * Method to get all tickets by projectId.
 * @param { object } req.body
 * @returns { object } data
 */

const getOpenTickets = async (req) => {
    throwIfNot(req.params.responseId, statusCodes.BAD_REQUEST, statusMessages.TICKETS_ID_REQUIRED);
    const { responseId } = req.params;
    const condition = { responseId, ticketStatus: { [Op.not]: "closed" } };
    const data = await ticketService.getAllTickets(condition);
    return { data };
};

const nestedTicketSearchConditions = {
    ticketNumber: (searchString) => Sequelize.where(Sequelize.fn("CONCAT", Sequelize.col("project_wise_ticket_mapping.prefix"), Sequelize.col("ticket_number")), "ILIKE", `%${searchString}%`),
    supervisor_obj: (searchString) => Sequelize.where(Sequelize.fn("CONCAT", Sequelize.col("supervisor_obj.name"), "-", Sequelize.col("supervisor_obj.code")), "ILIKE", `%${searchString}%`),
    assignee: (searchString) => Sequelize.where(Sequelize.fn("CONCAT", Sequelize.col("assignee.name"), "-", Sequelize.col("assignee.code")), "ILIKE", `%${searchString}%`)
};

/**
 * Method to get all tickets by projectId, ticketStatus, aging.
 * @param { object } req.body
 * @returns { object } data
 */

const getAllTickets = async (req) => {
    /** Extract query parameters from the request */
    const { projectId, ticketStatus, bySupervisorIdFlag, searchString, headerColumns } = req.query;
    let { aging } = req.query;
    /** Initialize an empty filter condition */
    const condition = {
        [Op.and]: []
    };
    if (projectId) condition.projectId = projectId;
    if (ticketStatus && ticketStatus !== "all") condition.ticketStatus = ticketStatus === "closed" ? ticketStatus : { [Op.not]: "closed" };
    /** Filter by aging if provided and it's a valid number */
    if (aging && !Number.isNaN(Number(aging))) {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        aging = +aging;
        if (aging < 8) {
            let endDateCounter = 1;
            if (aging === 3 || aging === 5) {
                aging += 1;
                endDateCounter = 2;
            }
            startDate.setDate(startDate.getDate() - aging);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + endDateCounter);
            /** Filter by the date range */
            condition.createdAt = {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            };
        } else {
            startDate.setDate(startDate.getDate() - 7);
            /** Filter for tickets older than 7 days */
            condition.createdAt = { [Op.lte]: startDate };
        }
    }
    if (bySupervisorIdFlag) {
        const { userId } = req.user;
        condition.supervisorId = userId;
        condition.assigneeId = userId;
        condition.ticketStatus = { [Op.not]: "closed" };
    }

    if (searchString) {
        const orConditions = [];
        headerColumns.forEach((header) => {
            if (nestedTicketSearchConditions[header]) {
                orConditions.push(nestedTicketSearchConditions[header](searchString));
            } else {
                let columnName = header;
                if (header.includes(".")) {
                    columnName = `$${columnName}$`;
                }
                orConditions.push({ [columnName]: { [Op.iLike]: `%${searchString}%` } });
            }
        });
        condition[Op.and].push({ [Op.or]: orConditions });

    }

    const data = await ticketService.getAllTickets(condition);
    return { data };
};

/**
 * Method to get ticket mappings list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllTicketByDropdown = async (req) => {
    const data = await ticketService.getAllTicketByDropdown();
    return { data };
};

const getTicketHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.TICKETS_ID_REQUIRED);
    const data = await ticketService.getTicketHistory({ recordId: req.params.recordId });
    return { data };
};

/** Method to get form data */
const getFormData = async (req) => {
    throwIfNot(req.query.formId, statusCodes.BAD_REQUEST, statusMessages.TICKETS_FORMID_REQUIRED);
    throwIfNot(req.query.responseId, statusCodes.BAD_REQUEST, statusMessages.TICKET_RESPONSEID_REQUIRED);
    const data = await ticketService.getFormData(req.query);
    return { data };
};

const getGAAData = async (req) => {
    throwIfNot(req.query.formId, statusCodes.BAD_REQUEST, statusMessages.TICKETS_FORMID_REQUIRED);
    throwIfNot(req.query.responseId, statusCodes.BAD_REQUEST, statusMessages.TICKET_RESPONSEID_REQUIRED);
    const data = await ticketService.getGAAData(req.query);
    return { data };
};

/**
 * Method to delete ticket mappings by ticket mappings id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteTicket = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TICKETS_ID_REQUIRED);
    const { responseId } = req.query;
    const data = await ticketService.deleteTicket(responseId, { id: req.params.id });
    return { data };
};

/**
 * Method to update ticket from mobile
 * @param { object } req.body
 * @returns { object } data
 */
const mobileUpdateTicket = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TICKETS_ID_REQUIRED);
    const data = await ticketService.mobileUpdateTicket({ id: req.params.id }, req.body, req?.user?.userId);
    return { data };
};

/**
 * Method to get all the occupied user list for tickets where ticketStatus != "closed" || "resolved" || "rejected"
 * @return { object } data
 */
const getOccupiedUsers = async () => {
    const data = await ticketService.getOccupiedUsers();
    return data;
};

const getSupervisorTickets = async (req) => {
    const { userId } = req.user;
    const data = await ticketService.getSupervisorTickets(userId);
    return data;
};

const getInstallerDetails = async (req) => {
    const { userId } = req.user;
    const data = await ticketService.getInstallerDetails(userId);
    return data;
};

const supervisorTicketUpdate = async (req) => {
    const { ticketArr } = req.body;
    const { userId } = req.user;
    const { unassign } = req.query;
    const data = await ticketService.supervisorTicketUpdate(userId, ticketArr, unassign);
    return data;
};

const getSourceDropdown = async () => {
    const data = await ticketService.getSourceDropdown();
    return data;
}

const getTicketDashboard = async (req) => {
    const {ticketSource} = req.query;
    const data = await ticketService.getTicketDashboard(ticketSource);
    return data;
}

const getTicketStatusReport = async (req) => {
    const data = await ticketService.getTicketStatusReport(req.query);
    return data;
};

const getTicketReport = async (req) => {
    const data = await ticketService.getTicketReport(req.query);
    return data;
};

module.exports = {
    createTicket,
    updateTicket,
    getTicketDetails,
    deleteTicket,
    getAllTicketsCount,
    getAllTickets,
    getAllTicketByDropdown,
    getFormData,
    getGAAData,
    getTicketHistory,
    getOpenTickets,
    mobileUpdateTicket,
    getOccupiedUsers,
    getSupervisorTickets,
    supervisorTicketUpdate,
    getInstallerDetails,
    getTicketDashboard,
    getSourceDropdown,
    getTicketReport,
    getTicketStatusReport
};
