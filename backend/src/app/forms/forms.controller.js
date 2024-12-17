/* eslint-disable camelcase */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
require("dotenv").config();
const CsvParser = require("json2csv").Parser;
const { Op } = require("sequelize");
const { v4 } = require("uuid");
const { default: axios } = require("axios");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const formService = require("./forms.service");
const metabaseReportsService = require("../metabase-reports/metabase-reports.service");
const { createFormAttributesWithForm, updateExistingFormAttributes, updateMappingDataInFormAttributes, getFormAttributesByForm, getActiveInactiveRecords } = require("../form-attributes/form-attributes.service");
const { getAllMastersListByCondition } = require("../all-masters-list/all-masters-list.service");
const { getAllMasterColumnsListByMasterId } = require("../all-master-columns-list/all-master-columns-list.service");
const { getAllMasterMakerLov } = require("../master-maker-lovs/master-maker-lovs.service");
const { getMappedFormedAttributeData } = require("../form-attributes/form-attributes.service");
const Forms = require("../../database/operation/forms");
const { giveDefautltPermissionsAfterFormCreated, addNewColumnDefaultPermissions } = require("../access-management/access-management.controller");
const { BadRequestError } = require("../../services/error-class");
const { getUserLovAccess, getUserColumnWisePermissions, goverRowForUserAfterCreate } = require("../access-management/access-management.service");
const { createInstallationTxn } = require("../stock-ledgers/stock-ledgers.service");
const { createNewResurveyAssignedNotification, deleteNotificationByResponseId } = require("../form-notifications/form-notifications.service");
const AttributeIntegrationBlocks = require("../../database/operation/attribute-integration-blocks");
const logger = require("../../logger/logger");
// const config = require("../../config/database-schema");
const { getProjectByCondition } = require("../projects/projects.service");
const publishMessage = require("../../utilities/publisher");
/**
 * Method to create form
 * @param { object } req.body
 * @returns { object } data
 */
const createForm = async (req) => {
    const { name, attributesArray, projectId } = req.body;
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FORM_DETAILS);
    // throwIfNot(attributesArray.filter((x) => !["0", 0].includes(x.isActive)), statusCodes.BAD_REQUEST, "Minimum 1 active attribute should be available in form");
    const isFormExists = await formService.formAlreadyExists({ name, projectId });
    throwIf(isFormExists, statusCodes.DUPLICATE, statusMessages.FORM_NAME_ALREADY_EXISTS);
    const data = await formService.createForm(req.body);
    const activeRecords = attributesArray.filter((obj) => obj?.isActive !== 0);
    if (activeRecords && activeRecords.length > 0) {
        await createFormAttributesWithForm(activeRecords, data?.id);
    }
    await goverRowForUserAfterCreate(req.user.userId, data.id, "Form Configurator");
    return { message: statusMessages.FORM_CREATED_SUCCESSFULLY };
};

/**
 * Method to update form
 * @param { object } req.body
 * @returns { object } data
 */
const updateForm = async (req) => {
    const { formId: id, attributesArray } = req.body;
    throwIfNot(attributesArray.filter((x) => !["0", 0].includes(x.isActive)), statusCodes.BAD_REQUEST, "Minimum 1 active attribute should be available in form");
    const isFormExists = await formService.getFormByCondition({ id });
    throwIfNot(isFormExists, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXIST);
    const { tableName, isPublished } = isFormExists;
    if (!isPublished) {
        await formService.updateForm(req.body, { id });
    }
    const objectsWithId = attributesArray.filter((obj) => obj.id);
    const objectsWithoutId = attributesArray.filter((obj) => !obj.id && obj.isActive !== 0);
    if (objectsWithoutId && objectsWithoutId.length > 0) {
        const data = await createFormAttributesWithForm(objectsWithoutId, id);
        if (isPublished) {
            const columnsToAdd = data.filter((obj) => !obj.properties?.factoryTable);
            if (columnsToAdd.length) {
                await formService.addColumnToDynamicTable(columnsToAdd, tableName);
            }
        }
        await addNewColumnDefaultPermissions(isFormExists, data);
    }
    if (objectsWithId && objectsWithId.length > 0) {
        await updateExistingFormAttributes(objectsWithId, isFormExists?.isPublished);
    }
    return { message: statusMessages.FORM_UPDATED_SUCCESSFULLY };
};

/**
 * Method to get form details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getFormDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    const data = await formService.getFormByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all forms
 * @param { object } req.body
 * @returns { object } data
 */
const getAllForms = async (req) => {
    const { projectId, formTypeId, accessSource = "Form Configurator", isTicket } = req.query;
    let condition = {};
    const { isSuperUser } = req.user;
    if (!isSuperUser) {
        const [projectLovData, formLovData] = await getUserLovAccess(req.user.userId, ["Project", accessSource], isTicket === "true");

        condition = {
            [Op.and]: [
                { projectId: { [Op.in]: projectLovData } },
                { id: { [Op.in]: formLovData } }
            ]
        };

        if (projectId) {
            condition[Op.and].push({ projectId: projectId });
        }

        if (formTypeId) {
            condition[Op.and].push({ formTypeId: formTypeId });
        }
    } else {
        if (projectId) condition.projectId = projectId;
        if (formTypeId) condition.formTypeId = formTypeId;
    }

    const result = await formService.getAllForms(condition);
    const data = JSON.parse(JSON.stringify(result));
    if (req.user.isMobileRequest) {
        const { db } = new Forms();
        const counts = await Promise.allSettled(data.rows.map(async (x) => {
            if (!x.isPublished) return obj;
            // WHERE submitted_at > CURRENT_DATE::timestamp 
            const [[count], [[{ resurvey }]]] = await Promise.all([
                (async () => db.sequelize.selectQuery(`SELECT LOWER(submission_mode) AS type, COUNT(submission_mode) AS total FROM ${x.tableName} WHERE created_at >= current_date::timestamp AND created_by = '${req.user.userId}' GROUP BY submission_mode;`)
                )(),
                (async () => {
                    if (x.form_attributes.some((x) => x.columnName.startsWith("l_"))) {
                        return db.sequelize.selectQuery(`SELECT COUNT(*)::INTEGER AS resurvey FROM ${x.tableName} WHERE resurvey_by && ARRAY['${req.user.userId}']::UUID[] AND LOWER(is_resurvey) = 'yes'`);
                    }
                    return [[{ resurvey: 0 }]];
                })()
            ]);
            const obj = {
                offline: 0,
                online: 0,
                resurvey
            };
            count.forEach(({ type, total }) => { obj[type] = +total || 0; });
            return obj;
        }));
        data.rows.forEach((val, i) => {
            val.submissions = {
                ...counts[i].status === "fulfilled" && counts[i].value
            };
        });
    }
    return { data };
};

/**
 * Method to get all resurvey forms for logged in users;
 * @param {Object} req
 */
const getResurveyForms = async (req) => {
    const { formId } = req.params;
    throwIfNot(formId, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    const isFormExists = await formService.getFormByCondition({ id: formId });
    throwIfNot(isFormExists.tableName, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXIST);
    const { form_attributes: formAttributes } = isFormExists;
    // const columnByIdName = formAttributes.filter((x) => x.is_active === "1").reduce((pre, cur) => { pre[cur.id] = cur.column_name; return pre; }, {});
    // columnByIdName[x.properties.dependency]
    const columns = formAttributes.filter((x) => (x.isActive === "1" && !x.properties?.factoryTable)).map((x) => x.columnName).join(", ");
    const { db } = new Forms();
    const staticColumns = formService.defaultColumnsToAdd.map((x) => (x.column)).join(", ");
    const { limit, offset } = req.query;
    const [data] = await db.sequelize.selectQuery(`
        SELECT id, ${columns}, ${staticColumns} FROM ${isFormExists.tableName} WHERE resurvey_by && ARRAY['${req.user.userId}']::UUID[] AND LOWER(is_resurvey) = 'yes' LIMIT ${limit} OFFSET ${offset}
    `);
    const [count] = await db.sequelize.selectQuery(`
        SELECT COUNT(*) FROM ${isFormExists.tableName} WHERE resurvey_by && ARRAY['${req.user.userId}']::UUID[] AND LOWER(is_resurvey) = 'yes'
    `);
    return { count: count[0]?.count, data };
};

/** Method to get form on bases of projectId anf formId array */
const getAllFormsByProjectIdAndArrayOfFormTypeId = async (req) => {
    const { projectId, formTypeId } = req.query;
    const condition = {};
    if (projectId) condition.projectId = projectId;
    if (formTypeId) {
        if (Array.isArray(formTypeId)) {
            condition.formTypeId = { [Op.in]: formTypeId };
        } else {
            condition.formTypeId = formTypeId;
        }
    }
    const result = await formService.getAllForms(condition);
    const data = JSON.parse(JSON.stringify(result));
    return { data };
};

/**
 * Method to get all defaultAtrributes
 * @param { object } req.body
 * @returns { object } dataGenus

 */
const getAllDefaultAttributes = async (req) => {
    const data = await formService.getAllDefaultAttributes();
    return { data };
};

/**
 * Method to delete state by state id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteForm = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    const { isPublished } = await formService.getFormByCondition({ id });
    await formService.deletFormAssociatedData(id, isPublished);
    return { message: statusMessages.FORM_DELETED_SUCCESSFULLY };
};

/**
 * Method to publish form
 * @param { object } req.body
 * @returns { object } data
 */
const publishForm = async (req) => {
    const { formId } = req.body;
    const formData = await formService.getFormByCondition({ id: formId }, undefined, true);
    throwIfNot(formData, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXIST);
    if (formData.isPublished) {
        return { message: statusMessages.FORM_ALREADY_PUBLISHED };
    }
    const dynamiceTableName = generateDynamicTableName(formData.project?.code, formData.name, formData.sequence);
    const attributesArray = formData.form_attributes.filter((x) => x.isActive !== "0" && !x.properties?.factoryTable);
    if (attributesArray?.length) {
        await formService.createDynamicFormTable(attributesArray, dynamiceTableName);
    }
    await formService.updateForm({ isPublished: true, tableName: dynamiceTableName }, { id: formId });
    await giveDefautltPermissionsAfterFormCreated({ id: formId, projectId: formData.projectId });
    return { message: statusMessages.FORM_PUBLISHED_SUCCESSFULLY };
};

const generateDynamicTableName = (projectCode, formName, formSequenceNum) => {
    const sanitizedProjectCode = projectCode.toLowerCase().replace(/[^a-z0-9]/g, "");
    const initials = Array.from(formName).reduce(
        (acc, char, index) => {
            if (char !== " " && (index === 0 || formName[index - 1] === " ")) {
                return acc + char.toLowerCase();
            }
            return acc;
        },
        ""
    );
    // remove zform from below line for productions, temp improvement to keep all tables altogether in db
    return `zform_${sanitizedProjectCode}_${initials}_${formSequenceNum}`;
};

const saveFormResponse = async (req) => {
    const files = Object.entries(req.files || {});
    const { id: formId } = req.params;
    throwIfNot(formId, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    const existingForm = await formService.getFormByCondition({ id: formId });
    throwIfNot(existingForm, statusCodes.BAD_REQUEST, statusMessages.FORM_NOT_EXIST);
    const { name: formName, tableName, form_attributes: frmAttr, totalCounts, properties } = existingForm;
    const factoryFileDropdowns = frmAttr.filter((x) => x.properties?.factoryTable).map((x) => x.columnName);
    factoryFileDropdowns.forEach((x) => {
        if (Object.hasOwn(req.body, x)) delete req.body[x];
    });
    const formAttributes = frmAttr.filter((x) => x.isActive === "1" && !factoryFileDropdowns.includes(x.columnName));
    req.body.id = req.body.temp_response_id || v4();
    delete req.body.temp_response_id;
    req.body.counter = 1;
    const uniqueFields = formAttributes.filter((x) => x.isUnique).map((x) => x.columnName);
    const { db } = new Forms();
    /**
     * Checks on active records ?
     */
    let response = false;
    const schemaName = "public";
    if (uniqueFields.length > 0) {
        const uniqueCehckRequest = uniqueFields.reduce((pre, cur) => {
            if (req.body[cur]) {
                pre += `${pre !== "" ? " OR " : " "} ${cur}='${req.body[cur].replaceAll("'", "''")}'`;
            }
            return pre;
        }, "");
        if (uniqueCehckRequest !== "") {
            const [[record]] = await db.sequelize.selectQuery(`SELECT * FROM ${schemaName}.${tableName} WHERE is_active = '1' AND (${uniqueCehckRequest})`);
            response = !!record;
        }
    }
    // in case of offline reject form submissions
    let isSameRecord = false;
    if (req.body.id) {
        const [[sameRecord]] = await db.sequelize.selectQuery(`SELECT * FROM ${schemaName}.${tableName} WHERE id='${req.body.id}'`);
        isSameRecord = !!sameRecord;
    }
    if (response || isSameRecord) {
        if (req.body.submission_mode === "Online" || isSameRecord) {
            throwIf(
                response,
                statusCodes.DUPLICATE,
                statusMessages.DUPLICATE_RECORD
            );
        }
        // if form not get rejected in case of offline mode then mark this as duplicate and store in to database
        req.body.is_active = "3";
    }
    if (formAttributes.some((x) => x.columnName === "resurvey_by")) {
        req.body.resurvey_by = [req.user.userId];
    }
    const payload = await formService.handleFilesInFormsResponse(req.body, files, formAttributes, req.user, formName);
    payload.updated_by = req.user.userId;
    payload.created_by = req.user.userId;
    await formService.saveDynamicFormResponse(tableName, Object.fromEntries(Object.entries(payload).filter((x) => !["", " "].includes(x[1]))));
    await formService.updateForm({ totalCounts: totalCounts + 1 }, { id: formId });
    const [[result]] = await db.sequelize.selectQuery(`SELECT * FROM ${schemaName}.${tableName} where id = '${req.body.id}'::uuid`);

    try {
        callInventoryMethod(formAttributes, result, properties, req.user.userId);
    } catch (error) {
        console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#285] | [error] | `, error);
    }
    return { message: statusMessages.FORM_DATA_SAVED_SUCCESSFULLY };
};

const callInventoryMethod = async (formAttributes, body, propertiesObject, userId) => {
    const properties = structuredClone(propertiesObject);
    const allFormsAttributes = formAttributes.reduce((pre, cur) => {
        pre[cur.id] = cur.columnName;
        return pre;
    }, {});

    function getValueByArributeId(id) { return Array.isArray(body[allFormsAttributes[id]]) ? body[allFormsAttributes[id]][0] : body[allFormsAttributes[id]]; }

    if (body && properties && Object.keys(properties).length > 0) {
        properties.installerId = userId;
        properties.responseId = body.id;
        properties.source = body.source;
        properties.counter = body.counter;
        ["consumerName", "kNumber"].forEach((x) => {
            if (properties[x]) {
                properties[x] = getValueByArributeId(properties[x]) || "";
            }
        });
        properties.materialArray.forEach((x, i) => {
            delete x.isActive;
            properties.materialArray[i] = Object.fromEntries(Object.entries(x).map(([key, value]) => {
                if (value !== "") {
                    if (key === "capitalize") {
                        return [key, value === "true"];
                    }
                    return [key, getValueByArributeId(value) || null];
                }
                return undefined;
            }).filter((x) => x));
        });
        // Call inventory transaction function with properties object
        console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#288] | [properties] | `, JSON.stringify(properties));
        await createInstallationTxn(properties);
    }
};

const softDeleteFormResponse = async (req) => {
    const { form_id: formId, response_id: responseId } = req.params;
    const { db } = new Forms();
    throwIfNot(formId, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    throwIfNot(responseId, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    const existingForm = await formService.getFormByCondition({ id: formId }, undefined, true);
    throwIfNot(existingForm, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXIST);
    const { tableName } = existingForm;
    const schemaName = "public";
    const date = `${Date.now()}`;
    await db.sequelize.query(`UPDATE ${schemaName}.${tableName} SET is_active='${req.query.is_active || 0}', updated_at=to_timestamp(${date.slice(0, date.length - 3)}) where id = '${responseId}'::uuid`);
    return { message: statusMessages.FORM_DATA_DELETED_SUCCESSFULLY };
};

const updateFormResponse = async (req) => {
    const { id: formId } = req.params;
    let files = [];
    if (req.files && typeof req.files === "object") {
        files = Object.entries(req.files);
    }
    const { db } = new Forms();
    throwIfNot(formId, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    throwIfNot(req.body.id, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    delete req.body.temp_response_id;
    const existingForm = await formService.getFormByCondition({ id: formId }, undefined, true);
    throwIfNot(existingForm, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXIST);
    const { name: formName, tableName, form_attributes: frmAttr, properties, projectId } = existingForm;
    const factoryFileDropdowns = frmAttr.filter((x) => x.properties?.factoryTable).map((x) => x.columnName);
    factoryFileDropdowns.forEach((x) => {
        if (Object.hasOwn(req.body, x)) delete req.body[x];
    });
    const formAttributes = frmAttr.filter((x) => !factoryFileDropdowns.includes(x.columnName));

    if (!Object.hasOwn(req.query, "keepOlderVersion")) {
        formAttributes.forEach((fa) => {
            if (!Object.hasOwn(req.body, fa.columnName)) {
                if (
                    req.body.ticket_id
                    && [
                        "resurveyor_org_type",
                        "resurveyor_org_id",
                        "resurvey_by"
                    ].includes(fa.columnName)
                ) {
                    return true;
                }
                req.body[fa.columnName] = fa.default_attribute.type.includes("[]") ? [] : "";
            }
        });
    }

    const uniqueFields = formAttributes.filter((x) => x.isUnique).map((x) => x.columnName);
    if (uniqueFields.length > 0) {
        const uniqueCehckRequest = uniqueFields.reduce((pre, cur) => {
            if (req.body[cur]) {
                pre += `${pre !== "" ? " OR " : " "} ${cur}='${req.body[cur].replaceAll("'", "''")}'`;
            }
            return pre;
        }, "");
        if (uniqueCehckRequest !== "") {
            const schemaName = "public";
            const [[response]] = await db.sequelize.selectQuery(`SELECT * FROM ${schemaName}.${tableName} where ((is_active = '1' OR is_active = '3') AND id <> '${req.body.id}'::uuid) AND (${uniqueCehckRequest})`);
            if ((response && req.body.submission_mode === "Online") || (response && req.body.submission_mode === "Offline" && req.body.source === "web")) {
                throwIf(
                    response,
                    statusCodes.DUPLICATE,
                    statusMessages.DUPLICATE_RECORD
                );
            } else if (response && req.body.submission_mode === "Offline") {
                req.body.is_active = "3";
            }
        }
    }
    if (req.body.source === "mobile" && formAttributes.some((x) => x.columnName === "resurvey_by")) {
        req.body.resurvey_by = [req.user.userId];
    }
    const payload = await formService.handleFilesInFormsResponse(req.body, files, formAttributes, req.user, formName);
    payload.updated_by = req.user.userId;
    /**
     * Code to cerate new notifications
     */
    const isResurvey = {};
    const schemaName = "public";
    const [[_response]] = await db.sequelize.selectQuery(`SELECT * FROM ${schemaName}.${tableName} where id = '${req.body.id}'::uuid`);
    payload.counter = _response.counter + 1;
    if (formAttributes.some((x) => x.columnName === "resurvey_by") && formAttributes.some((x) => x.columnName === "is_resurvey")) {
        isResurvey.newValue = req.body.is_resurvey && (Array.isArray(req.body.is_resurvey) ? req.body.is_resurvey[0] : req.body.is_resurvey).toUpperCase() === "YES";
        isResurvey.oldValueChanged = _response.is_resurvey?.toUpperCase() !== "YES" && isResurvey.newValue;
        isResurvey.userChanged = req.body.resurvey_by?.[0] !== _response?.resurvey_by?.[0];
        isResurvey.resurveyRevoked = _response.is_resurvey?.toUpperCase() === "YES" && !isResurvey.newValue;
    }
    await formService.updateDynamicFormResponse(tableName, Object.fromEntries(Object.entries(payload).filter((x) => !["", " "].includes(x[1]))));
    // If condition for resurvey notification gets truthy then create a notification
    if (isResurvey.newValue && (isResurvey.oldValueChanged || isResurvey.userChanged)) {
        await createNewResurveyAssignedNotification(req.body.resurvey_by[0], projectId, formId, req.body.id, req.user.userId);
    } else if (isResurvey.resurveyRevoked) {
        await deleteNotificationByResponseId(req.body.id);
    }
    const [[result]] = await db.sequelize.selectQuery(`SELECT * FROM ${schemaName}.${tableName} where id = '${req.body.id}'::uuid`);
    try {
        callInventoryMethod(formAttributes, result, properties, req.user.userId);
    } catch (error) {
        console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#388] | [error] | `, error);
    }
    // calling api to mdm request
    await sendFormDataToMdm(formId, req.body.id, req);
    return { message: statusMessages.FORM_DATA_UPDATED_SUCCESSFULLY };
};

const getDynamicFormData = async (req) => {
    const { formId: id } = req.params;
    const { isHistory } = req.query;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    const getFormData = await formService.getFormByCondition({ id });
    throwIfNot(getFormData, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXIST);
    const { tableName } = getFormData;
    if (req.query.sort && req.query.sort[0] === "updatedAt") req.query.sort[0] = "updated_at";
    const getDynamicFormData = tableName ? await formService.getDynamicFormData(tableName, req?.query, id, req.user, isHistory) : [];
    return { data: getDynamicFormData };
};

/*
function getQueries(array, areaPermissions, hierarchies, isGaa) {
    if (array.length === 0) return "";
    const ignoreJoinAndWhere = (ci, cur) => cur !== hierarchies.assignedArea && hierarchies.typeByNames[cur] !== hierarchies.typeByNames[hierarchies.assignedArea]
        && ((isGaa && ci >= hierarchies.networkIndex)
        || (!isGaa && ci > hierarchies.mappedIndex && hierarchies.typeByNames[cur] === "gaa"));
    let joinClause = array.reduce((pre, cur, currentIndex) => {
        if (currentIndex === 0 || ignoreJoinAndWhere(currentIndex, cur)) return pre;
        const joinTable = currentIndex === hierarchies.networkIndex ? array[hierarchies.mappedIndex] : array[currentIndex - 1];
        pre += `LEFT JOIN gaa_level_entries AS "g${cur}" ON "g${cur}"."parent_id" = "g${joinTable}"."id" AND "g${cur}"."gaa_hierarchy_id" = '${hierarchies.idByNames[cur]}'`;
        return pre;
    }, `FROM gaa_level_entries AS "g${array[0]}" `);

    joinClause += ` WHERE "g${areaPermissions.name}"."id" = ANY(ARRAY['${areaPermissions.gaa_level_entry_id.join("', '")}']::UUID[]) AND "g${areaPermissions.name}"."gaa_hierarchy_id" = '${areaPermissions.id}'`;

    array.forEach((cur, index) => {
        const comma = index + 1 === array.length ? "" : ", ";
        const column = ignoreJoinAndWhere(index, cur) ? "null" : `"g${cur}"."id"`;
        joinClause = `${comma} ${column} AS "${cur}" ${joinClause}`;
    });
    return `SELECT ${joinClause}`;
}

async function getWorkAreaAssingments(req, projectId) {
    const workAreaAssignments = {};
    try {
        if (!req.user.isSuperUser && req.user.isMobileRequest) {
            const [[areaPermissions]] = await this.sequelize.selectQuery(`
            SELECT
                waa.gaa_level_entry_id,
                gh.project_id,
                gh.name,
                gh.id
            FROM
                work_area_assignment AS waa
            INNER JOIN
                gaa_level_entries AS gle ON gle.id = ANY(waa.gaa_level_entry_id)
            INNER JOIN
                gaa_hierarchies AS gh ON gh.id = gle.gaa_hierarchy_id
            WHERE
                waa.user_id='${req.user.userId}' AND waa.is_active='1';
        `);
            if (!areaPermissions || areaPermissions.project_id !== projectId) return { noWorkArea: true };
            const [allLevels] = await this.sequelize.selectQuery(`
            SELECT
                id, name, is_mapped, level_type
            FROM
                gaa_hierarchies
            WHERE
                project_id = '${areaPermissions.project_id}'
            ORDER BY
                level_type ASC,
                rank ASC
        `);
            const hierarchies = {
                networkIndex: null,
                mappedIndex: null,
                mapped: "",
                networks: [],
                gaas: [],
                idByNames: {},
                typeByNames: {},
                assignedArea: areaPermissions.name
            };

            const levelNames = allLevels.map((x, i) => {
            // hierarchies[x.level_type === "network" ? "networks" : "gaas"].push(x.name);
                if (x.is_mapped === "1") {
                    hierarchies.mapped = x.name;
                    hierarchies.mappedIndex = i;
                }
                hierarchies.gaas.push(x.name);
                hierarchies.idByNames[x.name] = x.id;
                hierarchies.typeByNames[x.name] = x.level_type;
                if (x.level_type === "network" && !hierarchies.networkIndex) hierarchies.networkIndex = i;
                return { name: x.name, id: x.id };
            });
            const gaaQueries = getQueries(hierarchies.gaas, areaPermissions, hierarchies, true);
            const networkQueries = getQueries(hierarchies.gaas, areaPermissions, hierarchies, false);
            const [queryResults] = await this.sequelize.selectQuery(`${gaaQueries} UNION ALL ${networkQueries}`);
            queryResults.forEach((x, i) => {
                levelNames.forEach(({ id, name }) => {
                    if (!workAreaAssignments[id]) workAreaAssignments[id] = [];
                    if (x[name] && workAreaAssignments[id].indexOf(x[name]) === -1) workAreaAssignments[id].push(x[name]);
                });
            });
        }
    } catch (error) {
        console.error(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#552] | [error] | `, error);
        workAreaAssignments.noWorkArea = true;
    }
    return workAreaAssignments;
}
*/

const getDynamicQueryData = async (req) => {
    const { formDropdowns, formId: id, responseId } = req.body;
    const { projectId } = await formService.getFormByCondition({ id });
    const dropdownQueries = [];
    const { db } = new Forms();
    let startIndex = 0;
    const maxLength = formDropdowns.length;
    while (startIndex < maxLength) {
        const endIndex = Math.min(startIndex + 5, maxLength);
        const chunk = formDropdowns.slice(startIndex, endIndex);
        const result = await Promise.all(chunk.map(async (obj) => formService.getDropDownData(obj, req.user, projectId, projectId, id, responseId)));
        dropdownQueries.push(...result);
        startIndex = endIndex;
    }
    const goupedDropDownQuries = [];
    const emptySets = [];
    const sourceColumnById = {};

    // const workAreaAssignments = await getWorkAreaAssingments.call(db, req, projectId);
    dropdownQueries.forEach((arg) => {
        const { selectClause, matchingColum, fieldName, query, tableName, dependency, sourceColumn, sourceTableId, conditions } = arg;
        const index = goupedDropDownQuries.findIndex(
            (_arg) => {
                const {
                    query: _query,
                    tableName: _tableName,
                    fieldName: _fieldName,
                    sourceTableId: _sourceTableId,
                    conditions: _conditions
                } = _arg;
                return (_fieldName === dependency
                && tableName === _tableName
                && _query === query
                && _sourceTableId === sourceTableId
                && conditions?.length > 0
                && _conditions?.length > 0);
            }
        );
        if (index === -1) {
            return goupedDropDownQuries.push(arg);
        }
        if (!Object.hasOwn(goupedDropDownQuries[index], "otherSelectClauses")) {
            goupedDropDownQuries[index].otherSelectClauses = [];
        }
        goupedDropDownQuries[index].otherSelectClauses.push({ selectClause, matchingColum, fieldName, dependency });
        sourceColumnById[sourceColumn] = selectClause;
        emptySets.push({ [fieldName]: [] });
    });
    const finalQuery = [];
    // const hierarchiesKeys = Object.keys(workAreaAssignments);
    goupedDropDownQuries.forEach(({ selectClause, fieldName, query, sqlQuery, tableName, matchingColum, otherSelectClauses = [], conditions }) => {
        const selectOther = otherSelectClauses.reduce((pre, cur) => {
            if (cur.selectClause && cur.fieldName) {
                pre += `, '${cur.selectClause}',  "${cur.selectClause}"`;
            }
            return pre;
        }, "");
        const matchingColumCluase = matchingColum ? `, 'matchingcolumn', "${matchingColum}"` : "";
        finalQuery.push(`SELECT array_agg(jsonb_build_object('id', "id", 'name', "${selectClause}"${selectOther}${matchingColumCluase})) AS "${fieldName}" FROM ${tableName} ${query}${sqlQuery}; `);
    });
    const [dropdownData] = await db.sequelize.selectQuery(`${finalQuery.join(" ")}`);
    dropdownData.push(...emptySets);
    return { sourceColumnById, dropdownData };
};

const getDynamicTableData = async (req) => {
    const { db } = new Forms();
    const { userId } = req.user;
    const { isSuperUser } = req.user;
    throwIf(isSuperUser, statusCodes.BAD_REQUEST, "Not allowed download forms for super admin user");
    const mappedTablesWithFormsAccess = [];
    const condtions = {};
    const [allTables, formLovData] = await getAllAssociatedTables.call(db, userId, condtions, mappedTablesWithFormsAccess, false, false);
    const columns = {
        serialize_material_type: '"id" UUID, "serial_number" character varying, "fromattributeid" UUID',
        serial_numbers: '"id" uuid, "material_id" uuid, "serial_number" character varying, "factory_value" character varying, "fromattributeid" UUID, "consumed" boolean',
        nonserialize_materials: '"id" uuid, name character varying, quantity double precision, "fromattributeid" UUID'
    };
    let tables = structuredClone(allTables);
    tables.push(...mappedTablesWithFormsAccess.map((x) => x.table_name));
    tables = Array.from(new Set(tables));

    tables.push(...mappedTablesWithFormsAccess);
    tables = Array.from(new Set(tables));
    // ADD DEFAULT TABLE TO SAVE RESPONSES
    const data = [
        "DROP TABLE IF EXISTS form_permissions",
        'CREATE TABLE IF NOT EXISTS "local_form_submissions" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "form_responses" TEXT, "form_files_data" TEXT, "form_id" uuid, "resurvey_id" TEXT);',
        'CREATE TABLE IF NOT EXISTS "form_permissions" ("id" uuid);',
        ...formLovData.functionNames.map((x) => `DROP TABLE IF EXISTS "${x}"`),
        ...formLovData.functionNames.map((x) => `CREATE TABLE IF NOT EXISTS "${x}" (${columns[x]})`)
    ];
    const getRowQuerysForTables = await formService.getDynamicTableData();
    const filteredTablesLists = getRowQuerysForTables.filter((x) => tables.includes(x.table_name));
    // RECREATE ALL TABLES SO THAT IT WILL ADD ALL COLUMN
    data.push(...filteredTablesLists.map((x) => `DROP TABLE IF EXISTS ${x.table_name};`));
    data.push(...filteredTablesLists.map((x) => x.columns));
    data.push("ALTER TABLE users ADD COLUMN logged_in_user boolean");
    return { data };
};

const updateFormDataMapping = async (req) => {
    const { formId: id, mappingArray } = req.body;
    const isFormExists = await formService.getFormByCondition({ id });
    throwIfNot(isFormExists, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXIST);
    await formService.updateForm(req.body, { id });
    if (mappingArray && mappingArray.length > 0) {
        await updateMappingDataInFormAttributes(mappingArray);
    }
    return { message: statusMessages.DATA_MAPPING_UPDATED_SUCCESSFULLY };
};

const getMappedFormData = async (req) => {
    const { formId: id, searchBy, ticketId, useId } = req.query;
    const isvalue = "1";
    const isUsingId = useId === "1";
    const isFormExists = await formService.getFormByCondition({ id });
    throwIfNot(isFormExists, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXIST);
    let { searchColumns } = isFormExists;
    const { selfSearchColumns } = isFormExists;
    const { mappingTableId } = isFormExists;
    const allMasterCondtion = await getAllMastersListByCondition({ id: mappingTableId });
    let tableName;
    if (allMasterCondtion) {
        tableName = allMasterCondtion.name;
    }
    if (ticketId && ticketId !== "undefined") {
        if (!selfSearchColumns?.length) {
            return { data: [], message: "O&M Search Mapping Not Implemented!" };
        }
        searchColumns = selfSearchColumns;
    }
    let fitlerQuery;
    const { db } = new Forms();
    let rows;
    let isDynamicMaster = false;
    let formMappingData = [];
    let hasApprovalStatus = false;
    let oldMeterMappingQuery = "";
    if (tableName) {
        rows = await getAllMasterColumnsListByMasterId({ id: searchColumns }, ["id", "name"]);
    } else {
        isDynamicMaster = true;
        rows = await getFormAttributesByForm({ id: searchColumns });
        formMappingData = await formService.getFormByCondition({ id }, true);
        if (formMappingData) {
            if (ticketId && ticketId !== "undefined") {
                tableName = formMappingData[0].own_table;

                Array.prototype.unshift.call(formMappingData, { mapping_column: "id", key_name: "id", mapping_table: "id" });
                formMappingData = formMappingData.map((x) => ({
                    ...x,
                    mapping_column: x.key_name
                }));

                const [selfMapping] = await db.sequelize.selectQuery(`
                    SELECT
                        FORMS.TABLE_NAME AS FORM_TABLE_NAME,
                        FORMS.PROJECT_ID AS PROJECT_ID,
                        FA.COLUMN_NAME AS ATTRIBUTE_NAME,
                        DA.INPUT_TYPE AS INPUT_TYPE,
                        FAM.COLUMN_NAME AS MAPPED_ATTRIBUTE,
                        DAM.INPUT_TYPE AS MAPPED_INPUT_TYPE,
                        AML.NAME AS MAPPED_SOURCE_TABLE,
                        AML.TABLE_TYPE AS MAPPED_TABLE_TYPE,
                        AMC.NAME AS MAPPED_SOURCE_COLUMN
                    FROM FORM_ATTRIBUTES AS FA
                    INNER JOIN FORMS ON FA.FORM_ID = FORMS.ID
                    INNER JOIN DEFAULT_ATTRIBUTES AS DA ON DA.ID = FA.DEFAULT_ATTRIBUTE_ID
                    INNER JOIN FORM_ATTRIBUTES AS FAM ON FA.PROPERTIES ->> 'oldNewMappingColumn' = FAM.ID::text
                    INNER JOIN FORMS AS FM ON FM.ID = FAM.FORM_ID
                    INNER JOIN DEFAULT_ATTRIBUTES AS DAM ON DAM.ID = FAM.DEFAULT_ATTRIBUTE_ID
                    INNER JOIN ALL_MASTERS_LIST AS AML ON AML.ID::text = FAM.PROPERTIES ->> 'sourceTable'
                    INNER JOIN ALL_MASTER_COLUMNS AS AMC ON AMC.ID::TEXT = FAM.PROPERTIES ->> 'sourceColumn'
                    WHERE 
                        FA.PROPERTIES ->> 'oldNewMappingColumn' IS NOT NULL
                        AND FORMS.TABLE_NAME = '${tableName}'
                `);
                oldMeterMappingQuery = selfMapping.reduce(
                    (pre, cur, index) => {
                        if (cur.input_type === "text" && cur.mapped_input_type === "dropdown") {
                            const aliasJoin = `${cur.mapped_source_table}_${cur.mapped_attribute}`;
                            pre += ` ${aliasJoin}.${cur.mapped_source_column} AS ${cur.attribute_name} `;
                        } else {
                            pre += ` ${cur.mapped_attribute} AS ${cur.attribute_name}`;
                        }
                        if (pre !== "" && index < selfMapping.length - 1) pre += ",";
                        return pre;
                    },
                    ""
                );

                if (oldMeterMappingQuery) {
                    oldMeterMappingQuery = `SELECT ${tableName}.id, ${oldMeterMappingQuery} FROM ${tableName}`;

                    oldMeterMappingQuery = selfMapping.reduce((pre, cur) => {
                        if (cur.mapped_input_type === "dropdown") {
                            const tableJoin = cur.mapped_table_type === "function"
                                ? `${cur.mapped_source_table}(null, null) `
                                : cur.mapped_source_table;
                            const aliasJoin = `${cur.mapped_source_table}_${cur.mapped_attribute}`;
                            pre += ` INNER JOIN ${tableJoin} AS ${aliasJoin} ON ${aliasJoin}.ID = ${cur.mapped_attribute}[1]`;
                        }
                        return pre;
                    }, oldMeterMappingQuery);
                }

            } else {
                tableName = formMappingData[0].mapping_table;
            }
            if (tableName.startsWith("zform_")) {
                const [[{ subquery } = {}]] = await db.sequelize.selectQuery(`
                    SELECT
                        fa.column_name || '[1] = ''''' || pmml.id || '''''' AS subquery
                    FROM
                        forms
                        INNER JOIN form_attributes AS fa ON fa.form_id = forms.id
                        INNER JOIN project_master_makers AS pmm ON pmm.project_id = forms.project_id
                        INNER JOIN project_master_maker_lovs AS pmml ON pmml.master_id = pmm.id
                    WHERE
                        forms.table_name = '${tableName}'
                        AND pmml.name = 'Approved'
                        AND fa.column_name = 'l_b_approval_status';
                `);

                if (subquery) {
                    hasApprovalStatus = true;
                }

                let [lovPermissions] = await db.sequelize.selectQuery(`SELECT gaa_level_entry_id FROM work_area_assignment WHERE user_id='${req.user.userId}' AND is_active='1'`);
                lovPermissions = lovPermissions[0]?.gaa_level_entry_id;
                if (!lovPermissions || lovPermissions.length === 0) {
                    return { data: [] };
                }

                const [[{ query }]] = await db.sequelize.selectQuery(`
                    SELECT
                            ${hasApprovalStatus ? "'(' || " : ""}
                            STRING_AGG(fa.column_name || ' && ARRAY[''${lovPermissions.join("'', ''")}'']::uuid[]', ' OR ') 
                            ${hasApprovalStatus ? `|| ') AND ${subquery}'` : ""}
                        AS query
                    FROM
                        forms as f
                        INNER JOIN form_attributes AS fa ON fa.form_id = f.id AND fa.properties ->> 'sourceTable' IS NOT null
                        INNER JOIN all_masters_list AS aml ON aml.id::text = fa.properties ->> 'sourceTable'
                    WHERE
                        f.table_name = '${tableName}' 
                        AND aml.name = 'gaa_level_entries'
                        AND (fa.properties ->> 'factoryTable' IS null OR fa.properties ->> 'factoryTable' = '')
                `);

                if (query) {
                    fitlerQuery = query;
                }
            }
            // eslint-disable-next-line max-len
            formMappingData = formMappingData.filter((x, index, self) => x.key_name && x.mapping_column && x.mapping_table && self.findIndex((y) => y.mapping_column === x.mapping_column) === index);
        } else {
            throw new BadRequestError("Mapping Table not found");
        }
    }
    let mappedDropDowns = null;
    if (!isUsingId && rows.rows.some((x) => x?.default_attribute?.inputType === "dropdown")) {
        const fitleredDropDowns = rows.rows.filter((x) => x?.default_attribute?.inputType === "dropdown" && !x.properties.factoryTable);
        mappedDropDowns = await Promise.all(fitleredDropDowns.map(async (x) => {
            const { sourceTable, sourceColumn } = x.properties;
            const [[[{ tablename, tabletype }]], [[{ columnname }]]] = await Promise.all([
                db.sequelize.selectQuery(`SELECT name AS tablename, table_type AS tabletype from all_masters_list WHERE id='${sourceTable}'`),
                db.sequelize.selectQuery(`SELECT name AS columnname from all_master_columns WHERE id='${sourceColumn}'`)
            ]);
            const conditions = `${columnname} ILIKE '${searchBy}'`;
            const table = tabletype === "function" ? `${tablename}(null, null)` : tablename;
            const [records] = await db.sequelize.selectQuery(`SELECT id FROM ${table} WHERE ${conditions}`);
            return { [x.columnName]: records.map((x) => x.id) };
        }));
        mappedDropDowns = mappedDropDowns.reduce((pre, cur) => {
            const entry = Object.entries(cur);
            pre[entry[0][0]] = entry[0][1];
            return pre;
        }, {});
        // eslint-disable-next-line max-len
        rows.rows = rows.rows.filter((x) => !Object.keys(mappedDropDowns).includes(x.columnName));
        // eslint-disable-next-line max-len
        mappedDropDowns = Object.fromEntries(Object.entries(mappedDropDowns).filter((x) => x[1].length > 0));
    }
    // eslint-disable-next-line max-len
    const getSqlData = await formService.getMappedData(tableName, searchBy, rows?.rows, !isDynamicMaster, mappedDropDowns, fitlerQuery, isUsingId);
    let oldMeterMappingData = [];
    if (oldMeterMappingQuery && getSqlData.length > 0) {
        const idsToFetch = getSqlData.map((x) => x.id);
        const [oldMeterMapping] = await db.sequelize.selectQuery(`${oldMeterMappingQuery} WHERE ${tableName}.id IN ('${idsToFetch.join("', '")}')`);
        oldMeterMappingData = oldMeterMapping.reduce((pre, cur) => {
            pre[cur.id] = cur;
            return pre;
        }, {});
    }
    // eslint-disable-next-line max-len
    const getFormAttributesData = isDynamicMaster ? formMappingData : await getMappedFormedAttributeData({ mappingColumnId: { [Op.ne]: null }, formId: id }, isDynamicMaster);
    const data = await formService.reduceDataByKeys(getSqlData, getFormAttributesData, isDynamicMaster);
    const visibleData = await formService.reduceDataByKeys(getSqlData, getFormAttributesData, isDynamicMaster, isvalue);
    data.forEach((x) => {
        if (oldMeterMappingData[x.id]) {
            Object.entries(oldMeterMappingData[x.id]).forEach(([key, value]) => {
                x[key] = value;
            });
        }
    });
    return { data, visibleData, ...data.length === 0 && { message: hasApprovalStatus ? "No Approved Record Found!" : " No Record Found!" } };
};

const getOfflineData = async (req) => {
    const { id } = req.query;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const { db } = new Forms();
            const schemaName = "public";
            const { userId } = req.user;
            const userRightConditions = {};
            const mappedTablesWithFormsAccess = [];
            const { isSuperUser } = req.user;
            throwIf(isSuperUser, statusCodes.BAD_REQUEST, "Not allowed download forms for super admin user");
            const [allTables, formLovData, factoryTables, ticketsFormResponseId, allTicketForms] = await getAllAssociatedTables.call(db, userId, userRightConditions, mappedTablesWithFormsAccess, true, true);
            let tables = structuredClone(allTables);
            tables.push(...mappedTablesWithFormsAccess.map((x) => x.table_name));
            tables = Array.from(new Set(tables));
            const defaultObject = {
                tablename: "",
                id: "",
                querytoexecute: "",
                valuestoinsert: ""
            };
            const sendClubRecords = [];
            if (formLovData && Array.isArray(formLovData) && formLovData.length > 0) {
                const dataToLoad = structuredClone(defaultObject);
                dataToLoad.querytoexecute = "INSERT INTO form_permissions (id) VALUES ";
                formLovData.forEach((x) => {
                    if (dataToLoad.valuestoinsert !== "") dataToLoad.valuestoinsert += ", ";
                    dataToLoad.valuestoinsert += `('${x}')`;
                });
                sendClubRecords.push(dataToLoad);
            }
            userRightConditions.formLovDataRights.push(...mappedTablesWithFormsAccess.map((x) => x.mapping_table_id), ...allTicketForms);
            userRightConditions.formLovDataRights = Array.from(new Set(userRightConditions.formLovDataRights));
            let [[mappedTables], [accessLov]] = await Promise.all([
                db.sequelize.selectQuery(`
                SELECT
                    STRING_AGG(fa.column_name, ', ') as "column_name", f.table_name
                FROM
                    forms as f
                    LEFT JOIN form_attributes AS fa ON fa.form_id = f.id
                    AND fa.properties ->> 'sourceTable' IS NOT null
                    AND (fa.properties ->> 'factoryTable' IS null OR fa.properties ->> 'factoryTable' = '')
                    LEFT JOIN all_masters_list AS aml ON aml.id :: text = fa.properties ->> 'sourceTable'
                WHERE
                    f.table_name in ('${tables.join("', '")}')
                    AND aml.name = 'gaa_level_entries'
                GROUP BY
                    f.table_name
                `),
                db.sequelize.selectQuery(`SELECT gaa_level_entry_id FROM work_area_assignment WHERE user_id='${req.user.userId}'  AND is_active='1'`)
            ]);
            accessLov = accessLov[0]?.gaa_level_entry_id;
            mappedTables = mappedTables.reduce((pre, acc) => {
                pre[acc.table_name] = acc.column_name.split(", ");
                return pre;
            }, {});
            if (!accessLov || accessLov.length === 0) {
                tables = tables.filter((x) => !Object.keys(mappedTables).includes(x));
            }
            let i = 0;
            // ADD DEFAULT TABLE TO SAVE RESPONSES
            const response = [
                'CREATE TABLE IF NOT EXISTS "local_form_submissions" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "form_responses" TEXT, "form_files_data" TEXT, "form_id" uuid);'
            ];
            const getRowQuerysForTables = await formService.getDynamicTableData();
            const filteredTablesLists = getRowQuerysForTables.filter((x) => tables.includes(x.table_name));
            // RECREATE ALL TABLES SO THAT IT WILL ADD ALL COLUMN
            // response.push(...filteredTablesLists.map((x) => `DROP TABLE IF EXISTS ${x.table_name};`));
            response.push(...filteredTablesLists.map((x) => x.columns));
            const conditions = async (_table, isSingleQuote, isResurvey) => {
                const table = _table.split("___")[0];
                // quoteIdent
                const qI = isSingleQuote ? "'" : "''";
                let query = "";
                if (isResurvey && table.includes("zform_")) {
                    const [[{ count: isResurveyAble }]] = await db.sequelize.selectQuery(`SELECT count(*)::integer AS count FROM forms INNER JOIN form_attributes AS fo ON fo.form_id = forms.id AND fo.column_name = 'resurvey_by' WHERE forms.table_name = '${table}'`);
                    if (isResurveyAble > 0) {
                        query += ` WHERE is_active=${qI}1${qI} AND resurvey_by && ARRAY[${qI}${req.user.userId}${qI}]::UUID[] AND LOWER(is_resurvey) = ${qI}yes${qI}`;
                    } else {
                        // Dont download data incase of no resurvey available
                        query += ` WHERE is_active <> ${qI}0${qI} AND is_active <> ${qI}1${qI}`;
                    }
                    return query;
                }
                if (table === "forms") {
                    query = `
                        WHERE is_published=true
                        ${userRightConditions.formLovDataRights && Array.isArray(userRightConditions.formLovDataRights) && userRightConditions.formLovDataRights.length > 0 ? `AND id IN (${qI}${userRightConditions.formLovDataRights.join(`${qI}, ${qI}`)}${qI})` : ""}
                        ${userRightConditions.projectId && Array.isArray(userRightConditions.projectId) && userRightConditions.projectId.length > 0 ? `AND project_id IN (${qI}${userRightConditions.projectId.join(`${qI}, ${qI}`)}${qI})` : ""}
                    `;
                }
                if (response.some((x) => x.includes(`CREATE TABLE IF NOT EXISTS "${table}" `) && x.includes('"is_active" text'))) {
                    query += `${query.includes("WHERE") ? " AND " : "WHERE "} is_active=${qI}1${qI}`;
                    if (table === "users") {
                        if (userRightConditions.projectId.length > 0) {
                            const [userIds] = await db.sequelize.selectQuery(`SELECT user_id FROM user_master_lov_permission WHERE lov_array && ARRAY['${userRightConditions.projectId.join("', '")}']::UUID[] AND master_id = '434473cb-b66d-4462-8eb1-6c47389695e7'`);
                            const joiner = `${qI}, ${qI}`;
                            query += ` AND id IN (${qI}${userIds.map((x) => x.user_id).join(joiner)}${qI})`;
                        }
                    }
                }
                if (response.some((x) => x.includes(`CREATE TABLE IF NOT EXISTS "${table}" `) && x.includes('"form_id" uuid') && userRightConditions.formLovDataRights && Array.isArray(userRightConditions.formLovDataRights) && userRightConditions.formLovDataRights.length > 0)) {
                    const joiner = `${qI}, ${qI}`;
                    query += `${query.includes("WHERE") ? " AND " : "WHERE "} form_id IN (${qI}${userRightConditions.formLovDataRights.join(joiner)}${qI})`;
                }
                if (response.some((x) => x.includes(`CREATE TABLE IF NOT EXISTS "${table}" `) && x.includes('"user_id" uuid'))) {
                    query += `${query.includes("WHERE") ? " AND " : "WHERE "} user_id=${qI}${userId}${qI}`;
                }
                if (!isResurvey && Object.hasOwn(mappedTables, table) && table.includes("zform_")) {
                    if (mappedTables[table].length > 0 && response.some((x) => x.includes(`CREATE TABLE IF NOT EXISTS "${table}" `) && x.includes('"is_active" text'))) {
                        query += " AND ( ";
                    }
                    query += mappedTables[table].reduce((pre, acc) => {
                        const joiner = `${qI}, ${qI}`;
                        pre.push(` "${acc}" && ARRAY[${qI}${accessLov.join(joiner)}${qI}]::uuid[]`);
                        return pre;
                    }, []).join(" OR ");
                    if (mappedTables[table].length > 0 && response.some((x) => x.includes(`CREATE TABLE IF NOT EXISTS "${table}" `) && x.includes('"is_active" text'))) {
                        query += " )";
                    }
                }
                return query;
            };
            const chunkSize = 5000;
            const allQueriesToExecute = [];
            const allTicketFormResponseKeys = Object.keys(ticketsFormResponseId);
            const ticketReponseCounts = (ticketsFormResponseId && allTicketFormResponseKeys.length) || 0;
            let packetCount = sendClubRecords.length + ticketReponseCounts;
            // get Logged in users details
            const [user] = await db.sequelize.selectQuery(`SELECT * FROM get_each_row_data('${schemaName}', 'users', 'WHERE id=''${req.user.userId}''')`);
            const getTableName = (table, single = true) => {
                const qI = single ? "'" : "''";
                if (Array.isArray(formLovData.functionNames) && formLovData.functionNames.includes(table)) {
                    return `${table.split("___")[0]}(${qI + req.user.userId + qI}, ${qI + formLovData.projectLovData[0] + qI})`;
                }
                return table;
            };
            // add one more query to update users table for mark logged in user details
            packetCount += 1;
            while (i < tables.length) {
                const isResurvey = tables[i].startsWith("resurvey ");
                const table = tables[i].replace("resurvey ", "");
                const [[{ count }]] = await db.sequelize.selectQuery(`SELECT count(*) FROM ${getTableName(table)} ${await conditions(table, true, isResurvey)}`);
                const loopCounts = Math.ceil(count / chunkSize);
                let k = 0;
                while (k < loopCounts) {
                    const filterQuery = `ORDER BY created_at DESC LIMIT ${chunkSize} OFFSET ${k * chunkSize}`;
                    allQueriesToExecute.push({ table: tables[i], filterQuery });
                    packetCount += 1;
                    k += 1;
                }
                i += 1;
            }
            i = 0;
            while (i < ticketReponseCounts) {
                const key = allTicketFormResponseKeys[i];
                const allResnposeIds = ticketsFormResponseId[key];
                const [tableName, columnName, type] = key.split("$");
                if (type !== "dropdown") {
                    publishMessage(global.eventNames.publisher, { id, type: global.eventNames.sendSocketMessage, pid: process.pid, message: JSON.stringify([{}]) });
                    i += 1;
                    continue;
                }
                const [[{ string_agg }]] = await db.sequelize.selectQuery(`SELECT STRING_AGG(${columnName}[1]::text, ''', ''') FROM ${tableName} WHERE ID IN ('${allResnposeIds.join("', '")}')`);
                const [material] = await db.sequelize.selectQuery(`SELECT * FROM serial_numbers(null, null) WHERE ID in ('${string_agg}')`);
                const columns = Object.keys(material[0]);
                defaultObject.tablename = tableName;
                defaultObject.querytoexecute = `INSERT INTO "serial_numbers" ("${columns.join('", "')}", "consumed") VALUES `;
                defaultObject.valuestoinsert = material.reduce((pre, cur) => `${pre}${pre !== "" ? "," : ""}('${Object.values(cur).join("','")}', true) `, "");
                publishMessage(global.eventNames.publisher, { id, type: global.eventNames.sendSocketMessage, pid: process.pid, message: JSON.stringify([defaultObject]) });
                Object.keys(defaultObject).forEach((x) => { delete defaultObject[x]; });
                i += 1;
            }
            packetCount += 1;
            packetCount += factoryTables.length;
            publishMessage(global.eventNames.publisher, { id, type: global.eventNames.sendSocketMessage, pid: process.pid, message: JSON.stringify({ packetCount }) });
            sendClubRecords.forEach((x) => {
                publishMessage(global.eventNames.publisher, { id, type: global.eventNames.sendSocketMessage, pid: process.pid, message: JSON.stringify([x]) });
            });
            resolve({ data: [] });
            i = 0;
            publishMessage(global.eventNames.publisher, { id, type: global.eventNames.sendSocketMessage, pid: process.pid, message: JSON.stringify(user) });
            while (i < factoryTables.length) {
                const { tableName, factoryTable, factoryColumn, linkColumn, sourceColumn, fromattributeid, facatoryTableName } = factoryTables[i];
                const tableNameForFactory = tableName !== "serial_numbers" ? facatoryTableName : tableName;
                const factoryFileParams = tableName === "serial_numbers" ? `('${req.user.userId}', '${formLovData.projectLovData[0]}', '${factoryTable}', '${factoryColumn}', '${linkColumn}', '${sourceColumn}' )` : " limit 1";
                const [material] = await db.sequelize.selectQuery(`SELECT * FROM ${tableName}${factoryFileParams}`);
                if (material && material.length > 0 && Object.prototype.toString.call(material[0]) === "[object Object]" && Object.keys(material[0]).length > 0) {
                    const columns = Object.keys(material[0]);
                    defaultObject.tablename = tableName;
                    defaultObject.querytoexecute = `INSERT INTO "${tableNameForFactory}" ("${columns.join('", "')}", "fromattributeid") VALUES `;
                    defaultObject.valuestoinsert = material.reduce((pre, cur) => `${pre}${pre !== "" ? "," : ""}('${Object.values(cur).join("','")}', '${fromattributeid}') `, "");
                    publishMessage(global.eventNames.publisher, { id, type: global.eventNames.sendSocketMessage, pid: process.pid, message: JSON.stringify([defaultObject]) });
                } else {
                    publishMessage(global.eventNames.publisher, {
                        id,
                        type: global.eventNames.sendSocketMessage,
                        pid: process.pid,
                        message: JSON.stringify([{ querytoexecute: null }])
                    });
                }
                Object.keys(defaultObject).forEach((x) => { delete defaultObject[x]; });
                i += 1;
            }
            publishMessage(global.eventNames.publisher, { id,
                type: global.eventNames.sendSocketMessage,
                pid: process.pid,
                message: JSON.stringify([{
                    tablename: "users",
                    id: "e620c116-1b9f-4628-b547-0ba18148578b",
                    querytoexecute: `UPDATE users SET logged_in_user = true WHERE id = '${req.user.userId}'`,
                    valuestoinsert: ""
                }]) });
            i = 0;
            while (i < allQueriesToExecute.length) {
                const { filterQuery } = allQueriesToExecute[i];
                let { table } = allQueriesToExecute[i];
                i += 1;
                if (Array.isArray(formLovData.functionNames) && formLovData.functionNames.includes(table)) {
                    const [material] = await db.sequelize.selectQuery(`SELECT * FROM ${table.split("___")[0]}('${req.user.userId}', '${formLovData.projectLovData[0]}')`);
                    const columns = Object.keys(material[0]);
                    defaultObject.tablename = table.split("___")[0];
                    defaultObject.querytoexecute = `INSERT INTO "${table.split("___")[0]}" ("${columns.join('", "')}", "fromattributeid") VALUES `;
                    defaultObject.valuestoinsert = material.reduce((pre, cur) => `${pre}${pre !== "" ? "," : ""}('${Object.values(cur).join("','")}', '${table.split("___")[1]}') `, "");
                    publishMessage(global.eventNames.publisher, { id, type: global.eventNames.sendSocketMessage, pid: process.pid, message: JSON.stringify([defaultObject]) });
                    Object.keys(defaultObject).forEach((x) => { delete defaultObject[x]; });
                    // eslint-disable-next-line no-continue
                    continue;
                }
                const isResurvey = table.split("___")[0].startsWith("resurvey ");
                table = table.split("___")[0].replace("resurvey ", "");
                const [_response] = await db.sequelize.selectQuery(`SELECT * FROM get_each_row_data('${schemaName}', '${getTableName(table, false)}', '${await conditions(table, undefined, isResurvey) || ""} ${filterQuery}')`);
                const prepareData = _response.reduce((pre, cur) => {
                    if (pre === null) return cur;
                    pre.valuestoinsert += `,${cur.valuestoinsert}`;
                    return pre;
                }, null);
                publishMessage(global.eventNames.publisher, { id, type: global.eventNames.sendSocketMessage, pid: process.pid, message: JSON.stringify([prepareData]) });
            }
        } catch (error) {
            if (id) {
                publishMessage(global.eventNames.publisher, { id, type: global.eventNames.closeConnection, pid: process.pid });
            }
            reject(error);
        }
    });
};

const getAllFormsType = async (req) => {
    const [projectLovData, formLovData] = await getUserLovAccess(req.user.userId, ["Project", "Form Configurator"]);
    const getFormTypeId = await formService.getAllFormsType({ ...Array.isArray(formLovData) && { id: formLovData }, ...Array.isArray(projectLovData) && { projectId: projectLovData } });
    const formTypeIdArray = getFormTypeId.map((obj) => obj.formTypeId);
    const getMaster = await getAllMasterMakerLov({ id: formTypeIdArray }, ["id", "name"], false);
    const data = await formService.getCountOfMasterInForms(getMaster.rows, formLovData, projectLovData);
    return { data };
};

async function getAllAssociatedTables(userId, condition, mappedTablesWithFormsAccess, isDownload, includeFormAttribute) {
    const [[projectLovData, formLovData], [mappingTables]] = await Promise.all([
        getUserLovAccess(userId, ["Project", "Form Configurator"]),
        this.sequelize.selectQuery("SELECT id, mapping_table_id, table_name FROM forms WHERE mapping_table_id IS NOT null")
    ]);
    mappingTables.forEach((element) => {
        if (formLovData.includes(element.id) && element.table_name) {
            mappedTablesWithFormsAccess.push(element);
        }
    });
    condition.projectId = projectLovData;
    condition.formLovData = structuredClone(formLovData);
    condition.formLovDataRights = structuredClone(formLovData);
    if (formLovData.length === 0) {
        throw new BadRequestError("Form not found");
    }

    const [[{ table_name: allFormTables }]] = await this.sequelize.selectQuery(`
        SELECT
            array_agg(forms.table_name)
        AS
            table_name
        FROM
            forms
        WHERE forms.id IN ('${condition.formLovData.join("', '")}') AND forms.is_published = true AND forms.is_active = '1'
    `);
    const tableNameCondtions = `${condition.formLovData && Array.isArray(condition.formLovData) && condition.formLovData.length > 0
        ? `AND fo.id IN ('${condition.formLovData.join("', '")}')`
        : ""}`;
    const projectIdConditions = `${condition.projectId && Array.isArray(condition.projectId) && condition.projectId.length > 0
        ? `AND fo.project_id IN ('${condition.projectId.join("', '")}')`
        : ""}`;
    const [[{ table_name: functionNames }]] = await this.sequelize.selectQuery(includeFormAttribute ? `
        SELECT
            ARRAY_AGG(aml.name || '___' || fa.id :: TEXT) AS table_name
        FROM
            forms AS fo
            INNER JOIN form_attributes AS fa ON fa.form_id = fo.id
            INNER JOIN all_masters_list AS aml ON fa.properties ->> 'sourceTable' = aml.id :: text
        WHERE
            aml.table_type = 'function'
            AND fa.properties ->> 'sourceTable' IS not null
            ${tableNameCondtions}
            ${projectIdConditions}
    ` : `
        SELECT
            array_agg(name) AS table_name
        FROM
            all_masters_list
        WHERE
            table_type = 'function'
    `);

    let [factoryTables] = await this.sequelize.selectQuery(`
        SELECT
            aml.name AS "tableName",
            fa.properties ->> 'factoryTable' AS "factoryTable",
            fa.properties ->> 'factoryColumn' AS "factoryColumn",
            fa.properties ->> 'linkColumn' AS "linkColumn",
            fa.properties ->> 'sourceColumn' AS "sourceColumn",
            factory_forms.table_name AS "facatoryTableName",
            fa.id AS fromattributeid
        FROM
            forms AS fo
            INNER JOIN form_attributes AS fa ON fa.form_id = fo.id
            INNER JOIN default_attributes AS d ON d.id = fa.default_attribute_id
            INNER JOIN all_masters_list AS aml ON aml.id::TEXT = fa.properties ->> 'sourceTable'
            INNER JOIN forms AS factory_forms ON factory_forms.id :: TEXT = fa.properties ->> 'factoryTable'
        WHERE
            d.input_type = 'dropdown'
            AND fa.properties ->> 'factoryTable' IS NOT NULL
            AND fa.properties ->> 'factoryTable' <> ''
            AND fa.is_active = '1'
            ${tableNameCondtions}
            ${projectIdConditions}
    `);

    factoryTables = structuredClone(factoryTables);
    
    const [ticketForms] = await this.sequelize.selectQuery(`
            SELECT
                PWTM.FORMS AS forms,
                TICKETS.FORM_ID AS TICKET_FORM_ID,
                TICKETS.RESPONSE_ID AS TICKET_RESPONSE_ID
            FROM
                TICKETS
                INNER JOIN PROJECT_WISE_TICKET_MAPPINGS AS PWTM ON PWTM.ID = TICKETS.PROJECT_WISE_MAPPING_ID
            WHERE assignee_id = '${userId}'
        `);

    let allTicketForms = ticketForms.map((x) => x.forms).flat();
    allTicketForms = Array.from(new Set(allTicketForms));
    let ticketsFormResponseId = {};
    let ticketFormsName = [];
    let ticketRelatedTabels = [];
    if (allTicketForms.length > 0) {
        let [ticketFormsNameResult] = await this.sequelize.selectQuery(`SELECT id, table_name FROM FORMS WHERE ID IN ('${allTicketForms.join("', '")}')`);
        ticketFormsNameResult = ticketFormsNameResult.reduce((pre, cur) => {
            pre[cur.id] = cur.table_name;
            return pre;
        }, {});
        ticketFormsName = Object.values(ticketFormsNameResult);
        let [newMeterSrNoColumns] = await this.sequelize.selectQuery(`
            SELECT
                F.TABLE_NAME,
                FAM.COLUMN_NAME,
                DAM.INPUT_TYPE
            FROM
                FORM_ATTRIBUTES AS FA
                INNER JOIN FORM_ATTRIBUTES AS FAM ON FA.PROPERTIES ->> 'oldNewMappingColumn' = FAM.ID :: TEXT
                INNER JOIN FORMS F ON F.ID = FA.FORM_ID
                INNER JOIN DEFAULT_ATTRIBUTES AS DA ON DA.ID = FA.DEFAULT_ATTRIBUTE_ID
                INNER JOIN DEFAULT_ATTRIBUTES AS DAM ON DAM.ID = FAM.DEFAULT_ATTRIBUTE_ID
            WHERE
                F.TABLE_NAME IN ('${ticketFormsName.join("', '")}')
                AND FA.PROPERTIES ->> 'oldNewMappingColumn' IS NOT NULL
                AND FA.PROPERTIES ->> 'oldNewMappingColumn' <> ''
                AND DA.INPUT_TYPE = 'text'
        `);
        newMeterSrNoColumns = newMeterSrNoColumns.reduce((pre, cur) => {
            pre[cur.table_name] = `${cur.column_name}$${cur.input_type}`;
            return pre;
        }, {});

        ticketsFormResponseId = ticketForms.reduce((pre, cur) => {
            if (newMeterSrNoColumns[ticketFormsNameResult[cur.ticket_form_id]]) {
                const keyName = `${ticketFormsNameResult[cur.ticket_form_id]}$${newMeterSrNoColumns[ticketFormsNameResult[cur.ticket_form_id]]}`;
                if (Object.hasOwn(pre, keyName)) {
                    pre[keyName].push(cur.ticket_response_id);
                } else {
                    pre[keyName] = [cur.ticket_response_id];
                }
            }
            return pre;
        }, {});
        ticketRelatedTabels = ["tickets", "form_wise_ticket_mappings", "project_wise_ticket_mappings", "forms_notifications"];
    }

    formLovData.projectLovData = structuredClone(projectLovData);
    formLovData.resurvey = allFormTables;
    formLovData.functionNames = functionNames;
    const tables = [
        "users",
        "forms",
        "default_attributes",
        "form_attributes",
        "all_masters_list",
        "all_master_columns",
        "attribute_visibility_conditions",
        "attribute_validation_conditions",
        "attribute_validation_blocks",
        "attribute_visibility_blocks",
        "projects",
        "master_maker_lovs",
        "master_makers",
        "project_master_makers",
        "project_master_maker_lovs",
        ...ticketRelatedTabels,
        ...allFormTables.map((x) => (isDownload ? `resurvey ${x}` : x))
    ];
    const tableNameConditions = includeFormAttribute ? "CASE WHEN a.table_type = 'function' THEN a.name || '___' || f.id ELSE a.name END" : "a.name";
    if (this.sequelize) {
        const [associatedTables] = await this.sequelize.selectQuery(`
            SELECT
                ${tableNameConditions} AS tablename
            FROM
                form_attributes AS f
                INNER JOIN forms AS fo ON fo.id = f.form_id
                INNER JOIN default_attributes AS d ON d.id = f.default_attribute_id
                RIGHT JOIN all_masters_list AS a ON a.id :: text = f.properties ->> 'sourceTable'
            WHERE
                d.input_type = 'dropdown'
                AND f.is_active = '1'
                ${tableNameCondtions}
                ${projectIdConditions}
            GROUP BY
                tablename
            UNION
            SELECT
                CASE
                    WHEN CONCAT(am.name, ff.table_name) <> '' THEN CONCAT(am.name, ff.table_name)
                END AS tablename
            FROM
                forms AS fo
                LEFT JOIN all_masters_list AS am ON am.id = fo.mapping_table_id
                LEFT JOIN forms AS ff ON ff.id = fo.mapping_table_id
            WHERE
                CONCAT(am.name, ff.table_name) <> ''
                ${tableNameCondtions}
                ${projectIdConditions}
            GROUP BY
                tablename
            ORDER BY
                tablename ASC
        `);
        tables.push(...associatedTables.map((x) => x.tablename));
    }
    return [tables, formLovData, factoryTables, ticketsFormResponseId, allTicketForms];
}

const getFormResponseById = async (req) => {
    const { db } = new Forms();
    const { formId, responseId } = req.query;
    const { userId, isSuperUser } = req.user;
    const getColumnIds = await getUserColumnWisePermissions(formId, userId, isSuperUser);
    const { tableName } = await formService.getFormByCondition({ id: formId });
    let query = "";
    const columnNames = await getActiveInactiveRecords({ formId }, ["id", "columnName", "properties"], undefined, true);
    const columnByIdName = columnNames.rows.reduce((pre, cur) => { pre[cur.id] = cur.columnName; return pre; }, {});
    let factoryTableColumns = columnNames.rows.filter((x) => x.properties?.factoryTable && columnByIdName[x.properties?.dependency]);
    factoryTableColumns = factoryTableColumns.map((x) => `${columnByIdName[x.properties?.dependency]} AS ${x.columnName}`);

    if (getColumnIds === true) {
        if (factoryTableColumns?.length) factoryTableColumns[0] = `, ${factoryTableColumns[0]}`;
        query = `select * ${factoryTableColumns} from ${tableName} where id = '${responseId}';`;
    } else {
        const names = columnNames?.rows.filter((obj) => !obj.properties?.factoryTable && getColumnIds.includes(obj.id)).map((obj) => obj.columnName);
        names.push("id", "submission_mode", "source", ...factoryTableColumns);
        const result = names.join(", ");
        query = `select ${result} from ${tableName} where id = '${responseId}';`;
    }
    const [data] = await db.sequelize.selectQuery(query);
    return { data };
};

const exportFormResponses = async (req, res) => {
    try {
        const { formId, mode, gaaLevelFilter, isExport, accessors, isReport, isTemp } = req.body;
        // const { name } = await formService.getFormByCondition({ id: formId });
        // const formName = name.replace(/ /g, "_");

        let rows;
        if (isReport) {
            ({ rows } = await metabaseReportsService.getReportData(formId, mode, req.user, undefined, gaaLevelFilter, undefined, isTemp, true, true));
        } else {
            ({ rows } = await formService.getFormResponsesQuery(req.body, req.user, undefined, isExport, accessors, false, undefined, undefined, isTemp));
        }

        const headers = Object.keys(rows[0]);
        const csvParser = new CsvParser({ headers });
        const data = csvParser.parse(rows);

        res.setHeader("Content-Type", "text.csv");
        res.status(200).end(data);

    } catch (error) {
        console.log(">backend | [forms.controller.js] > #649 | error : ", error);
        res.status(500).send({ message: "something went wrong", _error: error });
    }
};

const formResponses = async (req) => {
    const queryObject = req.query;
    const paginations = {};
    if (+queryObject.pageNumber && +queryObject.pageNumber - 1 && +queryObject.rowPerPage) {
        paginations.offset = (queryObject.pageNumber - 1) * queryObject.rowPerPage;
    }
    if (+queryObject.rowPerPage) {
        paginations.limit = +queryObject.rowPerPage;
    }
    const data = await formService.getFormResponsesQuery(req.body, req.user, paginations, undefined, undefined, req.query.countOnly === "1");
    return { data };
};

const getDistinctColumnValue = async (req) => {
    const { formId, columnName, searchString, rowPerPage, pageNumber, isActive, customAccessor, filterObjectForApi, gaaLevelFilter } = req.body;
    let data = {};
    data = await formService.getDistinctColumnValue(formId, columnName, searchString, rowPerPage, pageNumber, isActive, customAccessor, filterObjectForApi, gaaLevelFilter, req.user);

    return { data };
};

const getTicketRelatedData = async (req) => {
    const { formId, forms: formsArray, mobileFields, geoLocationField, responseId } = req.body;
    const forms = new Forms();
    const [form, formList, [formAttributes]] = await Promise.all([
        forms.findOne({ id: formId }, undefined, true),
        forms.findAll({ id: formsArray }, ["id", "name"]),
        forms.db.sequelize.selectQuery(`
            SELECT
                FA.NAME AS NAME,
                FA.COLUMN_NAME AS "columnName",
                AMC.NAME AS SOURCE_COLUMN,
                AML.NAME AS SOURCE_TABLE,
                AML.TABLE_TYPE,
                FA.PROPERTIES ->> 'selectType' AS DROPDOWN_TYPE,
                DA.INPUT_TYPE,
                FA.ID AS ID,
                FT.TABLE_NAME AS FACTORY_TABLE,
                FAT.COLUMN_NAME AS FACTORY_COLUMN,
                FAL.COLUMN_NAME AS LINK_COLUMN,
                FAD.COLUMN_NAME AS DEPENDENCY_COLUMN
            FROM
                FORM_ATTRIBUTES AS FA
                LEFT JOIN DEFAULT_ATTRIBUTES AS DA ON DA.ID = FA.DEFAULT_ATTRIBUTE_ID
                LEFT JOIN ALL_MASTERS_LIST AS AML ON AML.ID::TEXT = FA.PROPERTIES ->> 'sourceTable'
                LEFT JOIN ALL_MASTER_COLUMNS AS AMC ON AMC.ID::TEXT = FA.PROPERTIES ->> 'sourceColumn'
                LEFT JOIN FORMS AS FT ON FT.ID::TEXT = FA.PROPERTIES ->> 'factoryTable'
                LEFT JOIN FORM_ATTRIBUTES AS FAT ON FAT.ID::TEXT = FA.PROPERTIES ->> 'factoryColumn'
                LEFT JOIN FORM_ATTRIBUTES AS FAL ON FAL.ID::TEXT = FA.PROPERTIES ->> 'linkColumn'
                LEFT JOIN FORM_ATTRIBUTES AS FAD ON FA.PROPERTIES ->> 'dependency' = FAD.ID::TEXT
            WHERE
                FA.ID IN ('${[...mobileFields, geoLocationField].filter((x) => x).join("', '")}')
        `)
    ]);
    const { tableName } = form;
    let fields = "";
    let factoryTableConditions = false;
    let selectedJoin = "";
    const factoryTableJoin = {};
    formAttributes.forEach((val, ind) => {
        const comma = ind === 0 ? "" : ",";
        if (val.input_type !== "dropdown") {
            fields += `${comma} ${val.columnName} AS "${val.name}"`;
            return;
        }
        if (val.dropdown_type === "multi") {
            const foreignTable = val.table_type === "function" ? `${val.table_name}(null, null)` : val.table_name;
            fields += `${comma} ARRAY_TO_STRING(ARRAY(
                    SELECT "${val.source_column}" :: TEXT
                    FROM ${foreignTable}
                    WHERE id = ANY("${tableName}"."${val.columnName}")
                ), ', ') AS "${val.name}"`;
        } else {
            const foriegnTableName = val.factory_table || val.source_table === "serial_numbers" ? "material_serial_numbers" : val.source_table;
            const isFactory = !!val.factory_table;
            const joinName = isFactory ? "factory_table_join" : `${foriegnTableName}_${val.columnName}`;
            const selectedColumnName = isFactory ? `factory_table_join.${val.factory_column}` : `${joinName}.${val.source_column}`;
            fields += `${comma} ${selectedColumnName} as "${val.name}"`;
            if (isFactory) {
                if (factoryTableConditions) return true;
                factoryTableJoin.factory_table = val.factory_table;
                factoryTableJoin.factory_column = val.factory_column;
                factoryTableJoin.source_column = val.source_column;
                factoryTableJoin.dependency_column = val.dependency_column;
                factoryTableJoin.link_column = val.link_column;
                factoryTableJoin.joinname = "factory_table_join";
                factoryTableConditions = true;
                return;
            }
            selectedJoin += `LEFT OUTER JOIN ${foriegnTableName} as ${joinName} ON ${tableName}.${val.columnName}[1] = ${joinName}.id `;
        }
    });
    if (factoryTableConditions) {
        selectedJoin += `LEFT OUTER JOIN (
            SELECT sn.id, ft.${factoryTableJoin.factory_column} ${factoryTableJoin.factory_column}
                FROM "material_serial_numbers" sn
            INNER JOIN ${factoryTableJoin.factory_table} AS ft ON ft.${factoryTableJoin.link_column} = sn.${factoryTableJoin.source_column}
            WHERE FT.is_active = '1'
        ) AS ${factoryTableJoin.joinname} ON ${factoryTableJoin.joinname}.id = ${tableName}.${factoryTableJoin.dependency_column}[1]`;
    }

    const geoLocationKey = formAttributes.find((x) => x.id === geoLocationField)?.name;
    const [[responseData]] = await forms.db.sequelize.selectQuery(`
        SELECT
            ${fields}
        FROM
            ${tableName}
            ${selectedJoin}
        WHERE
            ${tableName}.id = '${responseId}'
        `);
    return { formList, geoLocationKey, responseData, project: form.project };
};

/**
 * Constant for conditional arrays
 * if condition is or then we do iterate via array.some method to check for one condition
 * else if condition is and then we do iterate via array.evert method to check for all conditions
 */
const conditionType = {
    and: Array.prototype.every,
    or: Array.prototype.some
};

/**
 * Contant to compare two values on the basis of operator
 */
const validationConditions = {
    et: (val1, val2) => {
        if (Array.isArray(val1)) {
            return val1.some((x) => x === val2);
        } else {
            return val1 === val2;
        }
    },
    net: (val1, val2) => {
        if (Array.isArray(val1)) {
            return !val1.some((x) => x === val2);
        } else {
            return val1 !== val2;
        }
    },
    gt: (val1, val2) => {
        if (Array.isArray(val1)) {
            return val1.some((x) => x > val2);
        } else {
            return val1 > val2;
        }
    },
    lt: (val1, val2) => {
        if (Array.isArray(val1)) {
            return val1.some((x) => x < val2);
        } else {
            return val1 < val2;
        }
    },
    gte: (val1, val2) => {
        if (Array.isArray(val1)) {
            return val1.some((x) => x >= val2);
        } else {
            return val1 >= val2;
        }
    },
    lte: (val1, val2) => {
        if (Array.isArray(val1)) {
            return val1.some((x) => x <= val2);
        } else {
            return val1 <= val2;
        }
    }
};

/**
 * Method to send payload to MDM based on differant condition
 * @param {Object} req
 * @returns
 */
const sendFormDataToMdm = async (formId, responseId, req) => {
    try {
        throwIfNot(formId, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
        throwIfNot(responseId, statusCodes.BAD_REQUEST, statusMessages.RESPONSE_ID_REQUIRED);
        const forms = new Forms();
        const form = await forms.findOne({ id: formId }, undefined, true);
        throwIfNot(form, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXISTS);
        const faByIds = JSON.parse(JSON.stringify(form)).form_attributes.reduce((pre, cur) => {
            pre[cur.id] = cur.name;
            return pre;
        }, {});
        // Get subQuery and add the isActive condition
        let subQuery = await formService.exportFormResponseQuery(form.tableName, "", false, undefined, undefined, undefined, true);
        subQuery = subQuery.replace("where_condition", ` ${form.tableName}.id='${responseId}'`);
        const [[[response]], [[formData]]] = await Promise.all([
            forms.db.sequelize.selectQuery(subQuery),
            forms.db.sequelize.selectQuery(`SELECT * FROM "${form.tableName}" WHERE "${form.tableName}"."id"='${responseId}'::UUID`)
        ]);
        throwIfNot(response, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXISTS);
        const integrationBlocksInstance = new AttributeIntegrationBlocks(undefined, true);
        const integrationBlocks = await integrationBlocksInstance.findAll({ formId }, undefined, true);
        if (!integrationBlocks?.length) {
            return Promise.resolve(true);
        }
        const finalPaylods = integrationBlocks.reduce((pre, cur) => {
            try {
                const { attribute_integration_conditions: conditions, attribute_integration_payloads: paylod, auth, endpoint, method, type, name } = cur;
                const isCondition = !conditions || (conditions && conditions.length > 0 && conditionType[type].call(conditions, (condition) => {
                    const { form_attribute: { columnName }, compareWithValue, compare_with_column: compareColumn, operatorKey } = condition;
                    return validationConditions[operatorKey].call(null, formData[columnName], compareWithValue || formData[compareColumn.columnName]);
                }));
                if (isCondition) {
                    const clonePayload = JSON.parse(JSON.stringify(paylod, null, 2));
                    const data = preparePayload(formatPayload(updateFormData(clonePayload)), response, faByIds, req);
                    pre.push(
                        {
                            payload: {
                                method,
                                url: endpoint,
                                maxBodyLength: Infinity,
                                ...auth && { headers: { ...Object.fromEntries(JSON.parse(auth)) } },
                                data
                            },
                            name
                        }
                    );
                }
            } catch (error) {
                logger.error(error);
            }
            return pre;
        }, []);
        console.dir(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#1176] | [finalPaylods] | `);
        console.dir(JSON.stringify(finalPaylods), { depth: 7 });
        const rsponse = await Promise.allSettled(finalPaylods.map((x) => axios.request(x.payload)));
        await Promise.all(
            rsponse.map(async ({ status, reason, value }, index) => {
                console.dir(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#1463] | [{ status, reason, value }] | `);
                console.dir(
                    {
                        status: JSON.stringify(status || {}),
                        reason: reason?.response?.data || reason?.message || reason,
                        value: value?.data || value
                    },
                    { depth: 6 }
                );
                if (status === "rejected") {
                    const mdmPyaloadMessage = (reason.response?.data?.operation?.messages || [reason.message || "Something Went Wrong"])?.join(", ") || "";
                    await forms.db.sequelize.query(`
                        UPDATE
                            ${form.tableName}
                        SET 
                            mdm_payload_status='${reason.response?.data?.operation?.status || "Failure"}',
                            mdm_payload_title='${finalPaylods[index].name}',
                            mdm_payload_timestamp='${reason.response?.data?.operation?.date || new Date().toISOString()}',
                            mdm_payload_message='${mdmPyaloadMessage?.replaceAll("'", "''")}'
                        WHERE
                            "${form.tableName}"."id"='${responseId}'::UUID
                    `);
                    throw new BadRequestError(mdmPyaloadMessage);
                } else if (status === "fulfilled") {
                    await forms.db.sequelize.query(`
                        UPDATE
                            ${form.tableName}
                        SET 
                            mdm_payload_status='${value.data?.operation?.status || "Success"}',
                            mdm_payload_title='${finalPaylods[index].name}',
                            mdm_payload_timestamp='${value.data?.operation?.date || new Date().toISOString()}',
                            mdm_payload_message=''
                        WHERE
                            "${form.tableName}"."id"='${responseId}'::UUID
                    `);
                }
            })
        );
    } catch (error) {
        console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#998] | [error] | `, error);
        throw error;
    }
};

/**
 * Method to set value in object
 * @param {Object} object
 * @param {Object} response
 * @returns
 */
const preparePayload = (object, response, faByIds, req) => Object.fromEntries(Object.entries(object).map(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
        return [key, value.map((x) => preparePayload(x, response, faByIds, req))];
    } else if (Object.prototype.toString.call(value) === "[object Object]" && !value.reponseObject) {
        return [key, preparePayload(value, response, faByIds, req)];
    } else {
        if (value.fixedValue && value.dependency && (!Object.hasOwn(faByIds, value.dependency) || (Object.hasOwn(faByIds, value.dependency) && response[faByIds[value.dependency]] === null))) {
            return [key, null];
        }

        if (value.isConcat === "true") {
            try {
                const allKeys = Object.keys(value).filter((x) => x.startsWith("column"));
                allKeys.sort((a, b) => a.replace("column") - b.replace("column"));
                if (allKeys.length > 0) {
                    let concatValue = response[faByIds[value[allKeys[0]]]];
                    allKeys.forEach((x, i) => {
                        if (i === 0) return;
                        concatValue += `${value.separator || ""}${response[faByIds[value[x]]] || ""}`;
                    });
                    return [key, concatValue];
                }
            } catch (error) {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#1502] | [error] | `, error);
            }
            return [key, null];
        }

        let finalValue = value.fixedValue || response[value.name] || null;
        if (finalValue === null) return [key, finalValue];

        if (value.subType) {
            if (value.subType === "F1") {
                const arrFinalVaue = finalValue.split("/");
                arrFinalVaue.reverse();
                return [key, arrFinalVaue[0]];
            }
            if (value.subType === "F2") {
                const arrFinalValue = finalValue.split("/");
                arrFinalValue.pop();
                return [key, `https://${req.headers.host}${arrFinalValue.join("/")}/`];
            }
            if (!finalValue) return [key, finalValue];
            let index = null;
            if (value.subType.startsWith("L") || value.subType.startsWith("S") || value.subType.startsWith("N")) {
                const length = value.subType?.length;
                index = +value.subType.slice(1, length) - 1;
            }
            if (value.subType.startsWith("N")) {
                const arrFinalVaue = finalValue.split(";").map((x) => x?.trim()).filter((x) => x);
                arrFinalVaue.sort((a, b) => a.split(":")[0].replace("SIM", "") - b.split(":")[0].replace("SIM", ""));
                const finalValueObject = {
                    simOne: arrFinalVaue[0].replace("SIM1:", ""),
                    simTwo: arrFinalVaue[1]?.replace("SIM2:", "")
                };
                finalValue = finalValueObject.simOne;
                if (index > 5) {
                    finalValue = finalValueObject.simTwo;
                    index -= 6;
                }
            }
            if (index !== null && index > -1 && finalValue) {
                const arrFinalVaue = finalValue.split(",");
                finalValue = arrFinalVaue[index];
            }
        }
        if (value.format?.toLowerCase() === "boolean") {
            let finalBool = false;
            if (value.trueValue && finalValue === value.trueValue) {
                finalBool = true;
            }
            // else if (value.falseValue && finalValue === value.falseValue) {
            //     finalBool = false;
            // }
            return [key, finalBool];
        }
        if (value.format?.toLowerCase() === "double") {
            if (typeof finalValue === "number") return [key, finalValue];
            if (typeof finalValue === "string") {
                const stringValue = finalValue.split("").filter((x) => ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-"].includes(x)).join("");
                if (!Number.isNaN(parseFloat(stringValue))) {
                    return [key, parseFloat(stringValue)];
                }
            }
            return [key, null];
        }
        return [key, finalValue];
    }
}));

/**
 * Prepare payload in object required as payload
 * @param {Object} data
 * @returns
 */
const formatPayload = (data) => {
    const groupedByParent = data.reduce((acc, entry) => {
        const { parentId, ...rest } = entry;
        acc[parentId] = acc[parentId] || [];
        acc[parentId].push(rest);
        return acc;
    }, {});

    const processEntries = (parent) => (groupedByParent[parent] || []).reduce((result, { id, name, type, value }) => {
        if (type === "key") {
            result[name] = value;
        } else if (type === "object") {
            const processedEntry = processEntries(id);
            if (Array.isArray(result)) {
                result.push(processedEntry);
            } else {
                result[name] = processedEntry;
            }
        } else if (type === "array") {
            const arr = [];
            (groupedByParent[id] || []).forEach((innerEntry) => {
                const { id: innerName, type: innerType, value: innerValue, name: title } = innerEntry;
                if (innerType === "key") {
                    arr.push({ [title]: innerValue });
                } else if (innerType === "object") {
                    arr.push(processEntries(innerName));
                } else if (innerType === "array") {
                    arr.push(processEntries(innerName));
                }
            });
            result[name] = arr;
        }
        return result;
    }, {});

    return processEntries("");
};

/**
 * Method to format object with parent and child relations
 * @param {Object} data
 * @returns
 */
function updateFormData(formDataSample) {
    return formDataSample.map((item) => ({
        ...item,
        value: { reponseObject: true, ...item.valueName, ...item.properties },
        parent: item.parent !== null ? item.parentName?.name : "",
        parentId: item.parent !== null ? item.parent : "",
        valueName: null,
        parentName: null
    }));
}

const ocrReader = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, "Missing OCR details.");

    const googleApiKey = process.env.GOOGLE_VISION_API_KEY;
    const apiUrl = `${process.env.GOOGLE_VISION_API_URL}?key=${googleApiKey}`;

    const data = await axios({
        method: "POST",
        url: apiUrl,
        data: req.body,
        headers: {
            "Content-Type": "application/json"
        }
    });

    throwIfNot(data?.data, statusCodes.NOT_FOUND, "Can't Read Clicked Image!");

    if (data?.data?.responses?.[0]?.textAnnotations?.[0]?.description) return { data: data.data.responses[0].textAnnotations[0].description };
    else return { message: "Can't read" };
};
  
const generateFormsReport = async (req) => {
    try {
        const { formId, approver, projectId, formType, gaaLevelDetails, dateFrom, dateTo, pageNumber, rowPerPage } = req.query;
        const forms = new Forms();
        const { name: formName, tableName } = await forms.findOne({ id: formId }, ["name", "tableName"], true);
        const approverType = approver === "L1" ? "L_A" : "L_B";
        let whereCondition = "";
        if (gaaLevelDetails) {
            Object.keys(gaaLevelDetails).forEach((key) => {
                whereCondition += ` AND ${tableName}.${key}[1] IN ('${gaaLevelDetails[key].join("', '")}')`;
            });
        }
        if (dateFrom) {
            whereCondition += ` AND ${tableName}.created_at >= '${dateFrom}'::TIMESTAMP`;
        }
        if (dateTo) {
            whereCondition += ` AND ${tableName}.created_at <= '${dateTo}'::TIMESTAMP`;
        }

        let pagination = "";
        if (pageNumber && rowPerPage) {
            pagination = `OFFSET ${(pageNumber - 1) * rowPerPage} LIMIT ${rowPerPage}`;
        }

        const dataQuery = `
            SELECT USERS.ID,
            USERS.NAME AS "approver_name",
            USERS.MOBILE_NUMBER AS "approver_mobile_number",
            ORGANIZATIONS.NAME AS "contractor_name",
            COUNT(DISTINCT CASE WHEN PMML.NAME = 'Rejected' THEN ${tableName}.ID END) AS "rejected",
            COUNT(DISTINCT CASE WHEN PMML.NAME = 'Approved' THEN ${tableName}.ID END) AS "approved",
            COUNT(DISTINCT CASE WHEN PMML.NAME = 'On-Hold' THEN ${tableName}.ID END) AS "on_hold"
            FROM ${tableName}
            INNER JOIN USERS ON USERS.ID = ${tableName}.${approverType}_APPROVER_NAME[1]::UUID
            INNER JOIN ORGANIZATIONS ON ORGANIZATIONS.ID = USERS.ORGANIZATION_ID
            INNER JOIN PROJECT_MASTER_MAKER_LOVS AS PMML ON PMML.ID = ${tableName}.${approverType}_APPROVAL_STATUS[1]::UUID
            WHERE ${tableName}.${approverType}_APPROVER_NAME IS NOT NULL
                ${whereCondition}
            GROUP BY USERS.ID,
                USERS.NAME,
                USERS.MOBILE_NUMBER,
                ORGANIZATIONS.NAME
            ${pagination};
        `;

        const countQuery = `
            SELECT COUNT(*)
            FROM ${tableName}
            INNER JOIN USERS ON USERS.ID = ${tableName}.${approverType}_APPROVER_NAME[1]::UUID
            INNER JOIN ORGANIZATIONS ON ORGANIZATIONS.ID = USERS.ORGANIZATION_ID
            INNER JOIN PROJECT_MASTER_MAKER_LOVS AS PMML ON PMML.ID = ${tableName}.${approverType}_APPROVAL_STATUS[1]::UUID
            WHERE ${tableName}.${approverType}_APPROVER_NAME IS NOT NULL
                ${whereCondition}
            GROUP BY USERS.ID,
                USERS.NAME,
                USERS.MOBILE_NUMBER,
                ORGANIZATIONS.NAME
        `;
        const projectData = await getProjectByCondition({ id: projectId });
        const [[data], [count]] = await Promise.all([forms.db.sequelize.selectQuery(dataQuery), forms.db.sequelize.selectQuery(countQuery)]);
        const modifiedData = JSON.parse(JSON.stringify(data));
        modifiedData.forEach((data) => {
            data.formName = formName;
            data.formType = formType;
            data.customer = projectData.customer.name;
            data.project = projectData.name;
        });
        const dataToSend = {
            rows: modifiedData,
            count: count.length
        };
        return { data: dataToSend };
    } catch (e) {
        console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.controller.js] | [#998] | [error] | `, e);
    }
};

const getMDMPayloadStatusDropdown = async (req, res) => {
    const { formId } = req.query;
    console.log(req.query);
    const forms = new Forms();
    const { tableName } = await forms.findOne({ id: formId }, ["tableName"]);
    const mdmPayloadValueQuery = `
        SELECT DISTINCT(ZF.MDM_PAYLOAD_STATUS) FROM ${tableName} AS ZF WHERE ZF.MDM_PAYLOAD_STATUS IS NOT NULL;
    `;

    const [data] = await forms.db.sequelize.selectQuery(mdmPayloadValueQuery);
    const result = data.map(({ mdm_payload_status: value }) => ({ id: value, name: value }));
    return { data: result };
};

module.exports = {
    createForm,
    updateForm,
    getFormDetails,
    getAllForms,
    deleteForm,
    getAllDefaultAttributes,
    publishForm,
    saveFormResponse,
    updateFormResponse,
    getDynamicFormData,
    getDynamicQueryData,
    getDynamicTableData,
    updateFormDataMapping,
    getMappedFormData,
    getOfflineData,
    getAllFormsType,
    getFormResponseById,
    getResurveyForms,
    exportFormResponses,
    getAllFormsByProjectIdAndArrayOfFormTypeId,
    formResponses,
    getTicketRelatedData,
    getDistinctColumnValue,
    sendFormDataToMdm,
    softDeleteFormResponse,
    ocrReader,
    generateFormsReport,
    getMDMPayloadStatusDropdown
};
