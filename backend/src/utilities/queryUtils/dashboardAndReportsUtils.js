const statusMessage = require("../../config/status-message");
const Forms = require("../../database/operation/forms");
const formService = require("../../app/forms/forms.service");

const { db } = new Forms();
const formTypeIds = {
    INSTALLATION: "30ea8a65-ff5b-4bff-b1a1-892204e23669",
    SURVEY: "1d75feca-2e64-4b95-900d-fcd53446ddeb"
};

// Only accept Installation Or O&M request only 
// columns ["INVENTORY_MATERIAL_SERIAL_NUMBER" == Want to get the InventoryLinkColumnsFrom FormResponces  ];
// formReqType ---- Which type of form like installation o&M survey InstallationWithO&M
// fetchColumn ----- which attributes we want to get
const getUnionAllFormReponses = async (projectId, formReqType = "", fetchColumn = "", dropdownColumn = false) => {
    const formTypes = ["Installation", "O&M", "InstallationWithO&M", "SURVEY"];
    if (formTypes.includes(formReqType)) {
        // Important Variables
        let formTypeWise;
        const UnionArray = [];
        let UnionQuery = "";
        
        // Manageing variables
        let count = 1;
        const attributeAlieases = [];
        
        // eslint-disable-next-line brace-style
        if (["Installation", "O&M", "InstallationWithO&M"].includes(formReqType)) { formTypeWise = formTypeIds.INSTALLATION; }
        else if (["SURVEY"].includes(formReqType)) { formTypeWise = formTypeIds.SURVEY; }

        const [formAttrubutes] = await getAllFormProperties(projectId, false, ((formTypeWise) || false), dropdownColumn);

        formAttrubutes.forEach((val, index) => {
            if (!UnionArray[val.form_table_name]) {
                UnionArray[val.form_table_name] = { query: [], joins: "", tableName: val.form_table_name };
            }
            if ((fetchColumn != "") && (fetchColumn != undefined)) {
                if (val.da_input_type === "dropdown") {
                    if (val.aml_table_type === "function") {
                        const isFactoryColumnn = val.factory_table && val.aml_table_type === "function";
                        if (!isFactoryColumnn && val.form_properties != null && fetchColumn.includes("INVENTORY_MATERIAL_SERIAL_NUMBER")) {
                            if (!attributeAlieases.includes("INVENTORY_MATERIAL_SERIAL_NUMBER")) {
                                attributeAlieases.push("INVENTORY_MATERIAL_SERIAL_NUMBER");
                            }
                            UnionArray[val.form_table_name].query.INVENTORY_MATERIAL_SERIAL_NUMBER = `, ${val.form_table_name}.${val.column_name} AS INVENTORY_MATERIAL_SERIAL_NUMBER`;
                            // UnionArray[val.form_table_name].query += `, ${val.form_table_name}.${val.column_name} AS INVENTORY_MATERIAL_SERIAL_NUMBER`;
                        }
                        // else if (!isFactoryColumnn)
                        // else {
                        // }
                    }
                    // else if (val.aml_table_type === "table") {
                    // }
                }
                // else {
                // }
            }
        });

        const staticColumns = formService.defaultColumnsToAdd.map((x) => (x.column)).join(", ");

        Object.entries(UnionArray).forEach(([index, val]) => {
            let query = "";
            // Used to ensure all columns exist in all table Union
            attributeAlieases.forEach((value) => {
                // eslint-disable-next-line no-unused-expressions
                (val.query[value]) ? query += val.query[value] : query += `, NULL as ${value}`;
            });

            UnionQuery += `SELECT id,${staticColumns}${query}, '${val.tableName}' as response_table_name from ${val.tableName} `;
            if (count < Object.entries(UnionArray).length) { UnionQuery += "UNION ALL "; count += 1; }
        });

        return {
            status: true,
            query: UnionQuery
        };
    } else {
        return {
            status: false,
            message: statusMessage.Wrong_FormType
        };
    }

};

// // -|- Functionality -|- Used to get form Attributes Details AND (Requested form || All Form Types wise)
// tableName -- get the single table data Used to send the table name Like (zform_g1946_dmi_10 || get the all table data).
// formTypeWise -- get the all form responces form type wise.
// onlySourceColumns -- Used to get all or one type Like (Dropdown || single) Dropdown mean which data come from another (table || function).
const getAllFormProperties = async (projectId, tableName = false, formTypeWise = false, onlySourceColumns = false) => {
    let whereCondition = "";
    
    if (tableName || onlySourceColumns || formTypeWise) {
        if (tableName) {
            whereCondition += `AND forms.table_name = '${tableName}'`;
        }
        if (formTypeWise) {
            whereCondition += `AND forms.form_type_id = '${formTypeWise}'`;
        }
        if (onlySourceColumns) {
            whereCondition += "AND fa.properties ->> 'sourceTable' IS NOT null AND da.input_type = 'dropdown'";
        }

    }

    const query = `SELECT
        CASE WHEN IFS.COLUMN_NAME IS NULL THEN FA.COLUMN_NAME ELSE IFS.COLUMN_NAME END AS column_name,
        FA.ID,
        FORMS.table_name AS FORM_TABLE_NAME,
        FORMS.properties ->> 'materialArray' AS fORM_PROPERTIES, 
        FA.RANK,
        FA.NAME AS FA_NAME,
        DA.TYPE AS DA_TYPE,
        DA.INPUT_TYPE AS DA_INPUT_TYPE,
        AMC.NAME AS AMC_Attribute,
        AML.NAME AS AML_TableName,
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
        WHERE forms.is_published = 'true'
        AND forms.project_id = '${projectId}'
        ${whereCondition}
        ORDER BY fa.rank ASC , fa.name ASC`;

    const getcolumnsDetails = await db.sequelize.selectQuery(query);
        
    return getcolumnsDetails;
};

module.exports = {
    getAllFormProperties,
    getUnionAllFormReponses
};