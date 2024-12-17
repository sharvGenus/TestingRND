/* eslint-disable no-param-reassign */
require("dotenv").config();
const formService = require("./forms.service");
const Forms = require("../../../database/operation/forms");

const getDynamicQueryData = async (req) => {
    const { formDropdowns, formId: id, responseId, selectedHierarchyValue = {}, skipOthers } = req.body;
    const { db } = new Forms();
    const [[{ allStaticTable }, { allColumns }, { allForms }, { formAttribute, formAttributeName }, { dropdownMeta, projectId }]] = await db.sequelize.selectQuery(`
        SELECT JSON_OBJECT_AGG("id"::TEXT, "name"::TEXT || '$$' ||"table_type"::TEXT) AS "allStaticTable" FROM ALL_MASTERS_LIST WHERE NAME IS NOT NULL;
        SELECT JSON_OBJECT_AGG("id"::TEXT, "name"::TEXT) AS "allColumns" FROM all_master_columns WHERE NAME IS NOT NULL;
        SELECT JSON_OBJECT_AGG("id"::TEXT, "table_name"::TEXT) AS "allForms" FROM forms WHERE is_published = true;
        SELECT 
            JSON_OBJECT_AGG("id"::TEXT, "column_name"::TEXT) AS "formAttribute",
            JSON_OBJECT_AGG("id"::TEXT, "name"::TEXT) AS "formAttributeName"
        FROM
        form_attributes;
        SELECT
            JSON_OBJECT_AGG(
                FA.ID,
                JSON_BUILD_OBJECT(
                    'factory_column_name',
                    FAF.COLUMN_NAME,
                    'factory_table_name',
                    FF.TABLE_NAME,
                    'link_column_name',
                    FAL.COLUMN_NAME
                )
            ) AS "dropdownMeta",
            FORMS.PROJECT_ID AS "projectId"
        FROM
            FORMS
            LEFT JOIN FORM_ATTRIBUTES AS FA ON FORMS.ID = FA.FORM_ID
            LEFT JOIN DEFAULT_ATTRIBUTES AS DA ON DA.ID = FA.DEFAULT_ATTRIBUTE_ID
            LEFT JOIN FORM_ATTRIBUTES AS FAF ON FA.PROPERTIES ->> 'factoryColumn' = FAF.ID::TEXT
            LEFT JOIN FORMS AS FF ON FA.PROPERTIES ->> 'factoryTable' = FF.ID::TEXT
            LEFT JOIN FORM_ATTRIBUTES AS FAL ON FA.PROPERTIES ->> 'linkColumn' = FAL.ID::TEXT
        WHERE
            DA.INPUT_TYPE = 'dropdown'
            AND FORMS.ID = '${id}'
        GROUP BY FORMS.PROJECT_ID;
    `);
    const dropdownQueries = formDropdowns.map((obj) => formService.getDropDownData(obj, req.user, projectId, projectId, id, responseId, { allColumns, allForms, allStaticTable, formAttribute, formAttributeName }));
    const goupedDropDownQuries = [];
    const goupedSameDropDownQuries = [];
    const emptySets = [];
    const sourceColumnById = {};
    const duplicatedValues = {};

    dropdownQueries.forEach((arg) => {
        const { formAttributeId, selectClause, matchingColum, fieldName, query, tableName, dependency, sourceTableId, conditions, factoryTable, joinCluase, sourceColumn } = arg;
        const index = goupedDropDownQuries.findIndex(
            (_arg) => {
                const {
                    query: _query,
                    tableName: _tableName,
                    fieldName: _fieldName,
                    sourceTableId: _sourceTableId,
                    conditions: _conditions,
                    sourceColumn: _sourceColumn
                } = _arg;
                if (factoryTable) {
                    return (
                        _fieldName === dependency
                        && _query === query
                        && sourceColumn === _sourceColumn
                        && _sourceTableId === sourceTableId
                        && conditions?.length === 0);
                }
                return (_fieldName === dependency
                && tableName === _tableName
                && _query === query
                && _sourceTableId === sourceTableId
                && conditions?.length > 0
                && _conditions?.length > 0
                && JSON.stringify(conditions) === JSON.stringify(_conditions));
            }
        );
        let modifiedSelectClause = selectClause.includes(".") || tableName.includes("(") ? selectClause : `${tableName}"."${selectClause}`;
        let keyName = selectClause.replace('"."', "_");
        if (index === -1) {
            return goupedDropDownQuries.push({ ...arg, otherSelectClauses: [], selectClause: modifiedSelectClause });
        }
        if (factoryTable) {
            keyName = dropdownMeta[formAttributeId]?.factory_column_name;
            modifiedSelectClause = `factory_${dropdownMeta[formAttributeId]?.factory_table_name}_${dropdownMeta[formAttributeId]?.link_column_name}"."${dropdownMeta[formAttributeId]?.factory_column_name}`;
        }
        // add join clause if exists
        if (factoryTable && (!goupedDropDownQuries[index].joinCluase || goupedDropDownQuries[index].joinCluase === "") && joinCluase && joinCluase !== "") {
            goupedDropDownQuries[index].joinCluase = joinCluase;
        }
        goupedDropDownQuries[index].otherSelectClauses.push({
            factoryTable,
            formAttributeId,
            keyName,
            selectClause: modifiedSelectClause,
            matchingColum,
            fieldName,
            dependency
        });
        sourceColumnById[fieldName] = keyName;
        duplicatedValues[fieldName] = goupedDropDownQuries[index].fieldName;
        emptySets.push({ [fieldName]: [] });
    });
    goupedDropDownQuries.forEach((arg) => {
        const { selectClause, fieldName, query, tableName, sourceTableId, conditions, otherSelectClauses } = arg;
        const index = goupedSameDropDownQuries.findIndex(
            (_arg) => {
                const {
                    selectClause: _selectClause,
                    query: _query,
                    tableName: _tableName,
                    sourceTableId: _sourceTableId,
                    conditions: _conditions,
                    otherSelectClauses: _otherSelectClauses
                } = _arg;
                return (
                    selectClause === _selectClause
                && tableName === _tableName
                && _query === query
                && _sourceTableId === sourceTableId
                && conditions?.length > 0
                && _conditions?.length > 0
                && JSON.stringify(conditions) === JSON.stringify(_conditions)
                && otherSelectClauses?.length === _otherSelectClauses?.length
                );
            }
        );
        if (index === -1) {
            return goupedSameDropDownQuries.push({ ...arg });
        }
        duplicatedValues[fieldName] = goupedSameDropDownQuries[index].fieldName;
        emptySets.push({ [fieldName]: [] });
    });
    const finalQuery = [];
    // const hierarchiesKeys = Object.keys(workAreaAssignments);
    const fetchedDropDowns = [];
    goupedSameDropDownQuries.forEach((gropuedDropdown) => {
        const { selectClause, fieldName, query, sqlQuery, tableName, matchingColum, otherSelectClauses = [], dependency } = gropuedDropdown;
        let { joinCluase = "" } = gropuedDropdown;
        const skipOptions = !skipOthers && !otherSelectClauses[0]?.factoryTable;
        if (skipOptions || (Object?.keys(selectedHierarchyValue || {}).length > 0 && selectedHierarchyValue?.[dependency]?.length > 0)) {
            const [tableAlias] = tableName.split("(");
            const selectOther = otherSelectClauses.reduce((pre, cur) => {
                if (!joinCluase && cur.factoryTable) {
                    const joinName = `"factory_${dropdownMeta[cur.formAttributeId]?.factory_table_name}_${dropdownMeta[cur.formAttributeId]?.link_column_name}"`;
                    const conditionToMatch = tableName.startsWith("serial_numbers(") ? "serial_number" : "id";
                    joinCluase += ` left join "${dropdownMeta[cur.formAttributeId]?.factory_table_name}" AS ${joinName} ON ${joinName}."${dropdownMeta[cur.formAttributeId]?.link_column_name}" = "${conditionToMatch}"`;
                }
                if (cur.selectClause && cur.keyName) {
                    pre += `, '${cur.keyName}',  "${cur.selectClause}"`;
                }
                return pre;
            }, "");
            let dependencyCondition = "";
            if (tableName === "users" && ["L1 Approver Name", "L2 Approver Name"].includes(fieldName)) {
                if (query) {
                    dependencyCondition += " AND ";
                }
                const userIds = [req.user.userId, ...(selectedHierarchyValue?.[fieldName] || [])];
                dependencyCondition += `id IN ('${userIds.join("', '")}') `;
            } else if (["gaa_level_entries", "urban_level_entries"].includes(tableName) && selectedHierarchyValue?.[dependency]) {
                if (query) {
                    dependencyCondition += " AND ";
                }
                dependencyCondition += ` parent_id IN ('${selectedHierarchyValue?.[dependency].join("', '")}') `;
            } else if (tableName.startsWith("serial_numbers(")) {
                dependencyCondition += ` WHERE ${tableAlias}.serial_number IN ('${selectedHierarchyValue?.[dependency]}') `;
            } else {
                dependencyCondition += sqlQuery;
            }
            if (["gaa_level_entries", "urban_level_entries"].includes(tableName)) {
                const parentTable = tableName === "gaa_level_entries" ? "gaa_hierarchies" : "urban_hierarchies";
                const idColumn = tableName === "gaa_level_entries" ? "gaa_hierarchy_id" : "urban_hierarchy_id";
                joinCluase += ` INNER JOIN ${parentTable} ON ${parentTable}.id = ${tableAlias}.${idColumn}`;
            } else if (["project_master_maker_lovs"].includes(tableName)) {
                joinCluase += ` INNER JOIN project_master_makers ON project_master_makers.id = ${tableAlias}.master_id`;
            }
            const matchingColumCluase = matchingColum ? `, 'matchingcolumn', ${tableAlias}.${matchingColum}` : "";
            finalQuery.push(`SELECT array_agg(jsonb_build_object('id', ${tableAlias}.id, 'name', "${selectClause}"${selectOther}${matchingColumCluase})) AS "${fieldName}" FROM ${tableName} AS ${tableAlias} ${joinCluase} ${query} ${dependencyCondition}; `);
            fetchedDropDowns.push(fieldName);
        }
    });
    const [dropdownData] = await db.sequelize.selectQuery(`${finalQuery.join(" ")}`);
    dropdownData.push(...emptySets);
    return {
        dropdownData: selectedHierarchyValue && skipOthers ? dropdownData.filter((x) => fetchedDropDowns.includes(Object.keys(x)[0])) : dropdownData,
        sourceColumnById,
        duplicatedValues
    };
};

module.exports = {
    getDynamicQueryData
};
