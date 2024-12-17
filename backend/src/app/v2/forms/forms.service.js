const { operations } = require("../../../../constant");
const Forms = require("../../../database/operation/forms");

const getDropDownData = (data, userObj, projectId, formProject, formId, responseId, extras) => {
    const { db } = new Forms();
    const { name, dependency } = data;
    const selectClause = generateDynamicQuery.call(db, data, userObj, projectId, formProject, formId, responseId, name, dependency, extras);
    return selectClause;
};

function generateDynamicQuery(data, userObj, projectId, formProject, formId, responseId, name, dependencyUuid, extras) {
    const { allColumns, allForms, allStaticTable, formAttribute, formAttributeName } = extras;
    const { conditions, sourceColumn, sourceTable, factoryTable, factoryColumn, linkColumn, formAttributeId } = data;
    const { userId } = userObj;
    const sourceTables = {};
    const allMasterlist = allStaticTable[sourceTable];
    if (allMasterlist) {
        const [tableName, tableType] = allMasterlist.split("$$");
        sourceTables.tableName = tableName;
        sourceTables.tableType = tableType;
    } else {
        sourceTables.tableName = allForms[sourceTable];
        sourceTables.tableType = "table";
        sourceTables.isDynamicSource = true;
    }
    if (!sourceTables.isDynamicSource) {
        sourceTables.columnName = allColumns[sourceColumn];
    } else {
        sourceTables.columnName = formAttribute[sourceColumn];
    }

    if (data.extraColumn) {
        if (allColumns[data.extraColumn]) {
            sourceTables.matchingColumn = allColumns[data.extraColumn];
        } else {
            sourceTables.matchingColumn = formAttribute[data.extraColumn];
        }
    }
    const { tableName, tableType, columnName, matchingColumn } = sourceTables;
    const isFactoryFile = false; // !!(factoryTable && factoryColumn && linkColumn && sourceColumn);
    const factoryFileParams = isFactoryFile ? `, '${factoryTable}', '${factoryColumn}', '${linkColumn}', '${sourceColumn}'` : "";
    const webResponsesParams = formId && formAttributeId && responseId ? `, '${formId}', '${formAttributeId}', '${responseId}'` : "";
    const table = tableType === "function" ? `${tableName}('${userId}', '${projectId}' ${factoryFileParams} ${webResponsesParams})` : tableName;
    let dependency;
    if (dependencyUuid) {
        dependency = formAttributeName[dependencyUuid];
    }
    const query = getDropDownQuery(table, isFactoryFile ? "factory_value" : columnName, matchingColumn, conditions, tableType, formProject, name, dependency, sourceColumn, sourceTable, factoryTable, factoryColumn, linkColumn, extras);
    return { ...query, factoryTable, formAttributeId };
}

const getDropDownQuery = (tableName, columnName, extraColumn, conditions, tableType, formProject, name, dependency, sourceColumn, sourceTableId, factoryTbl, factoryCol, linkCol, { allColumns, allForms, formAttribute }) => {
    let searchColumns = [];
    if (conditions && conditions.length > 0) {
        searchColumns = conditions.map((obj) => {
            const searchColumn = allColumns[obj.column];
            return { column: `${searchColumn}::TEXT`, op: operations[obj.operation], value: obj.value };
        });
    }
    if (tableType !== "function") {
        searchColumns.push({ column: "\"is_active\"", op: "=", value: "1" });
    }

    let factoryTable = "";
    let factoryColumn = "";
    let linkColumn = "";
    if (factoryTbl && tableType !== "function") {
        factoryTable = allForms[factoryTbl];
        factoryColumn = formAttribute[factoryCol];
        linkColumn = formAttribute[linkCol];
    }

    const dataPayload = {
        tableName,
        columnName,
        extraColumn,
        searchColumns,
        factoryTable,
        factoryColumn,
        linkColumn
    };

    const { selectClause, matchingColum, fieldName, query: preQuery, joinCluase } = generateSelectQuery(dataPayload, name);
    const sqlQuery = "";
    /* if (tableName === "users") {
        const query = "SELECT user_id as \"userId\" FROM user_master_lov_permission WHERE master_id = '434473cb-b66d-4462-8eb1-6c47389695e7'";
        const projectData = await db.sequelize.selectQuery(query);
        let usersOfProjects = [];
        if (projectData[0] && projectData[0]?.length > 0) {
            usersOfProjects = projectData[0].map((obj) => obj.userId);
        }
        const stringWithQuotes = usersOfProjects.map((item) => `'${item}'`).join(", ");
        sqlQuery += ` AND id in (${stringWithQuotes})`;
    } */
    return { selectClause, matchingColum, dependency, fieldName, query: preQuery, sqlQuery, tableName, sourceColumn, conditions, sourceTableId, joinCluase };
};

const generateSelectQuery = (payload, name) => {
    // `jsonb_build_object('id', id, 'name', "${payload.columnName}"${matchingColum})`;
    const { tableName, extraColumn: matchingColum, columnName, factoryTable, factoryColumn, linkColumn } = payload;
    const [tableAlias] = tableName.split("(");
    const selectClause = factoryColumn ? `ft"."${factoryColumn}` : columnName;
    let joinCluase = "";
    if (factoryTable) {
        joinCluase += `LEFT OUTER JOIN ${factoryTable} AS ft ON ft.${linkColumn} = ${tableName}.id::TEXT`;
    }
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
        columnConditions[column].push(`${tableAlias}.${column} ${op} '${value}'`);
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
    return { selectClause, matchingColum, tableName, joinCluase, fieldName, query };
};

module.exports = {
    getDropDownData
};