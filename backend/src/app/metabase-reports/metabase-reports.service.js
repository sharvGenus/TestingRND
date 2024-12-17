const jwt = require("jsonwebtoken");
const {
    getUserGovernedLovArray
} = require("../access-management/access-management.service");
const Forms = require("../../database/operation/forms");
const { getFormResponsesQuery } = require("../forms/forms.service");
const { throwError, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const gaaHierarchiesService = require("../gaa-hierarchies/gaa-hierarchies.service");
const Users = require("../../database/operation/users");

const { METABASE_SECRET_KEY, METABASE_SITE_URL } = process.env;

/*
 * Explanation: To differentiate multiple latitude, longitude, and accuracy columns 
 * that may be created due to having multiple columns of type location.
 * Therefore, we have columns with the name of the column being split
 * using the first word of the split column. 
 * 
 * The same is done while creating the query. This function will match the accessor from the query.
 */
function createLocationColumns({ Header: argHeader, accessor: argAccessor, column: argColumn, update, view }, isTemp) {
    
    const Header = argHeader.split(" ")[0];
    const accessor = argAccessor.split(" ")[0];
    const column = argColumn.split(" ")[0];

    return [
        {
            Header: isTemp ? "Latitude" : `Latitude (${Header})`,
            accessor: `Latitude (${accessor})`,
            column: `Latitude (${column})`,
            type: "extra",
            update,
            view
        },
        {
            Header: isTemp ? "Longitude" : `Longitude (${Header})`,
            accessor: `Longitude (${accessor})`,
            column: `Longitude (${column})`,
            type: "extra",
            update,
            view
        },
        ...(isTemp ? [] : [{
            Header: `Accuracy (${Header})`,
            accessor: `Accuracy (${accessor})`,
            column: `Accuracy (${column})`,
            type: "extra",
            update,
            view
        }])
    ];
}

function convertSignalStrengthColumns({ update, view }) {
    return [
        {
            Header: "SIM Slot-1",
            accessor: "SIM Slot-1",
            column: "SIM Slot-1",
            type: "extra",
            update,
            view
        },
        {
            Header: "RSRP-1",
            accessor: "RSRP-1",
            column: "RSRP-1",
            type: "extra",
            update,
            view
        },
        {
            Header: "RSRQ-1",
            accessor: "RSRQ-1",
            column: "RSRQ-1",
            type: "extra",
            update,
            view
        },
        {
            Header: "SINR-1",
            accessor: "SINR-1",
            column: "SINR-1",
            type: "extra",
            update,
            view
        },
        {
            Header: "ASU-1",
            accessor: "ASU-1",
            column: "ASU-1",
            type: "extra",
            update,
            view
        },
        {
            Header: "Telecom Provider-1",
            accessor: "Telecom Provider-1",
            column: "Telecom Provider-1",
            type: "extra",
            update,
            view
        },
        {
            Header: "SIM Slot-2",
            accessor: "SIM Slot-2",
            column: "SIM Slot-2",
            type: "extra",
            update,
            view
        },
        {
            Header: "RSRP-2",
            accessor: "RSRP-2",
            column: "RSRP-2",
            type: "extra",
            update,
            view
        },
        {
            Header: "RSRQ-2",
            accessor: "RSRQ-2",
            column: "RSRQ-2",
            type: "extra",
            update,
            view
        },
        {
            Header: "SINR-2",
            accessor: "SINR-2",
            column: "SINR-2",
            type: "extra",
            update,
            view
        },
        {
            Header: "ASU-2",
            accessor: "ASU-2",
            column: "ASU-2",
            type: "extra",
            update,
            view
        },
        {
            Header: "Telecom Provider-2",
            accessor: "Telecom Provider-2",
            column: "Telecom Provider-2",
            type: "extra",
            update,
            view
        }
    ];
}

const getFilterForLovData = (lovData) => {
    if (lovData === true) {
        return [];
    } else {
        return Array.isArray(lovData) && lovData.length > 0 ? lovData : null;
    }
};

function generatePaginationParams(paginations) {
    let paginationParams = "";
    if (paginations && paginations?.limit) {
        paginationParams += `LIMIT ${paginations?.limit} `;
    }

    if (paginations && paginations?.offset) {
        paginationParams += `OFFSET ${paginations?.offset}`;
    }
    return paginationParams;
}

async function createLockedFilter(accessInfo, req) {
    if (!accessInfo) return [];
    const lockedFilterPromises = accessInfo.map(async (item) => {
        const lovData = await getUserGovernedLovArray(
            req.user.userId,
            item.masterName
        );
        const masterIds = getFilterForLovData(lovData);
        return [item.filterKey, masterIds];
    });
    const preLockedFilter = await Promise.all(lockedFilterPromises);
    const lockedFilter = Object.fromEntries(preLockedFilter);
    return lockedFilter;
}

const fetchDashboard = async (req) => {
    const { dashboardId, accessInfo } = req.body;

    /*
        Format for 'accessInfo'
        [
            {
            filterKey: 'project_id', // metabase key for filter
            masterName: 'Project' // master name
            }
        ]
    */

    const expiryTime = Math.round(Date.now() / 1000) + 10 * 60;

    const lockedFilter = await createLockedFilter(accessInfo, req);

    const payload = {
        resource: {
            dashboard: +dashboardId
        },
        params: {
            ...lockedFilter
        },
        exp: expiryTime
    };

    const token = jwt.sign(payload, METABASE_SECRET_KEY);
    const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
    return { iframeUrl };
};

function processStaticColumns(_columns, ci, isTemp) {
    let columns = _columns;
    const currentIndex = ci || 0;
    const supportedTypes = ["location", "network"];
    const typeIndex = columns.findIndex(
        (column, index) => index >= currentIndex && supportedTypes.includes(column.type)
    );
    if (typeIndex === -1) return columns;
  
    const foundTypeCol = columns[typeIndex];
  
    let outputCols = [];
  
    if (foundTypeCol.type === "location") {
        outputCols = createLocationColumns(foundTypeCol, isTemp);
    } else if (!isTemp && foundTypeCol.type === "network") {
        outputCols = convertSignalStrengthColumns(foundTypeCol);
    }
  
    columns?.splice(typeIndex + 1, 0, ...outputCols);
    if (isTemp) {
        columns = columns?.filter((col) => col.Header !== "Skip Location");
    }

    if (foundTypeCol.type === "network") {
        return columns;
    } else {
        return processStaticColumns(columns, typeIndex + outputCols.length + 1, isTemp);
    }
}

function generateSqlQuery(levels, networkLevels, levelType = "gaa") {
    if (levels.length === 0) return "";

    const isMappedIndex = levels.findIndex((level) => level.isMapped === "1");
    const levelTypeIsGaa = levelType === "gaa";
    const levelTypeIsNetwork = levelType === "network";

    if (levelTypeIsNetwork && networkLevels.length === 0) return "";
  
    // Start building the SELECT part of the query
    const selectParts = levels
        .map(
            (level, index) => `
      ${levelTypeIsGaa ? `"${level.name}"."id"` : `${index <= isMappedIndex ? `"${level.name}"."id"` : "NULL"}`} AS "${level.name} ID",
      ${levelTypeIsGaa ? `"${level.name}"."name"` : `${index <= isMappedIndex ? `"${level.name}"."name"` : "NULL"}`} AS "${level.name} Name",
      ${levelTypeIsGaa ? `"${level.name}"."code"` : `${index <= isMappedIndex ? `"${level.name}"."code"` : "NULL"}`} AS "${level.name} Code"${
    level.isMapped === "1"
        ? `,
      ${networkLevels.map(
        (networkLevel) => `
      ${levelTypeIsNetwork ? `"${networkLevel.name}"."id"` : "NULL"} AS "${networkLevel.name} ID",
      ${levelTypeIsNetwork ? `"${networkLevel.name}"."name"` : "NULL"} AS "${networkLevel.name} Name",
      ${levelTypeIsNetwork ? `"${networkLevel.name}"."code"` : "NULL"} AS "${networkLevel.name} Code"`
    ).join(",\n")}`
        : ""
}`
        )
        .join(",\n");

    const levelsForJoins = [...(levelTypeIsGaa ? levels : [...levels.filter((_, index) => index <= isMappedIndex), ...networkLevels])];
  
    // Initialize FROM part of the query with the first level
    const fromPart = `
  FROM
      "gaa_level_entries" AS "${levelsForJoins[0].name}"`;
  
    // Build the JOIN parts of the query
    let joinParts = "";
    for (let i = 1; i < levelsForJoins.length; i++) {
        joinParts += `
      LEFT JOIN "gaa_level_entries" AS "${levelsForJoins[i].name}" ON "${
    levelsForJoins[i].name
}"."parent_id" = "${levelsForJoins[i - 1].name}".id`;
    }
  
    let hierarchyJoinParts = "";
    for (let i = 0; i < levelsForJoins.length; i++) {
        hierarchyJoinParts += `
      LEFT JOIN gaa_hierarchies AS "${levelsForJoins[i].name} GAA Hierarchy" ON "${levelsForJoins[i].name}"."gaa_hierarchy_id" = "${levelsForJoins[i].name} GAA Hierarchy".id`;
    }
  
    // WHERE part of the query to filter based on the first level's gaa_hierarchy_id
    const wherePart = `
  WHERE
      "${levelsForJoins[0].name}".gaa_hierarchy_id = '${levelsForJoins[0].id}'`;
  
    let whereHierarchyParts = "";
    for (let i = 0; i < levelsForJoins.length; i++) {
        whereHierarchyParts += `
      AND ("${levelsForJoins[i].name} GAA Hierarchy".level_type = '${levelTypeIsNetwork && i <= isMappedIndex ? "gaa" : levelType}' OR "${levelsForJoins[i].name} GAA Hierarchy".level_type IS NULL)`;
    }
  
    // Combine all parts to form the final query
    const sqlQuery = `SELECT${selectParts}${fromPart}${joinParts}${hierarchyJoinParts}${wherePart}${whereHierarchyParts}`;
  
    return sqlQuery;
}

const getGaaHierarchiesReport = async (projectId, paginations) => {
    const gaaHierarchiesDataRaw = await gaaHierarchiesService.getAllGaaHierarchies(
        {
            projectId,
            levelType: "gaa"
        },
        { order: [["rank", "ASC"]] }
    );
    const networkHierarchiesDataRaw = await gaaHierarchiesService.getAllGaaHierarchies(
        {
            projectId,
            levelType: "network"
        },
        { order: [["rank", "ASC"]] }
    );

    const gaaHierarchiesData = gaaHierarchiesDataRaw?.rows;
    const networkHierarchiesData = networkHierarchiesDataRaw?.rows;

    const sqlForGaa = generateSqlQuery(gaaHierarchiesData, networkHierarchiesData, "gaa");
    const sqlForNetwork = generateSqlQuery(gaaHierarchiesData, networkHierarchiesData, "network");

    throwIfNot(sqlForGaa || sqlForNetwork, statusCodes.NOT_FOUND, statusMessages.GAA_REPORT_DATA_NOT_FOUND);

    const paginationParams = generatePaginationParams(paginations);

    const subQuery = (sqlForNetwork ? [sqlForGaa, sqlForNetwork] : [sqlForGaa]).join("\nUNION\n");
    const finalQuery = `${subQuery} ${paginationParams}`;

    const { db } = new Forms();

    const [result, countResult] = await Promise.all([db.sequelize.selectQuery(finalQuery), db.sequelize.selectQuery(`SELECT COUNT(*) FROM (${subQuery}) AS subquery`)]);

    const [rows] = result;
    const [[{ count }]] = countResult;

    return { rows, count: +count };
};

const getReportData = async (formId, mode, user, paginations, gaaLevelFilter, countOnly, reportType, isCustomExport, ignoreLevelValidations) => {
    try {
        if (countOnly) {
            const data = await getFormResponsesQuery({
                isActive: "1",
                formId,
                isHistory: false,
                gaaLevelFilter,
                ignoreLevelValidations
            }, user, paginations, false, [], true, true, mode, reportType);
            return data;
        }
        const data = await getFormResponsesQuery({
            isActive: "1",
            formId,
            isHistory: false,
            gaaLevelFilter,
            ignoreLevelValidations
        }, user, paginations, false, [], false, true, mode, reportType, isCustomExport);

        const { rows, columns, formPermissions } = data;
        return { rows, columns: processStaticColumns(columns, 0, reportType), formPermissions };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ISSUES_FETCHING_REPORT, error);
        console.log("error", error);
    }
};

const installerMaterialReport = async (reqQuery) => {
    try {
        const { projectId, materialTypeId, installerId, fromDate, toDate } = reqQuery;
        const { db } = new Forms();
        let whereCondition = "";
        let issueDateCondition = "";
        if (projectId) {
            whereCondition += `AND PROJECTS."id" IN ('${projectId.join("', '")}')`;
        }
        if (materialTypeId) {
            whereCondition += ` AND MATERIALS."material_type_id" IN ('${materialTypeId.join("', '")}')`;
        }
        if (installerId) {
            whereCondition += ` AND "Users - Installer"."id" IN ('${installerId.join("', '")}')`;
        }
        if (fromDate) {
            issueDateCondition += ` AND "source"."Item Installed Date" >= '${fromDate}'::timestamp`;
        }
        if (toDate) {
            issueDateCondition += ` AND "source"."Item Installed Date" <= '${toDate}'::timestamp`;
        }
        const query = `
        SELECT "source"."id" AS "id",
	"source"."reference_document_number" AS "reference_document_number",
	"source"."created_at" AS "created_at",
	"source"."Projects__name" AS "Projects__name",
	"source"."Organizations - Customer__name" AS "Organizations - Customer__name",
	"source"."Master Maker Lovs - Material Type__name" AS "Master Maker Lovs - Material Type__name",
	"source"."Users - Installer__id" AS "Users - Installer__id",
	"source"."Users - Installer__name" AS "Users - Installer__name",
	"source"."Users - Installer__code" AS "Users - Installer__code",
	"source"."Material Serial Numbers__serial_number" AS "Material Serial Numbers__serial_number",
	"source"."Serial Number Numeric Extract" AS "Serial Number Numeric Extract",
	"source"."Item Status" AS "Item Status",
	"source"."Item Installed Date" AS "Item Installed Date",
	"source"."Item Issued Rank" AS "Item Issued Rank"
FROM
	(WITH INSTALLEDSTOCKLEDGERS AS
			(SELECT MSN.SERIAL_NUMBER,
					MAX(SL.CREATED_AT) AS INSTALLED_AT
				FROM "public"."stock_ledgers" AS SL
				INNER JOIN "public"."material_serial_numbers" AS MSN ON SL.ID = MSN.STOCK_LEDGER_ID
				WHERE SL.TRANSACTION_TYPE_ID = 'f3848838-6e7c-4240-a4e2-27e084164a17'
				GROUP BY MSN.SERIAL_NUMBER
				ORDER BY MSN.SERIAL_NUMBER) SELECT SL."id",
			SL."reference_document_number",
			SL."created_at",
			PROJECTS."name" AS "Projects__name",
			"Organizations - Customer"."name" AS "Organizations - Customer__name",
			"Master Maker Lovs - Material Type"."name" AS "Master Maker Lovs - Material Type__name",
			"Users - Installer"."id" AS "Users - Installer__id",
			"Users - Installer"."name" AS "Users - Installer__name",
			"Users - Installer"."code" AS "Users - Installer__code",
			"Material Serial Numbers"."serial_number" AS "Material Serial Numbers__serial_number",
			CAST(REGEXP_REPLACE("Material Serial Numbers"."serial_number",

									'[^0-9]',
									'',
									'g') AS BIGINT) AS "Serial Number Numeric Extract",
			CASE
							WHEN ISL.SERIAL_NUMBER IS NOT NULL THEN 'Installed'
							ELSE 'Issued'
			END AS "Item Status",
			ISL.INSTALLED_AT AS "Item Installed Date",
			ROW_NUMBER() OVER (PARTITION BY "Material Serial Numbers"."serial_number"
																						ORDER BY SL."created_at" DESC) AS "Item Issued Rank"
		FROM "public"."stock_ledgers" AS SL
		LEFT JOIN "public"."projects" AS PROJECTS ON SL."project_id" = PROJECTS."id"
		LEFT JOIN "public"."organizations" AS "Organizations - Customer" ON PROJECTS."customer_id" = "Organizations - Customer"."id"
		LEFT JOIN "public"."materials" AS MATERIALS ON SL."material_id" = MATERIALS."id"
		LEFT JOIN "public"."master_maker_lovs" AS "Master Maker Lovs - Material Type" ON MATERIALS."material_type_id" = "Master Maker Lovs - Material Type"."id"
		LEFT JOIN "public"."users" AS "Users - Installer" ON SL."installer_id" = "Users - Installer"."id"
		LEFT JOIN "public"."material_serial_numbers" AS "Material Serial Numbers" ON SL."id" = "Material Serial Numbers"."stock_ledger_id"
		LEFT JOIN INSTALLEDSTOCKLEDGERS AS ISL ON "Material Serial Numbers"."serial_number" = ISL.SERIAL_NUMBER
		WHERE SL."transaction_type_id" = '5b4e46d5-7bf5-4f42-8c4a-b6337533fdff'
			AND MATERIALS."is_serial_number" = TRUE
            ${whereCondition}
            AND ("Users - Installer"."name" IS NOT NULL)
			AND (("Users - Installer"."name" <> '')
								OR ("Users - Installer"."name" IS NULL)) ) AS "source"
        WHERE "source"."Item Issued Rank" = 1 ${issueDateCondition}
        `;

        const paginations = {
            offset: reqQuery.pageNumber > 1 ? (reqQuery.pageNumber - 1) * reqQuery.rowPerPage : 0,
            limit: reqQuery.rowPerPage || 0
        };

        const paginationParams = generatePaginationParams(paginations);

        const [result] = await db.sequelize.selectQuery(`${query} ${paginationParams}`);
        const [countResult] = await db.sequelize.selectQuery(`SELECT COUNT(*) FROM (${query}) AS subquery`);
        
        const [{ count }] = countResult;
        return { rows: result, count };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ISSUES_FETCHING_REPORT, error);
    }
};

const supervisorMaterialReport = async (reqQuery) => {
    try {
        const { projectId, materialTypeId, supervisorId, fromDate, toDate } = reqQuery;
        const { db } = new Forms();
        let whereCondition = "";
        let issueDateCondition = "";
        if (projectId) {
            whereCondition += `AND PROJECTS."id" IN ('${projectId.join("', '")}')`;
        }
        if (materialTypeId) {
            whereCondition += ` AND MATERIALS."material_type_id" IN ('${materialTypeId.join("', '")}')`;
        }
        if (supervisorId) {
            issueDateCondition += ` AND "Users - Supervisor"."id" IN ('${supervisorId.join("', '")}')`;
        }
        if (fromDate) {
            issueDateCondition += ` AND "source"."Item Installed Date" >= '${fromDate}'::timestamp`;
        }
        if (toDate) {
            issueDateCondition += ` AND "source"."Item Installed Date" <= '${toDate}'::timestamp`;
        }
        const query = `
        SELECT "source"."id" AS "id",
        "source"."reference_document_number" AS "reference_document_number",
        "source"."created_at" AS "created_at",
        "source"."Projects__name" AS "Projects__name",
        "source"."Organizations - Customer__name" AS "Organizations - Customer__name",
        "source"."Master Maker Lovs - Material Type__name" AS "Master Maker Lovs - Material Type__name",
        "source"."Users - Installer__id" AS "Users - Installer__id",
        "source"."Users - Installer__name" AS "Users - Installer__name",
        "source"."Users - Installer__code" AS "Users - Installer__code",
        "source"."Material Serial Numbers__serial_number" AS "Material Serial Numbers__serial_number",
        "source"."Serial Number Numeric Extract" AS "Serial Number Numeric Extract",
        "source"."Item Status" AS "Item Status",
        "source"."Item Installed Date" AS "Item Installed Date",
        "source"."Item Issued Rank" AS "Item Issued Rank",
        "Users - Supervisor"."name" AS "Users - Supervisor__name",
        "Users - Supervisor"."code" AS "Users - Supervisor__code"
    FROM
        (WITH INSTALLEDSTOCKLEDGERS AS
                (SELECT MSN.SERIAL_NUMBER,
                        MAX(SL.CREATED_AT) AS INSTALLED_AT
                    FROM "public"."stock_ledgers" AS SL
                    INNER JOIN "public"."material_serial_numbers" AS MSN ON SL.ID = MSN.STOCK_LEDGER_ID
                    WHERE SL.TRANSACTION_TYPE_ID = 'f3848838-6e7c-4240-a4e2-27e084164a17'
                    GROUP BY MSN.SERIAL_NUMBER
                    ORDER BY MSN.SERIAL_NUMBER) SELECT SL."id",
                SL."reference_document_number",
                SL."created_at",
                PROJECTS."name" AS "Projects__name",
                "Organizations - Customer"."name" AS "Organizations - Customer__name",
                "Master Maker Lovs - Material Type"."name" AS "Master Maker Lovs - Material Type__name",
                "Users - Installer"."id" AS "Users - Installer__id",
                "Users - Installer"."name" AS "Users - Installer__name",
                "Users - Installer"."code" AS "Users - Installer__code",
                "Material Serial Numbers"."serial_number" AS "Material Serial Numbers__serial_number",
                CAST(REGEXP_REPLACE("Material Serial Numbers"."serial_number",
    
                                        '[^0-9]',
                                        '',
                                        'g') AS BIGINT) AS "Serial Number Numeric Extract",
                CASE
                                WHEN ISL.SERIAL_NUMBER IS NOT NULL THEN 'Installed'
                                ELSE 'Issued'
                END AS "Item Status",
                ISL.INSTALLED_AT AS "Item Installed Date",
                ROW_NUMBER() OVER (PARTITION BY "Material Serial Numbers"."serial_number"
                                                                                            ORDER BY SL."created_at" DESC) AS "Item Issued Rank"
            FROM "public"."stock_ledgers" AS SL
            LEFT JOIN "public"."projects" AS PROJECTS ON SL."project_id" = PROJECTS."id"
            LEFT JOIN "public"."organizations" AS "Organizations - Customer" ON PROJECTS."customer_id" = "Organizations - Customer"."id"
            LEFT JOIN "public"."materials" AS MATERIALS ON SL."material_id" = MATERIALS."id"
            LEFT JOIN "public"."master_maker_lovs" AS "Master Maker Lovs - Material Type" ON MATERIALS."material_type_id" = "Master Maker Lovs - Material Type"."id"
            LEFT JOIN "public"."users" AS "Users - Installer" ON SL."installer_id" = "Users - Installer"."id"
            LEFT JOIN "public"."material_serial_numbers" AS "Material Serial Numbers" ON SL."id" = "Material Serial Numbers"."stock_ledger_id"
            LEFT JOIN INSTALLEDSTOCKLEDGERS AS ISL ON "Material Serial Numbers"."serial_number" = ISL.SERIAL_NUMBER
            WHERE SL."transaction_type_id" = '5b4e46d5-7bf5-4f42-8c4a-b6337533fdff'
                AND MATERIALS."is_serial_number" = TRUE
                ${whereCondition}
                AND ("Users - Installer"."name" IS NOT NULL)
                AND (("Users - Installer"."name" <> '')
                                    OR ("Users - Installer"."name" IS NULL))
            ) AS "source"
    LEFT JOIN "public"."supervisor_assignments" AS "Supervisor Assignments" ON "source"."Users - Installer__id" = "Supervisor Assignments"."user_id"
    LEFT JOIN "public"."users" AS "Users - Supervisor" ON "Supervisor Assignments"."supervisor_id" = "Users - Supervisor"."id"
    WHERE ("Users - Supervisor"."name" IS NOT NULL)
        AND (("Users - Supervisor"."name" <> '')
                            OR ("Users - Supervisor"."name" IS NULL))
        AND ("source"."Item Issued Rank" = 1) ${issueDateCondition}
        `;

        const paginations = {
            offset: reqQuery.pageNumber > 1 ? (reqQuery.pageNumber - 1) * reqQuery.rowPerPage : 0,
            limit: reqQuery.rowPerPage || 0
        };

        const paginationParams = generatePaginationParams(paginations);

        const [result, countResult] = await Promise.all([db.sequelize.selectQuery(`${query} ${paginationParams}`), db.sequelize.selectQuery(`SELECT COUNT(*) FROM (${query}) AS subquery`)]);
        const [rows] = result;
        const [[{ count }]] = countResult;
        return { rows, count: +count };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ISSUES_FETCHING_REPORT, error);
    }
};

const getStockLedgerInstallerList = async (projectIds = []) => {
    try {
        const { db } = new Users();
        const installerQuery = `
            SELECT USERS.NAME,
            USERS.CODE,
            USERS.ID
            FROM STOCK_LEDGERS
            INNER JOIN USERS ON STOCK_LEDGERS.INSTALLER_ID = USERS.ID
            WHERE STOCK_LEDGERS.INSTALLER_ID IS NOT NULL
                AND STOCK_LEDGERS.IS_ACTIVE = '1'
                AND USERS.IS_ACTIVE = '1'
                AND STOCK_LEDGERS.PROJECT_ID IN ('${projectIds.join("', '")}')
            GROUP BY USERS.ID
        `;
        const [installers] = await db.sequelize.selectQuery(installerQuery);
        return installers;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const PMML_UNIT_QUERY = (formName, columnList = []) => `
            SELECT 
                ARRAY_AGG(
                    JSON_BUILD_OBJECT(
                        'id', pmml.id,
                        'name', pmml.name
                    )
                ) AS pmml,
                FA.PROPERTIES->>'values' AS value_arr,
                FA.COLUMN_NAME,
                FA.NAME,
                forms.table_name
            FROM 
                FORM_ATTRIBUTES AS FA
            LEFT JOIN 
                ALL_MASTERS_LIST AS AML ON AML.ID = (FA.PROPERTIES ->> 'sourceTable')::UUID
            LEFT JOIN PROJECT_MASTER_MAKER_LOVS as pmml on pmml.master_id = (FA.PROPERTIES -> 'conditions' -> 0 ->> 'value')::UUID
            LEFT JOIN 
                FORMS ON FORMS.ID = FA.FORM_ID
            WHERE 
                FORMS.NAME = '${formName}'
                AND FORMS.IS_ACTIVE = '1'
                AND FA.COLUMN_NAME IN (
                    '${columnList.join("','")}'
                )
            GROUP BY 
                FA.COLUMN_NAME,
                FA.NAME,
                forms.table_name,
                FA.PROPERTIES->>'values';
        `;

const SURVEY_STATS_UNTIL = (tableName, columnData = []) => `
        SELECT 
            COUNT(*) AS "total_records",
            ${columnData.map((data) => {
        if (data.value_arr) {
            return `JSON_BUILD_OBJECT(${data.value_arr
                .split(",")
                .map((value) => `
                    '${value}', COUNT(DISTINCT CASE WHEN ZF.${data.column_name} = '${value}' THEN ZF.ID END)
                `)
                .join(",")},
                'null', COUNT(DISTINCT CASE WHEN ZF.${data.column_name} IS NULL THEN ZF.ID END)) AS "${data.name}"`;
        } else {
            return `JSON_BUILD_OBJECT(${data.pmml
                .map(({ name, id }) => `
                    '${name}', COUNT(DISTINCT CASE WHEN ZF.${data.column_name}[1]::UUID = '${id}' THEN ZF.ID END)
                `)
                .join(",")},
                'null', COUNT(DISTINCT CASE WHEN ZF.${data.column_name}[1]::UUID IS NULL THEN ZF.ID END)) AS "${data.name}"`;
        }
    })}
        FROM ${tableName} AS ZF WHERE ZF.IS_ACTIVE = '1'    
`;

const getSiteExceptionReport = async () => {
    try {
        const { db } = new Forms();
        // const data = await forms.findAll({ name: ["DT Survey", "WC Consumer Survey"] }, ["tableName", "name"]);
        // const [{ tableName: dtTableName }] = data.filter(({ name }) => name === "DT Survey");
        // const [{ tableName: wcTableName }] = data.filter(({ name }) => name === "WC Consumer Survey");
        const dtSurveyColumnQuery = PMML_UNIT_QUERY("DT Survey", [
            "dt_accessibility",
            "type_of_cable",
            "dt_rating_visiblity",
            "dt_mounting",
            "trans_body_earth",
            "tran_neutral_earth",
            "modem_available",
            "lt_bushing_condi"]);
        const wcConsumerSurveyColumnQuery = PMML_UNIT_QUERY("WC Consumer Survey", [
            "type_of_premises",
            "meter_location",
            "reason_for_non_survy",
            "connection_status",
            "bill_available",
            "type_of_mobile_phone",
            "mtr_reding_visible",
            "meter_reachability",
            "service_line",
            "service_cable_type",
            "service_cable_status"
        ]);
        const [[dtSurveyColumnData], [wcConsumerSurveyColumnData]] = await Promise.all([db.sequelize.selectQuery(dtSurveyColumnQuery), db.sequelize.selectQuery(wcConsumerSurveyColumnQuery)]);
        const [{ table_name: dtTableName }] = dtSurveyColumnData;
        const [{ table_name: wcTableName }] = wcConsumerSurveyColumnData;

        const dtSurveyStatsQuery = SURVEY_STATS_UNTIL(dtTableName, dtSurveyColumnData);
        const wcSurveyStatsQuery = SURVEY_STATS_UNTIL(wcTableName, wcConsumerSurveyColumnData);

        const [[dtSurveyStatsData], [wcSurveyStatsData]] = await Promise.all([db.sequelize.selectQuery(dtSurveyStatsQuery), db.sequelize.selectQuery(wcSurveyStatsQuery)]);

        return { dtSurveyStatsData, wcSurveyStatsData };
        
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_SERVER_ERROR, error);
    }
};

const areaWiseProductivityQueryGenerator = (tableName, gaaHierarchy, whereCondition, pagination = "") => `
SELECT 
    main.${gaaHierarchy}[1],
    COUNT(*) AS TOTAL,
    COUNT(DISTINCT main.CREATED_BY) AS MAN_POWER,
    CASE
        WHEN COUNT(DISTINCT main.CREATED_BY) = 0 THEN 0
        ELSE ROUND(COUNT(*)::numeric / COUNT(DISTINCT main.CREATED_BY), 2)
    END AS AVG_PRODUCTIVITY,
    sub.min_productivity as MIN_PRODUCTIVITY,
    sub.max_productivity as MAX_PRODUCTIVITY
FROM 
    ${tableName} AS main
LEFT JOIN (
    SELECT 
        ${gaaHierarchy},
        MIN(count_per_created_by) AS min_productivity,
        MAX(count_per_created_by) AS max_productivity
    FROM (
        SELECT 
            ${gaaHierarchy},
            CREATED_BY,
            COUNT(*) AS count_per_created_by
        FROM 
            ${tableName}
        ${whereCondition.replaceAll("main.", "")}
        GROUP BY 
            ${gaaHierarchy}, CREATED_BY
    ) AS counts
    GROUP BY ${gaaHierarchy}
) AS sub ON main.${gaaHierarchy} = sub.${gaaHierarchy}
${whereCondition}
GROUP BY main.${gaaHierarchy}[1], sub.min_productivity, sub.max_productivity
${pagination};        
`;

const CountareaWiseProductivityQueryGenerator = (tableName, gaaHierarchy, whereCondition) => `
    SELECT COUNT(*)
    FROM (
        SELECT 
            main.${gaaHierarchy}[1],
            COUNT(*) AS TOTAL,
            COUNT(DISTINCT main.CREATED_BY) AS MAN_POWER,
            CASE
                WHEN COUNT(DISTINCT main.CREATED_BY) = 0 THEN 0
                ELSE ROUND(COUNT(*)::numeric / COUNT(DISTINCT main.CREATED_BY), 2)
            END AS AVG_PRODUCTIVITY,
            sub.min_productivity as MIN_PRODUCTIVITY,
            sub.max_productivity as MAX_PRODUCTIVITY
        FROM 
            ${tableName} AS main
        LEFT JOIN (
            SELECT 
                ${gaaHierarchy},
                MIN(count_per_created_by) AS min_productivity,
                MAX(count_per_created_by) AS max_productivity
            FROM (
                SELECT 
                    ${gaaHierarchy},
                    CREATED_BY,
                    COUNT(*) AS count_per_created_by
                FROM 
                    ${tableName}
                ${whereCondition.replaceAll("main.", "")}
                GROUP BY 
                    ${gaaHierarchy}, CREATED_BY
            ) AS counts
            GROUP BY ${gaaHierarchy}
        ) AS sub ON main.${gaaHierarchy} = sub.${gaaHierarchy}
        ${whereCondition}
        GROUP BY main.${gaaHierarchy}[1], sub.min_productivity, sub.max_productivity;   
    ) AS TOTAL_QUERY;
`;

const getAreaWiseProductivity = async (req) => {
    try {
        const { formId, gaaHierarchy, dateFrom, dateTo, formType, pageNumber, rowPerPage } = req.query;

        const condition = [];
        if (dateFrom) {
            condition.push(`main.created_at >= '${dateFrom}'::timestamp`);
        }
        if (dateTo) {
            condition.push(`main.created_at <= '${dateTo}'::timestamp`);
        }
    
        const forms = new Forms();
        const basicDetailQuery = `
            SELECT F.NAME AS "form",
                F.TABLE_NAME AS "tableName",
                P.NAME AS "project",
                MML.NAME AS "formType"
            FROM FORMS AS F
            INNER JOIN PROJECTS AS P ON P.ID = F.PROJECT_ID
            INNER JOIN MASTER_MAKER_LOVS AS MML ON MML.MASTER_ID = '861bfe8c-d3d6-4705-b6cc-5982634091a5'
            WHERE F.ID = '${formId}'
                AND MML.ID = F.FORM_TYPE_ID
        `;
        const [[{ form, tableName, project, formType: formTypeName }]] = await forms.db.sequelize.selectQuery(basicDetailQuery);
        let data;
        let count;
        const pgNum = (pageNumber) || 1;
        const rPerPage = (rowPerPage) || 25;
        const pagination = `OFFSET ${(pgNum - 1) * rPerPage} LIMIT ${rPerPage}`;
        if (formType === "1d75feca-2e64-4b95-900d-fcd53446ddeb") {
            // Form Type is SURVEY
            condition.push(`main.${gaaHierarchy.columnName}[1] in ('${gaaHierarchy.columnValue.join("','")}')`);
            const whereCondition = condition.length ? `WHERE ${condition.join(" AND ")}` : "";
            const sqlQuery = `
                SELECT MAIN.${gaaHierarchy.columnName}[1], ${gaaHierarchy.allLevelNames.map((level) => `main.${level}[1]`)},
                    COUNT(*) AS TOTAL,
                    COUNT(DISTINCT MAIN.CREATED_BY) AS MAN_POWER,
                    CASE
                                    WHEN COUNT(DISTINCT MAIN.CREATED_BY) = 0 THEN 0
                                    ELSE ROUND(COUNT(*)::numeric / COUNT(DISTINCT MAIN.CREATED_BY),
                
                                                            2)
                    END AS AVG_PRODUCTIVITY,
                    SUB.MIN_PRODUCTIVITY AS MIN_PRODUCTIVITY,
                    SUB.MAX_PRODUCTIVITY AS MAX_PRODUCTIVITY
                FROM ${tableName} AS MAIN
                LEFT JOIN
                    (SELECT ${gaaHierarchy.lastLevelColumn},
                            MIN(COUNT_PER_CREATED_BY) AS MIN_PRODUCTIVITY,
                            MAX(COUNT_PER_CREATED_BY) AS MAX_PRODUCTIVITY
                        FROM
                            (SELECT ${gaaHierarchy.lastLevelColumn},
                                    CREATED_BY,
                                    COUNT(*) AS COUNT_PER_CREATED_BY
                                FROM ${tableName}
                                ${whereCondition.replaceAll("main.", "")}
                                GROUP BY ${gaaHierarchy.lastLevelColumn},
                                    CREATED_BY) AS COUNTS
                        GROUP BY ${gaaHierarchy.lastLevelColumn}) AS SUB ON MAIN.${gaaHierarchy.lastLevelColumn} = SUB.${gaaHierarchy.lastLevelColumn}
                    ${whereCondition}
                GROUP BY MAIN.${gaaHierarchy.columnName}[1], ${gaaHierarchy.allLevelNames.map((level) => `main.${level}[1]`)},
                    SUB.MIN_PRODUCTIVITY,
                    SUB.MAX_PRODUCTIVITY
                ${pagination};
            `;

            const sqlQueryCount = `
                SELECT COUNT(*)
                FROM (
                    SELECT MAIN.${gaaHierarchy.columnName}[1], ${gaaHierarchy.allLevelNames.map((level) => `main.${level}[1]`)},
                        COUNT(*) AS TOTAL,
                        COUNT(DISTINCT MAIN.CREATED_BY) AS MAN_POWER,
                        CASE
                                        WHEN COUNT(DISTINCT MAIN.CREATED_BY) = 0 THEN 0
                                        ELSE ROUND(COUNT(*)::numeric / COUNT(DISTINCT MAIN.CREATED_BY),
                    
                                                                2)
                        END AS AVG_PRODUCTIVITY,
                        SUB.MIN_PRODUCTIVITY AS MIN_PRODUCTIVITY,
                        SUB.MAX_PRODUCTIVITY AS MAX_PRODUCTIVITY
                    FROM ${tableName} AS MAIN
                    LEFT JOIN
                        (SELECT ${gaaHierarchy.lastLevelColumn},
                                MIN(COUNT_PER_CREATED_BY) AS MIN_PRODUCTIVITY,
                                MAX(COUNT_PER_CREATED_BY) AS MAX_PRODUCTIVITY
                            FROM
                                (SELECT ${gaaHierarchy.lastLevelColumn},
                                        CREATED_BY,
                                        COUNT(*) AS COUNT_PER_CREATED_BY
                                    FROM ${tableName}
                                    ${whereCondition.replaceAll("main.", "")}
                                    GROUP BY ${gaaHierarchy.lastLevelColumn},
                                        CREATED_BY) AS COUNTS
                            GROUP BY ${gaaHierarchy.lastLevelColumn}) AS SUB ON MAIN.${gaaHierarchy.lastLevelColumn} = SUB.${gaaHierarchy.lastLevelColumn}
                        ${whereCondition}
                    GROUP BY MAIN.${gaaHierarchy.columnName}[1], ${gaaHierarchy.allLevelNames.map((level) => `main.${level}[1]`)},
                        SUB.MIN_PRODUCTIVITY,
                        SUB.MAX_PRODUCTIVITY
                ) AS TOTAL_QUERY;
            `;

            const [result] = await forms.db.sequelize.selectQuery(sqlQuery);
            [count] = await forms.db.sequelize.selectQuery(sqlQueryCount);
            
            const gaaLevelIds = {};
            result.forEach((data) => {
                gaaLevelIds[data[gaaHierarchy.columnName]] = 1;
                gaaHierarchy.allLevelNames.forEach((level) => {
                    gaaLevelIds[data[level]] = 1;
                });
            });

            let gaaLevelEntryNames = [];
            if (Object.keys(gaaLevelIds).length) {
                [gaaLevelEntryNames] = await forms.db.sequelize.selectQuery(`
                    SELECT GLE.ID,
                        GLE.NAME
                    FROM GAA_LEVEL_ENTRIES AS GLE
                    WHERE GLE.ID in ('${Object.keys(gaaLevelIds).join("','")}')
                `);
            }

            gaaLevelEntryNames.forEach(({ id, name }) => {
                gaaLevelIds[id] = name;
            });
            
            result.forEach((data) => {
                data[gaaHierarchy.columnName] = gaaLevelIds[data[gaaHierarchy.columnName]];
                gaaHierarchy.allLevelNames.forEach((level) => {
                    data[level] = gaaLevelIds[data[level]];
                });
                data.form = form;
                data.project = project;
                data.formType = formTypeName;
            });
            data = result;
        } else if (formType === "30ea8a65-ff5b-4bff-b1a1-892204e23669") {
            // Form Type is Installation and O&M
            // O&M DATA
            const OMConditions = [...condition];
            OMConditions.push("main.ticket_id is not null");
            let whereCondition = OMConditions.length ? `WHERE ${OMConditions.join(" AND ")}` : "";
            const OMSqlQuery = areaWiseProductivityQueryGenerator(tableName, gaaHierarchy.columnName, whereCondition, pagination);
            const CountOMSqlQuery = CountareaWiseProductivityQueryGenerator(tableName, gaaHierarchy.columnName, whereCondition);
            const [result] = await forms.db.sequelize.selectQuery(OMSqlQuery);
            [count] = await forms.db.sequelize.selectQuery(CountOMSqlQuery);

            const [OMIds] = await forms.db.sequelize.selectQuery(`
                SELECT DISTINCT ON (record_id) ID
                FROM ${tableName}_HISTORY
                WHERE RECORD_ID IN (
                    SELECT DISTINCT ID
                    FROM ${tableName}
                    WHERE TICKET_ID IS NOT NULL
                );
            `);
            
            const installationCondition = [...condition];
            installationCondition.push(`main.id in ('${OMIds.map(({ id }) => id).join("','")}')`);
            whereCondition = installationCondition ? `WHERE ${installationCondition.join(" AND ")}` : "";
            const installationHistoryQuery = areaWiseProductivityQueryGenerator(`${tableName}_history`, gaaHierarchy, whereCondition);
            const [installationHistoryData] = await forms.db.sequelize.selectQuery(installationHistoryQuery);

            data["o&m"] = result;
            data.installation = installationHistoryData;
        }
        return { count: parseInt(count[0]?.count), rows: data };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_SERVER_ERROR, error);
    }
};

module.exports = {
    getAreaWiseProductivity,
    fetchDashboard,
    getGaaHierarchiesReport,
    getReportData,
    supervisorMaterialReport,
    installerMaterialReport,
    getStockLedgerInstallerList,
    getSiteExceptionReport
};
