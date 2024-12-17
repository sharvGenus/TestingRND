/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const { join } = require("node:path");
const { writeFile, existsSync, mkdirSync } = require("node:fs");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Forms = require("../../database/operation/forms");
const DefaultAttributes = require("../../database/operation/default-attributes");
const FormsAttributes = require("../../database/operation/form-attributes");
const UserColumnDefaultPermissions = require("../../database/operation/user-column-default-permissions");
const { getAllMastersListByCondition } = require("../all-masters-list/all-masters-list.service");
const { getAllMasterColumnsListByCondition } = require("../all-master-columns-list/all-master-columns-list.service");
const { getAttributValidationBlockByFormId, deleteFormsAttributeValidationBlock } = require("../attribute-validation-blocks/attribute-validation-blocks.service");
const { deleteFormsAttributeValidationCondition } = require("../attribute-validation-conditions/attribute-validation-conditions.service");
const { getAttributeVisibilityBlockByFormId, deleteFormsAttributeVisibilityBlock } = require("../attribute-visibility-blocks/attribute-visibility-blocks.service");
const { deleteFormsAttributeVisibilityCondition } = require("../attribute-visibility-conditions/attribute-visibility-conditions.service");
const { deleteformAttributesByFormId } = require("../form-attributes/form-attributes.service");
const { getFormattedDate } = require("../../utilities/common-utils");
const reportTypesObject = require("./form-response-object");
const { operations } = require("../../../constant");

const defaultColumnsToAdd = [
    {
        column: "source",
        type: "character varying",
        default: ""
    },
    {
        column: "counter",
        type: "INTEGER",
        default: "DEFAULT 1"
    },
    {
        column: "is_active",
        type: "form_responses_is_active",
        default: "DEFAULT ''1''"
    },
    {
        column: "submission_mode",
        type: "TEXT",
        default: "DEFAULT ''Online''"
    },
    {
        column: "ticket_id",
        type: "uuid",
        default: ""
    },
    {
        column: "created_by",
        type: "uuid",
        default: ""
    },
    {
        column: "updated_by",
        type: "uuid",
        default: ""
    },
    {
        column: "created_at",
        type: "timestamp with time zone",
        default: "NOT NULL DEFAULT CURRENT_TIMESTAMP"
    },
    {
        column: "submitted_at",
        type: "timestamp with time zone",
        default: "NOT NULL DEFAULT CURRENT_TIMESTAMP"
    },
    {
        column: "updated_at",
        type: "timestamp with time zone",
        default: "NOT NULL DEFAULT CURRENT_TIMESTAMP"
    },
    {
        column: "mdm_payload_title",
        type: "TEXT",
        default: ""
    },
    {
        column: "mdm_payload_timestamp",
        type: "timestamp with time zone",
        default: ""
    },
    {
        column: "mdm_payload_status",
        type: "text",
        default: ""
    },
    {
        column: "mdm_payload_message",
        type: "text",
        default: ""
    }];

const staticColumns = [
    {
        Header: "Source",
        accessor: "Source",
        column: "source",
        type: "extra",
        view: true,
        update: true
    },
    {
        Header: "Counter",
        accessor: "Counter",
        column: "counter",
        type: "extra",
        view: true,
        update: true
    },
    {
        Header: "Submission Mode",
        accessor: "Submission Mode",
        column: "submission_mode",
        type: "extra",
        view: true,
        update: true
    },
    {
        Header: "MDM Payload Status",
        accessor: "MDM Payload Status",
        column: "mdm_payload_status",
        type: "extra",
        view: true,
        update: true
    },
    {
        Header: "MDM Payload Title",
        accessor: "MDM Payload Title",
        column: "mdm_payload_title",
        type: "extra",
        view: true,
        update: true
    },
    {
        Header: "MDM Payload Timestamp",
        accessor: "MDM Payload Timestamp",
        column: "mdm_payload_timestamp",
        type: "extra",
        view: true,
        update: true
    },
    {
        Header: "MDM Payload Message",
        accessor: "MDM Payload Message",
        column: "mdm_payload_message",
        type: "extra",
        view: true,
        update: true,
        properties: {
            pickerType: "dateTimeBoth"
        }
    },
    {
        Header: "Ticket Number",
        accessor: "Ticket Number",
        column: "ticket_id",
        type: "extra",
        view: true,
        update: true
    },
    {
        Header: "Created On",
        accessor: "Created On",
        column: "created_at",
        type: "date",
        view: true,
        update: true,
        properties: {
            pickerType: "dateTimeBoth"
        }
    },
    {
        Header: "Updated On",
        accessor: "Updated On",
        column: "updated_at",
        type: "date",
        view: true,
        update: true,
        properties: {
            pickerType: "dateTimeBoth"
        }
    },
    {
        Header: "Submitted On",
        accessor: "Submitted On",
        column: "submitted_at",
        type: "date",
        view: true,
        update: true,
        properties: {
            pickerType: "dateTimeBoth"
        }
    },
    {
        Header: "Created By",
        accessor: "Created By",
        column: "created_by",
        type: "extra",
        view: true,
        update: true
    },
    {
        Header: "Updated By",
        accessor: "Updated By",
        column: "updated_by",
        type: "extra",
        view: true,
        update: true
    }
];

const generateHistoryWhereConditionForReport = (historyTableName, responseIdsWithATicketNumber) => ` 
    AND ${historyTableName}.TICKET_ID IS NULL
    AND (
        ${historyTableName}.RECORD_ID IN (
            '${responseIdsWithATicketNumber.join("', '")}'
        )
    ) AND ${historyTableName}.COUNTER = (
        SELECT
            MAX(subquery.COUNTER)
        FROM
            ${historyTableName} AS subquery
        WHERE
            subquery.RECORD_ID = ${historyTableName}.RECORD_ID
            AND subquery.TICKET_ID is null
    )`;

const generateNetworkColumnSplitJoinQuery = (table, networkColumnName) => ` 
CROSS JOIN LATERAL (
    SELECT
        "nc"."network_signal","nc"."has_both_sim1_and_sim2",
        "nc"."starts_with_sim1","nc"."starts_with_sim2",
        "nc"."has_sim1","nc"."has_sim2","nc"."has_double_sinr",
        split_part("nc"."network_signal",',',1) AS "part_1", split_part("nc"."network_signal",',',3) AS "part_2",
        split_part("nc"."network_signal",',',5) AS "part_3", split_part("nc"."network_signal",',',7) AS "part_4",
        split_part("nc"."network_signal",',',9) AS "part_5", split_part("nc"."network_signal",',',10) AS "part_6",
        split_part("nc"."network_signal",',',12) AS "part_7", split_part("nc"."network_signal",',',14) AS "part_8",
        split_part("nc"."network_signal",',',16) AS "part_9", split_part("nc"."network_signal",',',17) AS "part_10",
        split_part("nc"."network_signal",',',18) AS "part_11", split_part("nc"."network_signal",',',20) AS "part_12",
        split_part("nc"."network_signal",',',21) AS "part_13"
    FROM
        (
            SELECT
                REPLACE(REPLACE(${table}."${networkColumnName}"::TEXT,':',','),';',',') AS "network_signal",
                ${table}."${networkColumnName}"::TEXT LIKE '%SIM1%'
                AND ${table}."${networkColumnName}"::TEXT LIKE '%SIM2%' AS "has_both_sim1_and_sim2",
                ${table}."${networkColumnName}"::TEXT ILIKE 'SIM1%' AS "starts_with_sim1",
                ${table}."${networkColumnName}"::TEXT ILIKE 'SIM2%' AS "starts_with_sim2",
                ${table}."${networkColumnName}"::TEXT LIKE '%SIM1%' AS "has_sim1",
                ${table}."${networkColumnName}"::TEXT LIKE '%SIM2%' AS "has_sim2",
                (
                    length(${table}."${networkColumnName}"::TEXT) -
                    length(replace(${table}."${networkColumnName}"::TEXT,'SINR:',''))
                ) / length('SINR:') > 1 AS "has_double_sinr"
        ) "nc"
) "nc"
`;

const generateLocationSplitSelections = (table, { ifs_column_name: columnName, fa_name: columnHeader }) => `
        split_part("${table}"."${columnName}", ',', 1) AS "Latitude (${columnHeader.split(" ")[0]})"
        , split_part("${table}"."${columnName}", ',', 2) AS "Longitude (${columnHeader.split(" ")[0]})"
        , split_part("${table}"."${columnName}", ',', 3) AS "Accuracy (${columnHeader.split(" ")[0]})"
`;

const formAlreadyExists = async (where) => {
    try {
        const forms = new Forms();
        const data = await forms.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORM_ALREADY_EXIST, error);
    }
};

const getFormAttributes = async (where) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes.findAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORMATTRIBUTES_LIST_FAILURE, error);
    }
};

const createForm = async (formDetails) => {
    try {
        const forms = new Forms();
        const data = await forms.create(formDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_FORM_FAILURE, error);
    }
};
const updateForm = async (formDetails, where) => {
    try {
        const forms = new Forms();
        const data = await forms.update(formDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORM_UPDATE_FAILURE, error);
    }
};

const getAllForms = async (where) => {
    try {
        const forms = new Forms();
        const data = await forms.findAndCountAll(where, undefined, true, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORM_LIST_FAILURE, error);
    }
};

const getAllDefaultAttributes = async () => {
    try {
        const defaultAttributes = new DefaultAttributes();
        const data = await defaultAttributes.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORM_LIST_FAILURE, error);
    }
};

const deleteForm = async (where, transaction, isDeleted) => {
    try {
        const forms = new Forms();
        const data = await forms.delete(where, transaction, isDeleted);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FORM_FAILURE, error);
    }
};
const getFormByCondition = async (where, isForMappingTable, paranoid = false) => {
    try {
        const forms = new Forms();
        if (paranoid) {
            forms.relations = forms.relations.map((x) => { x.paranoid = false; return x; });
        }
        if (!isForMappingTable) {
            return forms.findOne(where, undefined, true, undefined, false);
        }
        // First check for dynamic master
        const query = `
        SELECT
            mapper.table_name AS mapping_table,
            mapper_att.column_name AS mapping_column,
            form_att.column_name AS key_name,
            forms.table_name AS own_table,
            form_att.id AS att_id
        FROM
            forms
            INNER JOIN forms AS mapper ON mapper.id = forms.mapping_table_id
            INNER JOIN form_attributes AS mapper_att ON mapper_att.form_id = mapper.id
            INNER JOIN form_attributes AS form_att ON form_att.mapping_column_id = mapper_att.id AND forms.id = form_att.form_id
        WHERE
            forms.id = '${where.id}'`;
        const [result] = await forms.db.sequelize.selectQuery(query);
        if (result.length > 0) {
            return result;
        }
        // if mapping not included dynamic master
        const query2 = `
        SELECT
            aml.name AS mapping_table,
            amc.name AS mapping_column,
            fa.column_name AS key_name
        FROM
            forms
        INNER JOIN
            form_attributes AS fa ON fa.form_id = forms.id
        INNER JOIN
            all_masters_list AS aml ON aml.id = forms.mapping_table_id
        INNER JOIN
            all_master_columns AS amc ON amc.id = fa.mapping_column_id
        WHERE
            forms.id = '${where.id}'
        `;
        const [result2] = await forms.db.sequelize.selectQuery(query2);
        return result2;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORM_FAILURE, error);
    }
};

const createDynamicFormTable = async (data, dynamiceTableName, schemaName = "public") => {
    const { db } = new Forms();
    const createString = generateQuery(data);
    await db.sequelize.query(`call create_dynamic_table('${schemaName}', '${dynamiceTableName}', '${createString}')`);
    db.sequelize.query("call created_all_required_indexs()");
    return Promise.resolve();
};

const generateQuery = (array) => {
    let line = "id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY, ";
    line += array.map((obj) => {

        let defualtValue = obj.properties.defaultDataValueInColumn || obj.default_attribute.defaultValue;
        if (defualtValue && typeof defualtValue === "string" && defualtValue.trim() !== "" && !defualtValue.includes("(") && !defualtValue.includes(")")) {
            defualtValue = `''${defualtValue.trim()}''`;
        }
        const defaultSet = defualtValue ? `DEFAULT ${defualtValue}` : "";
        const columnLine = `${obj.columnName} ${obj.default_attribute.type} ${defaultSet}`;
        // if (obj.default_attribute.name === "Dropdown" && obj.properties.sourceTable && obj.properties.sourceColumn) {
        //     columnLine += `, FOREIGN KEY (${obj.columnName}) REFERENCES ${obj.properties.sourceTable}(${obj.properties.sourceColumn})`;
        // }
        return columnLine;
    }).join(", ");
    line += ` , ${defaultColumnsToAdd.map((x) => Object.values(x).join(" ")).join(", ")}`;
    return line;
};

const saveDynamicFormResponse = async (tableName, payload, schemaName = "public") => {
    const { db } = new Forms();
    payload.submitted_at = Date.now();
    const data = Object.entries(payload).reduce((prev, [key, cur]) => {
        let value = `${cur}`;
        if (cur !== null) {
            if (["created_at", "updated_at", "submitted_at"].includes(key)) {
                const date = `${new Date(Number.isNaN(+cur) ? cur : +cur).getTime()}`;
                value = `to_timestamp(${date.slice(0, date.length - 3)})`;
            } else {
                value = `''${cur}''`;
            }
        }
        prev.push(value);
        return prev;
    }, []);
    const res = await db.sequelize.query(`
        call save_form_submissions(
            '${schemaName}',
            '${tableName}',
            '${Object.keys(payload).reduce((prev, cur) => (`${prev}, ${cur}`))}',
            '${data.join(", ")}'
        )
    `);
    return res;
};

const handleFilesInFormsResponse = async (body = {}, files = [], formAttributes = [], loggedInUser = {}, formName = "") => {
    let payload = structuredClone(body);
    let i = 0;
    const seperator = " - ";
    while (i < formAttributes.length) {
        const x = formAttributes[i];
        if (x && x.default_attribute.inputType === "blob" && payload[x.columnName] && payload[x.columnName].indexOf(";base64") > -1) {
            const blob = payload[x.columnName];
            const index = blob.indexOf(";base64");
            const extenssions = blob.substr(0, index).split("/")[1];
            files.push([x.columnName, { data: blob.substr(index + 7, blob.length), name: `file_blob.${extenssions}`, cOptions: { encoding: "base64" } }]);
        }
        if (x.columnName === "resurveyor_org_id" && loggedInUser?.organizationId && !payload.resurveyor_org_id) {
            payload.resurveyor_org_id = [loggedInUser?.organizationId];
        }
        if (x.columnName === "resurveyor_org_type" && loggedInUser?.organizationTypeId && !payload.resurveyor_org_type) {
            payload.resurveyor_org_type = [loggedInUser?.organizationTypeId];
        }
        i += 1;
    }
    const todayDate = getFormattedDate();
    const folderName = join(global.formSubissionsUploadFolderNew, formName, todayDate);
    if (!existsSync(join(global.upploadFolder, folderName))) {
        mkdirSync(join(global.upploadFolder, folderName), { recursive: true });
    }
    await Promise.all(files.map(async ([fieldName, file]) => {
        const key = fieldName.split(seperator)[0];
        const type = file?.mimetype?.split("/")?.at(-1) || "";
        const originalName = file.name.includes(".") ? file.name : `${file.name}.${type}`;
        const fileName = `/${join(folderName, `${key}_${Date.now()}_${originalName}`)}`;
        const filePath = join(global.upploadFolder, fileName);
        return new Promise((resolve, reject) => {
            writeFile(filePath, file.data, {
                ...file.cOptions && Object.keys(file.cOptions).length > 0 && file.cOptions
            }, (err, data) => {
                if (err) return reject(err);
                if (file.cOptions) {
                    payload[fieldName] = fileName;
                } else if (!payload[key]) {
                    payload[key] = [fileName];
                } else {
                    if (!Array.isArray(payload[key])) {
                        payload[key] = [payload[key]];
                    }
                    payload[key].push(fileName);
                }
                return resolve(true);
            });
        });
    }));
    let k = 0;
    const payloadEnteries = Object.entries(payload);
    while (k < payloadEnteries.length) {
        if (payloadEnteries[k] && Array.isArray(payloadEnteries[k]?.[1])) {
            const value = payloadEnteries[k][1];
            payloadEnteries[k][1] = value.filter((y, j) => value.indexOf(y) === j);
        }
        k += 1;
    }
    payload = Object.fromEntries(payloadEnteries.map(([key, value]) => {
        if (value && Object.prototype.toString.call(value) === "[object String]") {
            return [key, value.replaceAll("'", "''''")];
        } else if (Array.isArray(value)) {
            return [key, value.map((x) => x.replaceAll("'", "''''"))];
        }
        return [key, value];
    }));
    const finalPayload = { ...payload.id && { id: payload.id } };
    defaultColumnsToAdd.forEach(({ column }) => {
        if (payload[column]) {
            finalPayload[column] = payload[column];
        }
    });
    formAttributes.forEach((obj) => {
        if (Object.prototype.hasOwnProperty.call(payload, obj.columnName)) {
            if (obj.default_attribute.type.includes("[]")) {
                if (Array.isArray(payload[obj.columnName]) && payload[obj.columnName].length > 0 && !payload[obj.columnName].some((x) => [null, "null", "", " "].includes(x))) {
                    finalPayload[obj.columnName] = `${payload[obj.columnName].reduce((prev, curr) => `${prev + curr}", "`, '{"')}}`.replace(', "}', "}");
                    return;
                }
                finalPayload[obj.columnName] = null;
            } else if (["null", "", " "].includes(payload[obj.columnName])) {
                finalPayload[obj.columnName] = null;
            } else if (payload[obj.columnName]) {
                finalPayload[obj.columnName] = payload[obj.columnName];
            }
        }
    });
    return finalPayload;
};

const updateDynamicFormResponse = async (tableName, payload, schemaName = "public") => {
    const restPayload = structuredClone(payload);
    const recordId = restPayload.id;
    delete restPayload.id;
    const { db } = new Forms();
    const data = Object.entries(restPayload).reduce((prev, [key, value]) => {
        let cur = `${key}=${value}`;
        if (!["null", null].includes(value)) {
            cur = `${key}=''${value}''`;
            if (["updated_at"].includes(key)) {
                const date = `${Date.now()}`;
                cur = `${key}=to_timestamp(${date.slice(0, date.length - 3)})`;
            }
        }
        prev.push(cur);
        return prev;
    }, []);
    const res = await db.sequelize.query(`
        call update_form_submissions(
            '${schemaName}',
            '${tableName}',
            '${data.join(", ")}',
            '${recordId}'
        )
    `);
    return res;
};

const getDynamicFormData = async (tableName, whereQuery, formId, userObject, isHistory, schema = "public") => {
    const { db, queryObject } = new Forms();
    const UserColumnDefaultPermission = new UserColumnDefaultPermissions();

    const { whereKey, whereValue } = whereQuery;
    const { userId, isSuperUser } = userObject;

    const permissionData = await UserColumnDefaultPermission.findOne({ userId, formId }, ["add", "update", "view", "deleteRecord"], false, undefined, true);
    const formPermissions = {
        add: permissionData?.add ?? isSuperUser,
        view: permissionData?.view ?? isSuperUser,
        update: permissionData?.update ?? isSuperUser,
        deleteRecord: permissionData?.deleteRecord ?? isSuperUser
    };

    if (!formPermissions.update && !formPermissions?.view) {
        return { rows: [], columns: [], count: 0, formPermissions };
    }
    const paginationParameters = paginationParams(queryObject, tableName);
    const table = isHistory === "true" ? `${tableName}_history` : tableName;
    const whereCondition = whereKey && whereValue
        ? `ARRAY['"${table}"."${whereKey}"','${whereValue}']`
        : "ARRAY[]::text[]";
    const whereCountCondition = whereKey && whereValue ? `WHERE "${whereKey}"='${whereValue}'` : "";
    // Added a new "properties" attribute to the form data, which can be retrieved, created, updated, and deleted via the respective endpoints in the Forms API.

    // if all works fine then we will remove this
    const sql = `
        SELECT form_attributes.name AS "Header",
        form_attributes.column_name AS accessor,
        form_attributes.properties AS properties,
        form_attributes.is_active AS status,
        default_attributes.input_type as "type",
        COALESCE(user_column_wise_permissions.update, ${isSuperUser}) AS update,
        COALESCE(user_column_wise_permissions.view, ${isSuperUser}) AS view
        FROM form_attributes
        left outer join default_attributes on default_attributes.id = form_attributes.default_attribute_id
        left outer join user_column_wise_permissions ON user_column_wise_permissions.column_id = form_attributes.id AND user_column_wise_permissions.user_id = '${userId}' AND user_column_wise_permissions.form_id = '${formId}'
        WHERE ${schema}.form_attributes.form_id ='${formId}'
        order by form_attributes.rank asc, form_attributes.name asc;
    `;
    // Execute all queries concurrently using Promise.all
    const [res, countData, columnsData] = await Promise.all([
        db.sequelize.selectQuery(`select gen_query('public','${table}', ${whereCondition} ,'${paginationParameters}')`),
        db.sequelize.selectQuery(`SELECT COUNT(*) FROM ${schema}.${table} ${whereCountCondition}`),
        db.sequelize.selectQuery(sql)
    ]);
    const queryData = await db.sequelize.selectQuery(res[0][0].gen_query);
    const { count } = countData[0]?.[0] || {};
    let columns = columnsData[0].concat(staticColumns);
    columns = makeRequiredHeader(columns);
    const accessors = columns.map((item) => item.accessor);
    accessors.push("id");
    const requiredArray = queryData[0]?.length ? await filterObjectsByKeys(queryData[0], accessors) : [];
    return { rows: requiredArray, columns, count: count && !Number.isNaN(count) ? +count : 0, formPermissions };
};

const filterObjectsByKeys = (objects, keys) => objects.map((obj) => {
    const filteredObj = {};
    keys.forEach((key) => {
        if (Object.hasOwnProperty.call(obj, key)) {
            filteredObj[key] = obj[key];
        }
    });
    return filteredObj;
});

const makeRequiredHeader = (array) => {
    // Filter the array to include only objects where both 'update' and 'view' are true
    const filteredArray = array.filter((obj) => obj.update === true || obj.view === true);

    // Modify the 'accessor' property for objects of type 'dropdown'
    filteredArray.forEach((obj) => {
        if (obj.type === "dropdown") {
            obj.accessor += "_data";
        }
    });

    return filteredArray;
};

const paginationParams = (queryObject, tableName) => {
    let requiredStrig = "";
    // const orderArray = [ [ Col { col: 'updated_at' }, 'DESC' ] ];
    const { order, limit, offset, sort } = queryObject;
    if (order) {
        requiredStrig += `order by ${sort[0]} ${sort[1]} `;
    }

    if (offset) {
        requiredStrig += `offset ${offset} `;
    }

    if (limit) {
        requiredStrig += `limit ${limit}`;
    }
    return requiredStrig;
};

// const transformData = (data) => data.map((obj) => {
//     const newObj = {};
//     Object.entries(obj).forEach(([key, value]) => {
//         const keys = key.split(".");
//         let currentObj = newObj;
//         keys.forEach((nestedKey, index) => {
//             if (index === keys.length - 1) {
//                 currentObj[nestedKey] = value;
//             } else {
//                 if (!currentObj[nestedKey]) currentObj[nestedKey] = {};
//                 currentObj = currentObj[nestedKey];
//             }
//         });
//     });
//     return newObj;
// });

const getDropDownData = async (data, userObj, projectId, formProject, formId, responseId) => {
    const { db } = new Forms();
    const { name, dependency } = data;
    const selectClause = await generateDynamicQuery.call(db, data, userObj, projectId, formProject, formId, responseId, name, dependency);
    return selectClause;
};

async function generateDynamicQuery(data, userObj, projectId, formProject, formId, responseId, name, dependencyUuid) {
    const { conditions, sourceColumn, sourceTable, factoryTable, factoryColumn, linkColumn, formAttributeId, isWebResponse } = data;
    const { userId } = userObj;
    const sourceTables = {};
    const allMasterlist = await getAllMastersListByCondition({ id: sourceTable });
    if (allMasterlist) {
        sourceTables.tableName = allMasterlist.name;
        sourceTables.tableType = allMasterlist.tableType;
    } else {
        const [[dynamicSource]] = await this.sequelize.selectQuery(`SELECT table_name FROM forms WHERE id = '${sourceTable}'::uuid`);
        sourceTables.tableName = dynamicSource.table_name;
        sourceTables.tableType = "table";
        sourceTables.isDynamicSource = true;
    }
    if (!sourceTables.isDynamicSource) {
        const { name: columnName } = await getAllMasterColumnsListByCondition({ id: sourceColumn });
        sourceTables.columnName = columnName;
    } else {
        const [[formAttribute]] = await this.sequelize.selectQuery(`SELECT column_name FROM form_attributes WHERE id = '${sourceColumn}'::uuid`);
        sourceTables.columnName = formAttribute.column_name;
    }

    if (data.extraColumn) {
        const extraColumnList = await getAllMasterColumnsListByCondition({ id: data.extraColumn });
        if (extraColumnList) {
            sourceTables.matchingColumn = extraColumnList.name;
        } else {
            const [[formAttribute]] = await this.sequelize.selectQuery(`SELECT column_name FROM form_attributes WHERE id = '${data.extraColumn}'::uuid`);
            sourceTables.matchingColumn = formAttribute.column_name;
        }
    }
    const { tableName, tableType, columnName, matchingColumn } = sourceTables;
    const isFactoryFile = !!(factoryTable && factoryColumn && linkColumn && sourceColumn);
    const factoryFileParams = isFactoryFile ? `, '${factoryTable}', '${factoryColumn}', '${linkColumn}', '${sourceColumn}'` : "";
    const webResponsesParams = formId && formAttributeId && responseId ? `, '${formId}', '${formAttributeId}', '${responseId}'` : "";
    const projectIdValue = isWebResponse ? null : `'${projectId}'`;
    const table = tableType === "function" ? `${tableName}('${userId}', ${projectIdValue} ${factoryFileParams} ${webResponsesParams})` : tableName;
    let dependency;
    if (dependencyUuid) {
        const [[{ faname } = {}]] = await this.sequelize.selectQuery(
            `SELECT fa.name AS faname FROM form_attributes AS fa WHERE fa.id = '${dependencyUuid}'`
        );
        dependency = faname;
    }
    const query = await getDropDownQuery(table, isFactoryFile && tableType === "function" ? "factory_value" : columnName, matchingColumn, conditions, tableType, formProject, name, dependency, sourceColumn, sourceTable);
    return query;
}

const getDropDownQuery = async (tableName, columnName, extraColumn, conditions, tableType, formProject, name, dependency, sourceColumn, sourceTableId) => {
    const { db } = new Forms();
    let searchColumns = [];
    if (conditions && conditions.length > 0) {
        const searchColumnPromises = conditions.map(async (obj) => {
            const { name: searchColumn } = await getAllMasterColumnsListByCondition({ id: obj.column });
            return { column: `${searchColumn}::TEXT`, op: operations[obj.operation], value: obj.value };
        });
        searchColumns = await Promise.all(searchColumnPromises);
    }
    if (tableType !== "function") {
        searchColumns.push({ column: "is_active", op: "=", value: "1" });
    }

    const dataPayload = {
        tableName,
        columnName,
        extraColumn,
        searchColumns
    };

    const { selectClause, matchingColum, fieldName, query } = generateSelectQuery(dataPayload, name);
    let sqlQuery = "";
    if (tableName === "users") {
        const query = `SELECT user_id as "userId" FROM user_master_lov_permission WHERE lov_array && ARRAY['${formProject}']::UUID[] AND master_id = '434473cb-b66d-4462-8eb1-6c47389695e7'`;
        const projectData = await db.sequelize.selectQuery(query);
        let usersOfProjects = [];
        if (projectData[0] && projectData[0]?.length > 0) {
            usersOfProjects = projectData[0].map((obj) => obj.userId);
        }
        const stringWithQuotes = usersOfProjects.map((item) => `'${item}'`).join(", ");
        sqlQuery += ` AND id in (${stringWithQuotes})`;
    } else if (tableName === "gaa_level_entries") {
        const [[{ master_id }]] = await db.sequelize.selectQuery(
            `SELECT array_agg(id) as master_id FROM gaa_hierarchies WHERE project_id  = '${formProject}'`
        );
        if (master_id && master_id.length > 0) {
            sqlQuery += ` AND gaa_hierarchy_id in ('${master_id.join("', '")}')`;
        }
    } else if (tableName === "project_master_maker_lovs") {
        const [[{ master_id }]] = await db.sequelize.selectQuery(
            `SELECT array_agg(id) as master_id FROM project_master_makers WHERE project_id  = '${formProject}'`
        );
        if (master_id && master_id.length > 0) {
            sqlQuery += ` AND master_id in ('${master_id.join("', '")}')`;
        }
    }
    return { selectClause, matchingColum, dependency, fieldName, query, sqlQuery, tableName, sourceColumn, conditions, sourceTableId };
};

const generateSelectQuery = (payload, name) => {
    // Basic SELECT query
    const matchingColum = payload.extraColumn;
    const selectClause = payload.columnName;
    // `jsonb_build_object('id', id, 'name', "${payload.columnName}"${matchingColum})`;
    const { tableName } = payload;
    const fieldName = name;

    // Create an object to keep track of conditions for each column
    const columnConditions = {};
    let query = payload.searchColumns?.length > 0 ? "Where " : "";
    for (const condition of payload.searchColumns) {
        const { column, op, value } = condition;
        // Initialize an array for conditions on this column if it doesn't exist
        if (!columnConditions[column]) {
            columnConditions[column] = [];
        }
        // Push the conditions to the respective column's conditions array
        columnConditions[column].push(`${column} ${op} '${value}'`);
    }
    // Make the WHERE clause
    const whereClause = [];
    // Iterate through the columnConditions object
    for (const column in columnConditions) {
        // If there are multiple conditions for this column, add OR between themm
        if (columnConditions[column].length > 1) {
            whereClause.push(`(${columnConditions[column].join(" OR ")})`);
        } else {
            whereClause.push(columnConditions[column][0]);
        }
    }
    // Add the WHERE clause to the queryyyyy
    query += whereClause.join(" AND ");
    return { selectClause, matchingColum, tableName, fieldName, query };
};

const getDynamicTableData = async (schema = "public") => {
    const { db } = new Forms();
    const [rows] = await db.sequelize.selectQuery(`SELECT * FROM fetch_table_with_columns_data_type('${schema}')`);
    rows.push({
        table_name: "local_form_submissions",
        columns: `CREATE TABLE IF NOT EXISTS "local_form_submissions"
                ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "form_responses" TEXT, "form_files_data" TEXT, "form_id" uuid);
            `
    });
    return rows;
};

const addColumnToDynamicTable = async (data, tableName, schema = "public") => {
    const { db } = new Forms();
    const createAddColumnClause = await addColumnClause(data);
    // TODO: if referencing alter table statement is needed the we will change the fourth parameter at that instance
    await db.sequelize.query(`select add_column('${schema}', '${tableName}', '${createAddColumnClause}', ARRAY[]::text[])`);
    await db.sequelize.query(`select add_column('${schema}', '${tableName}_history', '${createAddColumnClause}', ARRAY[]::text[])`);
    db.sequelize.query("call created_all_required_indexs()");
    return Promise.resolve();
};

const addColumnClause = async (data) => {
    const defaultAttributes = new DefaultAttributes();
    const promises = data.map(async (obj) => {
        const {
            columnName,
            properties: { defaultDataValueInColumn },
            defaultAttributeId: id
        } = obj;
        const { type, defaultValue } = await defaultAttributes.findOne({ id }, undefined, true, true, undefined);
        let defualtValueSet = defaultDataValueInColumn || defaultValue;
        if (defualtValueSet && typeof defualtValueSet === "string" && defualtValueSet.trim() !== "" && !defualtValueSet.includes("(") && !defualtValueSet.includes(")")) {
            defualtValueSet = `''${defualtValueSet.trim()}''`;
        }
        const defaultSet = defaultDataValueInColumn || defaultValue ? `DEFAULT ${defualtValueSet}` : "";
        const addColumn = `ADD COLUMN ${columnName} ${type} ${defaultSet}`;
        return addColumn;
    });

    const columns = await Promise.all(promises);
    const string = columns.join(", ");
    return string;
};

const getMappedData = async (tableName, searchString, data, isActive, mappedDropdowns, fitlerQuery, isUsingId, selectedColumn = "", selectedJoin = "") => {
    const { db } = new Forms();
    let string = "";
    let hasDropDownCondition = false;
    if (isUsingId) {
        string = `${tableName}.id = '${searchString}'`;
    } else {
        if (data.length > 0) {
            string += data.map((obj) => {
                if (
                    obj?.default_attribute?.inputType !== "number"
                    || (obj?.default_attribute?.inputType === "number"
                        && !Number.isNaN(parseFloat(searchString)))
                ) {
                    const whereCondition = `(${obj.columnName || obj.name} ${obj?.default_attribute?.inputType === "number"
                        ? "="
                        : "ilike"
                    } '${searchString}' ${fitlerQuery ? `AND (${fitlerQuery})` : ""
                    })`;
                    return whereCondition;
                }
                return "";
            }).filter((x) => x).join(" OR ");
            if (mappedDropdowns && Object.keys(mappedDropdowns).length > 0) {
                string += " OR ";
            }
        }
        if (mappedDropdowns && Object.keys(mappedDropdowns).length > 0) {
            const entries = Object.entries(mappedDropdowns);
            string += entries.map(([key, value]) => {
                const whereCondition = `(${key} && ARRAY['${value.join("', '")}']::uuid[] ${fitlerQuery ? `AND (${fitlerQuery})` : ""})`;
                if (!hasDropDownCondition) hasDropDownCondition = true;
                return whereCondition;
            }).join(" OR ");
        }
    }
    if (!string.includes(searchString) && !hasDropDownCondition) return [];
    string = string ? `(${string}) AND` : string;
    const subQuery = await exportFormResponseQuery(tableName, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
    string = subQuery.replace("where_condition", `${string} ${tableName}.is_active = '${1}'`);
    const rows = await db.sequelize.selectQuery(string);
    return rows[0];
};

const getAllFormsType = async (where = {}) => {
    const forms = new Forms();
    const data = await forms.findAndCountAllDistinctRows(where, ["formTypeId"], false, "formTypeId");
    return data;
};

const getCountOfMasterInForms = async (data, governedFormsArray, governedProjectsArray) => {
    const forms = new Forms();
    const object = await Promise.all(data.map(async (obj) => {
        const { id, name } = obj;
        const condition = { formTypeId: id, ...Array.isArray(governedFormsArray) && { id: governedFormsArray }, ...Array.isArray(governedProjectsArray) && { projectId: governedProjectsArray } };
        const count = await forms.count(condition, true);
        return { id, name, count };
    }));
    return object;
};

// eslint-disable-next-line max-len
const reduceDataByKeys = (data, replaceKeyArray, isFormMapped, isvalue = "") => data.map((item) => replaceKeyArray.reduce((acc, replaceItem) => {
    if (isFormMapped) {
        const { mapping_column: mappingKey, key_name: replaceWith } = replaceItem;
        const finalKey = `${mappingKey}${((isvalue === "1") && (`${mappingKey}_value` in item)) ? "_value" : ""}`;
        if (item[finalKey] && replaceWith) {
            acc[replaceWith] = item[finalKey];
        }
    } else {
        const { all_master_column: { name }, columnName: replaceName } = replaceItem;
        if (item[name]) {
            acc[replaceName] = item[name];
        }
    }
    return acc;
}, {}));

const deletFormAssociatedData = async (formId, isPublished) => {
    let transaction;
    try {
        const forms = new Forms();
        transaction = await forms.getNewTransactionInstance();

        const attributeValidationData = await getAttributValidationBlockByFormId(formId);
        if (attributeValidationData.length > 0) {
            const validationIdArray = attributeValidationData.flatMap((obj) => obj.id);
            // eslint-disable-next-line max-len
            await deleteFormsAttributeValidationCondition({ validationBlockId: validationIdArray }, transaction, isPublished);
            await deleteFormsAttributeValidationBlock({ id: validationIdArray }, transaction, isPublished);
        }

        const attributVisibilityData = await getAttributeVisibilityBlockByFormId(formId);
        if (attributVisibilityData.length > 0) {
            const visibilityDataId = attributVisibilityData.flatMap((obj) => obj.id);
            // eslint-disable-next-line max-len
            await deleteFormsAttributeVisibilityCondition({ visibilityBlockId: visibilityDataId }, transaction, isPublished);
            await deleteFormsAttributeVisibilityBlock({ id: visibilityDataId }, transaction, isPublished);
        }
        // Commit the transaction at the end
        await transaction.commit();
        await deleteformAttributesByFormId({ formId }, undefined, isPublished);
        await deleteForm({ id: formId }, undefined, isPublished);

    } catch (error) {
        if (transaction?.rollback) {
            transaction.rollback();
        }
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORMATTRIBUTES_LIST_FAILURE, error);
    }
};

const getAllFormIds = async (where) => {
    try {
        const forms = new Forms();
        const data = await forms.findAll(where, ["id", "name"], false, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORM_LIST_FAILURE, error);
    }
};

const getChildDataOfFormTypes = async (data, projectId) => {
    const modifiedData = await Promise.all(data.map(async (obj) => {
        const childData = await getAllFormsByTypes({ formTypeId: obj.id, projectId: projectId }, ["id", "name"]);
        if (childData.length > 0) {
            return { ...obj, child: childData };
        }
        return null;
    }));

    const filteredData = modifiedData.filter((obj) => obj !== null);
    return filteredData;
};

const getAllFormsByTypes = async (where, attributes = undefined) => {
    try {
        const forms = new Forms();
        const data = await forms.findAll(where, attributes, false, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORM_LIST_FAILURE, error);
    }
};

async function getAllFieldsAndGroupedColuns(db, tableName, schema = "public", selectString = "", searchColumn = "", string = "", filters = []) {
    const [[allColumns], [allMasterColumns]] = await Promise.all([
        db.sequelize.selectQuery(`
            SELECT
                CASE WHEN IFS.COLUMN_NAME IS NULL THEN FA.COLUMN_NAME ELSE IFS.COLUMN_NAME END AS IFS_COLUMN_NAME,
                FA.RANK,
                FA.NAME AS FA_NAME,
                DA.TYPE AS DA_TYPE,
                DA.INPUT_TYPE AS DA_INPUT_TYPE,
                AMC.NAME AS AM_NAME,
                AML.NAME AS AML_NAME,
                FAD_AML.NAME AS DEPENDENCY_AML_NAME,
                FAD_AML.TABLE_TYPE AS DEPENDENCY_AML_TABLE_TYPE,
	            FAD_AMC.NAME AS DEPENDENCY_AM_NAME,
                FA.IS_REQUIRED AS FA_IS_REQUIRED,
                FA.IS_ACTIVE AS FA_IS_ACTIVE,
                FAD.NAME AS DEPENDENCY,
                FAD.COLUMN_NAME AS DEPENDENCY_COLUMN,
                FA.PROPERTIES ->> 'conditions' AS CONDITIONS,
                FA.PROPERTIES ->> 'selectType' AS "dropdown_type",
                FA.PROPERTIES ->> 'pickerType' AS "picker_type",
                FA.PROPERTIES ->> 'timeFormat' AS "time_format",
                AML.TABLE_TYPE AS AML_TABLE_TYPE,
                FORMS.PROJECT_ID AS FORMS_PROJECT_ID,
                FORMS.UPDATED_BY AS FORMS_UPDATED_BY,
                CASE
                    WHEN FA.PROPERTIES ->> 'factoryTable' = '' THEN NULL
                    ELSE FA.PROPERTIES ->> 'factoryTable'
                END AS FACTORY_TABLE,
                FA.PROPERTIES ->> 'factoryColumn' AS FACTORY_COLUMN,
                FA.PROPERTIES ->> 'linkColumn' AS LINK_COLUMN,
                FA.PROPERTIES ->> 'sourceColumn' AS SOURCE_COLUMN,
                FAF.COLUMN_NAME AS FACTORY_COLUMN_NAME,
                FF.TABLE_NAME AS FACTORY_TABLE_NAME,
                AMC.NAME AS SOURCE_COLUMN_NAME,
                FAL.COLUMN_NAME AS LINK_COLUMN_NAME
            FROM
                FORMS
                INNER JOIN form_attributes AS fa ON forms.id = fa.form_id
                LEFT JOIN information_schema.columns AS ifs ON forms.table_name = ifs.table_name AND fa.column_name = ifs.column_name
                LEFT JOIN default_attributes AS da ON da.id = fa.default_attribute_id
                LEFT JOIN all_masters_list AS aml ON fa.properties ->> 'sourceTable' IS NOT NULL AND fa.properties ->> 'sourceTable' <> '' AND aml.id :: text = fa.properties ->> 'sourceTable'
                LEFT JOIN all_master_columns AS amc ON fa.properties ->> 'sourceColumn' IS NOT NULL AND fa.properties ->> 'sourceColumn' <> ''AND amc.id :: text = fa.properties ->> 'sourceColumn'
                LEFT JOIN form_attributes AS fad ON fa.properties ->> 'dependency' IS NOT NULL AND fa.properties ->> 'dependency' <> '' AND fa.properties ->> 'dependency' = fad.id::text
                LEFT JOIN form_attributes AS faf ON fa.properties ->> 'factoryColumn' IS NOT NULL AND fa.properties ->> 'factoryColumn' <> '' AND fa.properties ->> 'factoryColumn' = faf.id::text
                LEFT JOIN forms AS ff ON fa.properties ->> 'factoryTable' IS NOT NULL AND fa.properties ->> 'factoryTable' <> '' AND fa.properties ->> 'factoryTable' = ff.id::text
                LEFT JOIN form_attributes AS fal ON fa.properties ->> 'linkColumn' IS NOT NULL AND fa.properties ->> 'linkColumn' <> '' AND fa.properties ->> 'linkColumn' = fal.id::text
                LEFT JOIN ALL_MASTERS_LIST AS FAD_AML ON FAD.PROPERTIES ->> 'sourceTable' IS NOT NULL AND FAD.PROPERTIES ->> 'sourceTable' <> '' AND FAD.PROPERTIES ->> 'sourceTable' = FAD_AML.ID::TEXT
	            LEFT JOIN ALL_MASTER_COLUMNS AS FAD_AMC ON FAD.PROPERTIES ->> 'sourceColumn' IS NOT NULL AND FAD.PROPERTIES ->> 'sourceColumn' <> '' AND FAD.PROPERTIES ->> 'sourceColumn' = FAD_AMC.ID::TEXT
            WHERE
                forms.table_name = '${tableName}'
                ${selectString.length > 0 ? ` AND fa.${searchColumn} in (${string})` : ""}
                ${filters.length > 0 ? ` AND fa.column_name IN ('${filters.join("', '")}')` : ""}
            ORDER BY fa.rank ASC , fa.name ASC
        `),
        db.sequelize.selectQuery("select id, name from all_master_columns")
    ]);

    const dropdowns = allColumns.filter(({ da_input_type: daInputType }) => daInputType === "dropdown");
    /* const groupedColumns = [];
    dropdowns.forEach(({ conditions, dropdown_type: type, ifs_column_name, dependency, fa_name: faName, am_name: amcName, factory_table: factoryTable, link_column: linkColumn }) => {
        try {
            const index = dropdowns.findIndex(
                ({
                    conditions: _conditions,
                    dropdown_type: _type,
                    fa_name: _faName,
                    factory_table: _factoryTable,
                    link_column: _linkColumn
                }) => (
                    _linkColumn === linkColumn
                    && factoryTable === _factoryTable
                    && dependency === _faName
                    && _type === type
                    && _conditions === conditions
                    && JSON.parse(conditions).length > 0
                )
            );
            if (index !== -1) {
                groupedColumns.push({ faName, amcName, joinedAmc: dropdowns[index].am_name, originalColumn: ifs_column_name, joinColumn: dropdowns[index].ifs_column_name });
            }
        } catch (error) {
            console.error(`> [genus-wfm] | [${new Date().toLocaleString()}] | [forms.service.js] | [#900] | [error] | `, error);
        }
    }); */
    return { allMasterColumns, allColumns, dropdowns, groupedColumns: [] };
}

const exportFormResponseQuery = async (
    tableName,
    selectString = "",
    isHistory = false,
    schema = "public",
    filters = [],
    isCountQuery = false,
    isMdm = false,
    isReport = false,
    getDistinctColumn = false,
    isLevelApproval = {},
    isForDataMapping = false
) => {
    const { db } = new Forms();
    const table = isHistory === true ? `${tableName}_history` : tableName;
    const string = typeof selectString === "string" ? selectString : selectString.map((x) => `'${selectString}'`).join(",");
    const searchColumn = typeof selectString === "string" ? "column_name" : "name";

    const { allColumns, groupedColumns } = await getAllFieldsAndGroupedColuns(db, tableName, schema, selectString, searchColumn, string, filters);

    let networkColumnNameForSplit = "";
    // check if there is any active factory column exists in form
    const isActiveFactoryColumn = allColumns.some((cur) => cur.fa_is_active === "1" && cur.factory_table);
    let firstColumnAdded = false;
    let firstColumn = "";
    if (getDistinctColumn) {
        firstColumn = " DISTINCT ";
        if (filters.includes("id")) {
            firstColumn += `${tableName}.id AS "Response ID"`;
            firstColumnAdded = true;
        }
    } else {
        firstColumn = `"${table}".${isHistory === true ? "record_id" : "id"}  as "Response ID" `;
        firstColumnAdded = true;
    }

    if (isForDataMapping) {
        allColumns.forEach((cur) => {
            cur.fa_name = `${cur.ifs_column_name}_value`;
        });
    }

    const factoryColumnsGroups = allColumns.filter((x) => x.factory_table && x.fa_is_active === "1" && x.factory_table !== "").reduce((pre, cur) => {
        const columnTable = `factory_table_join_${cur.aml_name}_${cur.dependency_column}`;
        if (Object.hasOwn(pre, columnTable)) {
            pre[columnTable].push(cur);
        } else {
            pre[columnTable] = [cur];
        }
        return pre;
    }, {});

    const typeCast = isMdm ? "::TEXT" : "";

    let selectQuery = allColumns.reduce((pre, current) => {
        const cur = structuredClone(current);
        if (firstColumnAdded && !cur.factory_table) pre += ", ";
        if ((cur.da_type === "uuid[]")) {
            if (
                cur.aml_name === "serialize_material_type"
                && cur.am_name === "id"
            ) {
                pre += cur.dropdown_type === "multi" ? `ARRAY_TO_STRING("${table}"."${cur.ifs_column_name}", ', ')` : `"${table}"."${cur.ifs_column_name}"[1]`;
                pre += ` AS "${cur.fa_name}"`;
                firstColumnAdded = true;
                return pre;
            }
            // if no active column in the form then ignroe factory column's data
            if (cur.factory_table) return pre;
            const column = cur.am_name;
            if (groupedColumns.some(({ faName }) => faName === cur.fa_name)) {
                const index = groupedColumns.findIndex(({ faName }) => faName === cur.fa_name);
                cur.ifs_column_name = groupedColumns[index].joinColumn;
            }
            if (cur.dropdown_type && cur.dropdown_type === "multi") {
                const foreignTable = cur.aml_table_type === "function" ? `${cur.aml_name}(null, null)` : cur.aml_name;
                pre += `ARRAY_TO_STRING(ARRAY(
                    SELECT "${column}" :: TEXT
                    FROM ${foreignTable}
                    WHERE id = ANY("${table}"."${cur.ifs_column_name}")
                ), ', ') AS "${cur.fa_name}"`;
            } else {
                const table_name = `${cur.aml_name}_${cur.ifs_column_name}`;
                pre += `"${table_name}"."${column}" AS "${cur.fa_name}"`;
            }
        } else if (cur.da_type === "text[]") {
            const firstIndex = isMdm && ["image", "file"].includes(cur.da_input_type) ? "[1]" : "";
            pre += `"${table}"."${cur.ifs_column_name}"${firstIndex} AS "${cur.fa_name}" `;
        } else if (cur.da_input_type === "date") {
            if (getDistinctColumn) {
                pre += `"${table}"."${cur.ifs_column_name}"::DATE AS "${cur.fa_name}"`;
            } else {
                const fullDateFormat = ["dateOnly", "dateTimeBoth"].includes(cur.picker_type) ? "DD-MM-YYYY" : "";
                const dateformat = cur.picker_type === "monthYearBoth" ? "MM/YYYY" : fullDateFormat;
                const dayLightFormat = cur.time_format === "12hour" ? "hh12:MI AM" : "HH24:MI";
                const timeFormat = ["dateOnly", "monthYearBoth"].includes(cur.picker_type) ? "" : dayLightFormat;
                const commaFormat = dateformat && timeFormat ? ", " : "";
                const formatQuery = !isMdm || cur.picker_type === "monthYearBoth"
                    ? `TO_CHAR(("${table}"."${cur.ifs_column_name}"::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata'), '${dateformat}${commaFormat}${timeFormat}')`
                    : `"${table}"."${cur.ifs_column_name}"`;
                pre += `${formatQuery} AS "${cur.fa_name}"`;
            }
        } /* else if (isReport && cur.da_input_type === "location") {
            const locationSplitSelections = generateLocationSplitSelections(table, cur);
            pre += `"${table}"."${cur.ifs_column_name}" AS "${cur.fa_name}", ${locationSplitSelections}`;
        } else if (isReport && cur.da_input_type === "network" && networkColumnNameForSplit === "") {
            networkColumnNameForSplit = cur.ifs_column_name;
            pre += `"${table}"."${networkColumnNameForSplit}" AS "${cur.fa_name}"`;
            pre += `, (EXTRACT_SIM_VALUES("${table}"."${networkColumnNameForSplit}")).*`;
        } */ else {
            pre += `"${table}"."${cur.ifs_column_name}"${typeCast} AS "${cur.fa_name}"`;
        }
        firstColumnAdded = true;
        return pre;
    }, `SELECT ${firstColumn}`);

    selectQuery += isForDataMapping ? `${firstColumnAdded ? "," : ""} ${table}.*` : "";
    if (isActiveFactoryColumn) {
        const allEnteries = Object.entries(factoryColumnsGroups);
        allEnteries.forEach(([table_name, value]) => {
            value.forEach((cur) => {
                const column = cur.factory_column_name;
                const hasComma = firstColumnAdded ? ", " : "";
                selectQuery += `${hasComma} "${table_name}"."${column}" AS "${cur.fa_name}" `;
                if (!firstColumnAdded) firstColumnAdded = true;
            });
        });
    }

    const dropdownColumns = allColumns.filter((x) => x.da_type === "uuid[]" && x.am_name && x.am_name);

    if (!getDistinctColumn || filters.includes("counter")) selectQuery += `, ${table}.counter as "Counter"`;
    if (!getDistinctColumn || filters.includes("submission_mode")) selectQuery += `, ${table}.submission_mode as "Submission Mode"`;
    if (!getDistinctColumn || filters.includes("source")) selectQuery += `, ${table}.source as "Source"`;
    if (!getDistinctColumn || filters.includes("mdm_payload_status")) selectQuery += `, ${table}.mdm_payload_status AS "MDM Payload Status"`;
    if (!getDistinctColumn || filters.includes("mdm_payload_title")) selectQuery += `, ${table}.mdm_payload_title AS "MDM Payload Title"`;
    if (!getDistinctColumn || filters.includes("mdm_payload_timestamp")) {
        selectQuery += `${getDistinctColumn ? `, ${table}.mdm_payload_timestamp::DATE` : `, TO_CHAR(TIMEZONE('Asia/Kolkata', ${table}.mdm_payload_timestamp), 'DD-MM-YYYY HH24:MI:SS')`} AS "MDM Payload Timestamp"`;
    }
    if (!getDistinctColumn || filters.includes("mdm_payload_message")) selectQuery += `, ${table}.mdm_payload_message AS "MDM Payload Message"`;
    if (!getDistinctColumn || filters.includes("created_at")) {
        selectQuery += `${getDistinctColumn ? `, ${table}.created_at::DATE` : `, TO_CHAR(TIMEZONE('Asia/Kolkata', ${table}.created_at),'DD-MM-YYYY HH24:MI:SS')`} as "Created On"`;
    }
    if (!getDistinctColumn || filters.includes("updated_at")) {
        selectQuery += `${getDistinctColumn ? `, ${table}.updated_at::DATE` : `, TO_CHAR(TIMEZONE('Asia/Kolkata', ${table}.updated_at), 'DD-MM-YYYY HH24:MI:SS')`} as "Updated On"`;
    }
    if (!getDistinctColumn || filters.includes("submitted_at")) {
        selectQuery += `${getDistinctColumn ? `, ${table}.submitted_at::DATE` : `, TO_CHAR(TIMEZONE('Asia/Kolkata', ${table}.submitted_at), 'DD-MM-YYYY HH24:MI:SS')`} as "Submitted On"`;
    }
    if (!getDistinctColumn || filters.includes("ticket_id")) selectQuery += ", \"pwtm\".\"prefix\" ||  \"tickets\".\"ticket_number\"::TEXT AS \"Ticket Number\"";
    if (!getDistinctColumn || filters.includes("created_by")) selectQuery += ", \"user_created_by\".name AS \"Created By\"";
    if (!getDistinctColumn || filters.includes("updated_by")) selectQuery += ", \"user_updated_by\".name AS \"Updated By\"";

    selectQuery += ` FROM 
        ${table}
        `;
        // ${isReport && networkColumnNameForSplit !== "" ? generateNetworkColumnSplitJoinQuery(table, networkColumnNameForSplit) : ""}
        
    let joinNameUsed = [];
    let joinQuery = dropdownColumns.reduce((pre, subquery) => {
        if (
            (subquery.factory_table && (subquery.fa_is_active === "0"))
            || (subquery.aml_name === "serialize_material_type" && subquery.am_name === "id")
            || subquery.dropdown_type === "multi"
            || groupedColumns.some(({ faName }) => faName === subquery.fa_name)
        ) {
            return pre;
        }

        if (subquery.factory_table) {
            // only choose active column to add mapping cluause for factory table
            return pre;
        }
        pre += " LEFT OUTER JOIN ";
        const joinTableNames = subquery.aml_table_type === "function" ? "material_serial_numbers" : subquery.aml_name;
        const joinName = `${subquery.aml_name}_${subquery.ifs_column_name}`;
        pre += `${joinTableNames} AS ${joinName} ON ${joinName}.id = ${table}.${subquery.ifs_column_name}[1]`;
        joinNameUsed.push(joinName);

        return pre;
    }, selectQuery);

    joinNameUsed = Array.from(new Set([...joinNameUsed]));
    if (isActiveFactoryColumn) {
        Object.entries(factoryColumnsGroups).forEach(([joinName, [{ factory_table_name, link_column_name, dependency_aml_table_type, dependency_aml_name, dependency_am_name, dependency_column }]]) => {
            const joinNameForFactory = `${dependency_aml_name}_${dependency_column}`;
            if (!joinNameUsed.includes(joinNameForFactory)) {
                const tableForFactory = dependency_aml_table_type === "function" ? "material_serial_numbers" : `${dependency_aml_name}`;
                joinQuery += `LEFT OUTER JOIN ${tableForFactory} AS ${joinNameForFactory} ON ${table}.${dependency_column}[1] = ${joinNameForFactory}.id`;

            }
            joinQuery += ` LEFT OUTER JOIN ${factory_table_name} AS ${joinName} ON ${joinName}.${link_column_name} = ${dependency_aml_name}_${dependency_column}.${dependency_am_name} OR ${joinName}.${link_column_name} = ${dependency_aml_name}_${dependency_column}.id::TEXT `;
        });
    }

    if (!(isCountQuery || getDistinctColumn) || filters.includes("ticket_id")) joinQuery += ` LEFT OUTER JOIN tickets ON tickets.id = ${table}.ticket_id`;
    if (!(isCountQuery || getDistinctColumn) || filters.includes("ticket_id")) joinQuery += " LEFT OUTER JOIN project_wise_ticket_mappings AS pwtm ON pwtm.id = tickets.project_wise_mapping_id";
    if (!(isCountQuery || getDistinctColumn) || filters.includes("created_by")) joinQuery += ` LEFT OUTER JOIN users AS "user_created_by" ON "user_created_by".id = ${table}.created_by`;
    if (!(isCountQuery || getDistinctColumn) || filters.includes("updated_by")) joinQuery += ` LEFT OUTER JOIN users AS "user_updated_by" ON "user_updated_by".id = ${table}.updated_by`;

    joinQuery += " WHERE ";
    if (isLevelApproval.userId && isLevelApproval.formId && !isLevelApproval.ignoreLevelValidations) {
        const { levelConditions } = isLevelApproval.isSuperUser ? await Promise.resolve({}) : await getLevelConditionsForResponseListing(db, isLevelApproval.userId, isLevelApproval.formId, tableName);
        if (levelConditions?.length) {
            joinQuery += ` ${levelConditions[0]} AND `;
        }
    }

    joinQuery += " where_condition ";

    return joinQuery;
};

const getExportedData = async (tableName, isActive = 1) => {
    const { db } = new Forms();
    let queryData = await exportFormResponseQuery(tableName, "public", isActive);
    queryData = queryData.replace("where_condition", ` ${tableName}.is_active = '${isActive}' `);
    // ADD ANY SPECIFIC GROPY BY CLAUSE IF NEEDED LIKE updated_at (in case anything else was passed from frontend)
    queryData += `, ${tableName}.updated_at `;
    queryData += ` ORDER by ${tableName}.updated_at DESC`;
    const [rows] = await db.sequelize.selectQuery(queryData);
    return { rows };
};

/**
 * Find the corresponding installation responses for responseIdsWithATicketNumber
 * from history and substitute them for the corresponding O&M responses
 */
const substituteOAndMResponsesWithHistory = async ({ tableName, responseIdsWithATicketNumber, selectString, whereCondition, db, result }) => {
    const historyTableName = `${tableName}_history`;
    const historyWhereCondition = generateHistoryWhereConditionForReport(historyTableName, responseIdsWithATicketNumber);

    let historyTableQuery = await exportFormResponseQuery(
        tableName,
        selectString,
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        true
    );

    historyTableQuery = historyTableQuery.replace("where_condition", `
                ${whereCondition.replaceAll(tableName, historyTableName)}
                ${historyWhereCondition}
            `);

    const [historyTableResult] = await db.sequelize.selectQuery(historyTableQuery);
    result = result.map(
        (item) => (
            responseIdsWithATicketNumber.includes(item["Response ID"])
                ? historyTableResult.find(
                    (historyItem) => historyItem["Response ID"] === item["Response ID"]
                )
                : item
        )
    );
    return result;
};

async function getLevelConditionsForResponseListing(db, userId, formId, tableName) {
    const [
        levelPermissions,
        [[{ count: hasLBApprovalStatus }]]
    ] = await Promise.all([
        getUserPermissionAndLevels.call(db, userId, formId),
        db.sequelize.selectQuery(
            `select count(*)::integer from form_attributes where form_id = '${formId}' and column_name = 'l_b_approval_status'`
        )
    ]);

    const levelConditions = [];
    if (levelPermissions.approval_level === "l1") {
        const lbSTring = hasLBApprovalStatus ? ` OR l_b_approval_status[1] = '${levelPermissions.rejected_id}'` : "";
        levelConditions.push(`(l_a_approval_status is null OR l_a_approval_status[1] <> '${levelPermissions.approved_id}' ${lbSTring})`);
    } else if (levelPermissions.approval_level === "l2") {
        const mdmSuccessCondition = levelPermissions.is_mdm ? " OR UPPER(mdm_payload_status) <> 'SUCCESS' " : "";
        levelConditions.push(`${tableName}.ID IN (
			SELECT ID FROM ${tableName} WHERE
			(L_B_APPROVAL_STATUS IS NULL OR L_B_APPROVAL_STATUS[1] <> '${levelPermissions.approved_id}' ${mdmSuccessCondition})
			AND L_A_APPROVAL_STATUS[1] = '${levelPermissions.approved_id}'
		)`);
    }
    return { levelPermissions, hasLBApprovalStatus, levelConditions };
}

// form responses filter, search and order logic implementation
const getFormResponsesQuery = async (
    requestObject,
    userObject,
    paginations,
    isExport = false,
    accessorsArray = [],
    countOnly = false,
    isReport = false,
    reportMode = "Survey",
    reportType = "",
    isCustomExport = false
) => {
    try {
        const { db } = new Forms();
        const UserColumnDefaultPermission = new UserColumnDefaultPermissions();
        const {
            isActive = "1",
            formId,
            sortObject,
            filterObject,
            searchString,
            isHistory,
            responseId,
            gaaLevelFilter,
            mdmPayloadStatus,
            ignoreLevelValidations
        } = requestObject;
        const { userId, isSuperUser } = userObject;

        // Use Promise.all to parallelize multiple async operations
        const [
            permissionData,
            formInfo
        ] = await Promise.all([
            UserColumnDefaultPermission.findOne(
                { userId, formId },
                ["add", "update", "view", "deleteRecord"],
                false,
                undefined,
                true
            ),
            getFormByCondition({ id: formId })
        ]);

        const { tableName, isPublished } = formInfo;

        const formPermissions = {
            add: permissionData?.add ?? isSuperUser,
            view: permissionData?.view ?? isSuperUser,
            update: permissionData?.update ?? isSuperUser,
            deleteRecord: permissionData?.deleteRecord ?? isSuperUser
        };

        if (!formPermissions?.update && !formPermissions?.view) {
            return { rows: [], columns: [], count: 0, formPermissions };
        }

        if (!isPublished) {
            throwError(
                statusCodes.INTERNAL_ERROR,
                statusMessages.FORM_NOT_PUBLISHED,
                "FORM NOT PUBLISHED"
            );
        }

        const { selectString, columns } = await getPermissionedColumns(
            db,
            userObject,
            formId,
            accessorsArray
        );

        // Construct the where string
        const orCondition = searchString && searchString.length > 0
            ? columns
                .map(
                    (obj) => `lower("${obj.accessor}"::text) like lower('%${searchString}%')`
                )
                .join(" OR ")
            : "";
        const whereConditionArray = [];
        const filter = filterObject ? JSON.parse(filterObject) : {};
        if (filter && Object.keys(filter).length > 0) {
            const arr = await convertObjectToSQLWhereClause(
                filter,
                formId,
                db,
                tableName,
                countOnly
            );
            whereConditionArray.push(...arr);
        }
        if (orCondition) {
            whereConditionArray.push(`(${orCondition})`);
        }

        // Handle sorting
        let orderString = "";

        if (!isHistory) {
            orderString = sortObject && sortObject?.length > 0
                ? await getOrderStringForQuery(
                    sortObject,
                    tableName,
                    db,
                    formId
                )
                : 'order by "Updated On" DESC';
        }

        // pagination params
        let paginationParams = "";
        if (paginations && paginations?.limit) {
            const limit = !isExport ? paginations.limit + 1 : paginations?.limit;
            paginationParams += `LIMIT ${limit} `;
        }

        if (paginations && paginations?.offset) {
            paginationParams += `OFFSET ${paginations?.offset}`;
        }

        // Get subQuery and add the isActive condition
        let whereCondition = "";
        if (isHistory) {
            whereCondition = ` ${tableName}_history.record_id = '${responseId}' `;
        } else {
            whereCondition = ` ${tableName}.is_active = '${isActive}' ${whereConditionArray.length > 0
                ? ` AND ${whereConditionArray.join(" AND ")}`
                : ""
            } `;
        }

        if (gaaLevelFilter && Object.keys(gaaLevelFilter).length) {
            const { fromDate, toDate } = gaaLevelFilter;
            whereCondition += Object.keys(gaaLevelFilter)
                .filter((key) => !["fromDate", "toDate"].includes(key))
                .map((key) => ` AND ${tableName}.${key}[1] = '${gaaLevelFilter[key]}'`)
                .join("");
            if (fromDate) {
                whereCondition += ` AND ${tableName}.created_at::date >= '${fromDate}'`;
            }
            if (toDate) {
                whereCondition += ` AND ${tableName}.created_at::date <= '${toDate}'`;
            }
        }

        if (mdmPayloadStatus) {
            whereCondition += ` AND ${tableName}.mdm_payload_status = '${mdmPayloadStatus}'`;
        }
        if (isReport && reportMode === "O&M") {
            whereCondition += ` AND ( ${tableName}.ticket_id IS NOT NULL )`;
        }

        if (countOnly) {
            const subQuery = await exportFormResponseQuery(
                tableName,
                selectString,
                isHistory,
                undefined,
                Object.keys(filter),
                true,
                undefined,
                undefined,
                undefined,
                { userId, formId, isSuperUser, ignoreLevelValidations }
            );
            const countQuery = await getFinalCountQuery(whereCondition, subQuery);

            // Use Promise.all to parallelize the database queries
            const [[{ count }]] = await db.sequelize.query(countQuery);
            return { count };
        }
        const time = Date.now();
        let subQuery = await exportFormResponseQuery(
            tableName,
            selectString,
            isHistory,
            undefined,
            undefined,
            undefined,
            undefined,
            isReport,
            undefined,
            { userId, formId, isSuperUser, ignoreLevelValidations }
        );

        subQuery = subQuery.replace("where_condition", whereCondition);
        let finalQuery = `${subQuery} ${orderString} ${paginationParams};`;
        if (reportType && isCustomExport && reportTypesObject[reportType]) {
            finalQuery = `SELECT ${reportTypesObject[reportType]?.filter(({ requiredName }) => requiredName !== "Skip Location")?.map(({ originalName, requiredName }) => `sq."${originalName}" AS "${requiredName}"`).join(", ")
            } from (${finalQuery.replace(/;/g, "")}) AS sq`;
        }

        let [result] = await db.sequelize.query(finalQuery);

        if (isReport && reportMode === "Installation") {
            const responseIdsWithATicketNumber = result
                .filter((row) => row["Ticket Number"])
                .map((row) => row["Response ID"]);

            if (responseIdsWithATicketNumber.length > 0) {
                result = await substituteOAndMResponsesWithHistory({ tableName, responseIdsWithATicketNumber, selectString, whereCondition, db, result });
            }
        }

        if (isExport) {
            return { rows: result };
        }

        let updatedColumns = [];

        if (reportType && reportTypesObject[reportType]) {
            updatedColumns = reportTypesObject[reportType]?.map((item) => {
                const matchingColumn = columns.find((column) => column.accessor === item.originalName);
                if (matchingColumn) {
                    return {
                        ...matchingColumn,
                        Header: item.requiredName
                        // accessor: item.requiredName
                    };
                }
                return null;
            }).filter(Boolean);
        }

        const responseObject = {
            rows: result,
            nextButton: false,
            columns: reportType ? updatedColumns : columns,
            formPermissions
        };

        if (result.length > paginations?.limit) {
            responseObject.nextButton = true;
            responseObject.rows.pop();
        }
        return responseObject;
    } catch (error) {
        console.log("error", error);
        throw error;
    }
};

async function getUserPermissionAndLevels(userId, formId) {
    const [permissions] = await this.sequelize.selectQuery(`
        SELECT
            JSONB_BUILD_OBJECT(
                'rejected_id',
                PMMLR.ID,
                'approved_id',
                PMML.ID,
                'form_name',
                S.FORM_NAME,
                'approval_level',
                S.APPROVAL_LEVEL,
                'user_id',
                S.USER_ID,
                'user_name',
                S.USER_NAME,
                'edit',
                S.EDIT,
                'view',
                S.VIEW,
                'is_mdm',
                CASE
                    WHEN S.IS_MDM IS NOT NULL THEN 1
                    ELSE 0
                END
            ) AS "approval"
        FROM
            (
                SELECT
                    FORMS.NAME AS "form_name",
                    FORMS.PROJECT_ID AS "project_id",
                    CASE
                        WHEN FA.COLUMN_NAME ~ '^l_[a]_' THEN 'l1'
                        ELSE CASE
                            WHEN FA.COLUMN_NAME ~ '^l_[b]_' THEN 'l2'
                            ELSE ''
                        END
                    END AS "approval_level",
                    USERS.ID AS "user_id",
                    USERS.NAME AS "user_name",
                    UCWP.UPDATE AS "edit",
                    UCWP.VIEW AS "view",
                    (
                        SELECT
                            AIB.ID AS "is_mdm"
                        FROM
                            ATTRIBUTE_INTEGRATION_BLOCKS AS AIB
                        WHERE
                            AIB.FORM_ID = FORMS.ID
                            AND AIB.IS_ACTIVE = '1'
                        LIMIT
                            1
                    )
                FROM
                    FORMS
                    INNER JOIN FORM_ATTRIBUTES AS FA ON FA.FORM_ID = FORMS.ID
                    INNER JOIN USER_COLUMN_WISE_PERMISSIONS AS UCWP ON UCWP.COLUMN_ID = FA.ID
                    INNER JOIN USERS ON USERS.ID = UCWP.USER_ID
                WHERE
                    FA.COLUMN_NAME ~ '^l_[ab]_approval_status'
                    AND USERS.ID = '${userId}'
                    AND FORMS.ID = '${formId}'
                    AND UCWP.IS_ACTIVE = '1'
                    AND UCWP.UPDATE = TRUE
                GROUP BY
                    FORMS.ID,
                    FORMS.NAME,
                    FA.COLUMN_NAME,
                    CASE
                        WHEN FA.COLUMN_NAME ~ '^l_[a]_' THEN 'l1'
                        ELSE CASE
                            WHEN FA.COLUMN_NAME ~ '^l_[b]_' THEN 'l2'
                            ELSE ''
                        END
                    END,
                    USERS.ID,
                    USERS.NAME,
                    UCWP.UPDATE,
                    UCWP.VIEW
                ORDER BY
                    FORMS.NAME
            ) AS S
            INNER JOIN PROJECT_MASTER_MAKERS AS PMM ON PMM.PROJECT_ID = S.PROJECT_ID
            INNER JOIN PROJECT_MASTER_MAKER_LOVS AS PMML ON PMML.MASTER_ID = PMM.ID
            AND PMML.NAME = 'Approved'
            INNER JOIN PROJECT_MASTER_MAKER_LOVS AS PMMLR ON PMMLR.MASTER_ID = PMM.ID
            AND PMMLR.NAME = 'Rejected'
        WHERE
            PMM.NAME = 'APPROVAL STATUS'
    `);
    return permissions?.length === 1 ? permissions?.[0]?.approval : {};
}

async function getFinalCountQuery(whereString, subQuery) {
    let [, ...joins] = subQuery.split(" FROM ");
    joins = joins.join(" FROM ");
    joins = joins.split("where_condition")[0];
    return `SELECT COUNT(*) FROM ${joins} ${whereString}`;
}

const convertObjectToSQLWhereClause = async (obj, formId, dbInstance, tableName, countOnly) => {
    const columnString = Object.keys(obj).map((x) => `'${x}'`).join(",");
    const sql = `
        SELECT
            DA.TYPE,
            DA.INPUT_TYPE AS "inputType",
            AML.NAME,
            CASE WHEN FTC.COLUMN_NAME IS NOT NULL THEN FTC.COLUMN_NAME ELSE AMC.NAME END AS COLNAME,
            FA.PROPERTIES ->> 'selectType' AS "selectType",
            FA.PROPERTIES ->> 'pickerType' AS "pickerType",
            CASE
                WHEN FA.PROPERTIES ->> 'factoryTable' IS NOT NULL
                AND FA.PROPERTIES ->> 'factoryTable' <> '' THEN FTD.COLUMN_NAME
                ELSE FA.COLUMN_NAME
            END AS COLUMN_NAME,
            FA.COLUMN_NAME AS REAL_COLUMN_NAME,
            FTD.COLUMN_NAME AS DEPENDENCY_COLUMN,
            FAD_AML.NAME AS DEPENDENCY_AML_NAME,
            FAD_AML.TABLE_TYPE AS DEPENDENCY_AML_TABLE_TYPE,
            FAD_AMC.NAME AS DEPENDENCY_AM_NAME,
            FA.PROPERTIES ->> 'factoryTable' AS is_factory
        FROM
            FORM_ATTRIBUTES AS FA
            INNER JOIN DEFAULT_ATTRIBUTES AS DA ON FA.DEFAULT_ATTRIBUTE_ID = DA.ID
            LEFT JOIN ALL_MASTERS_LIST AS AML ON FA.PROPERTIES ->> 'sourceTable' IS NOT NULL
                AND FA.PROPERTIES ->> 'sourceTable' <> ''
                AND AML.ID::TEXT = FA.PROPERTIES ->> 'sourceTable'
            LEFT JOIN ALL_MASTER_COLUMNS AS AMC ON FA.PROPERTIES ->> 'sourceColumn' IS NOT NULL
                AND FA.PROPERTIES ->> 'sourceColumn' <> ''
                AND AMC.ID::TEXT = FA.PROPERTIES ->> 'sourceColumn'
            LEFT JOIN FORM_ATTRIBUTES AS FTC ON FTC.ID::TEXT = FA.PROPERTIES ->> 'factoryColumn'
                AND FA.PROPERTIES ->> 'factoryColumn' IS NOT NULL
            LEFT JOIN FORM_ATTRIBUTES AS FTD ON FTD.ID::TEXT = FA.PROPERTIES ->> 'dependency'
                AND FA.PROPERTIES ->> 'factoryColumn' IS NOT NULL
            LEFT JOIN ALL_MASTERS_LIST AS FAD_AML ON FTD.PROPERTIES ->> 'sourceTable' IS NOT NULL AND FTD.PROPERTIES ->> 'sourceTable' <> '' AND FTD.PROPERTIES ->> 'sourceTable' = FAD_AML.ID::TEXT
            LEFT JOIN ALL_MASTER_COLUMNS AS FAD_AMC ON FTD.PROPERTIES ->> 'sourceColumn' IS NOT NULL AND FTD.PROPERTIES ->> 'sourceColumn' <> '' AND FTD.PROPERTIES ->> 'sourceColumn' = FAD_AMC.ID::TEXT
        WHERE
            FA.FORM_ID = '${formId}'
            AND FA.COLUMN_NAME IN (${columnString})`;

    const [queryData] = await dbInstance.sequelize.selectQuery(sql);
    const query = generateFilterQuery(queryData, obj, Object.keys(obj), tableName, countOnly);
    return query;
};

function generateFilterQuery(array, filter, columns, tableName) {
    const queries = [];
    let query = "";
    columns.forEach((column) => {
        const columnInfo = array.find((item) => item.real_column_name === column);
        const hasBlanks = filter[column].includes("(Blanks)");
        const newArray = filter[column].filter((item) => item !== "(Blanks)");

        if (columnInfo && columnInfo.type === "uuid[]") {
            const referenceTableJoin = columnInfo.is_factory
                ? `factory_table_join_${columnInfo.dependency_aml_name}_${columnInfo.dependency_column}`
                : `${columnInfo.name}_${columnInfo.column_name}`;

            if (hasBlanks) {
                query = `${referenceTableJoin}.${columnInfo.colname} is null`;
                queries.push(query);
            }

            if (newArray.length > 0) {
                query = `${referenceTableJoin}.${columnInfo.colname} IN ('${newArray.join("', '")}')`;
                queries.push(query);
            }
        } else if (column === "created_by") {
            if (hasBlanks) {
                query = "user_created_by.name is null";
                queries.push(query);
            }

            if (newArray.length > 0) {
                query = `user_created_by.name IN ('${newArray.join("', '")}')`;
                queries.push(query);
            }
        } else if (column === "updated_by") {
            if (hasBlanks) {
                query = "user_updated_by.name is null";
                queries.push(query);
            }

            if (newArray.length > 0) {
                query = `user_updated_by.name IN ('${newArray.join("', '")}')`;
                queries.push(query);
            }
        } else if (columnInfo && columnInfo.type === "text[]" && columnInfo?.selectType !== "multi") {
            if (hasBlanks) {
                query = `array_to_string(${tableName}."${column}", ' , ') is null`;
                queries.push(query);
            }

            if (newArray.length > 0) {
                query = `array_to_string(${tableName}."${column}", ' , ') IN ('${newArray.join("', '")}')`;
                queries.push(query);
            }
        } else if (columnInfo && columnInfo?.selectType === "multi") {
            if (hasBlanks) {
                query = `array_to_string(${tableName}."${columnInfo?.column_name}", ' , ') is null`;
                queries.push(query);
            }

            if (newArray.length > 0) {
                // Generating individual queries for each item in newArray
                const subQueries = newArray.map((item) => `array_to_string(${tableName}."${columnInfo?.column_name}", ' , ') like '%${item}%'`);

                // Joining the subqueries with 'or'
                const joinedSubQueries = subQueries.join(" or ");

                // Pushing the subqueries encapsulated within round brackets becaue they are or query
                queries.push(`(${joinedSubQueries})`);
            }
        } else if (columnInfo?.inputType === "date" && (columnInfo?.pickerType === "dateOnly" || columnInfo?.pickerType === "dateTimeBoth")) {
            if (hasBlanks) {
                query = `date(${tableName}.${columnInfo?.column_name}) is null`;
                queries.push(query);
            }

            if (newArray.length > 0) {
                // Generating individual queries for each item in newArray
                const subQueries = newArray.map((item) => `date(${tableName}.${columnInfo?.column_name}) = '${item}'`);

                // Joining the subqueries with 'or'
                const joinedSubQueries = subQueries.join(" or ");

                // Pushing the subqueries encapsulated within round brackets becaue they are or query
                queries.push(`(${joinedSubQueries})`);
            }
        } else if (["created_at", "updated_at", "submitted_at", "mdm_payload_timestamp"].includes(column)) {
            if (hasBlanks) {
                query = `date(${tableName}.${column}) is null`;
                queries.push(query);
            }

            if (newArray.length > 0) {
                // Generating individual queries for each item in newArray
                const subQueries = newArray.map((item) => `date(${tableName}.${column}) = '${item}'`);

                // Joining the subqueries with 'or'
                const joinedSubQueries = subQueries.join(" or ");

                // Pushing the subqueries encapsulated within round brackets becaue they are or query
                queries.push(`(${joinedSubQueries})`);
            }
        } else if (column === "ticket_id") {
            if (hasBlanks) {
                query = "\"tickets\".\"ticket_number\" is null";
            } else {
                query = `("pwtm"."prefix"::TEXT ||  "tickets"."ticket_number"::TEXT)  in ('${newArray.join("', '")}')`;
            }
            queries.push(query);
        } else {
            if (hasBlanks) {
                query = `${tableName}.${column} is null`;
                queries.push(query);
            }

            if (newArray.length > 0) {
                query = `${tableName}.${column} IN ('${newArray.map((x) => (Object.prototype.toString.call(x) === "[object String]" && x.includes("'") ? x.replaceAll("'", "''") : x)).join("', '")}')`;
                queries.push(query);
            }
        }
    });

    return queries;
}

const getOrderStringForQuery = async (sortObject, tableName, dbInstance, formId) => {
    const orderByClauses = sortObject.map(async (item) => {
        const sql = `
                select da.type, properties ->> 'pickerType' as "pickerType", da.input_type as "inputType", column_name
                from form_attributes as fa
                inner join default_attributes as da on fa.default_attribute_id = da.id
                where form_id = '${formId}' and fa.name = '${item.sortBy}'
        `;
        const [[columnInfo]] = await dbInstance.sequelize.selectQuery(sql);
        let order;
        if (columnInfo?.inputType === "date" && (columnInfo?.pickerType === "dateOnly" || columnInfo?.pickerType === "dateTimeBoth")) {
            order = `${tableName}.${columnInfo.column_name} ${item.sortOrder}`;
        } else if (item.sortBy === "Created On" || item.sortBy === "Updated On" || item.sortBy === "Submitted On") {
            let column;
            switch (item.sortBy) {
                case "Created On":
                    column = "created_at";
                    break;
                case "Updated On":
                    column = "updated_at";
                    break;
                default:
                    column = "submitted_at";
            }
            order = `${tableName}."${column}" ${item.sortOrder}`;
        } else {
            order = `"${item.sortBy}" ${item.sortOrder}`;
        }
        return order;
    });
    const promises = await Promise.all(orderByClauses);
    const orderByString = promises.join(", ");
    return `ORDER BY ${orderByString}`;
};

const getPermissionedColumns = async (dbInstance, userObject, formId, accessorArray = [], schema = "public") => {
    const { userId, isSuperUser } = userObject;
    const accessorArrayy = accessorArray.map((element) => `'${element}'`).join(", ");
    const sql = `
        SELECT form_attributes.name AS "Header",
        form_attributes.name AS accessor,
        form_attributes.properties AS properties,
        form_attributes.is_active AS status,
        form_attributes.column_name As column,
        default_attributes.input_type as "type",
        COALESCE(user_column_wise_permissions.update, ${isSuperUser}) AS update,
        COALESCE(user_column_wise_permissions.view, ${isSuperUser}) AS view
        FROM form_attributes
        left outer join default_attributes on default_attributes.id = form_attributes.default_attribute_id
        left outer join user_column_wise_permissions ON user_column_wise_permissions.column_id = form_attributes.id AND user_column_wise_permissions.user_id = '${userId}' AND user_column_wise_permissions.form_id = '${formId}'
        WHERE ${schema}.form_attributes.form_id ='${formId}'
        ${accessorArray.length > 0 ? `and ${schema}.form_attributes.name in (${accessorArrayy})` : ""}
        order by form_attributes.rank asc, form_attributes.name asc;`;
    const [columns] = await dbInstance.sequelize.selectQuery(sql);
    const columnsData = columns.concat(staticColumns);
    if (accessorArray.length === 0 || accessorArray.includes("Response ID")) {
        columnsData.unshift({ Header: "Response ID", column: "id", accessor: "Response ID", view: true, update: true, type: "extra" });
    }
    const filteredColumns = columnsData.filter((obj) => obj.update === true || obj.view === true);
    const convertedString = filteredColumns.map((item) => `'${item.column}'`).join(", ");
    return { selectString: convertedString, columns: filteredColumns };
};

const getDistinctColumnValue = async (formId, columnName, searchString, rowPerPage, pageNumber, isActive, customAccessor, filterObjectForApi, gaaLevelFilter, userObj) => {
    try {
        const filteredColumns = [customAccessor];
        const { db } = new Forms();
        const { userId, isSuperUser } = userObj;
        const { tableName: formTable } = await getFormByCondition({ id: formId });
        let orderString = "";
        if (rowPerPage) {
            orderString += `limit ${rowPerPage} `;
        }
        if (pageNumber && pageNumber - 1 && rowPerPage) {
            orderString += `offset ${(pageNumber - 1) * rowPerPage}`;
        }
        if (formId) {
            let whereCondition = ` "${formTable}"."is_active" = '${isActive}'`;
            Object.entries(gaaLevelFilter).forEach(([key, value]) => {
                let valueArr = [];
                if (typeof value === "string") valueArr.push(value);
                else valueArr = value;
                const filterKey = ["fromDate", "toDate"].includes(key) ? "\"created_at\"::DATE" : `"${key}"`;
                const filterValue = ["fromDate", "toDate"].includes(key) ? ` ${key === "fromDate" ? ">=" : "<="} '${valueArr}'` : `&& ARRAY['${valueArr.join("','")}']::UUID[]`;
                whereCondition += ` AND "${formTable}".${filterKey} ${filterValue} `;
            });

            let filterConditionObject = {};
            let filterResultQuery = "";
            try {
                filterConditionObject = JSON.parse(filterObjectForApi);
                filterConditionObject = Object.fromEntries(Object.entries(filterConditionObject).filter(([key]) => key !== customAccessor));
                if (Object.keys(filterConditionObject).length) {
                    const { allColumns } = await getAllFieldsAndGroupedColuns(db, formTable, "public");
                    const allColumnByColumnName = allColumns.reduce((pre, cur) => { pre[cur.ifs_column_name] = cur.fa_name; return pre; }, {});
                    const allDefaultColumns = Object.fromEntries([{ Header: "Response ID", column: "id" }, ...staticColumns].map(({ Header, column }) => [column, Header]));
                    Object.assign(allColumnByColumnName, allDefaultColumns);
                    filterResultQuery = ` AND ${Object.entries(filterConditionObject).map(([key, value]) => {
                        const blankValue = "(Blanks)";
                        const filterValues = value.filter((x) => x !== blankValue);
                        let string = "";
                        const hasBlank = value.includes(blankValue);
                        if (hasBlank) {
                            string += `( s."${allColumnByColumnName[key]}" is null or `;
                        }
                        string += `s."${allColumnByColumnName[key]}" IN ('${filterValues.map((x) => (Object.prototype.toString.call(x) === "[object String]" ? x.replaceAll("'", "''") : x)).join("', '")}') ${hasBlank ? ")" : ""}`;
                        return string;
                    }).join(" AND ")}`;
                    filteredColumns.push(...Object.keys(filterConditionObject));
                }
            } catch (error) {
                filterConditionObject = {};
                filterResultQuery = "";
            }

            let subQuery = await exportFormResponseQuery(
                formTable,
                undefined,
                undefined,
                undefined,
                filteredColumns,
                undefined,
                undefined,
                undefined,
                true,
                { userId, formId, isSuperUser }
            );

            const subQueryArr = subQuery.replace("where_condition", whereCondition).replaceAll(",", " , ").replaceAll("  ", " ").split(" ")
                .filter((x) => x.trim() !== "");
            subQueryArr.forEach((x, i) => {
                if (i === 0) { return; }
                const lastVal = subQueryArr[i - 1];
                if (lastVal.toUpperCase() === "DISTINCT" && x === ",") subQueryArr[i] = "";
                if (lastVal.toLowerCase() === "," && x.toLowerCase() === "from") subQueryArr[i - 1] = "";
            });
            subQuery = subQueryArr.join(" ");
            const searchParam = (searchString ? ` AND s."${columnName}"::text ilike '%${searchString}%' ` : "") + filterResultQuery;

            const [[rows], [[{ count }]]] = await Promise.all([
                db.sequelize.selectQuery(`SELECT DISTINCT "${columnName}" AS name FROM (${subQuery}) as s WHERE s."${columnName}" IS NOT NULL ${searchParam} ${orderString}`),
                db.sequelize.selectQuery(`SELECT COUNT(DISTINCT "${columnName}") FROM (${subQuery}) as s WHERE s."${columnName}" IS NOT NULL ${searchParam}`)
            ]);
            return { rows, count };
        }

        const sql = `select da.type, properties ->> 'sourceTable' as "sourceTable", properties ->> 'sourceColumn' as "sourceColumn", fa.column_name, aml.table_type, properties ->> 'pickerType' as "pickerType", da.input_type as "inputType"
                 from form_attributes as fa
                 inner join default_attributes as da on fa.default_attribute_id = da.id
                 left join all_masters_list AS aml ON fa.properties ->> 'sourceTable' IS NOT NULL
                 and fa.properties ->> 'sourceTable' <> ''
                 and aml.id :: text = fa.properties ->> 'sourceTable'
                 where form_id = '${formId}' and fa.name = '${columnName}'`;
        const [[columnInfo]] = await db.sequelize.selectQuery(sql);

        let query, countQuery;
        if (columnInfo?.type === "uuid[]" && columnInfo?.table_type !== "function") {
            const { name: tableName } = await getAllMastersListByCondition({ id: columnInfo.sourceTable });
            const { name: dbColumnName } = await getAllMasterColumnsListByCondition({ id: columnInfo.sourceColumn });
            const whereCondition = searchString?.length > 0 ? ` and lower("${dbColumnName}" :: text) like lower('%${searchString}%')` : "";

            const getDistinctDataOfFCTable = `
        SELECT DISTINCT unnest(string_to_array(array_to_string(${columnInfo.column_name}, ','), ',')) as column_ids
        FROM ${formTable}
        WHERE ${columnInfo.column_name} IS NOT NULL;`;
            const [columnIds] = await db.sequelize.selectQuery(getDistinctDataOfFCTable);
            const map = columnIds?.map((obj) => `'${obj.column_ids}'`).join(",");
            query = `select ${dbColumnName} as name from ${tableName} where id in (${map}) ${whereCondition} ${orderString}`;
            countQuery = `select count(distinct ${dbColumnName}) from ${tableName} where id in (${map}) and is_active = '1' ${whereCondition}`;
        } else if ((columnInfo?.type === "text" && columnInfo?.inputType !== "date") || (columnInfo?.inputType === "number" && columnInfo?.type === "double precision")) {
            const whereCondition = searchString?.length > 0 ? ` and lower("${columnInfo.column_name}" :: text) like lower('%${searchString}%')` : "";
            query = `select distinct(${columnInfo.column_name}) as name from ${formTable} where ${columnInfo.column_name} is not null ${whereCondition}  ${orderString}`;
            countQuery = `select count(distinct ${columnInfo.column_name}) from ${formTable} where ${columnInfo.column_name} is not null ${whereCondition}`;
        } else if (columnInfo?.type === "text[]") {
            const whereCondition = searchString?.length > 0 ? `and lower("${columnInfo.column_name}" :: text) like lower('%${searchString}%')` : "";
            query = `select distinct unnest(${columnInfo.column_name}) as name from ${formTable} where ${columnInfo.column_name} is not null ${whereCondition} ${orderString}`;
            countQuery = `select count(distinct ${columnInfo.column_name}) from ${formTable} where  ${columnInfo.column_name} is not null ${whereCondition}`;
        } else if (columnName === "Created By" || columnName === "Updated By") {
            const whereCondition = searchString?.length > 0 ? `and lower(name :: text) like lower('%${searchString}%')` : "";
            const column = columnName === "Created By" ? "created_by" : "updated_by";
            const getDistinctIds = `select distinct(${column}) as user_id from ${formTable} where ${column} is not null`;
            const [columnIds] = await db.sequelize.selectQuery(getDistinctIds);
            const map = columnIds?.map((obj) => `'${obj.user_id}'`).join(",");
            query = `select name from users where id in (${map}) ${whereCondition} ${orderString}`;
            countQuery = `select count(distinct name) from users where id in (${map}) ${whereCondition}`;
        } else if (columnName === "Response ID") {
            const whereCondition = searchString?.length > 0 ? ` and lower(id :: text) like lower('%${searchString}%')` : "";
            query = `select id as name from ${formTable} where is_active = '${isActive}' ${whereCondition} ${orderString}`;
            countQuery = `select count(id) from ${formTable} where is_active = '${isActive}' ${whereCondition}`;
        } else if (columnInfo?.table_type === "function") {
            // as i dont have any reference where to get the data, will change if have the clarity but this solution will work for any function type
            let subQuery = await exportFormResponseQuery(formTable, [columnName]);
            const whereCondition = searchString?.length > 0 ? `and lower("${columnName}" :: text) like lower('%${searchString}%')` : "";
            subQuery = subQuery.replace("where_condition", ` ${formTable}.is_active = '${1}' `);
            query = `SELECT distinct("${columnName}") as name FROM (${subQuery}) AS subQuery  where "${columnName}" is not null ${whereCondition} ${orderString};`;
            countQuery = `SELECT count(distinct "${columnName}") FROM (${subQuery}) AS subQuery where "${columnName}" is not null ${whereCondition}`;
        } else if (columnInfo?.inputType === "date" && (columnInfo?.pickerType === "dateOnly" || columnInfo?.pickerType === "dateTimeBoth")) {
            const whereCondition = searchString?.length > 0 ? `and date(${columnInfo.column_name})::text LIKE '%${searchString}%'` : "";
            query = `select distinct(date(${columnInfo.column_name})) as name from ${formTable} where ${columnInfo.column_name} is not null and is_active = '1' ${whereCondition} order by date(${columnInfo.column_name}) ASC ${orderString}`;
            countQuery = `select count(distinct(date(${columnInfo.column_name}))) from ${formTable} where ${columnInfo.column_name} is not null and is_active = '1' ${whereCondition}`;
        } else if (columnName === "Created On" || columnName === "Updated On" || columnName === "Submitted On") {
            let column;

            switch (columnName) {
                case "Created On":
                    column = "created_at";
                    break;
                case "Updated On":
                    column = "updated_at";
                    break;
                default:
                    column = "submitted_at";
            }
            const whereCondition = searchString?.length > 0 ? `and date(${column})::text LIKE '%${searchString}%'` : "";
            query = `select distinct(date(${column})) as name from ${formTable} where ${column} is not null and is_active = '1' ${whereCondition} order by date(${column}) ASC ${orderString}`;
            countQuery = `select count(distinct(date(${column}))) from ${formTable} where ${column} is not null and is_active = '1' ${whereCondition}`;
        } else if (columnName === "Source" || columnName === "Counter" || columnName === "Submission Mode") {
            let column;

            switch (columnName) {
                case "Source":
                    column = "source";
                    break;
                case "Counter":
                    column = "counter";
                    break;
                default:
                    column = "submission_mode";
            }
            const whereCondition = searchString?.length > 0 ? `and ${column}::text LIKE '%${searchString}%'` : "";
            query = `select distinct(${column}) as name from ${formTable} where ${column} is not null and is_active = '1' ${whereCondition} order by ${column} ASC ${orderString}`;
            countQuery = `select count(distinct(${column})) from ${formTable} where ${column} is not null and is_active = '1' ${whereCondition}`;
        }

        const [rows] = await db.sequelize.selectQuery(query);
        const [countData] = await db.sequelize.selectQuery(countQuery);
        return { rows, count: countData[0].count && !Number.isNaN(countData[0].count) ? +countData[0].count : 0 };
    } catch (error) {
        console.log("error", error);
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.NO_DATA_FOUND_COLUMN, "No Data in the column.");
    }
};

const getFormDetails = async (formId, fields = 'form.NAME AS "form", form.TABLE_NAME AS "tableName", prj.NAME AS "project", master_lovs.name As "form_type_name"', project = false) => {
    try {
        const { db } = new Forms();
        const basicDetailQuery = `
            SELECT 
                ${fields}
            FROM FORMS AS form
            INNER JOIN PROJECTS AS prj ON prj.ID = form.PROJECT_ID
            INNER JOIN master_maker_lovs AS master_lovs ON form.form_type_id = master_lovs.id
            WHERE form.ID = '${formId}'
        `;

        const [formDetails] = await db.sequelize.selectQuery(basicDetailQuery, {
            type: db.sequelize.QueryTypes.SELECT
        });
        return formDetails;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.NO_DATA_FOUND_COLUMN, "No Data in the forms.");
    }

};

const getAllFormColumnDetails = async (tableName, onlySourceColumns = true) => {
    const { db } = new Forms();
    const getcolumnsDetails = await db.sequelize.selectQuery(`SELECT
        CASE WHEN IFS.COLUMN_NAME IS NULL THEN FA.COLUMN_NAME ELSE IFS.COLUMN_NAME END AS column_name,
        FA.RANK,
        FA.NAME AS FA_NAME,
        DA.TYPE AS DA_TYPE,
        DA.INPUT_TYPE AS DA_INPUT_TYPE,
        AMC.NAME AS attribute,
        AML.NAME AS table_name,
        FA.IS_REQUIRED AS FA_IS_REQUIRED,
        FA.IS_ACTIVE AS FA_IS_ACTIVE,
        FAD.NAME AS DEPENDENCY,
        FAD.COLUMN_NAME AS DEPENDENCY_COLUMN,
        FA.PROPERTIES ->> 'conditions' AS CONDITIONS,
        FA.PROPERTIES ->> 'selectType' AS "dropdown_type",
        FA.PROPERTIES ->> 'pickerType' AS "picker_type",
        FA.PROPERTIES ->> 'timeFormat' AS "time_format",
        AML.TABLE_TYPE AS AML_TABLE_TYPE,
        FORMS.PROJECT_ID AS FORMS_PROJECT_ID,
        FORMS.UPDATED_BY AS FORMS_UPDATED_BY,
        CASE
            WHEN FA.PROPERTIES ->> 'factoryTable' = '' THEN NULL
            ELSE FA.PROPERTIES ->> 'factoryTable'
        END AS FACTORY_TABLE,
        FA.PROPERTIES ->> 'factoryColumn' AS FACTORY_COLUMN,
        FA.PROPERTIES ->> 'linkColumn' AS LINK_COLUMN,
        FA.PROPERTIES ->> 'sourceColumn' AS SOURCE_COLUMN,
        FAF.COLUMN_NAME AS FACTORY_COLUMN_NAME,
        FF.TABLE_NAME AS FACTORY_TABLE_NAME,
        AMC.NAME AS SOURCE_COLUMN_NAME,
        FAL.COLUMN_NAME AS LINK_COLUMN_NAME
        FROM
        FORMS
        INNER JOIN form_attributes AS fa ON forms.id = fa.form_id
        LEFT JOIN information_schema.columns AS ifs ON forms.table_name = ifs.table_name AND fa.column_name = ifs.column_name
        LEFT JOIN default_attributes AS da ON da.id = fa.default_attribute_id
        LEFT JOIN all_masters_list AS aml ON fa.properties ->> 'sourceTable' IS NOT NULL AND fa.properties ->> 'sourceTable' <> '' AND aml.id :: text = fa.properties ->> 'sourceTable'
        LEFT JOIN all_master_columns AS amc ON fa.properties ->> 'sourceColumn' IS NOT NULL AND fa.properties ->> 'sourceColumn' <> ''AND amc.id :: text = fa.properties ->> 'sourceColumn'
        LEFT JOIN form_attributes AS fad ON fa.properties ->> 'dependency' IS NOT NULL AND fa.properties ->> 'dependency' <> '' AND fa.properties ->> 'dependency' = fad.id::text
        LEFT JOIN form_attributes AS faf ON fa.properties ->> 'factoryColumn' IS NOT NULL AND fa.properties ->> 'factoryColumn' <> '' AND fa.properties ->> 'factoryColumn' = faf.id::text
        LEFT JOIN forms AS ff ON fa.properties ->> 'factoryTable' IS NOT NULL AND fa.properties ->> 'factoryTable' <> '' AND fa.properties ->> 'factoryTable' = ff.id::text
        LEFT JOIN form_attributes AS fal ON fa.properties ->> 'linkColumn' IS NOT NULL AND fa.properties ->> 'linkColumn' <> '' AND fa.properties ->> 'linkColumn' = fal.id::text
        WHERE
        forms.table_name = '${tableName}'
        ${onlySourceColumns ? "AND fa.properties ->> 'sourceTable' IS NOT null AND da.input_type = 'dropdown'" : ""}
        ORDER BY fa.rank ASC , fa.name ASC`);

    return getcolumnsDetails;
};

module.exports = {
    formAlreadyExists,
    saveDynamicFormResponse,
    updateDynamicFormResponse,
    createForm,
    updateForm,
    getAllForms,
    deleteForm,
    getFormByCondition,
    getAllDefaultAttributes,
    createDynamicFormTable,
    getFormAttributes,
    getDynamicFormData,
    getDropDownData,
    getDynamicTableData,
    handleFilesInFormsResponse,
    addColumnToDynamicTable,
    getMappedData,
    getAllFormsType,
    getCountOfMasterInForms,
    reduceDataByKeys,
    deletFormAssociatedData,
    getAllFormIds,
    getChildDataOfFormTypes,
    getPermissionedColumns,
    getExportedData,
    getFormResponsesQuery,
    exportFormResponseQuery,
    getDistinctColumnValue,
    defaultColumnsToAdd,
    getFormDetails,
    getAllFormColumnDetails
};
