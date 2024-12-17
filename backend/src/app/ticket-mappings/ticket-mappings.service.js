const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ProjectMasterMakers = require("../../database/operation/project-master-makers");
const FormAttrubutes = require("../../database/operation/form-attributes");
const FormWiseTicketMappings = require("../../database/operation/form-wise-ticket-mappings");
const ProjectWiseTicketMappings = require("../../database/operation/project-wise-ticket-mappings");
const { exportFormResponseQuery } = require("../forms/forms.service");
const { filterObjectsByKeys } = require("../../utilities/common-utils");
const ProjectWiseTicketMappingsHistory = require("../../database/operation/project-wise-ticket-mappings-history");
const FormWiseTicketMappingsHistory = require("../../database/operation/form-wise-ticket-mappings-history");
const Forms = require("../../database/operation/forms");

const formWiseTicketMapppingAlreadyExists = async (where) => {
    try {
        const formWiseTicketMapping = new FormWiseTicketMappings();
        const data = await formWiseTicketMapping.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORM_WISE_TICKET_MAPPINGS_NOT_EXIST, error);
    }
};

const projectWiseTicketMapppingAlreadyExists = async (where) => {
    try {
        const projectWiseTicketMapping = new ProjectWiseTicketMappings();
        const data = await projectWiseTicketMapping.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_WISE_TICKET_MAPPINGS_NOT_EXIST, error);
    }
};

const createFormWiseTicketMappping = async (formWiseTicketMapppingDetails) => {
    try {
        const formWiseTicketMapping = new FormWiseTicketMappings();
        const data = await formWiseTicketMapping.create(formWiseTicketMapppingDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_FORM_WISE_TICKET_MAPPING_FAILURE, error);
    }
};

const createProjectWiseTicketMappping = async (projectWiseTicketMapppingDetails) => {
    try {
        const projectWiseTicketMapping = new ProjectWiseTicketMappings();
        const data = await projectWiseTicketMapping.create(projectWiseTicketMapppingDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PROJECT_WISE_TICKET_MAPPING_FAILURE, error);
    }
};

const getFormWiseTicketMapppingByCondition = async (where) => {
    try {
        const formWiseTicketMappings = new FormWiseTicketMappings();
        const data = await formWiseTicketMappings.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORM_WISE_TICKET_MAPPINGS_FAILURE, error);
    }
};

const getProjectWiseTicketMapppingByCondition = async (where) => {
    try {
        const projectWiseTicketMappings = new ProjectWiseTicketMappings();
        const data = await projectWiseTicketMappings.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_WISE_TICKET_MAPPINGS_FAILURE, error);
    }
};

const processFormWiseTicketMappingData = async (data) => Promise.all(
    data.map(async (obj) => {
        const formAttributes = new FormAttrubutes();
        const { searchFields, displayFields, mobileFields, geoLocationField } = obj;

        const [searchFieldNames, displayFieldNames, mobileFieldsNames, geoLocationFieldNames] = await Promise.all([
            formAttributes.findAll({ id: searchFields }, ["id", "name", "columnName"], false, true, undefined, true),
            formAttributes.findAll({ id: displayFields }, ["id", "name", "columnName"], false, true, undefined, true),
            formAttributes.findAll({ id: mobileFields }, ["id", "name", "columnName"], false, true, undefined, true),
            formAttributes.findOne({ id: geoLocationField }, ["id", "name", "columnName"], false, true, undefined, true)
        ]);
        obj.searchFields = searchFieldNames;
        obj.displayFields = displayFieldNames;
        obj.mobileFields = mobileFieldsNames;
        obj.geoLocationField = geoLocationFieldNames;

        return obj;
    })
);

const getAllFormWiseTicketMappping = async (where = {}) => {
    try {
        const formWiseTicketMapping = new FormWiseTicketMappings();
        const data = await formWiseTicketMapping.findAndCountAll(where, undefined, true, true, undefined);
        if (data.rows?.length > 0) {
            data.rows = await processFormWiseTicketMappingData(data.rows);
        }
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORM_WISE_TICKET_MAPPINGS_LIST_FAILURE, error);
    }
};

const processProjectWiseTicketMappingData = (data) => Promise.all(
    data.map(async (obj) => {
        const projectMasterMaker = new ProjectMasterMakers();
        const formsData = new Forms();
        const { issueFields, forms } = obj;
        const [formsNames, issueFieldsNames] = await Promise.all([
            formsData.findAll({ id: forms }, ["id", "name", "formTypeId"], false, true, undefined, true),
            projectMasterMaker.findAll({ id: issueFields }, ["id", "name", "columnName"], false, true, undefined, true)
        ]);
        obj.issueFields = issueFieldsNames;
        obj.forms = formsNames;
        return obj;
    })
);

const getAllProjectWiseTicketMappping = async (where = {}) => {
    try {
        const projectWiseTicketMapping = new ProjectWiseTicketMappings();
        const data = await projectWiseTicketMapping.findAndCountAll(where, undefined, true, true, undefined);

        if (data.rows?.length > 0) {
            data.rows = await processProjectWiseTicketMappingData(data.rows);
        }
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_WISE_TICKET_MAPPINGS_LIST_FAILURE, error);
    }
};

const getAllProjectWiseTicketMapppingByCondition = async (where = {}) => {
    try {
        const projectWiseTicketMapping = new ProjectWiseTicketMappings();
        projectWiseTicketMapping.queryObject = {};
        const data = await projectWiseTicketMapping.findAll(where, ["projectId", "forms"], false, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_WISE_TICKET_MAPPINGS_LIST_FAILURE, error);
    }
};

const updateFormWiseTicketMappping = async (formWiseTicketMapppingDetails, where) => {
    try {
        const formWiseTicketMapping = new FormWiseTicketMappings();
        const data = await formWiseTicketMapping.update(formWiseTicketMapppingDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORM_WISE_TICKET_MAPPING_UPDATE_FAILURE, error);
    }
};

const updateProjectWiseTicketMappping = async (projectWiseTicketMapppingDetails, where) => {
    try {
        const projectWiseTicketMapping = new ProjectWiseTicketMappings();
        const data = await projectWiseTicketMapping.update(projectWiseTicketMapppingDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_WISE_TICKET_MAPPING_UPDATE_FAILURE, error);
    }
};

const getFormFieldTypeDetails = async (db, searchField, formId) => {
    const getFeildTypeSQL = `
        select default_attributes.type, form_attributes.properties
        from default_attributes
        inner join form_attributes
        on form_attributes.default_attribute_id=default_attributes.id
        where form_attributes.column_name='${searchField}'
        and form_attributes.form_id='${formId}'
    `;
    const fieldType = await db.sequelize.selectQuery(getFeildTypeSQL);
    const { type, properties } = fieldType[0][0] || {};
    if (type !== "uuid[]") {
        return { type };
    }
    const { sourceTable, sourceColumn } = properties;
    return { type, sourceTable, sourceColumn };
};

/** Method to get form data */
const getFormData = async (queryData, tableName, requestFieldTypeCheck = false, isMDM = false) => {
    try {
        const { db } = new FormWiseTicketMappings();
        const { displayColumns, searchField, searchValue } = queryData;
        const parseColumns = JSON.parse(displayColumns);
        const convertedString = parseColumns?.map((item) => `'${item}'`).join(",");
        let getQuery = await exportFormResponseQuery(tableName, convertedString);
        const { type, sourceTable, sourceColumn } = requestFieldTypeCheck ? await getFormFieldTypeDetails(db, searchField, queryData.formId) : {};
        let whereCondition;
        if (type === "uuid[]") {
            const [sourceTableName, sourceColumnName] = await Promise.all([
                db.sequelize.selectQuery(`select name, table_type from all_masters_list where id='${sourceTable}'`),
                db.sequelize.selectQuery(`select name from all_master_columns where id='${sourceColumn}'`)
            ]);
            if (sourceTableName[0][0].table_type === "function") {
                if (parseColumns.includes(searchField)) {
                    whereCondition = ` ${sourceTableName[0][0].name}_${searchField}.${sourceColumnName[0][0].name} = '${searchValue}'`;
                } else {
                    whereCondition = ` LEFT OUTER JOIN ${sourceTableName[0][0].name}(NULL, NULL) AS ${sourceTableName[0][0].name}_${searchField} ON ${sourceTableName[0][0].name}_${searchField}.ID = ${tableName}.${searchField}[1] ${sourceTableName[0][0].name}_${searchField}.${sourceColumnName[0][0].name} = '${searchValue}'`;
                }
            } else {
                const searchValueFromSourceTable = await db.sequelize.selectQuery(`select id from ${sourceTableName[0][0].name} as target_table where target_table.${sourceColumnName[0][0].name} ILIKE '${searchValue}'`);
                if (!searchValueFromSourceTable[0].length) {
                    return [];
                }
                whereCondition = ` ${tableName}.${searchField} in ('{${searchValueFromSourceTable[0].map((item) => item.id).join("}','{")}}')`;
            }
        } else if (type === "text[]") {
            whereCondition = ` ${tableName}.${searchField} in ('{${searchValue}}')`;
        } else if (type === "double precision") {
            whereCondition = ` lower(CAST(${tableName}.${searchField} AS TEXT)) = '${searchValue}'`;
        } else if (searchField != "id") {
            whereCondition = ` lower(${tableName}.${searchField}) = lower('${searchValue}')`;
        } else {
            whereCondition = ` ${tableName}.${searchField} = '${searchValue}'`;
        }
        getQuery = getQuery.replace("where_condition", `${whereCondition} AND ${tableName}.is_active='1' `);
        const data = await db.sequelize.selectQuery(getQuery);
        const sql = `
            select column_name as accessor , name as header
            from form_attributes
            where column_name in (${convertedString}) and form_id = '${queryData.formId}'
        `;
        const columns = await db.sequelize.selectQuery(sql);
        if (isMDM) {
            columns[0]?.push({ header: "MDM Payload Status", accessor: "mdm_payload_status" });
        }
        const headers = columns[0].map((item) => item.header);
        if (displayColumns.includes("id")) {
            headers.unshift("Response ID");
        }
        const filteredData = filterObjectsByKeys(data[0], headers);
        return filteredData;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FIELD_TO_FETCH_FORM_DATA, error);
    }
};

const deleteProjectWiseTicketMapping = async (where) => {
    try {
        const projectWiseTicketMapping = new ProjectWiseTicketMappings();
        const data = await projectWiseTicketMapping.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_PROJECT_WISE_TICKET_MAPPING_FAILURE, error);
    }
};
const deleteFormWiseTicketMapping = async (where) => {
    try {
        const formWiseTicketMapping = new FormWiseTicketMappings();
        const data = await formWiseTicketMapping.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FORM_WISE_TICKET_MAPPING_FAILURE, error);
    }
};

const getProjectWiseTicketMappingHistory = async (where) => {
    try {
        const historyModelInstance = new ProjectWiseTicketMappingsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_WISE_TICKET_MAPPING_ID_REQUIRED, error);
    }
};
const getFormWiseTicketMappingHistory = async (where) => {
    try {
        const historyModelInstance = new FormWiseTicketMappingsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORM_WISE_TICKET_MAPPING_ID_REQUIRED, error);
    }
};

module.exports = {
    createFormWiseTicketMappping,
    createProjectWiseTicketMappping,
    formWiseTicketMapppingAlreadyExists,
    projectWiseTicketMapppingAlreadyExists,
    updateFormWiseTicketMappping,
    updateProjectWiseTicketMappping,
    getAllFormWiseTicketMappping,
    getAllProjectWiseTicketMappping,
    getFormWiseTicketMapppingByCondition,
    getProjectWiseTicketMapppingByCondition,
    deleteFormWiseTicketMapping,
    deleteProjectWiseTicketMapping,
    getFormData,
    getProjectWiseTicketMappingHistory,
    getFormWiseTicketMappingHistory,
    getAllProjectWiseTicketMapppingByCondition
};
