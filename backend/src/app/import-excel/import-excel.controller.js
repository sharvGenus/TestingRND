const fs = require("fs");
const path = require("node:path");
const XLSX = require("xlsx");
const Excel = require("excel4node");
const { spawn } = require("child_process");
const constant = require("../../../constant");
const Forms = require("../../database/operation/forms");
const {
    getFormByCondition
} = require("../forms/forms.service");
const { createDirectoryIfNotExists } = require("../files/files.service");
const { exportProjectMasterMakeLovSchema } = require("../project-master-maker-lovs/project-master-maker-lovs.controller");
const publishMessage = require("../../utilities/publisher");

const operators = {
    et: "=",
    net: "<>",
    gt: ">",
    lt: "<",
    gte: ">=",
    lte: "<="
};

const tables = {
    users: "users",
    project: "projects",
    material: "materials",
    roles: "roles",
    countries: "countries",
    states: "states",
    cities: "cities",
    gaa_hierarchies: "gaa_hierarchies",
    gaa_level_entries: "gaa_level_entries",
    network_hierarchies: "network_hierarchies",
    network_level_entries: "network_level_entries",
    company: "organizations",
    contractor: "organizations",
    customer: "organizations",
    supplier: "organizations",
    customer_departments: "customer_departments",
    customer_designations: "customer_designations",
    approver: "approver",
    masterMaker: "master_makers",
    masterMakerLovs: "master_maker_lovs",
    transactionTypeRange: "transaction_type_ranges",
    projectMaker: "project_master_makers",
    projectMasterMakerLovs: "project_master_maker_lovs",
    smtp: "smtp_configurations",
    contractor_branch: "organizations",
    company_branch: "organizations",
    company_stores: "organization_stores",
    contractor_stores: "organization_stores",
    customer_stores: "organization_stores",
    supplier_stores: "organization_stores",
    contractor_store_locations: "organization_store_locations",
    company_store_locations: "organization_store_locations",
    grn_receipt: "stock_ledger_details",
    min_receipt: "stock_ledger_details",
    mrn_receipt: "stock_ledger_details",
    return_mrn_receipt: "stock_ledger_details",
    ltl_receipt: "stock_ledger_details",
    stc_receipt: "stock_ledger_details",
    sto_receipt: "stock_ledger_details",
    sto_grn_receipt: "stock_ledger_details",
    ptp_receipt: "stock_ledger_details",
    mrf_receipt: "request_approvals",
    str_receipt: "request_approvals",
    mrr_receipt: "request_approvals",
    ptpr_receipt: "request_approvals",
    urban_level_entries: "urban_level_entries"
};

const staticMasterDataSql = (tableName) => {
    // get level excel columns
    let getColumn = [];
    if (tableName == "gaa_level_entries") getColumn = constant.VISIBLE_GAA_HIERARCHIES_LEVEL;

    if (getColumn.length > 0) {
        const sql = `
        SELECT
        c.column_name AS column_name,
        ccu.table_name as name,
        c.udt_name as column_type,
        CONCAT(
            c.udt_name,
            CASE
                WHEN ccu.table_name IS NOT NULL THEN ' (' || ccu.table_name || ')'
                ELSE ''
            END,
            CASE
                WHEN c.column_name IN ('${constant.MANDETORY_GAA_HIERARCHIES_LEVEL.join(
        "', '"
    )}') THEN '-mandatory'
                END
        ) as type
    FROM
        information_schema.columns AS c
        LEFT JOIN information_schema.key_column_usage AS kcu ON c.table_name = kcu.table_name
        AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.constraint_column_usage AS ccu ON kcu.constraint_name = ccu.constraint_name
        LEFT JOIN information_schema.table_constraints AS tc ON kcu.constraint_name = tc.constraint_name
    WHERE
        c.table_name = '${tableName}'
        AND c.column_name IN ('${getColumn.join("', '")}')
    ORDER BY
        c.ordinal_position;`;
        return sql;
    } else {
        return 0;
    }
};

const exportFormsSchemaFile = async (req, res) => {
    // download GAA & form
    const { formId, tableName, parentId, levelId, selectedColumns } = req.body;
    const { db } = new Forms();
    const isUpdateQuery = selectedColumns?.length > 0;
    let name, sql;
    if (formId) {
        const { name: formName } = await getFormByCondition({ id: formId });
        name = formName;
        const filterColumnsConditions = isUpdateQuery ? `AND SIC.COLUMN_NAME IN ('${selectedColumns.join("', '")}')` : "";
        sql = isUpdateQuery
            ? `SELECT
                SIC.COLUMN_NAME,
                SIC.TABLE_NAME,
                FA.IS_REQUIRED AS REQUIRED,
                CONCAT(
                    CASE
                        WHEN DA.TYPE IS NULL THEN CASE
                            WHEN UPPER(SIC.DATA_TYPE) = 'USER-DEFINED' THEN 'text'
                            ELSE SIC.DATA_TYPE
                        END
                        ELSE DA.TYPE
                    END,
                    CASE
                        WHEN AML.NAME IS NOT NULL THEN ' (' || INITCAP(REPLACE(AML.NAME, '_', ' ')) || ')'
                        ELSE ''
                    END
                ) AS TYPE,
                AML.NAME
            FROM
                INFORMATION_SCHEMA.COLUMNS AS SIC
                INNER JOIN FORMS AS F ON SIC.TABLE_NAME = F.TABLE_NAME
                LEFT OUTER JOIN FORM_ATTRIBUTES AS FA ON FA.FORM_ID = F.ID
                AND FA.COLUMN_NAME = SIC.COLUMN_NAME
                LEFT OUTER JOIN DEFAULT_ATTRIBUTES AS DA ON FA.DEFAULT_ATTRIBUTE_ID = DA.ID
                LEFT JOIN ALL_MASTERS_LIST AS AML ON AML.ID::TEXT = FA.PROPERTIES ->> 'sourceTable'
            WHERE
                F.ID = '${formId}'
                AND F.IS_PUBLISHED IS TRUE
                AND SIC.COLUMN_NAME <> 'id'
                AND F.IS_ACTIVE = '1'
                AND (
                    FA.IS_ACTIVE = '1'
                    OR FA.IS_ACTIVE IS NULL
                )
                ${filterColumnsConditions}
                ORDER BY
                    FA.RANK ASC, SIC.COLUMN_NAME ASC;`
            : `SELECT
                FA.COLUMN_NAME,
                FA.IS_REQUIRED AS REQUIRED,
                CONCAT(
                    DA.TYPE,
                    CASE
                        WHEN AML.NAME IS NOT NULL THEN ' (' || INITCAP(REPLACE(AML.NAME, '_', ' ')) || ')'
                        ELSE ''
                    END
                ) AS TYPE,
                AML.NAME
            FROM
                FORM_ATTRIBUTES AS FA
                LEFT OUTER JOIN DEFAULT_ATTRIBUTES AS DA ON FA.DEFAULT_ATTRIBUTE_ID = DA.ID
                LEFT JOIN ALL_MASTERS_LIST AS AML ON AML.ID::TEXT = FA.PROPERTIES ->> 'sourceTable'
            WHERE
                FORM_ID = '${formId}'
                AND FA.IS_ACTIVE = '1'
                AND (FA.PROPERTIES ->> 'factoryTable' IS NULL OR FA.PROPERTIES ->> 'factoryTable' = '')
            ORDER BY
                FA.RANK ASC,
                FA.NAME ASC;
        `;
    } else if (tableName === "project_master_maker_lovs") {
        exportProjectMasterMakeLovSchema(req, res);
        return;
    } else if (tableName === "urban_level_entries") {
        name = tables[tableName];
        sql = staticMasterDataSqlQuery(tables[tableName]);
    } else {
        name = tables[tableName];
        sql = staticMasterDataSql(tables[tableName]);
    }
    if (sql) {
        const workbook = new Excel.Workbook(); // creating new excel
        const worksheet = workbook.addWorksheet(name);

        const [queryData] = await db.sequelize.selectQuery(sql);
        let columns = [];
        let formProjectID;

        if (formId) {
            // for form
            const col = [];
            queryData.forEach((ele) => {
                // eleminate the default columns if query is for insert
                col.push(ele);
                // if (isUpdateQuery || !["resurvey_by", "is_resurvey"].includes(ele.column_name)) {
                // }
            });

            // add id column if only we are donwloading the sheat for update purpose
            // if (!formId || isUpdateQuery) {
            col.unshift({
                column_name: "id",
                required: "false",
                type: "uuid",
                name: null
            });
            // }

            col.forEach((ele) => {
                let man = "";
                if (ele.required === "true") {
                    man = " mandatory";
                    ele.type += " mandatory";
                }

                if (ele.type.startsWith("uuid[] (")) {
                    if (ele.type.includes("(Gaa Level Entries)")) {
                        ele.type = `uuid[] (ref_level_entries) i.e {ABC, XYZ}${man}`;
                    } else if (ele.type.includes("(Master Maker Lovs)")) {
                        ele.type = `uuid[] (ref_global_masters_lov) i.e {ABC, XYZ}${man}`;
                    } else if (ele.type.includes("(Project Master Maker Lovs)")) {
                        ele.type = `uuid[] (ref_project_masters_lov) i.e {ABC, XYZ}${man}`;
                    }
                }

                if (ele.type === "text[]") {
                    ele.type += " i.e {ABC, XYZ}";
                }
            });

            columns = col;

            const projectId = `SELECT project_id FROM forms where id='${formId}'`;
            // const projectId = getProjectByCondition({id: `${formId}`})
            const tableQueryprojectId = await db.sequelize.selectQuery(projectId);
            formProjectID = tableQueryprojectId[0][0].project_id;
        } else {
            queryData.forEach((ele) => {
                if (ele.column_name == "id") {
                    ele.type = "uuid";
                } else if (ele.column_name == "gaa_hierarchy_id") {
                    ele.type = "uuid (ref_gaa_hierarchy_id)";
                } else if (ele.column_name == "urban_hierarchy_id") {
                    ele.type = "uuid (ref_urban_hierarchy_id)";
                } else if (ele.column_name == "parent_id") {
                    ele.type = "uuid (ref_parent_id)";
                }
            });
            columns = queryData;
        }

        const columnNames = columns.map((row) => row.column_name); // column names of the form
        const dataTypes = columns.map((row) => row.type);

        const distinctNonNullNames = [
            ...new Set(
                queryData
                    .filter((item) => item.name !== null)
                    .map((item) => item.name)
            )
        ];

        const headerStyle = workbook.createStyle({
            font: {
                color: "00a9ff",
                bold: true
            }
        });

        const boldStyle = workbook.createStyle({
            font: {
                bold: true,
                size: 10
            }
        });

        columnNames.forEach((name, colNumber) => {
            worksheet
                .cell(1, colNumber + 1)
                .string(name)
                .style(headerStyle);
        });

        dataTypes.forEach((type, colNumber) => {
            worksheet
                .cell(2, colNumber + 1)
                .string(type)
                .style(boldStyle);
        });

        let queryPromises;

        if (tableName == "gaa_level_entries") {
            let sheetObjNames;
            let parentTable;
            if (constant.SHEET_LEVEL_GAA_NAME[distinctNonNullNames]) {
                sheetObjNames = constant.SHEET_LEVEL_GAA_NAME;
                parentTable = "gaa_level_entries";
            }
            queryPromises = Object.keys(sheetObjNames)?.map(
                async (_tableName) => {
                    let tableName = _tableName;
                    if (
                        tableName !== "serial_numbers"
                        && tableName !== "nonserialize_materials"
                    ) {
                        const tableSheet = workbook.addWorksheet(
                            sheetObjNames[tableName]
                        );
                        let tableDataSql = "";
                        const fields = ["id", "name", "code"];
                        // Query the data for the current table name
                        if (sheetObjNames[tableName]) {
                            if (tableName == "parent_id" && parentId) {
                                tableName = parentTable;
                                tableDataSql += `SELECT ${fields} FROM ${tableName} WHERE is_active = '1' AND gaa_hierarchy_id='${parentId}'`;
                            } else if (
                                tableName == "existing_entries"
                                && parentId
                            ) {
                                tableName = parentTable;
                                tableDataSql += `SELECT tb.id, tb.name, tb.code, ga.id AS parent_id, ga.name AS parent_name FROM ${tableName} AS tb
                                INNER JOIN ${tableName} AS ga ON ga.id = tb.parent_id
                                WHERE tb.is_active = '1' AND tb.gaa_hierarchy_id='${levelId}'`;
                            } else if (tableName == "existing_entries") {
                                tableName = parentTable;
                                tableDataSql += `SELECT id, name, code FROM ${tableName} WHERE is_active = '1' AND gaa_hierarchy_id='${levelId}'`;
                            } else {
                                // eslint-disable-next-line no-lonely-if
                                if (tableName == "gaa_level_entries") {
                                    tableDataSql += `SELECT ${fields} FROM gaa_hierarchies WHERE is_active = '1' AND id= '${levelId}'`;
                                }
                            }
                        }

                        const [tableQueryData] = await db.sequelize.selectQuery(
                            tableDataSql
                        );
                        // Insert the header row with the column names
                        const tableColumnNames = tableQueryData.length > 0
                            ? Object.keys(tableQueryData?.[0])
                            : [];
                        tableColumnNames?.forEach((name, colNumber) => {
                            tableSheet
                                .cell(1, colNumber + 1)
                                .string(name)
                                .style(headerStyle);
                        });

                        tableQueryData?.forEach((row, rowIndex) => {
                            tableColumnNames.forEach((colName, colIndex) => {
                                const cellValue = row[colName];
                                if (cellValue !== null) {
                                    tableSheet
                                        .cell(rowIndex + 2, colIndex + 1)
                                        .string(cellValue.toString());
                                } else {
                                    tableSheet
                                        .cell(rowIndex + 2, colIndex + 1)
                                        .string("null");
                                }
                            });
                        });
                    }
                }
            );
        } else if (tableName == "urban_level_entries") {
            let sheetObjNames;
            let parentTable;
            if (constant.SHEET_LEVEL_URBAN_NAME[distinctNonNullNames]) {
                sheetObjNames = constant.SHEET_LEVEL_URBAN_NAME;
                parentTable = "urban_level_entries";
            }
            queryPromises = Object.keys(sheetObjNames)?.map(
                async (_tableName) => {
                    let tableName = _tableName;
                    if (
                        tableName !== "serial_numbers"
                        && tableName !== "nonserialize_materials"
                    ) {
                        const tableSheet = workbook.addWorksheet(
                            sheetObjNames[tableName]
                        );
                        let tableDataSql = "";
                        const fields = ["id", "name", "code"];
                        // Query the data for the current table name
                        if (sheetObjNames[tableName]) {
                            if (tableName == "parent_id" && parentId) {
                                tableName = parentTable;
                                tableDataSql += `SELECT ${fields} FROM ${tableName} WHERE is_active = '1' AND urban_hierarchy_id='${parentId}'`;
                            } else if (
                                tableName == "existing_entries"
                                && parentId
                            ) {
                                tableName = parentTable;
                                tableDataSql += `SELECT tb.id, tb.name, tb.code, ul.id AS parent_id, ul.name AS parent_name FROM ${tableName} AS tb
                                INNER JOIN ${tableName} AS ul ON ul.id = tb.parent_id
                                WHERE tb.is_active = '1' AND tb.urban_hierarchy_id='${levelId}'`;
                            } else if (tableName == "existing_entries") {
                                tableName = parentTable;
                                tableDataSql += `SELECT id, name, code FROM ${tableName} WHERE is_active = '1' AND urban_hierarchy_id='${levelId}'`;
                            } else {
                                // eslint-disable-next-line no-lonely-if
                                if (tableName == "urban_level_entries") {
                                    tableDataSql += `SELECT ${fields} FROM urban_hierarchies WHERE is_active = '1' AND id= '${levelId}'`;
                                }
                            }
                        }

                        const [tableQueryData] = await db.sequelize.selectQuery(
                            tableDataSql
                        );
                        // Insert the header row with the column names
                        const tableColumnNames = tableQueryData.length > 0
                            ? Object.keys(tableQueryData?.[0])
                            : [];
                        tableColumnNames?.forEach((name, colNumber) => {
                            tableSheet
                                .cell(1, colNumber + 1)
                                .string(name)
                                .style(headerStyle);
                        });

                        tableQueryData?.forEach((row, rowIndex) => {
                            tableColumnNames.forEach((colName, colIndex) => {
                                const cellValue = row[colName];
                                if (cellValue !== null) {
                                    tableSheet
                                        .cell(rowIndex + 2, colIndex + 1)
                                        .string(cellValue.toString());
                                } else {
                                    tableSheet
                                        .cell(rowIndex + 2, colIndex + 1)
                                        .string("null");
                                }
                            });
                        });
                    }
                }
            );
        } else {
            // for form
            queryPromises = distinctNonNullNames?.map(async (tableName) => {
                let table;
                if (
                    tableName !== "serial_numbers"
                    && tableName !== "nonserialize_materials"
                ) {
                    let tableDataSql;

                    if (tableName == "gaa_level_entries") {
                        table = "ref_level_entries";

                        tableDataSql = `SELECT ga.id, ga.name, ga.code, gh.name AS level, gai.name AS parent_name, gai.code AS parent_code FROM gaa_level_entries AS ga
                        INNER JOIN gaa_hierarchies AS gh ON gh.id = ga.gaa_hierarchy_id
                        LEFT JOIN gaa_level_entries AS gai ON gai.id = ga.parent_id
                        WHERE ga.is_active = '1' AND gh.project_id ='${formProjectID}'`;
                    } else if (tableName == "master_maker_lovs") {
                        table = "ref_global_masters_lov";

                        tableDataSql = `SELECT ml.id, ml.name, gh.name AS master_name FROM ${tableName} AS ml
                        INNER JOIN master_makers AS gh ON gh.id = ml.master_id
                        WHERE ml.is_active = '1'`;
                    } else if (tableName == "project_master_maker_lovs") {
                        table = "ref_project_masters_lov";

                        tableDataSql = `SELECT ml.id, ml.name, ml.code, gh.name AS master_name FROM ${tableName} AS ml
                        INNER JOIN project_master_makers AS gh ON gh.id = ml.master_id
                        WHERE ml.is_active = '1' AND gh.project_id ='${formProjectID}'`;
                    } else {
                        tableDataSql = undefined;
                    }

                    if (tableDataSql != undefined) {
                        const [tableQueryData] = await db.sequelize.selectQuery(
                            tableDataSql
                        );

                        const tableSheet = workbook.addWorksheet(table);

                        const tableColumnNames = tableQueryData.length > 0
                            ? Object.keys(tableQueryData?.[0])
                            : [];
                        tableColumnNames?.forEach((name, colNumber) => {
                            tableSheet
                                .cell(1, colNumber + 1)
                                .string(name)
                                .style(headerStyle);
                        });

                        tableQueryData?.forEach((row, rowIndex) => {
                            tableColumnNames.forEach((colName, colIndex) => {
                                const cellValue = row[colName];
                                if (cellValue !== null) {
                                    tableSheet
                                        .cell(rowIndex + 2, colIndex + 1)
                                        .string(cellValue.toString());
                                } else {
                                    tableSheet
                                        .cell(rowIndex + 2, colIndex + 1)
                                        .string("null");
                                }
                            });
                        });
                    }
                }
            });
        }
        await Promise.all(queryPromises);

        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${name}.xlsx`
        );

        workbook.writeToBuffer().then((buffer) => {
            res.end(buffer);
        });
    } else {
        res.json({ Message: "Incorrect table name" });
    }
};

function changeOwnerToPostgres(path, isRecursive = false) {
    const options = [
        "chown",
        `${process.env.DB_USER}:${process.env.DB_USER}`,
        path
    ];
    if (isRecursive) options.push("-R");
    const child = spawn("sudo", options);

    return new Promise((resolve, reject) => {
        // Listen for data events from the spawned process
        child.stdout.on("data", (data) => {
            resolve();
        });

        child.stderr.on("data", (data) => {
            reject(data);
        });

        // Listen for the 'close' event when the child process exits
        child.on("close", (code) => {
            resolve();
        });
    });
}

function dropAllIndexQuery(_indexes) { return _indexes.map((x) => `DROP INDEX IF EXISTS ${x}`).join(";"); }

const updateFormResponses = async (req, res) => {
    if (global.dataImportStatus?.start && (!global.dataImportStatus?.completed || global.dataImportStatus?.rejectedFiles)) {
        res.status(400).send({ message: "Import is already in progress, please wait till last import gets completed" });
        return { noResponsetoClient: true };
    }

    const indexes = [];

    const messageForClient = { user: req.user.email };
    const { db } = new Forms();
    let temporaryTable = null;
    let temporartTextValueTable = null;
    let errorTable = null;

    const fileName = new Date().getTime().toString();
    const csvFilePath = path.join(global.exportedFilesDirectory, `${fileName}.csv`);

    try {
        // upload form
        const { formId } = req.body;

        if (!req.files || req.files.length === 0) {
            return { message: "No file uploaded." };
        }

        const uploadedFile = req.files.excelFile;
        const workbook = XLSX.read(uploadedFile.data, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const dataCsv = XLSX.utils.sheet_to_csv(worksheet, { defval: null });

        const dataCsvLines = dataCsv.split("\n");

        if (dataCsvLines.length < 3) {
            res.status(400).send({ message: "No data found in uploaded sheet" });
            return { noResponsetoClient: true };
        }

        global.dataImportStatus.user = req.user.email;
        global.dataImportStatus.start = Date.now();
        global.dataImportStatus.displayMessage = "Update in progress";
    
        const { tableName } = await getFormByCondition({ id: formId });

        const [[{ isPublished }]] = await db.sequelize.selectQuery(
            `SELECT
                CASE
                    WHEN COUNT(ID) >= 0 THEN TRUE
                    ELSE FALSE
                END AS "isPublished"
            FROM
                FORMS
            WHERE
                ID = '${formId}'
                AND IS_PUBLISHED IS TRUE`
        );
        if (!isPublished) {
            res.status(500).send({ message: "Form not published" });
            return { noResponsetoClient: true };
        }

        createDirectoryIfNotExists(global.exportedFilesDirectory);
        const rejectFolders = path.join(global.exportedFilesDirectory, "rejected-uploads");
        if (!fs.existsSync(rejectFolders)) {
            createDirectoryIfNotExists(rejectFolders);
            await changeOwnerToPostgres(rejectFolders, true);
        }

        const rejectedFileName = `${Date.now()}form.csv`;
        const opfile = path.join(rejectFolders, rejectedFileName);

        const dataCsvWithoutSecondRow = dataCsvLines.slice(0, 1).concat(dataCsvLines.slice(2));
        const csvDataString = dataCsvWithoutSecondRow.filter((x) => x.replaceAll(",", "").trim() !== "").join("\n");
        fs.writeFileSync(csvFilePath, csvDataString, "utf8");

        const csvHeaderAsColumnName = dataCsvWithoutSecondRow[0];
        const csvHeaderAsColumnNameArr = csvHeaderAsColumnName.split(",");
        const csvTypeArr = dataCsvLines[1].replaceAll('"', "").replaceAll("i.e {ABC, XYZ}", " ").replaceAll("mandatory", "").split(",");
        const tempTableColumnsWithType = csvHeaderAsColumnNameArr.map((x) => `${x} text`);
        const typeColumns = csvTypeArr.map((type) => (type.includes("[]") ? type.split(" ")[0] : type)?.trim() || "");
        const concatenatedColumns = csvHeaderAsColumnNameArr.map((name, index) => `${name} ${typeColumns[index]}`);

        const [allColumnsAvailable] = await db.sequelize.selectQuery(`
            SELECT
                *
            FROM
                INFORMATION_SCHEMA.COLUMNS
            WHERE
                TABLE_NAME = '${tableName}'
                AND COLUMN_NAME IN ('${csvHeaderAsColumnNameArr.join("','")}')
            `);

        if (csvHeaderAsColumnNameArr.length > allColumnsAvailable.length) {
            res.status(500).send({ message: "Extra columns available in sheet" });
            return { noResponsetoClient: true };
        } else {
            res.status(200).send({ message: "Data import has been initialised we will notify you when it has been completed" });
        }

        publishMessage(global.eventNames.publisher, {
            id: req.user.email,
            type: global.eventNames.dataImportStart,
            pid: process.pid,
            message: global.dataImportStatus
        });

        publishMessage(global.eventNames.publisher, {
            id: req.user.email,
            type: global.eventNames.dataImportInProgress,
            pid: process.pid,
            message: JSON.stringify({
                displayMessage: "Update in progress",
                status: 200
            })
        });
    
        const [columnsData] = await db.sequelize.selectQuery(`
            SELECT
                array_agg(amc.id || '____' || amc.name) AS SOURCE_COLUMNS,
                AML.NAME AS SOURCE_TABLE,
                FA.NAME,
                FA.COLUMN_NAME,
                FA.IS_REQUIRED::BOOL,
                FA.IS_UNIQUE::BOOL,
                FA.PROPERTIES ->> 'selectType' AS SELECT_TYPE,
                FA.PROPERTIES ->> 'conditions' AS CONDITIONS,
                DA.TYPE,
                DA.INPUT_TYPE,
                FA.PROPERTIES ->> 'pickerType' AS PICKER
            FROM
                FORM_ATTRIBUTES AS FA
                INNER JOIN DEFAULT_ATTRIBUTES AS DA ON FA.DEFAULT_ATTRIBUTE_ID = DA.ID
                LEFT JOIN ALL_MASTERS_LIST AS AML ON FA.PROPERTIES ->> 'sourceTable' = AML.ID::TEXT
	            LEFT JOIN ALL_MASTER_COLUMNS AS AMC ON AMC.MASTER_ID = AML.ID
                -- AND FA.PROPERTIES ->> 'sourceColumn' = AMC.ID::TEXT
            WHERE
                FORM_ID = '${formId}'
                AND FA.IS_ACTIVE = '1'
                AND FA.COLUMN_NAME IN ('${csvHeaderAsColumnNameArr.join("', '")}')
            GROUP BY
                SOURCE_TABLE,
                FA.NAME,
                FA.COLUMN_NAME,
                FA.IS_REQUIRED::BOOL,
                FA.IS_UNIQUE::BOOL,
                SELECT_TYPE,
                CONDITIONS,
                DA.TYPE,
                DA.INPUT_TYPE,
                PICKER
        `);

        const {
            reqFields,
            uniqueKeys,
            uniqueKeysDP,
            dateFields,
            doubleField,
            singleEntry,
            entryWithoutCond,
            dropdownColumns,
            dropdownColumnsWithConditions
        } = columnsData.reduce((pre, ele) => {
            pre.colNames.push(ele.column_name);
            if (ele.conditions === "[]") pre.entryWithoutCond.push(`${ele.source_table}---${ele.column_name}`);
            if (ele.select_type === "single") pre.singleEntry.push(ele.column_name);
            if (ele.is_required) pre.reqFields.push(ele.column_name);
            if (ele.is_unique && ele.type != "double precision") pre.uniqueKeys.push(ele.column_name);
            if (ele.is_unique && ele.type == "double precision") pre.uniqueKeysDP.push(ele.column_name);
            if (ele.input_type === "date") pre.dateFields.push(ele.column_name);
            if (ele.type === "double precision") pre.doubleField.push(ele.column_name);
            if (ele.type.includes("[]")) pre.dropdownColumns.push(ele.column_name);
            if (ele.source_table && ele.conditions.length > 0 && ele.conditions !== "[]") {
                pre.dropdownColumnsWithConditions.push(ele);
            }
            return pre;
        }, {
            reqFields: [],
            uniqueKeys: [],
            uniqueKeysDP: [],
            dateFields: [],
            doubleField: [],
            colNames: [],
            singleEntry: [],
            entryWithoutCond: [],
            dropdownColumns: [],
            dropdownColumnsWithConditions: []
        });

        // Define the temporary table names
        temporaryTable = `temp_${tableName}`;
        temporartTextValueTable = `temp_text_${tableName}`;
        errorTable = `err_${tableName}`;

        const indexValue = [];

        if (reqFields.length) indexValue.push(reqFields);
        if (uniqueKeys.length) indexValue.push(uniqueKeys);
        if (singleEntry.length) indexValue.push(singleEntry);
        if (uniqueKeysDP.length) indexValue.push(uniqueKeysDP);

        const set = new Set(indexValue.flat());
        let queryString = `
            CREATE OR REPLACE FUNCTION import_form_response()
            RETURNS jsonb
			AS $BODY$
			DECLARE
                result jsonb;
				has_id_value_error boolean := false;
                id_value uuid;
				has_dropdown_value_error boolean := false;
				has_double_value_error boolean := false;
				has_date_value_error boolean := false;
                reject_records_count int := 0;
                ${dateFields.length > 0 ? `${dateFields.map((x) => `${x}_value  date`).join(";\n")};` : ""}
			BEGIN
                -- first run only text type values
                DROP TABLE IF EXISTS ${temporartTextValueTable};
                CREATE TABLE ${temporartTextValueTable} (${tempTableColumnsWithType});
                COPY ${temporartTextValueTable} FROM '${csvFilePath}' CSV HEADER;

                IF EXISTS (SELECT ID FROM ${temporartTextValueTable} WHERE ID IS NULL OR ID ILIKE '% %'LIMIT 1) THEN
                    has_id_value_error := true;
                END IF;

                IF NOT has_id_value_error THEN
                    BEGIN
                        SELECT ID::UUID INTO id_value FROM ${temporartTextValueTable};
                        EXCEPTION
                            WHEN OTHERS THEN
                                has_id_value_error := true;
                    END;
                END IF;

                ${dropdownColumns?.length > 0 ? `
                    IF NOT has_id_value_error THEN
                        IF EXISTS(SELECT ID FROM ${temporartTextValueTable} WHERE ${dropdownColumns.map((ele) => `(${ele} IS NOT NULL AND ${ele} NOT LIKE '{%}')`).join(" OR ")} limit 1) THEN
                            has_dropdown_value_error:= true;
                        END IF;
                    END IF;
                ` : ""}

                ${doubleField?.length > 0 ? `
                    IF NOT has_dropdown_value_error THEN
                        IF EXISTS(SELECT id FROM ${temporartTextValueTable} WHERE ${doubleField.map((ele) => `${ele} !~ '^[0-9]+(\.[0-9]+)?$'`).join(" OR ")} limit 1) THEN
                            has_double_value_error:= true;
                        END IF;
                    END IF;
                ` : ""}

                ${dateFields.length > 0 ? `
                    IF NOT has_double_value_error THEN
                        IF EXISTS(SELECT id FROM ${temporartTextValueTable} WHERE ${dateFields.map((ele) => `(${ele} IS NOT NULL AND ${ele} NOT LIKE '____-__-__T__:__:__.___Z')`).join(" OR ")} LIMIT 1) THEN
                                has_date_value_error:= true;
                            END IF;
                    END IF;
                ` : ""}

                IF NOT has_id_value_error AND NOT has_dropdown_value_error AND NOT has_double_value_error AND NOT has_date_value_error THEN
                    -- if text type values are okay then only proceed to further queries
                    DROP TABLE IF EXISTS ${temporaryTable};
                    CREATE TABLE ${temporaryTable} (${concatenatedColumns});
                    DROP TABLE IF EXISTS ${errorTable};
                    CREATE TABLE ${errorTable} AS SELECT *, ''::TEXT AS system_remark FROM ${temporaryTable};
                    COPY ${temporaryTable} FROM '${csvFilePath}' CSV HEADER;
        `;
            
        if (set.size > 0) {
            const indexArray = [...set];
            const { length } = indexArray;
            const loopCounts = Math.ceil(length / 30);
            let i = 0;
            while (i <= loopCounts) {
                const startIndex = i * 30;
                const endIndex = startIndex + 30;
                const indexArr = indexArray.slice(startIndex, endIndex);
                if (indexArr.length > 0) {
                    const indexName = `form_id_${indexArr[0].replace(" ", "")}`;
                    indexes.push(indexName);
                    const indexTemp = `\nCREATE INDEX ${indexName} ON ${temporaryTable}(id, ${indexArr.join(", ")});`;
                    queryString += indexTemp;
                }
                i += 1;
            }
        }
        indexes.push(`${errorTable}_system_remark_hash`);
        queryString += `
                    CREATE INDEX ${errorTable}_system_remark_hash ON ${errorTable} USING hash (system_remark);

                    -- check id columns first
                    INSERT INTO ${errorTable} SELECT *, 'ID does not exist' AS system_remark FROM  ${temporaryTable} WHERE id NOT IN (SELECT id FROM ${tableName}) OR id IS NULL;
                    DELETE FROM ${temporaryTable} WHERE id IS NULL OR id IN (SELECT id FROM ${errorTable});
                    ${
    [...uniqueKeys, ...uniqueKeysDP]?.length > 0
        ? `
                            INSERT INTO ${errorTable} SELECT *, 'Duplicate value found for ${uniqueKeys},${uniqueKeysDP} in uploaded sheet' AS system_remark FROM ${temporaryTable} AS T WHERE EXISTS (
                                SELECT id FROM ${temporaryTable} O WHERE T.ID <> O.ID AND (${[...uniqueKeys, ...uniqueKeysDP].map((x) => `t.${x} = o.${x}`).join(" OR ")})
                            );
                            DELETE FROM ${temporaryTable} WHERE id IN (SELECT id FROM ${errorTable} WHERE system_remark = 'Duplicate value found for ${uniqueKeys}, ${uniqueKeysDP} in uploaded sheet');
                            INSERT INTO ${errorTable} SELECT *, '${uniqueKeys},${uniqueKeysDP} already exists' AS system_remark FROM ${temporaryTable} AS T WHERE EXISTS (
                                SELECT id FROM ${tableName} O WHERE T.ID <> O.ID AND (${[...uniqueKeys, ...uniqueKeysDP].map((x) => `t.${x} = o.${x}`).join(" OR ")})
                            );
                            DELETE FROM ${temporaryTable} WHERE id IN (SELECT id FROM ${errorTable} WHERE system_remark = '${uniqueKeys},${uniqueKeysDP} already exists');
                        ` : ""
}
                    ${
    dateFields.length > 0
        ? `
                            INSERT INTO ${errorTable} SELECT *, 'Invalid timestamp format in ${dateFields}' AS system_remark FROM ${temporaryTable} WHERE ${dateFields.map((ele) => `(${ele} IS NOT NULL AND ${ele} NOT LIKE '____-__-__T__:__:__.___Z')`).join(" OR ")};
                            DELETE FROM ${temporaryTable} WHERE ${dateFields.map((ele) => `(${ele} IS NOT NULL AND ${ele} NOT LIKE '____-__-__T__:__:__.___Z')`).join(" OR ")};
                        ` : ""
}
                    ${
    singleEntry?.length > 0
        ? `
                            INSERT INTO ${errorTable} SELECT ${temporaryTable}.*, 'Enter single value in ${singleEntry}' AS system_remark FROM ${temporaryTable} WHERE ${singleEntry.map((ele) => `array_length(${ele}, 1) > 1`).join(" OR ")};
                            DELETE FROM ${temporaryTable} WHERE ${singleEntry.map((ele) => `array_length(${ele}, 1) > 1`).join(" OR ")};
                        ` : ""
}

                    ${entryWithoutCond?.length > 0
        ? entryWithoutCond.map((entry) => {
            const [tab, col] = entry.split("---");
            return `
                                INSERT INTO ${errorTable}
                                SELECT 
                                    *,
                                    'Incorrect id in ${col}' AS system_remark
                                FROM
                                    ${temporaryTable} AS t
                                WHERE 
                                    t.${col} IS NOT NULL 
                                    AND EXISTS (
                                        SELECT 1 FROM UNNEST(t.${col}) AS elem where elem NOT IN (SELECT id FROM ${tab}${tab === "serial_numbers" ? "(null, null)" : ""})
                                        );
                                DELETE FROM ${temporaryTable} WHERE id IN (SELECT id FROM ${errorTable} WHERE system_remark = 'Incorrect id in ${col}');
                            `;
        }).join("\n") : ""
}

                    ${dropdownColumnsWithConditions?.length > 0
        ? dropdownColumnsWithConditions.map((ele) => {
            const stname = ele.source_table;
            ele.conditions = JSON.parse(ele.conditions);
            const dropDownFieldCond = ele.conditions.map((con) => {
                const [scol] = ele.source_columns.filter((x) => x.startsWith(con.column));
                return `${ele.source_table}.${scol.split("____")[1]} ${operators[con.operation]} '${con.value}'`;
            }).join(" AND ");

            return `
                                INSERT INTO 
                                    ${errorTable}
                                SELECT 
                                    ${temporaryTable}.*, 
                                    '${ele.column_name} value incorrect' AS system_remark
                                FROM 
                                    ${temporaryTable}
                                WHERE
                                    ${temporaryTable}.${ele.column_name} IS NOT NULL
                                    AND NOT EXISTS (
                                        SELECT 
                                            1
                                        FROM
                                            unnest(${temporaryTable}.${ele.column_name}) AS ref_id
                                            JOIN ${stname} ON ref_id = ${stname}.id
                                        WHERE ${dropDownFieldCond}
                                    );
                                DELETE FROM ${temporaryTable} WHERE id IN (SELECT id FROM ${errorTable} WHERE system_remark = '${ele.column_name} value incorrect');
                            `;
        }).join("\n") : ""}

                    IF EXISTS (SELECT id AS COUNT FROM ${temporaryTable} limit 1) THEN
                        UPDATE ${tableName} AS t SET
                        ${csvHeaderAsColumnNameArr.filter((x) => x !== "id").map((x) => `${x} = temp.${x}${x === "is_active" ? "::form_responses_is_active" : ""}`).join(", ")}, source='web', counter=t.counter + 1, updated_by='${req.user.userId}', updated_at=current_timestamp
                        FROM ${temporaryTable} AS temp WHERE t.id = temp.id;
                    END IF;
                    
                    IF EXISTS (SELECT id FROM ${errorTable} limit 1) THEN
                        COPY ${errorTable} TO '${opfile}' WITH CSV HEADER;
                        SELECT COUNT(*) INTO reject_records_count FROM ${errorTable};
                    END IF;

                    
                END IF;

                DROP TABLE IF EXISTS ${temporartTextValueTable};
                ${dropAllIndexQuery(indexes)};
                DROP TABLE IF EXISTS ${temporaryTable};
                DROP TABLE IF EXISTS ${errorTable};
                
                result := jsonb_build_object(
                    'has_id_value_error', has_id_value_error,
                    'has_dropdown_value_error', has_dropdown_value_error,
                    'has_double_value_error', has_double_value_error,
                    'has_date_value_error', has_date_value_error,
                    'reject_records_count', reject_records_count
                );
                
                RETURN result;
            END;
			$BODY$ LANGUAGE plpgsql;
        `;

        // -- check the error table count if it has some value then notify with error sheat else notify with success message

        // -- we can put this above query into plpgsql procedure and we can call the procedure and we can delete that procedure later on
        await db.sequelize.query(queryString);
        const [[{ import_form_response: importFormResponse }]] = await db.sequelize.query("select * from import_form_response();");
        // console.log("import_form_response", importFormResponse);
        const responseEntriesArr = Object.entries(importFormResponse);
        const indexOfhasError = responseEntriesArr.findIndex(([key, value]) => key !== "reject_records_count" && value);
        messageForClient.status = indexOfhasError > -1 ? 400 : 200;
        const errorMessage = {
            has_id_value_error: "Error in ID column",
            has_date_value_error: "Error in date type field values",
            has_double_value_error: "Error in double precission type field values",
            has_dropdown_value_error: "Error in dropdown type field values"
        };
        if (indexOfhasError > -1) {
            messageForClient.message = errorMessage[responseEntriesArr[indexOfhasError][0]];
            global.dataImportStatus = {};
        } else {
            const rejectRecordMessage = importFormResponse.reject_records_count ? `, ${importFormResponse.reject_records_count} record(s) has been rejected due to error` : "";
            messageForClient.message = `Data has been updated successfully ${rejectRecordMessage}`;
            if (importFormResponse.reject_records_count) {
                messageForClient.rejectedFiles = rejectedFileName;
                global.dataImportStatus.rejectedFiles = rejectedFileName;
            }
        }
    } catch (error) {
        console.log(
            `> [genus-wfm] | [${new Date().toLocaleString()}] | [import-excel.controller.js] | [#818] | [error] | `,
            Object.prototype.toString.call(error) === "[object Uint8Array]" ? JSON.stringify(error) : error
        );
        messageForClient.hasInternalError = true;
        messageForClient.status = 500;
        // on the nature of error message we have to notify the client
        messageForClient.message = "Something went wrong, Data import failed!";
    } finally {
        if (messageForClient.hasInternalError) {
            global.dataImportStatus = {};
        } else {
            global.dataImportStatus.completed = Date.now();
        }
        db.sequelize.query(`
            ${temporartTextValueTable ? `DROP TABLE IF EXISTS ${temporartTextValueTable}` : ""};
            ${indexes.length ? dropAllIndexQuery(indexes) : ""};
            ${temporaryTable ? `DROP TABLE IF EXISTS ${temporaryTable}` : ""};
            ${errorTable ? `DROP TABLE IF EXISTS ${errorTable}` : ""};
        `);
        fs.unlinkSync(csvFilePath);
        delete global.dataImportStatus.displayMessage;
    }
    // publish message to send response at client end
    publishMessage(global.eventNames.publisher, {
        id: req.user.email,
        type: global.eventNames.dataImportEnd,
        pid: process.pid,
        message: JSON.stringify(messageForClient)
    });

    // publish message to update the values in all existing threads
    publishMessage(global.eventNames.publisher, {
        id: req.user.email,
        type: global.eventNames.dataImportStart,
        pid: process.pid,
        message: global.dataImportStatus
    });
    return { noResponsetoClient: true };
};

const importFormResponses = async (req, res) => {
    if (global.dataImportStatus?.start && (!global.dataImportStatus?.completed || global.dataImportStatus?.rejectedFiles)) {
        res.status(400).send({
            message:
                "Import is already in progress, please wait till last import gets completed"
        });
        return { noResponsetoClient: true };
    }

    const indexes = [];
    function dropIndexQuery() { return indexes.map((x) => `DROP INDEX IF EXISTS ${x}`).join(";"); }

    global.dataImportStatus.user = req.user.email;
    global.dataImportStatus.start = Date.now();
    global.dataImportStatus.displayMessage = "Import in progress";

    try {
        // upload form
        const { db } = new Forms();
        const { formId } = req.body;
        const { tableName } = await getFormByCondition({ id: formId });

        if (!req.files || req.files.length === 0) {
            return { message: "No file uploaded." };
        }

        const [[{ isPublished }]] = await db.sequelize.selectQuery(
            `SELECT is_published AS isPublished FROM forms where id = '${formId}'`
        );
        if (isPublished === "false") return { message: "Form not published." };

        res.status(200).send({
            message:
                "Data import has been initialised we will notify you when it has been completed"
        });

        publishMessage(global.eventNames.publisher, {
            id: req.user.email,
            type: global.eventNames.dataImportStart,
            pid: process.pid,
            message: global.dataImportStatus
        });

        publishMessage(global.eventNames.publisher, {
            id: req.user.email,
            type: global.eventNames.dataImportInProgress,
            pid: process.pid,
            message: JSON.stringify({
                displayMessage: "Import in progress",
                status: 200
            })
        });

        createDirectoryIfNotExists(global.exportedFilesDirectory);
        const rejectFolders = path.join(
            global.exportedFilesDirectory,
            "rejected-uploads"
        );
        if (!fs.existsSync(rejectFolders)) {
            createDirectoryIfNotExists(rejectFolders);
            await changeOwnerToPostgres(rejectFolders, true);
        }

        const rejectedFileName = `${Date.now()}form.csv`;
        const opfile = path.join(rejectFolders, rejectedFileName);

        const query = `select fa.name, fa.column_name, fa.is_required, fa.properties, fa.is_unique, fa.properties ->> 'selectType' AS "selectType",
            da.type, da.input_type, fa.properties->> 'pickerType' as picker from form_attributes as fa
            inner join default_attributes as da on fa.default_attribute_id = da.id
            where form_id = '${formId}' AND fa.is_active='1'
        `;

        const columnsData = await db.sequelize.selectQuery(query);

        // get required fields
        const reqFields = columnsData[0]
            .filter((ele) => ele.is_required == "true")
            .map((ele) => ele.column_name);

        // get unique value fields
        const uniqueKeys = columnsData[0]
            .filter((ele) => ele.is_unique == "true" && ele.type != "double precision")
            .map((ele) => ele.column_name);

        const uniqueKeysDP = columnsData[0]
            .filter((ele) => ele.is_unique == "true" && ele.type == "double precision")
            .map((ele) => ele.column_name);
            
        const dateFields = columnsData[0].filter((ele) => ele.input_type == "date").map((el) => el.column_name);

        const doubleField = columnsData[0]
            .filter((ele) => ele.type == "double precision")
            .map((ele) => ele.column_name);

        // get all columns name
        const colNames = columnsData[0].map((ele) => ele.column_name);
        const singleEntry = []; // array fields with single selection
        const arrayVal = []; // all the array fields
        const arr = [];

        const [columnWithConditions] = await db.sequelize.selectQuery(`
            select
                array_agg(amc.id || '____' || amc.name) AS source_columns,
                fa.column_name as forms_column,
                aml.name as source_table,
                fa.properties ->> 'conditions' AS conditions
            from
                form_attributes as fa
                inner join all_masters_list as aml on fa.properties ->> 'sourceTable' = aml.id::text
                inner join all_master_columns as amc on amc.master_id = aml.id
                inner join default_attributes as da on fa.default_attribute_id = da.id
            where
                form_id = '${formId}' AND fa.is_active='1'
                and (fa.properties ->> 'sourceTable' is not null or fa.properties ->> 'sourceTable' <> '')
            group by 
                fa.column_name, aml.name, fa.properties ->> 'conditions';`);

        const entryWithoutCond = columnWithConditions
            .filter((ele) => ele.conditions === "[]") // get only empty conditions
            .map((ele) => `${ele.source_table}---${ele.forms_column}`);

        columnsData[0].forEach((ele) => {
            let con;
            if (ele.properties.selectType == "single") singleEntry.push(ele.column_name);
            if (ele.properties.selectType) arrayVal.push(ele.column_name);
            if (ele.properties.sourceTable && ele.properties.conditions.length > 0) {
                con = ele.properties.conditions;
                const conditionObj = {
                    colName: ele.column_name,
                    sourceTab: ele.properties.sourceTable,
                    sourceCol: ele.properties.sourceColumn,
                    type: ele.properties.selectType,
                    chkCondition: con
                };
                arr.push(conditionObj);
            }
        });

        const uploadedFile = req.files.excelFile;
        const workbook = XLSX.read(uploadedFile.data, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const dataCsv = XLSX.utils.sheet_to_csv(worksheet, {
            defval: null
        });

        const dataCsvLines = dataCsv.split("\n");
        const dataCsvWithoutSecondRow = dataCsvLines
            .slice(0, 1)
            .concat(dataCsvLines.slice(2));
        const firstRow = dataCsvLines[0].split(",");
        const secondRow = dataCsvLines[1].split(",");

        const typeCol = secondRow.map((type) => {
            let firstWord;
            // Split the string and extract the first word
            if (type.includes("uuid[]") || type.includes("text[]") || type.includes("double precision")) {
                if (type.includes("text[]")) firstWord = "text[]";
                if (type.includes("uuid[]")) firstWord = "uuid[]";
                if (type.includes("double precision")) firstWord = "double precision";
            } else {
                firstWord = type.split(" ")[0].trim();
            }

            return firstWord;
        });

        const typeColumns = typeCol.filter((ele) => ele !== "");

        const statment = [];
        const concatenatedColumns = firstRow.map((name, index) => {
            if (typeColumns[index]?.includes("uuid[]") || typeColumns[index]?.includes("text[]")) {
                statment.push(name);
            }
            return `${name} ${typeColumns[index]}`;
        });

        const nnn = firstRow.map((ele) => {
            if (ele == "id") {
                return `${ele} uuid`;
            } else {
                return `${ele} text`;
            }
        });

        const fileName = new Date().getTime().toString();

        const csvFilePath = path.join(
            global.exportedFilesDirectory,
            `${fileName}.csv`
        );

        const csvDataString = dataCsvWithoutSecondRow.join("\n");

        fs.writeFileSync(csvFilePath, csvDataString, "utf8");

        // Define the temporary table names
        const tableNameTemp = `temp_${tableName}`;
        const errTableTemp = `err_${tableName}`;

        const creteTempTable = `CREATE TABLE temp_1 (${nnn});`; // trial

        const createTableQuery = ` CREATE TABLE ${tableNameTemp} (${concatenatedColumns});`;

        const createErrTableQuery = `CREATE TABLE ${errTableTemp} AS SELECT * FROM ${tableNameTemp};`;
        const altErrTable = `ALTER TABLE ${errTableTemp} ADD COLUMN IF NOT EXISTS system_remark text;`;

        const copyQuery = `COPY temp_1 FROM '${csvFilePath}' DELIMITER ',' CSV HEADER;`;

        const copyQuery1 = `COPY ${tableNameTemp} FROM '${csvFilePath}' DELIMITER ',' CSV HEADER;`;

        const indexValue = [];

        if (reqFields.length > 0) indexValue.push(reqFields);
        if (uniqueKeys.length > 0) indexValue.push(uniqueKeys);
        if (singleEntry.length > 0) indexValue.push(singleEntry);

        const set = new Set(indexValue.flat());
        let str1 = createTableQuery + createErrTableQuery + altErrTable + copyQuery1;

        if (set.size > 0) {
            const indexArray = [...set];
            const { length } = indexArray;
            const loopCounts = Math.ceil(length / 30);
            let i = 0;
            while (i <= loopCounts) {
                const startIndex = i * 30;
                const endIndex = startIndex + 30;
                const arr = indexArray.slice(startIndex, endIndex);
                if (arr.length > 0) {
                    const indexName = `form_id_${arr[0].replace(" ", "")}`;
                    indexes.push(indexName);
                    const indexTemp = `CREATE INDEX ${indexName} ON ${tableNameTemp}(id, ${arr.join(", ")});`;
                    str1 += indexTemp;
                }
                i += 1;
            }
        }
        
        const str = creteTempTable + copyQuery;

        const idexist = `INSERT INTO ${errTableTemp}
        SELECT *, 'id does not exist' AS system_remark
        FROM ${tableNameTemp} WHERE id NOT IN (SELECT id FROM ${tableName}) AND id IS NOT NULL;`;

        const idexistDel = `DELETE FROM ${tableNameTemp} WHERE id NOT IN (SELECT id FROM ${tableName}) AND id IS NOT NULL;`;
        str1 += idexist + idexistDel;

        if (reqFields.length > 0) {
            // mandatory fields check
            const whereClause1 = reqFields
                .map((ele) => `t.${ele} IS NULL`)
                .join(" OR ");

            const manData = `INSERT INTO ${errTableTemp} 
                SELECT *, 'Mandatory fields ${reqFields} empty' AS system_remark 
                FROM ${tableNameTemp} AS t
                WHERE ${whereClause1};`;

            const delManData = `DELETE FROM ${tableNameTemp} AS t
                    WHERE ${whereClause1};`;

            str1 += manData + delManData;
        }

        if (uniqueKeys.length > 0 || uniqueKeysDP.length > 0) {
            // to check the uniqueness for unique key

            let conditions = false;
            let joining = false;

            if (uniqueKeys.length) {
                conditions = uniqueKeys.map((ele) => `t.${ele} = p.${ele}`).join(" OR ");
                joining = conditions;
            }

            if (uniqueKeysDP.length) {
                const conditionsDP = uniqueKeysDP.map((ele) => `(t.${ele})::text = p.${ele}`).join(" OR ");
                const conditionsDP1 = uniqueKeysDP.map((ele) => `t.${ele} = p.${ele}`).join(" OR ");

                conditions = conditions ? `${conditions} OR ${conditionsDP1}` : conditionsDP1;
                joining = joining ? `${joining} OR ${conditionsDP}` : conditionsDP;
            }
           
            const uniqueSheet = `INSERT INTO ${errTableTemp}
                SELECT t.*, 'Duplicate value found for ${uniqueKeys}, ${uniqueKeysDP} in uploaded sheet' AS system_remark
                FROM ${tableNameTemp} AS t
                WHERE (SELECT COUNT(*) FROM ${tableNameTemp} AS p WHERE ${conditions})>1;`;
            // EXISTS (SELECT 1 FROM ${tableNameTemp} AS p WHERE (${conditions}) AND (${whereClause1}));`;

            const uniqueSheetDel = `DELETE FROM ${tableNameTemp} AS t
                WHERE (SELECT COUNT(*) FROM ${tableNameTemp} AS p WHERE ${conditions})>1;`;

            const uniqueData = `INSERT INTO ${errTableTemp}
            SELECT t.*, '${uniqueKeys}, ${uniqueKeysDP} already exists' AS system_remark
            FROM ${tableNameTemp} AS t 
            WHERE EXISTS (
                SELECT 1
                FROM ${tableName} AS p
                WHERE (${joining}) AND t.id IS NULL);`;

            const uniqueDataDel = `DELETE FROM ${tableNameTemp} AS t
                WHERE EXISTS (SELECT 1 FROM ${tableName} AS p WHERE (${joining}) AND t.id IS NULL);`;

            // update
            const uniqueDataid = `INSERT INTO ${errTableTemp}
                SELECT t.*, '${uniqueKeys}, ${uniqueKeysDP} already exists  in system' AS system_remark
                FROM ${tableNameTemp} AS t
                INNER JOIN ${tableName} AS p ON (${joining}) WHERE t.id IS NOT NULL AND t.id<>p.id;`;

            const uniqueDataDelid = `DELETE FROM ${tableNameTemp} AS t
                WHERE id IN ( SELECT t.id
                    FROM ${tableNameTemp} AS t
                    INNER JOIN ${tableName} AS p 
                        ON (${joining}) AND t.id IS NOT NULL AND t.id <> p.id);`;

            str1
                += uniqueSheet + uniqueSheetDel + uniqueData + uniqueDataDel + uniqueDataid + uniqueDataDelid;
        }

        if (dateFields.length > 0) {

            const date1 = dateFields.map(
                (ele) => `(${ele} IS NOT NULL AND ${ele} NOT LIKE '____-__-__T__:__:__.___Z')`
            ).join(" OR ");
                        
            const dateCheck = `INSERT INTO ${errTableTemp} 
            SELECT *, 'Invalid timestamp format in ${dateFields}' AS system_remark
            FROM ${tableNameTemp}
            WHERE ${date1};`;

            const dateCheckDel = `DELETE FROM ${tableNameTemp}
            WHERE ${date1};`;

            str1 += dateCheck + dateCheckDel;
        }

        if (singleEntry.length > 0) {
            // check if entered only one value in single value for text[] or uuid[] fields

            const conditions1 = singleEntry
                .map((ele) => `array_length(${ele}, 1) > 1`)
                .join(" OR ");

            const singleVal = `INSERT INTO ${errTableTemp}
                SELECT ${tableNameTemp}.*, 'Enter single value in ${singleEntry}' AS system_remark
                FROM ${tableNameTemp} WHERE ${conditions1};`;

            const delSingleVal = `DELETE FROM ${tableNameTemp} WHERE ${conditions1};`;

            str1 += singleVal + delSingleVal;
        }

        await new Promise((resolve, reject) => {
            db.sequelize.transaction(async (transaction) => {
                try {
                    await db.sequelize.query(`${str}`, { transaction });

                    let arvalue = 0;
                    if (statment.length > 0) {

                        const ed = statment.map(
                            (ele) => `${ele} :: text NOT LIKE '{%' OR ${ele} :: text NOT LIKE '%}'`
                        );
                        const joinedd = ed.join(" OR ");

                        const [[{ count: arrVal }]] = await db.sequelize.selectQuery(
                            `SELECT count(*) FROM temp_1 WHERE ${joinedd}`,
                            { transaction }
                        );
                        arvalue = arrVal;
                    }

                    if (arvalue < 1) {
                        let checkNUmberValidation = false;
                        if (doubleField.length > 0) {
                            const checkNumVal = doubleField.map((ele) => `${ele} !~ '^[0-9]+(\.[0-9]+)?$'`).join(" OR ");
                             
                            const [[{ count: checkNumValCount }]] = await db.sequelize.selectQuery(`SELECT COUNT(*) FROM temp_1 WHERE ${checkNumVal};`, { transaction });
                            if (checkNumValCount > 0) checkNUmberValidation = true;
                        }

                        if (!checkNUmberValidation) {
                            await db.sequelize.query(`${str1}`, { transaction });

                            if (entryWithoutCond.length > 0) {
                                await Promise.all(entryWithoutCond.map(async (entry) => {
                                    const tab = entry.split("---");
                        
                                    await db.sequelize.query(`
                                        INSERT INTO ${errTableTemp}
                                        SELECT *, 'Incorrect id in ${tab[1]}' AS system_remark
                                        FROM ${tableNameTemp} AS t
                                        WHERE t.${tab[1]} IS NOT NULL AND EXISTS (SELECT 1 FROM UNNEST(t.${tab[1]}) AS elem where elem NOT IN (SELECT id FROM ${tab[0]}) )
                                    `, { transaction });
                            
                                    await db.sequelize.query(`
                                        DELETE FROM ${tableNameTemp} AS t WHERE t.${tab[1]} IS NOT NULL AND EXISTS(
                                        SELECT 1
                                        FROM UNNEST(t.${tab[1]}) AS div_id
                                        WHERE div_id NOT IN (SELECT id FROM ${tab[0]})
                                    );`, { transaction });
                                }));
                            }
                       
                            let i = 0;

                            if (arr.length > 0) {
                                while (i < arr.length) {
                                    const arrToRun4 = columnWithConditions.slice(
                                        i,
                                        i + 4
                                    );
                                    // eslint-disable-next-line no-await-in-loop, no-loop-func
                                    await Promise.all(
                                        arrToRun4.map(async (ele) => {
                                            let str11 = "";
                                            const stname = ele.source_table;
                                            ele.colName = ele.forms_column;
                                            ele.conditions = JSON.parse(
                                                ele.conditions
                                            );
                                            ele.conditions.forEach((con) => {
                                                if (str11 === "") str11 += " WHERE ";
                                                const [scol] = ele.source_columns.filter((x) => x.startsWith(con.column));
                                                str11 += `${ele.source_table}.${
                                                    scol.split("____")[1]
                                                } ${operators[con.operation]} '${
                                                    con.value
                                                }' AND `;
                                            });
                                            str11 = str11.slice(0, -5);

                                            await db.sequelize.query(`
                                        INSERT INTO 
                                                ${errTableTemp} SELECT ${tableNameTemp}.*, 
                                                '${ele.colName} value incorrect' AS system_remark
                                            FROM 
                                                ${tableNameTemp}
                                            WHERE
                                                ${tableNameTemp}.${ele.colName} IS NOT NULL
                                                    AND 
                                                NOT EXISTS (
                                                    SELECT 1 FROM unnest(${tableNameTemp}.${ele.colName}) AS circle_id JOIN ${stname} ON circle_id = ${stname}.id ${str11}
                                                );
                                            
                                            DELETE FROM 
                                                ${tableNameTemp}
                                            WHERE 
                                                ${tableNameTemp}.${ele.colName} IS NOT NULL 
                                                AND NOT EXISTS (
                                                    SELECT 1 FROM unnest(${tableNameTemp}.${ele.colName}) AS circle_id JOIN ${stname} ON circle_id = ${stname}.id ${str11}
                                                )
                                    `, { transaction });
                                        })
                                    );
                                    i += 4;
                                }
                            }

                            // getting count of columns, if there is any or not in table
                            const [[{ count: tempCount }]] = await db.sequelize.selectQuery(
                                `SELECT COUNT(*) FROM ${tableNameTemp};`,
                                { transaction }
                            );
                            if (tempCount > 0) {
                                const [[{ count }]] = await db.sequelize.selectQuery(
                                    `SELECT COUNT(*):: integer AS count FROM ${tableName};`,
                                    { transaction }
                                );

                                if (count == 0) {
                                    await db.sequelize.query(
                                        `INSERT INTO ${tableName} (id) VALUES ('5196290f-a641-4674-86d4-23c939cca436')`,
                                        { transaction }
                                    );
                                }

                                const [[{ row_to_json: rowToJson }]] = await db.sequelize.selectQuery(
                                    `select row_to_json(gle) from ${tableName} gle limit 1;`,
                                    { transaction }
                                );

                                if (count == 0) {
                                    await db.sequelize.query(
                                        `delete from ${tableName} where id = '5196290f-a641-4674-86d4-23c939cca436'`,
                                        { transaction }
                                    );
                                }

                                colNames.unshift("id");
                                // let keyForOriginalTable;
                                const keyForOriginalTable = Object.keys(rowToJson)
                                    .map((x) => (colNames.includes(x)
                                        ? x
                                        : `${
                                        // eslint-disable-next-line no-nested-ternary
                                            x === "is_active"
                                                ? "'1'" // eslint-disable-next-line no-nested-ternary
                                                : [
                                                    "created_at",
                                                    "updated_at",
                                                    "submitted_at"
                                                ].includes(x)
                                                    ? "current_timestamp"
                                                    : ["updated_by"].includes(x)
                                                        ? `'${req.user.userId}'`
                                                        : null
                                        } AS ${x}`))
                                    .join(", ");

                                colNames.shift();

                                const updatecon = colNames.map(
                                    (ele) => `"${ele}" = excluded.${ele} `
                                );

                                const updateRecWithId = `INSERT INTO ${tableName} SELECT ${keyForOriginalTable} FROM ${tableNameTemp} WHERE ${tableNameTemp}.id IS NOT NULL ON CONFLICT (id) DO UPDATE SET ${updatecon};`;

                                const deleteRecWithId = `DELETE FROM ${tableNameTemp} WHERE id IS NOT NULL;`;

                                await db.sequelize.query(
                                    `${updateRecWithId} ${deleteRecWithId}`,
                                    { transaction }
                                );

                                await db.sequelize.query(
                                    `UPDATE ${tableNameTemp} SET id = uuid_generate_v4() WHERE id IS NULL`,
                                    { transaction }
                                );

                                const keyForOriginalTable1 = Object.keys(rowToJson)
                                // eslint-disable-next-line no-nested-ternary
                                    .map((x) => (x === "id"
                                        ? `uuid_generate_v4() AS ${x}`
                                        : colNames.includes(x)
                                            ? x
                                            : `${
                                            // eslint-disable-next-line no-nested-ternary
                                                x === "is_active"
                                                    ? "'1'" // eslint-disable-next-line no-nested-ternary
                                                    : [
                                                        "created_at",
                                                        "updated_at",
                                                        "submitted_at"
                                                    ].includes(x)
                                                        ? "current_timestamp"
                                                        : [
                                                            "created_by",
                                                            "updated_by"
                                                        ].includes(x)
                                                            ? `'${req.user.userId}'`
                                                            : null
                                            } AS ${x}`))
                                    .join(", ");

                                const addRemRec = `INSERT INTO ${tableName} SELECT ${keyForOriginalTable1}  FROM ${tableNameTemp}`;

                                await db.sequelize.query(addRemRec, {
                                    transaction
                                });

                                await db.sequelize.query(
                                    `COPY ${errTableTemp} TO '${opfile}' WITH CSV HEADER`,
                                    { transaction }
                                );

                                const [[{ count: rejectCounts }]] = await db.sequelize.selectQuery(
                                    `select count(*)::integer AS count from ${errTableTemp}`,
                                    { transaction }
                                );

                                if (rejectCounts === 0 && fs.existsSync(opfile)) {
                                    spawn("sudo", ["rm", opfile]);
                                    global.dataImportStatus = {};
                                } else {
                                    global.dataImportStatus.rejectedFiles = rejectedFileName;
                                }

                                publishMessage(
                                    global.eventNames.publisher,
                                    {
                                        id: req.user.email,
                                        type: global.eventNames.dataImportEnd,
                                        pid: process.pid,
                                        message: JSON.stringify({
                                            user: req.user.email,
                                            message: `Data Imported successfully ${
                                                rejectCounts > 0
                                                    ? `, ${rejectCounts} rejected due to error`
                                                    : ""
                                            }`,
                                            status: 200,
                                            ...(rejectCounts > 0 && {
                                                rejectedFiles: rejectedFileName
                                            })
                                        })
                                    }
                                );

                                await db.sequelize.query(
                                    `DROP TABLE IF EXISTS temp_1; ${dropIndexQuery()}; DROP TABLE IF EXISTS ${tableNameTemp}; DROP TABLE IF EXISTS ${errTableTemp};`,
                                    { transaction }
                                );
                            } else {
                                await db.sequelize.query(
                                    `COPY ${errTableTemp} TO '${opfile}' WITH CSV HEADER`,
                                    { transaction }
                                );
                                const [[{ count: rejectCounts }]] = await db.sequelize.selectQuery(
                                    `select count(*)::integer AS count from ${errTableTemp}`,
                                    { transaction }
                                );

                                publishMessage(
                                    global.eventNames.publisher,
                                    {
                                        id: req.user.email,
                                        type: global.eventNames.dataImportEnd,
                                        pid: process.pid,
                                        message: JSON.stringify({
                                            user: req.user.email,
                                            message: `Nothing to upload ${
                                                rejectCounts === 0
                                                    ? ""
                                                    : `, ${rejectCounts} rejected due to error`
                                            }`,
                                            status: 200,
                                            ...(rejectCounts > 0 && {
                                                rejectedFiles: rejectedFileName
                                            })
                                        })
                                    }
                                );

                                await db.sequelize.query(
                                    `DROP TABLE IF EXISTS temp_1; ${dropIndexQuery()}; DROP TABLE IF EXISTS ${tableNameTemp}; DROP TABLE IF EXISTS ${errTableTemp};`,
                                    { transaction }
                                );

                                if (rejectCounts === 0 && fs.existsSync(opfile)) {
                                    spawn("sudo", ["rm", opfile]);
                                    global.dataImportStatus = {};
                                } else {
                                    global.dataImportStatus.rejectedFiles = rejectedFileName;
                                }
                            }
                        } else {
                            global.dataImportStatus = {};
    
                            publishMessage(global.eventNames.publisher, {
                                id: req.user.email,
                                type: global.eventNames.dataImportEnd,
                                pid: process.pid,
                                message: JSON.stringify({
                                    user: req.user.email,
                                    message:
                                        "Enter only numeric or decimal value in fields having type double precision",
                                    status: 500
                                })
                            });

                            await db.sequelize.query(
                                "DROP TABLE IF EXISTS temp_1",
                                { transaction }
                            );
                        }
                    } else {
                        global.dataImportStatus = {};

                        publishMessage(global.eventNames.publisher, {
                            id: req.user.email,
                            type: global.eventNames.dataImportEnd,
                            pid: process.pid,
                            message: JSON.stringify({
                                user: req.user.email,
                                message:
                                    "{ } missing in uuid[] or text[] type column",
                                status: 500
                            })
                        });

                        await db.sequelize.query(
                            "DROP TABLE IF EXISTS temp_1",
                            { transaction }
                        );
                    }
                    resolve();
                } catch (error) {
                    global.dataImportStatus = {};
                    console.log(
                        `> [genus-wfm] | [${new Date().toLocaleString()}] | [import-excel.controller.js] | [#920] | [error] | `,
                        error
                    );
                    publishMessage(global.eventNames.publisher, {
                        id: req.user.email,
                        type: global.eventNames.dataImportEnd,
                        pid: process.pid,
                        message: JSON.stringify({
                            user: req.user.email,
                            message: "Data Import Failed.",
                            status: 500
                        })
                    });
                    db.sequelize.query(
                        `DROP TABLE IF EXISTS temp_1; ${dropIndexQuery()}; DROP TABLE IF EXISTS ${tableNameTemp}; DROP TABLE IF EXISTS ${errTableTemp};`,
                        { transaction }
                    ).catch();
                    await db.sequelize.query(
                        `DROP TABLE IF EXISTS ${tableNameTemp}; DROP TABLE IF EXISTS ${errTableTemp};`,
                        { transaction }
                    ).catch();
                    reject(error);
                } finally {
                    global.dataImportStatus.completed = Date.now();
                    global.dataImportStatus.displayMessage = null;
                    fs.unlinkSync(csvFilePath);
                }
            });
        });
        publishMessage(global.eventNames.publisher, {
            id: req.user.email,
            type: global.eventNames.dataImportStart,
            pid: process.pid,
            message: global.dataImportStatus
        });

        return { noResponsetoClient: true };
    } catch (error) {
        global.dataImportStatus = {};
        publishMessage(global.eventNames.publisher, {
            id: req.user.email,
            type: global.eventNames.dataImportEnd,
            pid: process.pid,
            message: JSON.stringify({
                user: req.user.email,
                message: "Data Import Failed.",
                status: 500
            })
        });
        publishMessage(global.eventNames.publisher, {
            id: req.user.email,
            type: global.eventNames.dataImportStart,
            pid: process.pid,
            message: global.dataImportStatus
        });
        console.log(
            `> [genus-wfm] | [${new Date().toLocaleString()}] | [import-excel.controller.js] | [#818] | [error] | `,
            Object.prototype.toString.call(error) === "[object Uint8Array]" ? JSON.stringify(error) : error
        );
        return { noResponsetoClient: true, message: "Data import failed" };
    }
};

const importStaticMasters = async (req, res) => {
    // uploadGAA
    const { db } = new Forms();
    const { tableName, levelId } = req.body;

    const uploadedFile = req.files.excelFile;

    createDirectoryIfNotExists(global.exportedFilesDirectory);
    const rejectFolders = path.join(
        global.exportedFilesDirectory,
        "rejected-uploads"
    );
    if (!fs.existsSync(rejectFolders)) {
        createDirectoryIfNotExists(rejectFolders);
        await changeOwnerToPostgres(rejectFolders, true);
    }

    const rejectedFileName = `${Date.now()}output.csv`;
    const opfile = path.join(
        global.exportedFilesDirectory,
        "/rejected-uploads",
        rejectedFileName
    );
    const xlFilePath = path.join(
        global.exportedFilesDirectory,
        `copy${uploadedFile.name}`
    );

    fs.writeFileSync(xlFilePath, uploadedFile.data);

    const xlFilePathWorkbook = XLSX.readFile(xlFilePath);
    const xlFilePathsheetName = xlFilePathWorkbook.SheetNames[0];
    const xlFilePathworksheet = xlFilePathWorkbook.Sheets[xlFilePathsheetName];

    let csvFilePath;

    return new Promise((resolve, reject) => {
        db.sequelize.transaction(async (t) => {
            try {
                const dataCsv = XLSX.utils.sheet_to_csv(xlFilePathworksheet, {
                    defval: null,
                    FS: ",",
                    blankrows: false
                });
                let sqlItems = "";

                const dataCsvLines = dataCsv.split("\n");
                const dataCsvWithoutSecondRow = dataCsvLines
                    .slice(0, 1)
                    .concat(dataCsvLines.slice(2));
                // const firstRow = dataCsvLines[0].split(",");
                const fileName = new Date().getTime().toString();
                csvFilePath = path.join(
                    global.exportedFilesDirectory,
                    `${fileName}.csv`
                );

                const csvDataString = dataCsvWithoutSecondRow.join("\n");
                fs.writeFileSync(csvFilePath, csvDataString, "utf8"); // creating csv file
                const tableNameTemp = `temp_${tables[tableName]}`;
                const sql = staticMasterDataSql(tables[tableName]);
                const [queryData] = await db.sequelize.selectQuery(sql, {
                    transaction: t
                });

                const [
                    [{ rank, level_type: levelType, project_id: projectId }]
                ] = await db.sequelize.selectQuery(
                    `SELECT rank, level_type, project_id FROM gaa_hierarchies WHERE id ='${levelId}'`,
                    { transaction: t }
                );

                let higherLevel = false;
                if (rank == 1 && levelType == "gaa") higherLevel = true;
                let id;
                if (!(rank == 1 && levelType == "gaa")) {
                    if (rank > 1 && levelType == "gaa") {
                        [[{ id }]] = await db.sequelize.selectQuery(
                            `SELECT id FROM gaa_hierarchies WHERE project_id='${projectId}' AND rank=${
                                rank - 1
                            } AND level_type ='gaa' AND is_active = '1'`
                        );
                    } else if (rank > 1 && levelType == "network") {
                        [[{ id }]] = await db.sequelize.selectQuery(
                            `SELECT id FROM gaa_hierarchies WHERE project_id='${projectId}' AND rank=${
                                rank - 1
                            } AND level_type ='network' AND is_active = '1'`
                        );
                    } else if (rank == 1 && levelType == "network") {
                        [[{ id }]] = await db.sequelize.selectQuery(
                            `SELECT id FROM gaa_hierarchies WHERE project_id='${projectId}' AND is_mapped ='1' AND level_type='gaa' AND is_active = '1'`
                        );
                    }
                }

                const tempTableQuery = createTableQuery(
                    tableNameTemp,
                    queryData
                );

                const errtempTableQuery = `CREATE TABLE IF NOT EXISTS err${tableNameTemp} AS SELECT * FROM ${tableNameTemp}`;

                const altErrTable = `ALTER TABLE err${tableNameTemp} ADD COLUMN IF NOT EXISTS system_remark text`;
                const altErrStatusTable = `ALTER TABLE ${tableNameTemp}  ALTER COLUMN  approval_status TYPE TEXT USING approval_status::TEXT;
                    ALTER TABLE err${tableNameTemp}  ALTER COLUMN  approval_status TYPE TEXT USING approval_status::TEXT  
                `;
                // const altErrStatusTable = `ALTER TABLE  ${tableNameTemp} ADD COLUMN approval_status_temp TEXT; UPDATE  ${tableNameTemp} SET approval_status_temp = approval_status::TEXT; ALTER TABLE  ${tableNameTemp} DROP COLUMN approval_status; ALTER TABLE  ${tableNameTemp} RENAME COLUMN approval_status_temp TO approval_status; `;

                await db.sequelize.query(
                    `${tempTableQuery}; ${errtempTableQuery}; ${altErrTable}; ${altErrStatusTable}`
                );

                const indexTemp = `CREATE INDEX gaa_parent ON ${tableNameTemp}(gaa_hierarchy_id, parent_id)`;

                const indexErrTemp = `CREATE INDEX err_gaa_parent ON err${tableNameTemp}(gaa_hierarchy_id, parent_id)`;

                const copyQuery = `COPY ${tableNameTemp} FROM '${csvFilePath}' CSV HEADER`;
                
                const mandata = `INSERT INTO err${tableNameTemp}
                     SELECT ${tableNameTemp}.*, 
                                            TRIM(BOTH ', ' FROM 
                                                CONCAT(
                                                    CASE WHEN name IS NULL THEN 'name is empty. ' END,  
                                                    CASE WHEN code IS NULL THEN 'code is empty. ' END,  
                                                    CASE WHEN gaa_hierarchy_id IS NULL THEN 'gaa_hierarchy_id is empty.' END,
                                                    CASE WHEN approval_status IS NULL THEN 'approval status is empty.' END,
                                                    CASE WHEN approval_status NOT IN ('Approved', 'Unapproved') THEN 'approval status is not valid.' END
                                                ) 
                                            ) AS system_remark 
                     FROM ${tableNameTemp} WHERE name  IS NULL OR code IS NULL OR gaa_hierarchy_id IS NULL OR approval_status IS NULL OR approval_status NOT IN ('Approved', 'Unapproved')`;

                const deletedata = `DELETE FROM ${tableNameTemp} WHERE name IS NULL OR code IS NULL OR gaa_hierarchy_id IS NULL OR approval_status IS NULL OR approval_status NOT IN ('Approved', 'Unapproved')`;

                const gaaExist = `INSERT INTO err${tableNameTemp} SELECT ${tableNameTemp}.*, 'gaa_hierarchy_id mis-matched' AS system_remark FROM ${tableNameTemp} WHERE gaa_hierarchy_id <> '${levelId}'`;

                const delGaaExist = `DELETE FROM ${tableNameTemp} WHERE gaa_hierarchy_id <> '${levelId}'`;

                const idExist = `INSERT INTO err${tableNameTemp} SELECT ${tableNameTemp}.*, 'id does not exist' AS system_remark FROM ${tableNameTemp} WHERE id NOT IN (SELECT id FROM gaa_level_entries WHERE gaa_hierarchy_id = '${levelId}') AND id NOTNULL`;

                const delidExist = `DELETE FROM ${tableNameTemp} WHERE id NOT IN (SELECT id FROM gaa_level_entries WHERE gaa_hierarchy_id = '${levelId}') AND id IS NOT NULL`;

                const dupIdRec = `INSERT INTO  err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Duplicate Id found in sheet' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT id FROM ${tableNameTemp} GROUP BY id HAVING COUNT(id)>1 AND id IS NOT NULL)`;

                const deldupIdRec = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT id FROM ${tableNameTemp} GROUP BY id HAVING COUNT(id)>1 AND id IS NOT NULL)`;
                sqlItems += `${indexTemp}; ${indexErrTemp}; ${copyQuery}; ${mandata}; ${deletedata}; ${gaaExist}; ${delGaaExist}; ${idExist}; ${delidExist};${dupIdRec}; ${deldupIdRec}; `;

                let nameCode;
                let delNameCode;
                let extraParent;
                let delextraParent;
                let duplicateNameCode;
                let delduplicateNameCode;

                // update of data
                if (higherLevel) {
                    extraParent = `INSERT INTO err${tableNameTemp} SELECT ${tableNameTemp}.*, 'parent_id not required' AS system_remark
                    FROM ${tableNameTemp} WHERE parent_id IS NOT NULL`;

                    delextraParent = `DELETE FROM ${tableNameTemp} WHERE parent_id IS NOT NULL`;

                    duplicateNameCode = `INSERT INTO  err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Duplicate Name or Code found in sheet' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND (t1.name=t2.name OR t1.code=t2.code))`;

                    delduplicateNameCode = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND (t1.name=t2.name OR t1.code=t2.code))`;

                    nameCode = `INSERT INTO err${tableNameTemp} 
                    SELECT ${tableNameTemp}.*, 'Name or Code already exist' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN gaa_level_entries AS ge ON ge.id<> te.id AND (ge.name = te.name OR ge.code = te.code) AND ge.gaa_hierarchy_id='${levelId}' AND te.id IS NOT NULL)`;

                    delNameCode = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN gaa_level_entries AS ge ON ge.id<> te.id AND (ge.name = te.name OR ge.code = te.code) AND ge.gaa_hierarchy_id='${levelId}' AND te.id IS NOT NULL)`;

                    sqlItems += `${extraParent}; ${delextraParent}; ${duplicateNameCode}; ${delduplicateNameCode}; ${nameCode}; ${delNameCode};`;
                } else {
                    extraParent = `INSERT INTO err${tableNameTemp} SELECT ${tableNameTemp}.*, 'parent_id required' AS system_remark
                    FROM ${tableNameTemp} WHERE parent_id IS NULL`;

                    delextraParent = `DELETE FROM ${tableNameTemp} WHERE parent_id IS NULL`;

                    const parentExist = `INSERT INTO err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'parent_id incorrect' AS system_remark 
                    FROM ${tableNameTemp} 
                    WHERE parent_id NOT IN (SELECT DISTINCT(id) FROM gaa_level_entries WHERE gaa_hierarchy_id='${id}')`;

                    const delparentExist = `DELETE FROM  ${tableNameTemp} WHERE parent_id NOT IN (SELECT DISTINCT(id) FROM gaa_level_entries WHERE gaa_hierarchy_id='${id}')`;

                    duplicateNameCode = `INSERT INTO  err${tableNameTemp}
                    SELECT  ${tableNameTemp}.*, 'Duplicate Name or Code found in sheet' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM  ${tableNameTemp} t1
                    INNER JOIN ${tableNameTemp} AS t2 ON (t1.parent_id=t2.parent_id) AND (t1.id<>t2.id) AND (t1.name=t2.name OR t1.code=t2.code))`;

                    delduplicateNameCode = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON (t1.parent_id=t2.parent_id) AND (t1.id<>t2.id) AND (t1.name=t2.name OR t1.code=t2.code))`;
                    //
                    nameCode = `INSERT INTO err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Name or Code already exists' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN gaa_level_entries AS ge ON ge.parent_id = te.parent_id AND ge.id<>te.id AND (ge.name = te.name OR ge.code = te.code) AND ge.gaa_hierarchy_id='${levelId}' AND te.id IS NOT NULL)`;

                    delNameCode = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN gaa_level_entries AS ge ON ge.parent_id = te.parent_id AND ge.id<>te.id AND  (ge.name = te.name OR ge.code = te.code) AND ge.gaa_hierarchy_id='${levelId}' AND te.id IS NOT NULL)`;

                    sqlItems += `${extraParent}; ${delextraParent}; ${parentExist}; ${delparentExist}; ${duplicateNameCode}; ${delduplicateNameCode}; ${nameCode}; ${delNameCode};`;
                }

                // Add default value to identify all columns in order (in case there isn't any record available in table)
                const [[{ count }]] = await db.sequelize.selectQuery(
                    "SELECT COUNT(*) AS count FROM gaa_level_entries;"
                );
                if (count === 0) {
                    await db.sequelize.query(
                        "INSERT INTO gaa_level_entries (id, name, code, gaa_hierarchy_id) VALUES('5196290f-a641-4674-86d4-23c939cca436', '', '', '5196290f-a641-4674-86d4-23c939cca436')"
                    );
                }
                // get the value in an order as the original have it
                const [[{ row_to_json: rowToJson }]] = await db.sequelize.selectQuery(
                    "select row_to_json(gle) from gaa_level_entries gle limit 1;"
                );
                // delete record if it was inserted mannualy
                if (count === 0) {
                    await db.sequelize.query(
                        "delete from gaa_level_entries where id = '5196290f-a641-4674-86d4-23c939cca436'"
                    );
                }

                // create the keys for insert query in same order as of original table
                let keyForOriginalTable = Object.keys(rowToJson)
                    .map((x) => (constant.VISIBLE_GAA_HIERARCHIES_LEVEL.includes(x)
                        ? x
                        : `${
                            // eslint-disable-next-line no-nested-ternary
                            x === "is_active"
                                ? "'1'"
                                : ["created_at", "updated_at"].includes(x)
                                    ? "current_timestamp"
                                    : null
                        } AS ${x}`))
                    .join(", ");
                
                if (keyForOriginalTable.includes("approval_status")) {
                    keyForOriginalTable = keyForOriginalTable.replace("approval_status", "approval_status::enum_gaa_level_entries_approval_status");
                }

                const updateRecWithId = `INSERT INTO ${tables[tableName]} SELECT ${keyForOriginalTable} FROM ${tableNameTemp} WHERE ${tableNameTemp}.id IS NOT NULL ON CONFLICT (id) DO UPDATE SET "name" = excluded.name, "integration_id" = excluded.integration_id, "code" = excluded.code, "remarks" = excluded.remarks, "parent_id" = excluded.parent_id, "updated_by"= '${req.user.userId}', "is_active" = EXCLUDED.is_active::enum_gaa_level_entries_is_active`;

                const deleteRecWithId = `DELETE FROM ${tableNameTemp} WHERE id IS NOT NULL`;

                const AddId = `UPDATE ${tableNameTemp} SET id = uuid_generate_v4() WHERE id IS NULL`;

                let remSql = "";
                let nameCodeRem;
                let delNameCodeRem;
                let delDup;
                let dupId;

                // create records
                if (higherLevel) {
                    dupId = `INSERT INTO  err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Duplicate Name or Code found in sheet' AS system_remark
                    FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND (t1.name=t2.name OR t1.code=t2.code))`;

                    delDup = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND (t1.name=t2.name OR t1.code=t2.code))`;

                    nameCodeRem = `INSERT INTO err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Name or Code already exist' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN gaa_level_entries AS ge ON (ge.name = te.name OR ge.code = te.code) AND ge.gaa_hierarchy_id='${levelId}')`;

                    delNameCodeRem = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                        INNER JOIN gaa_level_entries AS ge ON (ge.name = te.name OR ge.code = te.code) AND ge.gaa_hierarchy_id='${levelId}')`;

                    remSql += `${dupId}; ${delDup}; ${nameCodeRem}; ${delNameCodeRem};`;
                } else {
                    dupId = `INSERT INTO  err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Duplicate Name or Code found in sheets' AS system_remark
                    FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND t1.parent_id=t2.parent_id AND (t1.name=t2.name OR t1.code=t2.code))`; // working

                    delDup = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND t1.parent_id=t2.parent_id AND (t1.name=t2.name OR t1.code=t2.code))`; // working

                    nameCodeRem = `INSERT INTO err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Name or Code already exist' AS system_remark
                    FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN gaa_level_entries AS ge ON (ge.parent_id = te.parent_id) AND (ge.name = te.name OR ge.code = te.code) AND ge.gaa_hierarchy_id='${levelId}')`;

                    delNameCodeRem = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                        INNER JOIN gaa_level_entries AS ge ON (ge.parent_id = te.parent_id) AND (ge.name = te.name OR ge.code = te.code) AND ge.gaa_hierarchy_id='${levelId}')`;
                    remSql += `${dupId}; ${delDup}; ${nameCodeRem}; ${delNameCodeRem};`;
                }

                // create the keys for insert query in same order as of original table
                keyForOriginalTable = Object.keys(rowToJson)
                    // eslint-disable-next-line no-nested-ternary
                    .map((x) => (x === "id"
                        ? `uuid_generate_v4() AS ${x}`
                        : constant.VISIBLE_GAA_HIERARCHIES_LEVEL.includes(x)
                            ? x
                            : `${
                                // eslint-disable-next-line no-nested-ternary
                                x === "is_active"
                                    ? "'1'" // eslint-disable-next-line no-nested-ternary
                                    : ["created_at", "updated_at"].includes(x)
                                        ? "current_timestamp"
                                        : ["created_by", "updated_by"].includes(x)
                                            ? `'${req.user.userId}'`
                                            : null
                            } AS ${x}`))
                    .join(", ");

                if (keyForOriginalTable.includes("approval_status")) {
                    keyForOriginalTable = keyForOriginalTable.replace("approval_status", "approval_status::enum_gaa_level_entries_approval_status");
                }
                const AddRemRec = `INSERT INTO ${tables[tableName]} SELECT ${keyForOriginalTable}  FROM ${tableNameTemp}`;

                const getErrCSV = `COPY err${tableNameTemp} TO '${opfile}' WITH CSV HEADER`;

                await db.sequelize.query(
                    ` ${sqlItems} ${updateRecWithId}; ${deleteRecWithId}; ${AddId}; ${remSql} ${AddRemRec}; ${getErrCSV};`,
                    { transaction: t }
                );

                const [[{ count: rejectCounts }]] = await db.sequelize.selectQuery(
                    `select count(*) as count from err${tableNameTemp}`,
                    { transaction: t }
                );
                await db.sequelize.query(
                    `
                DROP INDEX IF EXISTS gaa_parent;
                DROP INDEX IF EXISTS err_gaa_parent;
                DROP TABLE IF  EXISTS temp_gaa_level_entries;
                DROP TABLE IF EXISTS errtemp_gaa_level_entries;
                `,
                    { transaction: t }
                );

                if (rejectCounts === 0 && fs.existsSync(opfile)) {
                    spawn("sudo", ["rm", opfile]);
                }

                resolve({
                    message: "Data Imported successfully",
                    ...(rejectCounts > 0 && {
                        rejectedFiles: rejectedFileName
                    })
                });
            } catch (error) {
                db.sequelize.query(
                    `DROP INDEX IF EXISTS gaa_parent;
                    DROP INDEX IF EXISTS err_gaa_parent;
                    DROP TABLE IF  EXISTS temp_gaa_level_entries;
                    DROP TABLE IF EXISTS errtemp_gaa_level_entries;`,
                    { transaction: t }
                );
                console.log(
                    `> [genus-wfm] | [${new Date().toLocaleString()}] | [import-excel.controller.js] | [#350] | [error] | `,
                    error
                );
                reject(new Error("Data Import Failed."));
            } finally {
                fs.unlinkSync(csvFilePath);
                fs.unlinkSync(xlFilePath);
            }
        });
    });
};

const createTableQuery = (tableName, columns) => {
    const columnDefinitions = columns
        .map((column) => `"${column.column_name}" ${column.column_type}`)
        .join(",  ");

    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;
    return query;
};

const downloadRejectedFiles = (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(
        global.exportedFilesDirectory,
        "rejected-uploads",
        fileName || ""
    );
    if (fs.existsSync(filePath) && filePath.includes(filePath)) {
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${fileName}`
        );
        return res.sendFile(filePath, () => {
            global.dataImportStatus = {};
            publishMessage(global.eventNames.publisher, {
                id: req.user.email,
                type: global.eventNames.dataImportStart,
                pid: process.pid,
                message: global.dataImportStatus
            });
            return spawn("sudo", ["rm", filePath]);
        });
    } else {
        res.status(400).send({ message: "Bad Request" });
    }
};

// Used to import Static table Urban and Rural Hierarchy
const importStaticMastersData = async (req, res) => {
    // uploadGAA
    const { db } = new Forms();
    const { tableName, levelId } = req.body;

    const uploadedFile = req.files.excelFile;

    createDirectoryIfNotExists(global.exportedFilesDirectory);
    const rejectFolders = path.join(
        global.exportedFilesDirectory,
        "rejected-uploads"
    );
    if (!fs.existsSync(rejectFolders)) {
        createDirectoryIfNotExists(rejectFolders);
        await changeOwnerToPostgres(rejectFolders, true);
    }

    const rejectedFileName = `${Date.now()}output.csv`;
    const opfile = path.join(
        global.exportedFilesDirectory,
        "/rejected-uploads",
        rejectedFileName
    );
    const xlFilePath = path.join(
        global.exportedFilesDirectory,
        `copy${uploadedFile.name}`
    );

    fs.writeFileSync(xlFilePath, uploadedFile.data);

    const xlFilePathWorkbook = XLSX.readFile(xlFilePath);
    const xlFilePathsheetName = xlFilePathWorkbook.SheetNames[0];
    const xlFilePathworksheet = xlFilePathWorkbook.Sheets[xlFilePathsheetName];

    let csvFilePath;

    return new Promise((resolve, reject) => {
        db.sequelize.transaction(async (t) => {
            try {
                const dataCsv = XLSX.utils.sheet_to_csv(xlFilePathworksheet, {
                    defval: null,
                    FS: ",",
                    blankrows: false
                });
                let sqlItems = "";

                const dataCsvLines = dataCsv.split("\n");
                const dataCsvWithoutSecondRow = dataCsvLines
                    .slice(0, 1)
                    .concat(dataCsvLines.slice(2));
                // const firstRow = dataCsvLines[0].split(",");
                const fileName = new Date().getTime().toString();
                csvFilePath = path.join(
                    global.exportedFilesDirectory,
                    `${fileName}.csv`
                );

                const csvDataString = dataCsvWithoutSecondRow.join("\n");
                fs.writeFileSync(csvFilePath, csvDataString, "utf8"); // creating csv file
                const tableNameTemp = `temp_${tables[tableName]}`;
                const sql = staticMasterDataSqlQuery(tables[tableName]);
                const [queryData] = await db.sequelize.selectQuery(sql, {
                    transaction: t
                });

                const [
                    [{ rank, level_type: levelType, project_id: projectId }]
                ] = await db.sequelize.selectQuery(
                    `SELECT rank, level_type, project_id FROM urban_hierarchies WHERE id ='${levelId}'`,
                    { transaction: t }
                );

                let higherLevel = false;
                if (rank == 1 && levelType == "rural") higherLevel = true;
                let id;
                if (!(rank == 1 && levelType == "rural")) {
                    if (rank > 1 && levelType == "rural") {
                        [[{ id }]] = await db.sequelize.selectQuery(
                            `SELECT id FROM urban_hierarchies WHERE project_id='${projectId}' AND rank=${
                                rank - 1
                            } AND level_type ='rural' AND is_active = '1'`
                        );
                    } else if (rank > 1 && levelType == "urban") {
                        [[{ id }]] = await db.sequelize.selectQuery(
                            `SELECT id FROM urban_hierarchies WHERE project_id='${projectId}' AND rank=${
                                rank - 1
                            } AND level_type ='urban' AND is_active = '1'`
                        );
                    } else if (rank == 1 && levelType == "urban") {
                        [[{ id }]] = await db.sequelize.selectQuery(
                            `SELECT id FROM urban_hierarchies WHERE project_id='${projectId}' AND is_mapped ='1' AND level_type='rural' AND is_active = '1'`
                        );
                    }
                }
                
                const tempTableQuery = createTableQuery(
                    tableNameTemp,
                    queryData
                );

                const errtempTableQuery = `CREATE TABLE IF NOT EXISTS err${tableNameTemp} AS SELECT * FROM ${tableNameTemp}`;

                const altErrTable = `ALTER TABLE err${tableNameTemp} ADD COLUMN IF NOT EXISTS system_remark text`;
                const altErrStatusTable = `ALTER TABLE ${tableNameTemp}  ALTER COLUMN  approval_status TYPE TEXT USING approval_status::TEXT;
                    ALTER TABLE err${tableNameTemp}  ALTER COLUMN  approval_status TYPE TEXT USING approval_status::TEXT  
                `;
                // const altErrStatusTable = `ALTER TABLE  ${tableNameTemp} ADD COLUMN approval_status_temp TEXT; UPDATE  ${tableNameTemp} SET approval_status_temp = approval_status::TEXT; ALTER TABLE  ${tableNameTemp} DROP COLUMN approval_status; ALTER TABLE  ${tableNameTemp} RENAME COLUMN approval_status_temp TO approval_status; `;

                await db.sequelize.query(
                    `${tempTableQuery}; ${errtempTableQuery}; ${altErrTable}; ${altErrStatusTable}`
                );

                const indexTemp = `CREATE INDEX urban_parent ON ${tableNameTemp}(urban_hierarchy_id, parent_id)`;

                const indexErrTemp = `CREATE INDEX err_urban_parent ON err${tableNameTemp}(urban_hierarchy_id, parent_id)`;

                const copyQuery = `COPY ${tableNameTemp} FROM '${csvFilePath}' CSV HEADER`;
                
                const mandata = `INSERT INTO err${tableNameTemp}
                     SELECT ${tableNameTemp}.*, 
                                            TRIM(BOTH ', ' FROM 
                                                CONCAT(
                                                    CASE WHEN name IS NULL THEN 'name is empty. ' END,  
                                                    CASE WHEN code IS NULL THEN 'code is empty. ' END,  
                                                    CASE WHEN urban_hierarchy_id IS NULL THEN 'urban_hierarchy_id is empty.' END,
                                                    CASE WHEN approval_status IS NULL THEN 'approval status is empty.' END,
                                                    CASE WHEN approval_status NOT IN ('Approved', 'Unapproved') THEN 'approval status is not valid.' END
                                                ) 
                                            ) AS system_remark 
                     FROM ${tableNameTemp} WHERE name  IS NULL OR code IS NULL OR urban_hierarchy_id IS NULL OR approval_status IS NULL OR approval_status NOT IN ('Approved', 'Unapproved')`;

                const deletedata = `DELETE FROM ${tableNameTemp} WHERE name IS NULL OR code IS NULL OR urban_hierarchy_id IS NULL OR approval_status IS NULL OR approval_status NOT IN ('Approved', 'Unapproved')`;

                const urbanExist = `INSERT INTO err${tableNameTemp} SELECT ${tableNameTemp}.*, 'urban_hierarchy_id mis-matched' AS system_remark FROM ${tableNameTemp} WHERE urban_hierarchy_id <> '${levelId}'`;

                const delGaaExist = `DELETE FROM ${tableNameTemp} WHERE urban_hierarchy_id <> '${levelId}'`;

                const idExist = `INSERT INTO err${tableNameTemp} SELECT ${tableNameTemp}.*, 'id does not exist' AS system_remark FROM ${tableNameTemp} WHERE id NOT IN (SELECT id FROM urban_level_entries WHERE urban_hierarchy_id = '${levelId}') AND id NOTNULL`;

                const delidExist = `DELETE FROM ${tableNameTemp} WHERE id NOT IN (SELECT id FROM urban_level_entries WHERE urban_hierarchy_id = '${levelId}') AND id IS NOT NULL`;

                const dupIdRec = `INSERT INTO  err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Duplicate Id found in sheet' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT id FROM ${tableNameTemp} GROUP BY id HAVING COUNT(id)>1 AND id IS NOT NULL)`;

                const deldupIdRec = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT id FROM ${tableNameTemp} GROUP BY id HAVING COUNT(id)>1 AND id IS NOT NULL)`;
                sqlItems += `${indexTemp}; ${indexErrTemp}; ${copyQuery}; ${mandata}; ${deletedata}; ${urbanExist}; ${delGaaExist}; ${idExist}; ${delidExist};${dupIdRec}; ${deldupIdRec}; `;

                let nameCode;
                let delNameCode;
                let extraParent;
                let delextraParent;
                let duplicateNameCode;
                let delduplicateNameCode;

                // update of data
                if (higherLevel) {
                    extraParent = `INSERT INTO err${tableNameTemp} SELECT ${tableNameTemp}.*, 'parent_id not required' AS system_remark
                    FROM ${tableNameTemp} WHERE parent_id IS NOT NULL`;

                    delextraParent = `DELETE FROM ${tableNameTemp} WHERE parent_id IS NOT NULL`;

                    duplicateNameCode = `INSERT INTO  err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Duplicate Name or Code found in sheet' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND (t1.name=t2.name OR t1.code=t2.code))`;

                    delduplicateNameCode = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND (t1.name=t2.name OR t1.code=t2.code))`;

                    nameCode = `INSERT INTO err${tableNameTemp} 
                    SELECT ${tableNameTemp}.*, 'Name or Code already exist' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN urban_level_entries AS ge ON ge.id<> te.id AND (ge.name = te.name OR ge.code = te.code) AND ge.urban_hierarchy_id='${levelId}' AND te.id IS NOT NULL)`;

                    delNameCode = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN urban_level_entries AS ge ON ge.id<> te.id AND (ge.name = te.name OR ge.code = te.code) AND ge.urban_hierarchy_id='${levelId}' AND te.id IS NOT NULL)`;

                    sqlItems += `${extraParent}; ${delextraParent}; ${duplicateNameCode}; ${delduplicateNameCode}; ${nameCode}; ${delNameCode};`;
                } else {
                    extraParent = `INSERT INTO err${tableNameTemp} SELECT ${tableNameTemp}.*, 'parent_id required' AS system_remark
                    FROM ${tableNameTemp} WHERE parent_id IS NULL`;

                    delextraParent = `DELETE FROM ${tableNameTemp} WHERE parent_id IS NULL`;

                    const parentExist = `INSERT INTO err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'parent_id incorrect' AS system_remark 
                    FROM ${tableNameTemp} 
                    WHERE parent_id NOT IN (SELECT DISTINCT(id) FROM urban_level_entries WHERE urban_hierarchy_id='${id}')`;

                    const delparentExist = `DELETE FROM  ${tableNameTemp} WHERE parent_id NOT IN (SELECT DISTINCT(id) FROM urban_level_entries WHERE urban_hierarchy_id='${id}')`;

                    duplicateNameCode = `INSERT INTO  err${tableNameTemp}
                    SELECT  ${tableNameTemp}.*, 'Duplicate Name or Code found in sheet' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM  ${tableNameTemp} t1
                    INNER JOIN ${tableNameTemp} AS t2 ON (t1.parent_id=t2.parent_id) AND (t1.id<>t2.id) AND (t1.name=t2.name OR t1.code=t2.code))`;

                    delduplicateNameCode = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON (t1.parent_id=t2.parent_id) AND (t1.id<>t2.id) AND (t1.name=t2.name OR t1.code=t2.code))`;
                    //
                    nameCode = `INSERT INTO err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Name or Code already exists' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN urban_level_entries AS ge ON ge.parent_id = te.parent_id AND ge.id<>te.id AND (ge.name = te.name OR ge.code = te.code) AND ge.urban_hierarchy_id='${levelId}' AND te.id IS NOT NULL)`;

                    delNameCode = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN urban_level_entries AS ge ON ge.parent_id = te.parent_id AND ge.id<>te.id AND  (ge.name = te.name OR ge.code = te.code) AND ge.urban_hierarchy_id='${levelId}' AND te.id IS NOT NULL)`;

                    sqlItems += `${extraParent}; ${delextraParent}; ${parentExist}; ${delparentExist}; ${duplicateNameCode}; ${delduplicateNameCode}; ${nameCode}; ${delNameCode};`;
                }

                // Add default value to identify all columns in order (in case there isn't any record available in table)
                const [[{ count }]] = await db.sequelize.selectQuery(
                    "SELECT COUNT(*) AS count FROM urban_level_entries;"
                );
                if (count === 0) {
                    await db.sequelize.query(
                        "INSERT INTO urban_level_entries (id, name, code, urban_hierarchy_id) VALUES('5196290f-a641-4674-86d4-23c939cca436', '', '', '5196290f-a641-4674-86d4-23c939cca436')"
                    );
                }
                // get the value in an order as the original have it
                const [[{ row_to_json: rowToJson }]] = await db.sequelize.selectQuery(
                    "select row_to_json(gle) from urban_level_entries gle limit 1;"
                );
                // delete record if it was inserted mannualy
                if (count === 0) {
                    await db.sequelize.query(
                        "delete from urban_level_entries where id = '5196290f-a641-4674-86d4-23c939cca436'"
                    );
                }

                // create the keys for insert query in same order as of original table
                let keyForOriginalTable = Object.keys(rowToJson)
                    .map((x) => (constant.VISIBLE_URBAN_HIERARCHIES_LEVEL.includes(x)
                        ? x
                        : `${
                            // eslint-disable-next-line no-nested-ternary
                            x === "is_active"
                                ? "'1'"
                                : ["created_at", "updated_at"].includes(x)
                                    ? "current_timestamp"
                                    : null
                        } AS ${x}`))
                    .join(", ");
                
                if (keyForOriginalTable.includes("approval_status")) {
                    keyForOriginalTable = keyForOriginalTable.replace("approval_status", "approval_status::enum_urban_level_entries_approval_status");
                }

                const updateRecWithId = `INSERT INTO ${tables[tableName]} SELECT ${keyForOriginalTable} FROM ${tableNameTemp} WHERE ${tableNameTemp}.id IS NOT NULL ON CONFLICT (id) DO UPDATE SET "name" = excluded.name, "integration_id" = excluded.integration_id, "code" = excluded.code, "remarks" = excluded.remarks, "parent_id" = excluded.parent_id, "updated_by"= '${req.user.userId}', "is_active" = EXCLUDED.is_active::enum_urban_level_entries_is_active`;

                const deleteRecWithId = `DELETE FROM ${tableNameTemp} WHERE id IS NOT NULL`;

                const AddId = `UPDATE ${tableNameTemp} SET id = uuid_generate_v4() WHERE id IS NULL`;

                let remSql = "";
                let nameCodeRem;
                let delNameCodeRem;
                let delDup;
                let dupId;

                // create records
                if (higherLevel) {
                    dupId = `INSERT INTO  err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Duplicate Name or Code found in sheet' AS system_remark
                    FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND (t1.name=t2.name OR t1.code=t2.code))`;

                    delDup = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND (t1.name=t2.name OR t1.code=t2.code))`;

                    nameCodeRem = `INSERT INTO err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Name or Code already exist' AS system_remark 
                    FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN urban_level_entries AS ge ON (ge.name = te.name OR ge.code = te.code) AND ge.urban_hierarchy_id='${levelId}')`;

                    delNameCodeRem = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                        INNER JOIN urban_level_entries AS ge ON (ge.name = te.name OR ge.code = te.code) AND ge.urban_hierarchy_id='${levelId}')`;

                    remSql += `${dupId}; ${delDup}; ${nameCodeRem}; ${delNameCodeRem};`;
                } else {
                    dupId = `INSERT INTO  err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Duplicate Name or Code found in sheets' AS system_remark
                    FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND t1.parent_id=t2.parent_id AND (t1.name=t2.name OR t1.code=t2.code))`; // working

                    delDup = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT t1.id FROM ${tableNameTemp} AS t1
                    INNER JOIN ${tableNameTemp} AS t2 ON t1.id<>t2.id AND t1.parent_id=t2.parent_id AND (t1.name=t2.name OR t1.code=t2.code))`; // working

                    nameCodeRem = `INSERT INTO err${tableNameTemp}
                    SELECT ${tableNameTemp}.*, 'Name or Code already exist' AS system_remark
                    FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                    INNER JOIN urban_level_entries AS ge ON (ge.parent_id = te.parent_id) AND (ge.name = te.name OR ge.code = te.code) AND ge.urban_hierarchy_id='${levelId}')`;

                    delNameCodeRem = `DELETE FROM ${tableNameTemp} WHERE id IN (SELECT te.id FROM ${tableNameTemp} AS te
                        INNER JOIN urban_level_entries AS ge ON (ge.parent_id = te.parent_id) AND (ge.name = te.name OR ge.code = te.code) AND ge.urban_hierarchy_id='${levelId}')`;
                    remSql += `${dupId}; ${delDup}; ${nameCodeRem}; ${delNameCodeRem};`;
                }

                // create the keys for insert query in same order as of original table
                keyForOriginalTable = Object.keys(rowToJson)
                    // eslint-disable-next-line no-nested-ternary
                    .map((x) => (x === "id"
                        ? `uuid_generate_v4() AS ${x}`
                        : constant.VISIBLE_URBAN_HIERARCHIES_LEVEL.includes(x)
                            ? x
                            : `${
                                // eslint-disable-next-line no-nested-ternary
                                x === "is_active"
                                    ? "'1'" // eslint-disable-next-line no-nested-ternary
                                    : ["created_at", "updated_at"].includes(x)
                                        ? "current_timestamp"
                                        : ["created_by", "updated_by"].includes(x)
                                            ? `'${req.user.userId}'`
                                            : null
                            } AS ${x}`))
                    .join(", ");

                if (keyForOriginalTable.includes("approval_status")) {
                    keyForOriginalTable = keyForOriginalTable.replace("approval_status", "approval_status::enum_urban_level_entries_approval_status");
                }

                const AddRemRec = `INSERT INTO ${tables[tableName]} SELECT ${keyForOriginalTable}  FROM ${tableNameTemp}`;

                const getErrCSV = `COPY err${tableNameTemp} TO '${opfile}' WITH CSV HEADER`;

                // console.log(` ${sqlItems} ${updateRecWithId}; ${deleteRecWithId}; ${AddId}; ${remSql} ${AddRemRec}; ${getErrCSV};`);
                await db.sequelize.query(
                    ` ${sqlItems} ${updateRecWithId}; ${deleteRecWithId}; ${AddId}; ${remSql} ${AddRemRec}; ${getErrCSV};`,
                    { transaction: t }
                );

                const [[{ count: rejectCounts }]] = await db.sequelize.selectQuery(
                    `select count(*) as count from err${tableNameTemp}`,
                    { transaction: t }
                );
                await db.sequelize.query(
                    `
                DROP INDEX IF EXISTS urban_parent;
                DROP INDEX IF EXISTS err_urban_parent;
                DROP TABLE IF  EXISTS temp_urban_level_entries;
                DROP TABLE IF EXISTS errtemp_urban_level_entries;
                `,
                    { transaction: t }
                );

                if (rejectCounts === 0 && fs.existsSync(opfile)) {
                    spawn("sudo", ["rm", opfile]);
                }

                resolve({
                    message: "Data Imported successfully",
                    ...(rejectCounts > 0 && {
                        rejectedFiles: rejectedFileName
                    })
                });
            } catch (error) {
                db.sequelize.query(
                    `DROP INDEX IF EXISTS urban_parent;
                    DROP INDEX IF EXISTS err_urban_parent;
                    DROP TABLE IF  EXISTS temp_urban_level_entries;
                    DROP TABLE IF EXISTS errtemp_urban_level_entries;`,
                    { transaction: t }
                );
                console.log(
                    `> [genus-wfm] | [${new Date().toLocaleString()}] | [import-excel.controller.js] | [#350] | [error] | `,
                    error
                );
                reject(new Error("Data Import Failed."));
            } finally {
                fs.unlinkSync(csvFilePath);
                fs.unlinkSync(xlFilePath);
            }
        });
    });
};

// Used to create Static Query of Urban and Rural hierarchy
const staticMasterDataSqlQuery = (tableName) => {
    // get level excel columns
    let getColumn = [];
    let maindatoryColumns = [];
    if (tableName == "urban_level_entries") getColumn = constant.VISIBLE_URBAN_HIERARCHIES_LEVEL;
    maindatoryColumns = constant.MANDETORY_URBAN_HIERARCHIES_LEVEL.join("', '");

    if (getColumn.length > 0) {
        const sql = `
        SELECT
        c.column_name AS column_name,
        ccu.table_name as name,
        c.udt_name as column_type,
        CONCAT(
            c.udt_name,
            CASE
                WHEN ccu.table_name IS NOT NULL THEN ' (' || ccu.table_name || ')'
                ELSE ''
            END,
            CASE
                WHEN c.column_name IN ('${maindatoryColumns}') THEN '-mandatory'
                END
        ) as type
    FROM
        information_schema.columns AS c
        LEFT JOIN information_schema.key_column_usage AS kcu ON c.table_name = kcu.table_name
        AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.constraint_column_usage AS ccu ON kcu.constraint_name = ccu.constraint_name
        LEFT JOIN information_schema.table_constraints AS tc ON kcu.constraint_name = tc.constraint_name
    WHERE
        c.table_name = '${tableName}'
        AND c.column_name IN ('${getColumn.join("', '")}')
    ORDER BY
        c.ordinal_position;`;
        return sql;
    } else {
        return 0;
    }
};

module.exports = {
    downloadRejectedFiles,
    exportFormsSchemaFile,
    importFormResponses,
    importStaticMasters,
    updateFormResponses,
    importStaticMastersData
};