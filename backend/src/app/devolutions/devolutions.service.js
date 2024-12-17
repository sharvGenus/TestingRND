/* eslint-disable max-len */
const { Op } = require("sequelize");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Devolutions = require("../../database/operation/devolutions");
const DevolutionMaterials = require("../../database/operation/devolution-materials");
const { exportFormResponseQuery } = require("../forms/forms.service");
const { filterObjectsByKeys, generatePaginationParams } = require("../../utilities/common-utils");

const generateDevolutionDocNo = async (body) => {
    const devolutions = new Devolutions();
    const { projectId, formId, prefix, index } = body;
    const lastDevolution = await devolutions.findOne({ projectId, formId, devolutionDocNo: { [Op.startsWith]: `${prefix.replaceAll("\\", "\\\\")}` } }, ["devolutionDocNo"], false, { order: [["createdAt", "DESC"]] });
    const devolutionDocNo = lastDevolution?.devolutionDocNo;
    if (devolutionDocNo) {
        const newIndex = parseInt(devolutionDocNo.replace(`${prefix}`, "")) + 1;
        return `${prefix}${newIndex}`;
    } else {
        return `${prefix}${index}`;
    }
};

const devolutionAlreadyExists = async (where) => {
    try {
        const devolutions = new Devolutions();
        const data = await devolutions.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_FAILURE, error);
    }
};

const countDevolution = async (where) => {
    try {
        const devolutions = new Devolutions();
        const count = await devolutions.count(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_FAILURE, error);
    }
};

const createDevolution = async (body) => {
    try {
        const devolutions = new Devolutions();
        const data = await devolutions.createWithAssociation(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_DEVOLUTION_FAILURE, error);
    }
};

const getDevolution = async (where, attributes = undefined, isRelated = false) => {
    try {
        const devolutions = new Devolutions();
        const data = await devolutions.findOne(where, attributes, isRelated);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_FAILURE, error);
    }
};

const getDevolutionList = async (where, attributes = undefined, isRelated = true) => {
    try {
        const devolutions = new Devolutions();
        const data = await devolutions.findAndCountAll(where, attributes, isRelated, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_FAILURE, error);
    }
};

const countDevolutionMaterial = async (where) => {
    try {
        const devolutionMaterials = new DevolutionMaterials();
        const count = await devolutionMaterials.count(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_FAILURE, error);
    }
};

const getDevolutionMaterialList = async (where, attributes = undefined, isRelated = true) => {
    try {
        const devolutionMaterials = new DevolutionMaterials();
        const data = await devolutionMaterials.findAndCountAll(where, attributes, isRelated, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_FAILURE, error);
    }
};

const updateDevolution = async (body, where) => {
    try {
        const devolutions = new Devolutions();
        const data = await devolutions.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.UPDATE_DEVOLUTION_FAILURE, error);
    }
};

const deleteDevolutionMaterial = async (where) => {
    try {
        const devolutionMaterials = new DevolutionMaterials();
        const data = await devolutionMaterials.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_DEVOLUTION_MATERIAL_FAILURE, error);
    }
};

const getDevolutionIds = async (queryParams) => {
    try {
        const { db } = new Devolutions();
        const { projectId, formId, gaaHierarchy, customerId, customerStoreId, approvalStatus, sort } = queryParams;

        const addCondition = (column, value) => {
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    const formattedValue = value.map((item) => `'${item}'`).join(",");
                    whereCondition += ` AND ${column} IN (${formattedValue})`;
                } else if (column === "project_id") {
                    whereCondition += " AND 1=0";
                } else if (column === "form_id") {
                    whereCondition += " AND 1=0";
                }
            } else {
                whereCondition += ` AND ${column} = '${value}'`;
            }
        };

        const keys = Object.keys(gaaHierarchy);
        const gaaHierarchyConditions = keys.map((key) => `gaa_hierarchy->>'${key}' = '${gaaHierarchy[key]}'`);
        let whereCondition = `(${gaaHierarchyConditions.join(" OR ")})`;

        if (projectId) addCondition("project_id", projectId);
        if (formId) addCondition("form_id", formId);
        if (customerId) addCondition("customer_id", customerId);
        if (customerStoreId) addCondition("customer_store_id", customerStoreId);
        if (approvalStatus) whereCondition += ` AND approval_status = '${approvalStatus}'`;

        let orderBy = "ORDER BY created_at DESC";
        if (Array.isArray(sort) && sort.length) {
            const [column, direction = "DESC"] = sort;
            let dbColumn;
            switch (column) {
                case "createdAt":
                    dbColumn = "created_at";
                    break;
                case "updatedAt":
                    dbColumn = "updated_at";
                    break;
                default:
                    dbColumn = "created_at";
            }
            orderBy = `ORDER BY ${dbColumn} ${direction}`;
        }
        const paginations = generatePaginationParams(queryParams);

        const countQuery = `SELECT count(*) FROM devolutions WHERE ${whereCondition}`;
        const [[{ count }]] = await db.sequelize.selectQuery(countQuery);
        const sqlQuery = `SELECT id FROM devolutions WHERE ${whereCondition} ${orderBy} ${paginations}`;
        const [rows] = await db.sequelize.selectQuery(sqlQuery);
        const devolutionIds = rows.map((row) => row.id);
        return { count, devolutionIds };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_FAILURE, error);
    }
};

const getFormFieldTypeDetails = async (db, searchField, formId) => {
    const getFeildTypeSQL = `        
        SELECT 
            default_attributes.type, 
            form_attributes.properties 
        FROM 
            default_attributes 
            INNER JOIN form_attributes ON form_attributes.default_attribute_id = default_attributes.id 
        WHERE 
            form_attributes.column_name = '${searchField}' 
            AND form_attributes.form_id = '${formId}'
    `;
    const fieldType = await db.sequelize.selectQuery(getFeildTypeSQL);
    const { type, properties } = fieldType[0][0] || {};
    if (type !== "uuid[]") {
        return { type };
    }
    const { sourceTable, sourceColumn } = properties;
    return { type, sourceTable, sourceColumn };
};

const getSourceDetails = async (db, sourceTable, sourceColumn) => {
    const [tableDetail, columnDetail] = await Promise.all([
        db.sequelize.selectQuery(`SELECT name, table_type from all_masters_list WHERE id='${sourceTable}'`),
        db.sequelize.selectQuery(`SELECT name from all_master_columns WHERE id='${sourceColumn}'`)
    ]);
    return { tableType: tableDetail[0][0]?.table_type, tableName: tableDetail[0][0]?.name, columnName: columnDetail[0][0]?.name };
};

const getFormData = async (requestObject) => {
    try {
        const { db } = new Devolutions();
        const { projectId, formId, tableName, historyTableName, oldSerialNoColumn, oldMakeColumn, brandMasterId, formAttributes, columnMapping, newSerialNoColumn, newSerialNoPrefix, fromNewSerialNo, toNewSerialNo, gaaLevelFilter, fromDate, toDate, selectedResponseIds, devolutionId, isRejected, rowPerPage, pageNumber } = requestObject;

        const convertedString = formAttributes?.map((item) => `'${item}'`).join(",");
        let baseQuery = await exportFormResponseQuery(tableName, convertedString, true);

        let whereCondition = " WHERE";
        const { type: oldMakeType, sourceTable: oldMakeSourceTable, sourceColumn: oldMakeSourceColumn } = await getFormFieldTypeDetails(db, oldMakeColumn, formId);
        if (oldMakeType === "uuid[]") {
            const { tableType: oldMakeSourceTableType, tableName: oldMakeSourceTableName, columnName: oldMakeSourceColumnName } = await getSourceDetails(db, oldMakeSourceTable, oldMakeSourceColumn);
            if (oldMakeSourceTableType === "table" && oldMakeSourceTableName === "project_master_maker_lovs" && oldMakeSourceColumnName === "name") {
                whereCondition += ` ${historyTableName}.${oldSerialNoColumn} IS NOT NULL AND NOT EXISTS (SELECT 1 FROM project_master_maker_lovs AS project_master_maker_lovs_brand_master WHERE project_master_maker_lovs_brand_master.master_id = '${brandMasterId}' AND project_master_maker_lovs_${oldMakeColumn}.name ILIKE project_master_maker_lovs_brand_master.name)`;
            } else {
                throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_OLD_MAKE_COLUMN);
            }
        } else {
            throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_OLD_MAKE_COLUMN);
        }

        if (devolutionId) {
            // Devolution material list
            whereCondition += ` AND ${historyTableName}.record_id IN (SELECT devolution_materials.response_id FROM devolution_materials WHERE devolution_materials.devolution_id = '${devolutionId}' AND devolution_materials.is_active = '${isRejected ? "0" : "1"}')`;
        } else if (Array.isArray(selectedResponseIds) && selectedResponseIds.length) {
            // Selected material list
            const formattedSelectedResponseIds = selectedResponseIds.map((item) => `'${item}'`).join(",");
            whereCondition += ` AND ${historyTableName}.record_id IN (${formattedSelectedResponseIds})`;
        } else {
            // Check for already devoluted Response IDs
            const isDevolutionExists = await devolutionAlreadyExists({ projectId, formId, approvalStatus: { [Op.ne]: "0" } });
            if (isDevolutionExists) {
                whereCondition += ` AND ${historyTableName}.record_id NOT IN (SELECT devolution_materials.response_id FROM devolution_materials WHERE devolution_materials.devolution_id IN (SELECT devolutions.id FROM devolutions WHERE devolutions.project_id = '${projectId}' AND devolutions.form_id = '${formId}' AND devolutions.approval_status <> '0') AND devolution_materials.is_active = '1')`;
            }

            if (fromNewSerialNo || toNewSerialNo) {
                const { type, sourceTable, sourceColumn } = await getFormFieldTypeDetails(db, newSerialNoColumn, formId);
                if (type === "uuid[]") {
                    const { tableType: newSerialNoSourceTableType, tableName: newSerialNoSourceTableName, columnName: newSerialNoSourceColumnName } = await getSourceDetails(db, sourceTable, sourceColumn);
                    if (newSerialNoSourceTableType === "function" && newSerialNoSourceTableName === "serial_numbers" && newSerialNoSourceColumnName === "serial_number") {
                        if (newSerialNoPrefix) {
                            if (fromNewSerialNo) {
                                whereCondition += ` AND serial_numbers_${newSerialNoColumn}.serial_number ILIKE '${newSerialNoPrefix}%' AND CAST(SUBSTRING(serial_numbers_${newSerialNoColumn}.serial_number FROM ${newSerialNoPrefix.length + 1}) AS INTEGER) >= '${fromNewSerialNo}'`;
                            }
                            if (toNewSerialNo) {
                                whereCondition += ` AND serial_numbers_${newSerialNoColumn}.serial_number ILIKE '${newSerialNoPrefix}%' AND CAST(SUBSTRING(serial_numbers_${newSerialNoColumn}.serial_number FROM ${newSerialNoPrefix.length + 1}) AS INTEGER) <= '${toNewSerialNo}'`;
                            }
                        } else {
                            if (fromNewSerialNo) {
                                whereCondition += ` AND serial_numbers_${newSerialNoColumn}.serial_number >= '${fromNewSerialNo}'`;
                            }
                            if (toNewSerialNo) {
                                whereCondition += ` AND serial_numbers_${newSerialNoColumn}.serial_number <= '${toNewSerialNo}'`;
                            }
                        }
                    } else {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_NEW_SERIAL_NO_COLUMN);
                    }
                } else {
                    throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_NEW_SERIAL_NO_COLUMN);
                }
            }
    
            if (gaaLevelFilter && Object.keys(gaaLevelFilter).length) {
                whereCondition += Object.keys(gaaLevelFilter)
                    .filter((key) => !["fromDate", "toDate"].includes(key))
                    .map((key) => ` AND ${historyTableName}.${key}[1]::TEXT = '${gaaLevelFilter[key]}'`)
                    .join("");
            }
            if (fromDate) {
                whereCondition += ` AND ${historyTableName}.created_at >= '${fromDate}'::timestamp`;
            }
            if (toDate) {
                whereCondition += ` AND ${historyTableName}.created_at <= '${toDate}'::timestamp`;
            }

            // Check for Response IDs in the inventory.
            whereCondition += ` AND ${historyTableName}.record_id IN (SELECT stock_ledger_details.response_id FROM stock_ledger_details WHERE stock_ledger_details.transaction_type_id = 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND serial_number IS NOT NULL AND is_cancelled = false)`;
        }

        baseQuery = baseQuery.replace("where_condition", `${whereCondition} AND ${historyTableName}.is_active='1'`).concat(` ORDER BY record_id, ${oldSerialNoColumn}, ${historyTableName}.updated_at DESC`);
        const finalQuery = baseQuery.replace("SELECT", `SELECT DISTINCT ON (record_id, ${oldSerialNoColumn})`);
        const countQuery = `SELECT COUNT(*) FROM (${finalQuery}) AS SUBQUERY`;
        const [[{ count }]] = await db.sequelize.selectQuery(countQuery);
        const mappedQuery = finalQuery.replace(/ AS "([^"]+)"/gi, (_match, alias) => ` AS "${columnMapping[alias] || alias}"`);
        const paginations = generatePaginationParams({ rowPerPage, pageNumber });
        const sqlQuery = paginations ? `${mappedQuery} ${paginations}` : mappedQuery;
        const data = await db.sequelize.selectQuery(sqlQuery);
        const headers = ["Response ID", ...Object.values(columnMapping)];
        const rows = filterObjectsByKeys(data[0], headers);
        return { count, rows };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORM_DATA_FAILURE, error);
    }
};

module.exports = {
    generateDevolutionDocNo,
    devolutionAlreadyExists,
    countDevolution,
    createDevolution,
    getDevolution,
    getDevolutionList,
    countDevolutionMaterial,
    getDevolutionMaterialList,
    updateDevolution,
    deleteDevolutionMaterial,
    getDevolutionIds,
    getFormData
};
