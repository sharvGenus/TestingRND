const { throwError, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const StockLedgerDetails = require("../../database/operation/stock-ledger-details");
const StockLedgers = require("../../database/operation/stock-ledgers");
const { getUserGovernedLovArray } = require("../access-management/access-management.service");
const { validateUUID, generatePaginationParams } = require("../../utilities/common-utils");
const Forms = require("../../database/operation/forms");
const { getAllSupervisorAssignments } = require("../supervisor-assignments/supervisor-assignments.service");
const MaterialSerialNumbers = require("../../database/operation/material-serial-numbers");
const { getUnionAllFormReponses } = require("../../utilities/queryUtils/dashboardAndReportsUtils");

const executeQuery = async (db, query) => (await db.sequelize.selectQuery(query))[0];

const uuids = {
    companyOrganizationTypeId: "420e7b13-25fd-4d23-9959-af1c07c7e94b",
    contractorOrganizationTypeId: "decb6c57-6d85-4f83-9cc2-50e0630003df",
    installedTransactionTypeId: "f3848838-6e7c-4240-a4e2-27e084164a17",
    cancelInstalledTransactionTypeId: "923fa9a0-5ed5-4bc2-9946-dad0da5f34c4",
    grnTransactionTypeId: "3bf4cfe9-0ba0-4ba5-bd66-bfae7eecfeaf",
    ptpTransactionTypeId: "22ce5829-2a1e-407c-88f6-5ebc38455519",
    ctiTransactionTypeId: "5b4e46d5-7bf5-4f42-8c4a-b6337533fdff",
    itcTransactionTypeId: "799ee00c-0819-498a-9e47-3ac269f33db8",
    oldMeterTransactionTypeId: "cb92ec5a-3f86-48cf-86b8-9359dda410a5",
    cancelOldMeterTransactionTypeId: "79f09003-a389-4a81-abd8-43b77a5f914b"
};

const currentDateConstraint = '("Form Response"."created_at" >= CURRENT_DATE)';

const join = ({ type, table, alias, on, condition, onlyActive = true }) => `${type.toUpperCase()} JOIN\n
    ${table.includes("(") ? table : `"${table}"`} AS "${alias}"\n
        ON ${on}
        ${condition ? ` AND ${condition}` : ""}
        ${onlyActive ? ` AND "${alias}"."is_active" = '1'` : ""}`;

const generateInstalledQuantitySelector = () => `
ABS(
    SUM(
        CASE
            WHEN "Organization Type"."id" = '${uuids.companyOrganizationTypeId}'
            AND "Transaction Type"."id" = '${uuids.installedTransactionTypeId}'
            AND LOWER("Organization Store Location"."name") NOT ILIKE '%installed%'
            AND "Transaction"."installer_id" IS NOT NULL THEN "Transaction"."quantity"
            WHEN "Organization Type"."id" = '${uuids.contractorOrganizationTypeId}'
            AND "Transaction Type"."id" = '${uuids.installedTransactionTypeId}'
            AND "Transaction"."installer_id" IS NOT NULL THEN "Transaction"."quantity"
            ELSE 0
        END
    )
)
`;

const generateMeterIssuedToContractorSelector = () => `
SUM(
    CASE
        WHEN "Transaction Type"."id" IN (
            '${uuids.grnTransactionTypeId}',
            '${uuids.ptpTransactionTypeId}'
        ) THEN "Transaction"."quantity"
        ELSE 0
    END
)
`;

const generateMeterAvailableAtContractorSelector = () => `
SUM(
    CASE
        WHEN NOT (
            "Organization Store Location"."name" ILIKE '%installed%'
        )
        AND "Transaction"."installer_id" IS NULL THEN "Transaction"."quantity"
        ELSE 0
    END
)
`;

const generateMeterIssuedToInstallerSelector = () => `
SUM(
    CASE
        WHEN "Transaction Type"."id" IN (
            '${uuids.ctiTransactionTypeId}',
            '${uuids.itcTransactionTypeId}'
        )
        AND "Transaction"."installer_id" IS NOT NULL THEN "Transaction"."quantity"
        ELSE 0
    END
)
`;

const generateMeterAvailableAtInstallerSelector = () => `
SUM(
    CASE
        WHEN NOT (
            "Organization Store Location"."name" ILIKE '%installed%'
        )
        AND "Transaction Type"."id" NOT IN (
            '${uuids.oldMeterTransactionTypeId}',
            '${uuids.cancelOldMeterTransactionTypeId}'
        )
        AND "Transaction"."installer_id" IS NOT NULL THEN "Transaction"."quantity"
        ELSE 0
    END
)
`;

const generateAgingSelector = ({ selectorName, dateSince = null, dateTill = null, isValueSelector = false, conditionPartOnly = false }) => {
    const conditionPart = `
        NOT (
            "Organization Store Location"."name" ILIKE '%installed%'
        )
        AND "Transaction"."installer_id" IS NULL
        ${dateSince ? `AND "Transaction"."created_at" >= CURRENT_DATE - INTERVAL '${Math.abs(dateSince)} days'` : ""}
        ${dateTill ? `AND "Transaction"."created_at" < CURRENT_DATE - INTERVAL '${Math.abs(dateTill)} days'` : ""}`;

    if (conditionPartOnly) return conditionPart;

    const selector = isValueSelector ? 'ABS("Transaction"."rate" * "Transaction"."quantity")' : 'ABS("Transaction"."quantity")';

    return `
        SUM(
            CASE
                WHEN ${conditionPart} THEN ${selector}
                ELSE 0
            END
        ) AS "${selectorName}"`;
};

const accessorToQuantityConditions = {
    "Qty( >= 0 <30)": generateAgingSelector({ dateSince: -30, dateTill: null, conditionPartOnly: true }),
    "Qty(>= 30 < 60)": generateAgingSelector({ dateSince: -60, dateTill: -30, conditionPartOnly: true }),
    "Qty(>= 60 < 90)": generateAgingSelector({ dateSince: -90, dateTill: -60, conditionPartOnly: true }),
    "Qty(>= 90)": generateAgingSelector({ dateSince: null, dateTill: -90, conditionPartOnly: true })
};

// ====================== || Aging Of Materials Queries Start || ====================== //
const agingOfMaterialMainQuery = (whereClause) => `
WITH
  "CalculatedQuantities" AS (
    SELECT
      "Transaction"."store_id",
      "Transaction"."material_id",
      "Transaction"."store_location_id",
      SUM(
        CASE
          WHEN "Transaction Type"."name" IN ('GRN', 'MRN') THEN "Transaction"."quantity"
          ELSE 0
        END
      ) AS "GRN",
      SUM(
        CASE
          WHEN "Transaction Type"."name" IN ('MIN', 'STO', 'STC', 'PTP', 'STSRC') THEN "Transaction"."quantity"
          ELSE 0
        END
      ) AS "Delivery_Challan",
      SUM(
        CASE
          WHEN "Transaction Type"."name" IN ('MRN') THEN "Transaction"."quantity"
          ELSE 0
        END
      ) AS "MRN",
      SUM(
        CASE
          WHEN "Transaction Type"."name" IN ('CONSUMPTION') THEN "Transaction"."quantity"
          ELSE 0
        END
      ) AS "Consumption",
      ${generateInstalledQuantitySelector()} AS "Installed"
    FROM
      "public"."stock_ledgers" AS "Transaction"
      INNER JOIN "public"."master_maker_lovs" AS "Transaction Type" ON "Transaction"."transaction_type_id" = "Transaction Type"."id"
      INNER JOIN "public"."organization_stores" AS "Organization Store" ON "Transaction"."store_id" = "Organization Store"."id"
      INNER JOIN "public"."organizations" AS "Organization" ON "Organization Store"."organization_id" = "Organization"."id"
      INNER JOIN "public"."master_maker_lovs" AS "Organization Type" ON "Organization"."organization_type_id" = "Organization Type"."id"
      INNER JOIN "public"."organization_store_locations" AS "Organization Store Location" ON "Organization Store Location"."id" = "Transaction"."store_location_id"
      WHERE
      NOT "Transaction"."is_cancelled"
      ${whereClause}
    GROUP BY
      "Transaction"."store_id",
      "Transaction"."material_id",
      "Transaction"."store_location_id"
  )
SELECT
  "Organization Store"."name" AS "Store",
  "Organization Store"."id" AS "Store ID",
  "Materials"."name" AS "Material",
  "Materials"."id" AS "Material ID",
  ABS(SUM("CalculatedQuantities"."GRN")) AS "GRN",
  ABS(SUM("CalculatedQuantities"."Delivery_Challan")) AS "Delivery Challan (MIN, STO, STC, PTP & STSRC)",
  ABS(SUM("CalculatedQuantities"."MRN")) AS "MRN",
  CASE
    WHEN "Organization Type"."name" = 'COMPANY' THEN ABS(SUM("CalculatedQuantities"."GRN")) - ABS(SUM("CalculatedQuantities"."Delivery_Challan"))
    ELSE ABS(SUM("CalculatedQuantities"."GRN")) - ABS(SUM("CalculatedQuantities"."MRN"))
  END AS "Net Issue",
  ABS(SUM("CalculatedQuantities"."Consumption")) AS "Consumption",
  ABS(SUM("CalculatedQuantities"."Installed")) AS "Installed",
  CASE
    WHEN "Organization Type"."name" = 'COMPANY' THEN ABS(SUM("CalculatedQuantities"."GRN")) - ABS(SUM("CalculatedQuantities"."Delivery_Challan")) - (
      ABS(SUM("CalculatedQuantities"."Consumption")) + ABS(SUM("CalculatedQuantities"."Installed"))
    )
    ELSE ABS(SUM("CalculatedQuantities"."GRN")) - ABS(SUM("CalculatedQuantities"."MRN")) - (
      ABS(SUM("CalculatedQuantities"."Consumption")) + ABS(SUM("CalculatedQuantities"."Installed"))
    )
  END AS "At Stores",
  CASE
    WHEN "Organization Type"."name" = 'COMPANY' THEN ABS(SUM("CalculatedQuantities"."GRN")) - ABS(SUM("CalculatedQuantities"."Delivery_Challan")) - (
      ABS(SUM("CalculatedQuantities"."Consumption")) + ABS(SUM("CalculatedQuantities"."Installed"))
    )
    ELSE ABS(SUM("CalculatedQuantities"."GRN")) - ABS(SUM("CalculatedQuantities"."MRN")) - (
      ABS(SUM("CalculatedQuantities"."Consumption")) + ABS(SUM("CalculatedQuantities"."Installed"))
    )
  END AS "Material With Contractor"
FROM
  "CalculatedQuantities"
  INNER JOIN "public"."organization_stores" AS "Organization Store" ON "CalculatedQuantities"."store_id" = "Organization Store"."id"
  INNER JOIN "public"."organizations" AS "Organizations" ON "Organization Store"."organization_id" = "Organizations"."id"
  INNER JOIN "public"."master_maker_lovs" AS "Organization Type" ON "Organizations"."organization_type_id" = "Organization Type"."id"
  INNER JOIN "public"."materials" AS "Materials" ON "CalculatedQuantities"."material_id" = "Materials"."id"
  INNER JOIN "public"."organization_store_locations" AS "Organization Store Location" ON "Organization Store Location"."id" = "CalculatedQuantities"."store_location_id"
WHERE
  "Organization Type"."name" IN ('COMPANY', 'CONTRACTOR')
GROUP BY
  "Organization Store"."name",
  "Organization Store"."id",
  "Materials"."name",
  "Materials"."id",
  "Organization Type"."name"
ORDER BY
  "Organization Store"."name" ASC,
  "Materials"."name" ASC
`;

const subReportCentralQuery = (whereClause) => `
SELECT
    "Material"."id" AS "Material ID",
    "Material"."name" AS "Material Name",
    "UOM"."name" AS "UOM",
    "Transaction"."id" AS "Transaction ID",
    "Transaction Type"."name" AS "Transaction Type Name",
    "Material"."is_serial_number" AS "Is Serial Number",
    "Transaction"."store_id" AS "Store ID",
    "Transaction"."reference_document_number" AS "Document No",
    "Transaction"."created_at" AS "Date",
    0 AS "MIV",
    0 AS "MRN",
    0 AS "CONSUMPTION",
    ${generateAgingSelector({ selectorName: "Qty( >= 0 <30)", dateSince: -30, dateTill: null })},
    ${generateAgingSelector({ selectorName: "Qty(>= 30 < 60)", dateSince: -60, dateTill: -30 })},
    ${generateAgingSelector({ selectorName: "Qty(>= 60 < 90)", dateSince: -90, dateTill: -60 })},
    ${generateAgingSelector({ selectorName: "Qty(>= 90)", dateSince: null, dateTill: -90 })},
    ${generateAgingSelector({ selectorName: "Value(>= 0 < 30)", dateSince: -30, dateTill: null, isValueSelector: true })},
    ${generateAgingSelector({ selectorName: "Value(>= 30 < 60)", dateSince: -60, dateTill: -30, isValueSelector: true })},
    ${generateAgingSelector({ selectorName: "Value(>= 60 < 90)", dateSince: -90, dateTill: -60, isValueSelector: true })},
    ${generateAgingSelector({ selectorName: "Value(>= 90)", dateSince: null, dateTill: -90, isValueSelector: true })}
FROM
    "public"."stock_ledgers" AS "Transaction"
    INNER JOIN "public"."materials" AS "Material" ON "Transaction"."material_id" = "Material"."id"
    INNER JOIN "public"."master_maker_lovs" AS "Transaction Type" ON "Transaction"."transaction_type_id" = "Transaction Type"."id"
    INNER JOIN "public"."master_maker_lovs" AS "UOM" ON "UOM"."id" = "Material"."uom_id"
    INNER JOIN "public"."organization_store_locations" AS "Organization Store Location" ON "Organization Store Location"."id" = "Transaction"."store_location_id"
WHERE
    NOT "Transaction"."is_cancelled"
    AND "Transaction Type"."name" = 'GRN'
    ${whereClause}
GROUP BY
    "Material ID",
    "UOM"."name",
    "Transaction ID",
    "Transaction Type"."name",
    "Store ID",
    "Document No",
    "Date"
`;

const subReportCentralQueryFurtherSummary = (whereClause) => `
SELECT
    "subquery"."Material ID" AS "Material ID",
    "subquery"."Material Name" AS "Material Name",
    "subquery"."UOM" AS "UOM",
    "subquery"."Is Serial Number" AS "Is Serial Number",
    "subquery"."Store ID" AS "Store ID",
    SUM("subquery"."MIV") AS "MIV",
    SUM("subquery"."MRN") AS "MRN",
    SUM("subquery"."CONSUMPTION") AS "CONSUMPTION",
    SUM("subquery"."Qty( >= 0 <30)") AS "Qty( >= 0 <30)",
    SUM("subquery"."Qty(>= 30 < 60)") AS "Qty(>= 30 < 60)",
    SUM("subquery"."Qty(>= 60 < 90)") AS "Qty(>= 60 < 90)",
    SUM("subquery"."Qty(>= 90)") AS "Qty(>= 90)",
    SUM("subquery"."Value(>= 0 < 30)") AS "Value(>= 0 < 30)",
    SUM("subquery"."Value(>= 30 < 60)") AS "Value(>= 30 < 60)",
    SUM("subquery"."Value(>= 60 < 90)") AS "Value(>= 60 < 90)",
    SUM("subquery"."Value(>= 90)") AS "Value(>= 90)"
FROM
    (
        SELECT
            "subquery"."Material ID" AS "Material ID",
            "subquery"."Material Name" AS "Material Name",
            "subquery"."UOM" AS "UOM",
            "subquery"."Is Serial Number" AS "Is Serial Number",
            "subquery"."Store ID" AS "Store ID",
            SUM("subquery"."MIV") AS "MIV",
            SUM("subquery"."MRN") AS "MRN",
            SUM("subquery"."CONSUMPTION") AS "CONSUMPTION",
            SUM("subquery"."Qty( >= 0 <30)") AS "Qty( >= 0 <30)",
            SUM("subquery"."Qty(>= 30 < 60)") AS "Qty(>= 30 < 60)",
            SUM("subquery"."Qty(>= 60 < 90)") AS "Qty(>= 60 < 90)",
            SUM("subquery"."Qty(>= 90)") AS "Qty(>= 90)",
            SUM("subquery"."Value(>= 0 < 30)") AS "Value(>= 0 < 30)",
            SUM("subquery"."Value(>= 30 < 60)") AS "Value(>= 30 < 60)",
            SUM("subquery"."Value(>= 60 < 90)") AS "Value(>= 60 < 90)",
            SUM("subquery"."Value(>= 90)") AS "Value(>= 90)"
        FROM
            (
                ${subReportCentralQuery(whereClause)}
            ) "subquery"
        GROUP BY
            "subquery"."Material ID",
            "subquery"."Material Name",
            "subquery"."UOM",
            "subquery"."Is Serial Number",
            "subquery"."Store ID"
        UNION
        SELECT
            "Material"."id" AS "Material ID",
            "Material"."name" AS "Material Name",
            "UOM"."name" AS "UOM",
            "Material"."is_serial_number" AS "Is Serial Number",
            "Transaction"."store_id" AS "Store ID",
            SUM(
                CASE
                    WHEN "Transaction Type"."name" = 'MIN' THEN ABS("Transaction"."quantity")
                    ELSE 0
                END
            ) AS "MIV",
            SUM(
                CASE
                    WHEN "Transaction Type"."name" = 'MRN' THEN ABS("Transaction"."quantity")
                    ELSE 0
                END
            ) AS "MRN",
            SUM(
                CASE
                    WHEN "Transaction Type"."name" = 'CONSUMPTION' THEN ABS("Transaction"."quantity")
                    ELSE 0
                END
            ) AS "CONSUMPTION",
            0 AS "Qty( >= 0 <30)",
            0 AS "Qty(>= 30 < 60)",
            0 AS "Qty(>= 60 < 90)",
            0 AS "Qty(>= 90)",
            0 AS "Value(>= 0 < 30)",
            0 AS "Value(>= 30 < 60)",
            0 AS "Value(>= 60 < 90)",
            0 AS "Value(>= 90)"
        FROM
            "public"."stock_ledgers" AS "Transaction"
            INNER JOIN "public"."master_maker_lovs" AS "Transaction Type" ON "Transaction Type"."id" = "Transaction"."transaction_type_id"
            INNER JOIN "public"."materials" AS "Material" ON "Material"."id" = "Transaction"."material_id"
            INNER JOIN "public"."master_maker_lovs" AS "UOM" ON "UOM"."id" = "Material"."uom_id"
        WHERE
            NOT "Transaction"."is_cancelled"
            ${whereClause}
        GROUP BY
            "Material"."id",
            "Transaction Type"."name",
            "UOM"."name",
            "Material"."name",
            "Transaction"."store_id"
    ) "subquery"
GROUP BY
    "subquery"."Material ID",
    "subquery"."Material Name",
    "subquery"."UOM",
    "subquery"."Is Serial Number",
    "subquery"."Store ID"
`;

const serialNumbersFromSubReportCentralQuery = (whereClause) => `
WITH
  "SubRCentral" AS (
    ${subReportCentralQuery(whereClause)}
  )
SELECT
  "Material Serial Number"."serial_number" AS "Serial No",
  "SubRCentral"."Document No",
  "SubRCentral"."Date"
FROM
  "material_serial_numbers" AS "Material Serial Number"
  INNER JOIN "SubRCentral" ON "Material Serial Number"."material_id" = "SubRCentral"."Material ID" AND "Material Serial Number"."stock_ledger_id" = "SubRCentral"."Transaction ID"
`;

// ====================== || Aging Of Materials Queries End || ====================== //

// ====================== || Aging Of Materials Query Helpers Start || ====================== //
const formatConditionForSQL = (arr) => (Array.isArray(arr) ? `IN (${arr.map((item) => `'${item}'`).join(", ")})` : `= '${arr}'`);

function generateWhereClause(projectId, materialId, storeId, organizationId) {
    const conditions = [];

    if (projectId) {
        conditions.push(`"Transaction"."project_id" ${formatConditionForSQL(projectId)}`);
    }

    if (materialId) {
        conditions.push(`"Transaction"."material_id" ${formatConditionForSQL(materialId)}`);
    }

    if (storeId) {
        conditions.push(`"Transaction"."store_id" ${formatConditionForSQL(storeId)}`);
    }

    if (organizationId) {
        conditions.push(`("Organization"."id" ${formatConditionForSQL(organizationId)} OR "Organization"."parent_id" ${formatConditionForSQL(organizationId)})`);
    }

    return conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";
}

async function generateAccessConditions(userId) {
    const projectsLovData = await getUserGovernedLovArray(userId, "Project");
    const materialsLovData = await getUserGovernedLovArray(userId, "Material");
    const contractorStoresLovData = await getUserGovernedLovArray(userId, "Contractor Store");
    const companyStoresLovData = await getUserGovernedLovArray(userId, "Company Store");
    const combinedStoresLovData = [
        ...(Array.isArray(contractorStoresLovData) ? contractorStoresLovData : []),
        ...(Array.isArray(companyStoresLovData) ? companyStoresLovData : [])
    ];

    const accessConditions = `${Array.isArray(projectsLovData) && projectsLovData.length > 0 ? `("Transaction"."project_id" IN ('${projectsLovData.join("', '")}'))` : "(1 = 1)"} 
        AND ${Array.isArray(materialsLovData) && materialsLovData.length > 0 ? `("Transaction"."material_id" IN ('${materialsLovData.join("', '")}'))` : "(1 = 1)"}
        AND ${Array.isArray(combinedStoresLovData) && combinedStoresLovData.length > 0 ? `("Transaction"."store_id" IN ('${combinedStoresLovData.join("', '")}'))` : "(1 = 1)"}`;
    return accessConditions;
}

const executeAgingMaterialReportQuery = async (req, queryCreator, additionalParams = {}) => {
    const { db } = new Forms();
    const query = await queryCreator(req);
    const paginations = generatePaginationParams(req.query);
    const [queryResult, [countResult]] = await Promise.all([
        `${query} ${paginations}`,
        `SELECT COUNT(*) AS count FROM (${query}) as subquery`
    ].map((q) => executeQuery(db, q)));

    return { data: { rows: queryResult, count: +countResult.count } };
};
// ====================== || Aging Of Material Query Helpers End || ====================== //

// ====================== || Aging Of Material Service Functions Start || ====================== //
async function createAgingMaterialReportQuery(req) {
    const { userId } = req.user;
    const { projectId, storeId, organizationId, branchId, materialId } = req.query;
    throwIfNot(validateUUID(userId, projectId, storeId, organizationId, branchId, materialId), statusCodes.BAD_REQUEST, statusMessages.INVALID_UUID);

    const whereClause = generateWhereClause(projectId, materialId, storeId, branchId || organizationId);
    const accessConditions = await generateAccessConditions(userId);
    const query = agingOfMaterialMainQuery(`${whereClause} AND ${accessConditions}`);
    
    return query;
}

async function createAgingMaterialSubReportQuery(req) {
    const { projectId, materialId, storeId } = req.query;
    throwIfNot(validateUUID(projectId, materialId, storeId), statusCodes.BAD_REQUEST, statusMessages.INVALID_UUID);

    const whereClause = generateWhereClause(projectId, materialId, storeId);
    const query = subReportCentralQueryFurtherSummary(whereClause);
    return query;
}

async function createAgingMaterialSerialNumbersQuery(req) {
    const { projectId, materialId, storeId, header } = req.query;
    throwIfNot(validateUUID(projectId, materialId, storeId), statusCodes.BAD_REQUEST, statusMessages.INVALID_UUID);
    const quantityCondition = accessorToQuantityConditions[header];
    throwIfNot(header && quantityCondition, statusCodes.BAD_REQUEST, statusMessages.INVALID_HEADER);
    
    const whereClause = generateWhereClause(projectId, materialId, storeId);
    const query = serialNumbersFromSubReportCentralQuery(`${whereClause} AND ${quantityCondition}`);
    return query;
}
// ====================== || Aging Of Material Service Functions End || ====================== //

// ====================== || Stock Ledger Details Query Helpers Start || ====================== //
const getAllStockLedgerDetailsWithAssociation = async (associationWhere, whereCondition) => {
    try {
        const stockLedgerDetails = new StockLedgerDetails();
        const data = await stockLedgerDetails.findAndCountAllWithAssociation(
            associationWhere,
            whereCondition,
            undefined,
            true,
            undefined,
            false
        );
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_DETAIL_LIST_FAILURE, error);
    }
};
// ====================== || Stock Ledger Details Query Helpers End || ====================== //

const getTxnsForStockReport = async (where) => {
    try {
        const stockLedgers = new StockLedgers();
        stockLedgers.updateRelationForStockReport();
        const data = await stockLedgers.findAndCountAll(where, ["storeLocationId", "materialId", "uomId", "quantity", "rate", "value", "tax"], true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getAllTransactions = async (where) => {
    try {
        const stockLedgers = new StockLedgers();
        stockLedgers.updateRelationForReport();
        const data = await stockLedgers.findAndCountAll(where, ["projectId", "requestNumber", "organizationId", "storeId", "materialId", "quantity", "otherStoreId", "createdAt", "updatedAt"], true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getGrnSerialNumbers = async (where) => {
    try {
        const materialSerialNumbers = new MaterialSerialNumbers();
        const data = await materialSerialNumbers.findAndCountAllGrnSerialNo(where, ["serialNumber"], true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_SERIAL_NUMBER_FAILURE, error);
    }
};

const generateReportWhereCondition = (options = {}) => {
    const { id, tableSelector, excludeId } = options;
    let ids = Array.isArray(id) ? id.filter((id) => id !== undefined) : [id].filter((id) => id !== undefined);
    ids = ids.filter(validateUUID);
    return ids.length > 0 ? `("${tableSelector}"${!excludeId ? ".\"id\"" : ""} IN ('${ids.join("', '")}'))` : "(1 = 1)";
};

function generateDateWiseProductivityReportQuery({ projectId, formId, gaaLevel, gaaValue, dateFrom, dateTo, tableName }) {
    const query = `
        SELECT
            "source"."Projects__name" AS "Projects__name",
            "source"."Projects__code" AS "Projects__code",
            "source"."Form Type__name" AS "Task Type",
            CAST("source"."Installation Date" AS date) AS "Installation Date",
            SUM("source"."count") AS "Task Completed",
            COUNT(DISTINCT "source"."created_by") AS "Manpower",
            TRUNC(AVG("source"."Productivity"), 2) AS "Productivity"
        FROM (
            SELECT
                "source"."Projects__name",
                "source"."created_by",
                "source"."Projects__code",
                "source"."Form Type__name",
                "source"."Installation Date",
                COUNT(*) AS "count",
                COUNT(DISTINCT "source"."created_by") AS "count_2",
                COUNT(*) / COUNT(DISTINCT "source"."created_by") AS "Productivity"
            FROM (
                SELECT
                    "Form Response"."id",
                    '${tableName}' AS "forms_table_name",
                    "Form Response"."created_at"::DATE AS "Installation Date",
                    "Form Response"."created_by",
                    "Projects"."name" AS "Projects__name",
                    "Projects"."code" AS "Projects__code",
                    "Form Type"."name" AS "Form Type__name"
                FROM ${tableName} AS "Form Response"
                LEFT JOIN "public"."forms" AS "Forms" ON "Forms"."table_name" = '${tableName}'
                LEFT JOIN "public"."projects" AS "Projects" ON "Forms"."project_id" = "Projects"."id"
                LEFT JOIN "public"."master_maker_lovs" AS "Form Type" ON "Forms"."form_type_id" = "Form Type"."id"
                WHERE 
                    "Form Response"."is_active" = '1' 
                    ${projectId ? `AND "Projects"."id" = '${projectId}'` : ""}
                    ${formId ? `AND "Forms"."id" = '${formId}'` : ""}
                    ${gaaLevel && gaaValue ? `AND "Form Response"."${gaaLevel}"[1] IN ('${gaaValue.join("', '")}')` : ""}
                    ${dateFrom ? `AND "Form Response"."created_at" >= '${dateFrom}'` : ""}
                    ${dateTo ? `AND "Form Response"."created_at" <= '${dateTo}'::date + INTERVAL '1 day'` : ""}
            ) AS "source"
            GROUP BY
                "source"."Projects__name",
                "source"."Projects__code",
                "source"."created_by",
                "source"."Form Type__name",
                CAST("source"."Installation Date" AS date)
        ) AS "source"
        GROUP BY
            "source"."Projects__name",
            "source"."Projects__code",
            "source"."Form Type__name",
            CAST("source"."Installation Date" AS date)
        ORDER BY
            "source"."Projects__name" ASC,
            CAST("source"."Installation Date" AS date) DESC
    `;
    return query;
}

async function getDateWiseProductivityReport({ projectId, formId, formType, gaaLevelDetails, dateFrom, dateTo, limit = "", offset = "" }) {
    const forms = new Forms();
    const { db } = forms;

    const { tableName } = await forms.findOne({ id: formId }, ["name", "tableName"], true);

    // const approverType = approver === "L1" ? "L_A" : "L_B";

    const [gaaLevel, gaaValue] = Object.entries(gaaLevelDetails || {})[0] || [];

    const baseQuery = generateDateWiseProductivityReportQuery({
        projectId,
        formId,
        formType,
        gaaLevel,
        gaaValue,
        dateFrom,
        dateTo,
        tableName
    });
    let dataQuery;
    if ((limit === "") || (offset === "")) {
        dataQuery = `${baseQuery}`;
    } else {
        dataQuery = `${baseQuery} ${limit ? `LIMIT ${limit}` : ""} ${offset ? `OFFSET ${offset}` : ""}`;
    }
    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS count`;
    const [queryResult, [countResult]] = await Promise.all([dataQuery, countQuery].map((q) => executeQuery(db, q)));

    return { rows: queryResult?.map((item) => ({ ...item, "Task Type": formType })), count: +countResult.count };
}

function generateValidationStatusReportQuery({ projectId, formId, tableName, approver, approverType, gaaLevel, gaaValue, dateFrom, dateTo }) {
    return `
        SELECT
            "source"."customer_name" AS "Customer",
            "source"."project_name" AS "Project",
            "source".created_at as "Date",
            "source"."forms_name" as "Type of Survey",
            COUNT(*) AS "Survey Completed",

            SUM(
                CASE
                    WHEN LOWER("source"."${approver} Approval Status") = 'approved' THEN 1
                    ELSE 0
                END
            ) AS "${approver} Level - Approved",
            SUM(
                CASE
                    WHEN LOWER("source"."${approver} Approval Status") = 'rejected' THEN 1
                    ELSE 0
                END
            ) AS "${approver} Level - Rejected",
            SUM(
                CASE
                    WHEN LOWER("source"."${approver} Approval Status") = 'on-hold' THEN 1
                    ELSE 0
                END
            ) AS "${approver} Level - On-Hold"

        FROM
            (
                SELECT
                    "Users"."name" AS "Users__name",
                    "Forms"."name" AS "forms_name",
                    "Forms"."form_type_id" AS "FormsTypeId",
                    CAST("Form Response"."created_at" AS date) AS "created_at",
                    "Projects"."name" as "project_name",
                    "Customer"."name" AS "customer_name",
                    "Project Master Maker LOVs"."name" as "${approver} Approval Status",
                    "Form Response".id,
                    "Projects"."id" as "project_id"
                FROM
                    ${tableName} AS "Form Response"
                    LEFT JOIN "public"."project_master_maker_lovs" AS "Project Master Maker LOVs" ON "Form Response".${approverType}_APPROVAL_STATUS[1] = "Project Master Maker LOVs"."id"
                    INNER JOIN "public"."forms" AS "Forms" ON "Forms"."table_name" = '${tableName}'
                    INNER JOIN "public"."projects" AS "Projects" ON "Forms"."project_id" = "Projects"."id"
                    INNER JOIN "public"."users" AS "Users" ON "Form Response"."created_by" = "Users"."id"
                    INNER JOIN "organizations" AS "Customer" ON "Customer"."id" = "Projects"."customer_id"
                WHERE
                    "Form Response".is_active = '1'
                    ${formId ? `AND "Forms"."id" = '${formId}'` : ""}
                    ${projectId ? `AND "Projects"."id" = '${projectId}'` : ""}
                    ${gaaLevel && gaaValue ? `AND "Form Response"."${gaaLevel}"[1] IN ('${gaaValue.join("', '")}')` : ""}
                    ${dateFrom ? `AND "Form Response"."created_at" >= '${dateFrom}'` : ""}
                    ${dateTo ? `AND "Form Response"."created_at" <= '${dateTo}'::date + INTERVAL '1 day'` : ""}
                ORDER BY
                    "Users"."name" ASC,
                    CAST("Form Response"."created_at" AS date) ASC
            ) AS "source"
        GROUP BY
            "source"."customer_name",
            "source"."project_name",
            "source".created_at,
            "source"."forms_name"
        ORDER BY
            "source"."created_at" DESC
    `;
}

async function validationStatusReport({ projectId, formId, approver, gaaLevelDetails, dateFrom, dateTo, limit, offset } = {}) {
    const forms = new Forms();
    const { db } = forms;
    const approverType = approver === "L1" ? "L_A" : "L_B";
    // const [gaaLevel, gaaValue] = Object.entries(gaaLevelDetails || {})[0] || [];
    const gaaLevel = gaaLevelDetails?.columnName;
    const gaaValue = gaaLevelDetails?.columnValue;

    const { tableName } = await forms.findOne({ id: formId }, ["name", "tableName"], true);

    const baseQuery = generateValidationStatusReportQuery({
        projectId,
        approver,
        approverType,
        formId,
        tableName,
        gaaLevel,
        gaaValue,
        dateFrom,
        dateTo
    });

    const dataQuery = `${baseQuery} ${limit ? `LIMIT ${limit}` : ""} ${offset ? `OFFSET ${offset}` : ""}`;
    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS count`;
    const [queryResult, [countResult]] = await Promise.all([dataQuery, countQuery].map((query) => executeQuery(db, query)));
    return { rows: queryResult, count: +countResult.count };
}

const contractorSummaryMainTableQuery = ({ gaaColumnName, gaaColumnValue, projectId, fromDate, toDate }) => `
SELECT
    "Installed Transaction"."Organization Name" AS "Name Of Contractor",
    COUNT(DISTINCT "Installer"."id") as "Total Team",
    COUNT(
        DISTINCT CASE
            WHEN "Form Response"."created_at" = CURRENT_DATE THEN "Installer"."id"
        END
    ) AS "Active Team Today",
    SUM(
        "Installed Transaction"."Meter Issued To Contractor"
    ) OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "Meter Issued To Contractor",
    SUM(
        "Installed Transaction"."Meter Available At Contractor"
    ) OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "Meter Available At Contractor",
    SUM(
        "Installed Transaction"."Meter Issued To Installer"
    ) OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "Meter Issued To Installer",
    SUM("Installed Transaction"."Total Installation") OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "Total Installation",
    SUM(
        "Installed Transaction"."Meter Available At Installer"
    ) OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "Meter Available At Installer",
    SUM("Installed Transaction"."7 Days") OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "7 Days",
    SUM("Installed Transaction"."8 to 15 Days") OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "8 to 15 Days",
    SUM("Installed Transaction"."16 to 30 Days") OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "16 to 30 Days",
    SUM("Installed Transaction"."> 30 Days") OVER (
        PARTITION BY
            "Installed Transaction"."Organization ID"
    ) AS "> 30 Days",
    COUNT(
        DISTINCT
        CASE WHEN "Form Response"."mdm_payload_status" = 'Success' THEN "Form Response"."id" END
    ) AS "Total Synced To MDM"
FROM
    UNION_ALL_FORMS_FOR_METABASE ('Installation' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""}) AS "Form Response"
    ${join({ type: "INNER", table: "forms", alias: "Form", on: '"Form"."id" = "Form Response"."form_id"' })}
    ${join({ type: "INNER", table: "projects", alias: "Project", on: '"Project"."id" = "Form"."project_id"' })}
    ${join({ type: "INNER", table: "users", alias: "Installer", on: '"Installer"."id" = "Form Response"."created_by"' })}
    ${join({ type: "INNER", table: "organizations", alias: "Organization", on: '"Installer"."organization_id" = "Organization"."id"' })}
    ${join({ type: "INNER", table: "master_maker_lovs", alias: "Organization Type", on: '"Organization Type"."id" = "Organization"."organization_type_id"' })}
    RIGHT JOIN (
        SELECT
            "Organization"."id" as "Organization ID",
            "Organization"."name" as "Organization Name",
            "Transaction"."project_id" as "Project ID",
            ${generateMeterIssuedToContractorSelector()} AS "Meter Issued To Contractor",
            ${generateMeterAvailableAtContractorSelector()} AS "Meter Available At Contractor",
            ${generateMeterIssuedToInstallerSelector()} AS "Meter Issued To Installer",
            ${generateInstalledQuantitySelector()} AS "Total Installation",
            ${generateMeterAvailableAtInstallerSelector()} AS "Meter Available At Installer",
            ${generateAgingSelector({ selectorName: "7 Days", dateSince: -7, dateTill: null })},
            ${generateAgingSelector({ selectorName: "8 to 15 Days", dateSince: -15, dateTill: -7 })},
            ${generateAgingSelector({ selectorName: "16 to 30 Days", dateSince: -30, dateTill: -15 })},
            ${generateAgingSelector({ selectorName: "> 30 Days", dateSince: null, dateTill: -30 })}
        FROM
            stock_ledgers AS "Transaction"
            ${join({ type: "INNER", table: "organization_store_locations", alias: "Organization Store Location", on: '"Transaction"."store_location_id" = "Organization Store Location"."id"' })}
            ${join({ type: "INNER", table: "organization_stores", alias: "Organization Store", on: '"Organization Store"."id" = "Transaction"."store_id"' })}
            ${join({ type: "INNER", table: "organizations", alias: "Organization", on: '"Organization"."id" = "Organization Store"."organization_id"' })}
            ${join({ type: "INNER", table: "master_maker_lovs", alias: "Transaction Type", on: '"Transaction Type"."id" = "Transaction"."transaction_type_id"' })}
            ${join({ type: "INNER", table: "master_maker_lovs", alias: "Organization Type", on: '"Organization Type"."id" = "Organization"."organization_type_id"' })}
        WHERE
            NOT "Transaction"."is_cancelled"
        GROUP BY
            "Organization ID",
            "Project ID"
    ) AS "Installed Transaction" ON "Installed Transaction"."Organization ID" = "Organization"."id"
WHERE
    TRUE
    ${projectId ? `AND "Installed Transaction"."Project ID" = '${projectId}'` : ""}
    ${fromDate ? `AND "Form Response"."created_at" >= '${fromDate}'` : ""}
    ${toDate ? `AND "Form Response"."created_at" <= '${toDate}'::date + interval '1 day'` : ""}
GROUP BY
    "Installed Transaction"."Organization Name",
    "Organization"."name",
    "Organization"."id",
    "Installed Transaction"."Organization ID",
    "Installed Transaction"."Meter Issued To Contractor",
    "Installed Transaction"."Meter Available At Contractor",
    "Installed Transaction"."Meter Issued To Installer",
    "Installed Transaction"."Total Installation",
    "Installed Transaction"."Meter Available At Installer",
    "Installed Transaction"."7 Days",
    "Installed Transaction"."8 to 15 Days",
    "Installed Transaction"."16 to 30 Days",
    "Installed Transaction"."> 30 Days"
`;

const contractorSummaryQuery = ({ gaaColumnName, gaaColumnValue, projectId, fromDate, toDate }) => `
SELECT
    COUNT(DISTINCT SUBQUERY."Name Of Contractor") AS "Total Contractor",
    SUM(SUBQUERY."Total Team") AS "Total Team",
    SUM(SUBQUERY."Active Team Today") AS "Active Team Today",
    SUM(SUBQUERY."Meter Issued To Contractor") AS "Meter Issued To Contractor",
    SUM(SUBQUERY."Meter Available At Contractor") AS "Meter Available At Contractor",
    SUM(SUBQUERY."Meter Issued To Installer") AS "Meter Issued To Installer", 
    SUM(SUBQUERY."Total Installation") AS "Total Installation",
    SUM(SUBQUERY."Meter Available At Installer") AS "Meter Available At Installer",
    SUM(SUBQUERY."Total Synced To MDM") AS "Total Synced To MDM"
FROM
    (
        ${contractorSummaryMainTableQuery({ gaaColumnName, gaaColumnValue, projectId, fromDate, toDate })}
    ) SUBQUERY
`;

const gaaEntryWiseQuery = ({ projectId, variant = "region" }) => `
SELECT DISTINCT
    COALESCE("GAA Entry"."name", 'Unknown ${variant.charAt(0).toUpperCase()}${variant.slice(1)}') AS "GAA Entry Name",
    "Form"."name" AS "Meter Type",
    COUNT(DISTINCT "Form Response"."id") AS "Installed Quantity"
FROM
    "union_all_forms_for_metabase" ('Installation', '${variant}_name', 'All') AS "Form Response"
    ${join({ type: "INNER", table: "forms", alias: "Form", on: '"Form"."table_name" = "Form Response"."forms_table_name"' })}
    ${join({ type: "INNER", table: "gaa_level_entries", alias: "GAA Entry", on: `"GAA Entry"."id" = ANY ("Form Response"."${variant}_name")` })}
WHERE
    1 = 1
    ${projectId ? `AND "Form Response"."project_id" = '${projectId}'` : ""}
GROUP BY
    "GAA Entry Name",
    "Meter Type"
`;

const mainExecutiveQuery = async ({ projectId }) => {
    const allUnionQuery = await getUnionAllFormReponses(projectId, "InstallationWithO&M", ["INVENTORY_MATERIAL_SERIAL_NUMBER"], false);

    if (allUnionQuery.status && allUnionQuery.status === true) {
        const query = `
        SELECT
            "subquery"."Meter Type",
            "subquery"."Material Type",
            "subquery"."Start Date",
            "subquery"."End Date",
            "subquery"."Total Scope",
            "subquery"."Supplied Quantity",
            "subquery"."Installed Quantity",
            "subquery"."Synced To MDM",
            "subquery"."Total SAT",
            CASE
                WHEN COALESCE(
                    ROUND(
                        "subquery"."Total Scope" / NULLIF("subquery"."Installation Month Incentive" * 25, 0)
                    ),
                    0
                ) < 0
                THEN 0
                ELSE COALESCE(
                    ROUND(
                        "subquery"."Total Scope" / NULLIF("subquery"."Installation Month Incentive" * 25, 0)
                    ),
                    0
                ) 
            END AS "IIR (Per Day)"
            ,
            CASE
                WHEN COALESCE(
                    ROUND(
                        "subquery"."Installed Quantity" / NULLIF(
                            EXTRACT(
                                MONTH
                                FROM
                                    AGE (
                                        "subquery"."Latest Installation Date",
                                        "subquery"."Start Date"
                                    )
                            ) * 4.5,
                            0
                        )
                    ),
                    0
                ) < 0
            THEN 0
            ELSE COALESCE(
                    ROUND(
                        "subquery"."Installed Quantity" / NULLIF(
                            EXTRACT(
                                MONTH
                                FROM
                                    AGE (
                                        "subquery"."Latest Installation Date",
                                        "subquery"."Start Date"
                                    )
                            ) * 4.5,
                            0
                        )
                    ),
                    0
                )
            END AS "CMIR (Per Day)",
            CASE
                WHEN COALESCE(
                        ROUND(
                            (
                                "subquery"."Total Scope" - "subquery"."Installed Quantity"
                            ) / NULLIF(
                                "subquery"."Installation Month Incentive" - EXTRACT(
                                    MONTH
                                    FROM
                                        AGE (CURRENT_DATE, "subquery"."Start Date")
                                ),
                                0
                            ) / 26
                        ),
                        0
                    ) < 0
                THEN 0
                ELSE COALESCE(
                    ROUND(
                        (
                            "subquery"."Total Scope" - "subquery"."Installed Quantity"
                        ) / NULLIF(
                            "subquery"."Installation Month Incentive" - EXTRACT(
                                MONTH
                                FROM
                                    AGE (CURRENT_DATE, "subquery"."Start Date")
                            ),
                            0
                        ) / 26
                    )
                ) 
            END AS "RIR (Per Day)",
            "subquery"."Remaining Time"
        FROM
        (
            SELECT
                "Form"."name" AS "Meter Type",
                "Material Type"."name" AS "Material Type",
                "Project"."closure_date" AS "Start Date",
                "Project Scope"."installation_end_date" AS "End Date",
                COALESCE(
                    (SELECT SUM("total_quantity") 
                    FROM "project_scopes" 
                    WHERE "form_id" = "Form"."id" 
                    AND "material_type_id" = "Project Scope"."material_type_id"
                    ),
                    0
                ) AS "Total Scope",
                (
                    SELECT 
                        COALESCE(SUM("Transaction Internal"."quantity"), 0)
                    FROM 
                    "stock_ledgers" AS "Transaction Internal"
                    INNER JOIN "organization_stores" AS "Organization Store Internal" ON "Organization Store Internal"."id" = "Transaction Internal"."store_id"
                    WHERE 
                    "Transaction Internal"."project_id" = "Project"."id"
                    AND "Transaction Internal"."transaction_type_id" IN (
                        '${uuids.grnTransactionTypeId}',
                        '${uuids.ptpTransactionTypeId}'
                    )
                    AND NOT "Transaction Internal"."is_cancelled"
                    AND "Transaction Internal"."request_number" IS NULL
                    AND "Transaction Internal"."material_id" IN (
                        SELECT "id"
                        FROM "materials" AS "Material Internal"
                        WHERE "Material Internal"."material_type_id" = "Project Scope"."material_type_id"
                    )
                ) AS "Supplied Quantity",
                (
                    SELECT COUNT(*)
                    FROM "material_serial_numbers" AS "MSN"
                    WHERE "MSN"."id" = ANY(ARRAY_AGG(INVENTORY_MATERIAL_SERIAL_NUMBER[1])::UUID[])
                    AND "MSN"."material_id" IN (
                        SELECT "id"
                        FROM "materials" AS "Material Internal"
                        WHERE "Material Internal"."material_type_id" = "Project Scope"."material_type_id"
                    )
                ) AS "Installed Quantity",
            
                (
                    SELECT COUNT(*)
                    FROM "material_serial_numbers" AS "MSN"
                    WHERE "MSN"."id" = ANY(ARRAY_AGG(CASE WHEN mdm_payload_status = 'Success' THEN INVENTORY_MATERIAL_SERIAL_NUMBER[1] END))
                    AND "MSN"."material_id" IN (
                        SELECT "id"
                        FROM "materials" AS "Material Internal"
                        WHERE "Material Internal"."material_type_id" = "Project Scope"."material_type_id"
                    )
                ) AS "Synced To MDM",
                COALESCE(
                    (SELECT SUM("sat_quantity") 
                    FROM "project_scopes" 
                    WHERE "form_id" = "Form"."id" 
                    AND "material_type_id" = "Project Scope"."material_type_id"
                    ),
                    0
                ) AS "Total SAT",
                CASE
                    WHEN "Project Scope"."installation_end_date" IS NULL THEN 'N/A'
                    WHEN "Project Scope"."installation_end_date" < CURRENT_DATE THEN '0 days'
                    ELSE (
                        CONCAT(
                            CASE
                                WHEN EXTRACT(
                                    YEAR
                                    FROM
                                        AGE (
                                            "Project Scope"."installation_end_date",
                                            CURRENT_DATE
                                        )
                                ) > 0 THEN CONCAT(
                                    EXTRACT(
                                        YEAR
                                        FROM
                                            AGE (
                                                "Project Scope"."installation_end_date",
                                                CURRENT_DATE
                                            )
                                    ),
                                    ' Years '
                                )
                                ELSE ''
                            END,
                            CASE
                                WHEN EXTRACT(MONTH FROM AGE("Project Scope"."installation_end_date", CURRENT_DATE)) > 0 THEN
                                    CONCAT(EXTRACT(MONTH FROM AGE("Project Scope"."installation_end_date", CURRENT_DATE)), ' Months and ')
                                ELSE ''
                            END,
                            EXTRACT(
                                EPOCH
                                FROM
                                    "Project Scope"."installation_end_date" - CURRENT_DATE - (
                                        EXTRACT(
                                            YEAR
                                            FROM
                                                AGE (
                                                    "Project Scope"."installation_end_date",
                                                    CURRENT_DATE
                                                )
                                        ) * INTERVAL '1 year' + 
                                        (EXTRACT(MONTH FROM AGE("Project Scope"."installation_end_date", CURRENT_DATE)) 
                                        * INTERVAL '1 month')
                                    )
                            )::INTEGER / 86400,
                            ' Days'
                        )
                    )
                END AS "Remaining Time",
                COALESCE(
                    (SELECT SUM("installation_month_incentive") 
                    FROM "project_scopes" 
                    WHERE "form_id" = "Form"."id" 
                    AND "material_type_id" = "Project Scope"."material_type_id"
                    ),
                    0
                ) AS "Installation Month Incentive",
                MAX("Form Response"."created_at") AS "Latest Installation Date"
            FROM
                (${allUnionQuery?.query}) AS "Form Response"
                ${join({ type: "LEFT", table: "forms", alias: "Form", on: '"Form"."table_name" = "Form Response"."response_table_name"' })}
                ${join({ type: "LEFT", table: "projects", alias: "Project", on: '"Project"."id" = "Form"."project_id"' })}
                ${join({ type: "LEFT", table: "project_scopes", alias: "Project Scope", on: '"Project Scope"."project_id" = "Form"."project_id" AND "Project Scope"."form_id" = "Form"."id"' })}
                ${join({ type: "LEFT", table: "master_maker_lovs", alias: "Material Type", on: '"Material Type"."id" = "Project Scope"."material_type_id"' })}
            WHERE
                1 = 1
            ${projectId ? `AND "Project"."id" = '${projectId}'` : ""}
            GROUP BY
                "Meter Type",
                "Material Type",
                "Start Date",
                "End Date",
                "Project Scope"."total_quantity",
                "Project Scope"."sat_quantity",
                "Form"."id",
                "Project Scope"."material_type_id",
                "Project"."id",
                "Project Scope"."installation_month_incentive"
        ) AS "subquery" `;

        return query;
    }
};

const getGaaEntryWiseInstalledQtyQuery = ({ projectId, variant = "region" }) => `
SELECT
    "SUBQUERY"."GAA Entry Name" AS "GAA Entry Name",
    SUM("SUBQUERY"."Installed Quantity") AS "InstalledQuantity",
    "SUBQUERY"."GAA Entry Name" AS "GAA Entry Name",
    ROUND(
        100 * SUM("SUBQUERY"."Installed Quantity")::NUMERIC / NULLIF(
            (
                SELECT SUM("SUBQUERY"."Installed Quantity") 
                FROM (
                    ${gaaEntryWiseQuery({ projectId, variant })}
                ) "SUBQUERY"
            )::NUMERIC,
            0
        ),
        2
    ) AS "Percentage"
FROM
    (
        ${gaaEntryWiseQuery({ projectId, variant })}
    ) "SUBQUERY"
GROUP BY
    "GAA Entry Name"
`;

const plannedVsActualInstallationStatusQuery = ({ projectId }) => `
SELECT
  "SUBQUERY"."Meter Type",
  "SUBQUERY"."Month-Year",
  SUM("SUBQUERY"."Planned Quantity") AS "Planned Quantity",
  SUM("SUBQUERY"."Installed Quantity") AS "Installed Quantity"
FROM
  (
    SELECT
      "Forms"."name" AS "Meter Type",
      TO_CHAR("Form Response"."created_at", 'Mon-YYYY') AS "Month-Year",
      DATE_TRUNC('month', "Form Response"."created_at") AS "Month-Year-Date",
      0 AS "Planned Quantity",
      COUNT(DISTINCT "Form Response"."id") AS "Installed Quantity"
    FROM
      "union_all_forms_for_metabase" ('Installation') AS "Form Response"
      INNER JOIN "forms" AS "Forms" ON "Forms"."table_name" = "Form Response"."forms_table_name"
      INNER JOIN "project_scopes" AS "Project Scope" ON "Project Scope"."form_id" = "Forms"."id"
    WHERE
      1 = 1
      AND "Form Response"."created_at" >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year' -- Within One Year Duration
      ${projectId ? `AND "Form Response"."project_id" = '${projectId}'` : ""}
    GROUP BY
      "Forms"."name",
      TO_CHAR("Form Response"."created_at", 'Mon-YYYY'),
      DATE_TRUNC('month', "Form Response"."created_at")
    UNION
    SELECT
      "Form"."name" AS "Meter Type",
      TO_CHAR("Project Scope"."created_at", 'Mon-YYYY') AS "Month-Year",
      DATE_TRUNC('month', "Project Scope"."created_at") AS "Month-Year-Date",
      "Project Scope"."total_quantity" AS "Planned Quantity",
      0 AS "Installed Quantity"
    FROM
      "project_scopes" AS "Project Scope"
      INNER JOIN "forms" AS "Form" ON "Form"."id" = "Project Scope"."form_id"
    WHERE
      1 = 1
      ${projectId ? `AND "Project Scope"."project_id" = '${projectId}'` : ""}
    GROUP BY
      "Form"."name",
      TO_CHAR("Project Scope"."created_at", 'Mon-YYYY'),
      DATE_TRUNC('month', "Project Scope"."created_at"),
	  "Project Scope"."total_quantity"
  ) "SUBQUERY"
GROUP BY
  "SUBQUERY"."Meter Type",
  "SUBQUERY"."Month-Year",
  "SUBQUERY"."Month-Year-Date"
ORDER BY
  "SUBQUERY"."Meter Type" ASC,
  "SUBQUERY"."Month-Year-Date" ASC
`;

const getExecutiveDashboard = async ({ projectId }) => {
    try {
        const { db } = new Forms();
        const query = await mainExecutiveQuery({ projectId });

        const [
            [contractorSummary],
            contractorSummaryMainTable,
            plannedVsActualInstallationStatus,
            regionWisePercentage,
            zoneWisePercentage,
            circleWiseData,
            mainExecutiveData
        ] = await Promise.all([
            contractorSummaryQuery({ projectId }),
            contractorSummaryMainTableQuery({ projectId }),
            plannedVsActualInstallationStatusQuery({ projectId }),
            getGaaEntryWiseInstalledQtyQuery({ projectId, variant: "region" }),
            getGaaEntryWiseInstalledQtyQuery({ projectId, variant: "zone" }),
            gaaEntryWiseQuery({ projectId, variant: "circle" }),
            query
        ].map((q) => executeQuery(db, q)));
        
        return {
            contractorSummary,
            contractorSummaryMainTable,
            plannedVsActualInstallationStatus,
            regionWisePercentage,
            zoneWisePercentage,
            circleWiseData,
            mainExecutiveData
        };
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE,
            error
        );
    }
};

// ====================== || Area Wise Progress Dashboard || ====================== //
const generateSurveyQuery = ({ gaaColumnName, gaaColumnValue, useCurrentDateConstraint = false }) => `
SELECT
    "Form"."name" AS "Form Name",
    COUNT(*) AS "Tasks Completed"
FROM
    "union_all_forms_for_metabase" ('Survey' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""}) AS "Form Response"
    INNER JOIN "forms" AS "Form" ON "Form"."table_name" = "Form Response"."forms_table_name" AND "Form"."is_active" = '1'
WHERE
    TRUE
    ${useCurrentDateConstraint ? `AND ${currentDateConstraint}` : ""}
GROUP BY
    "Form Name"
`;

const generateInstallationQuery = ({ gaaColumnName, gaaColumnValue, useCurrentDateConstraint = false }) => `
SELECT
    "Form"."name" AS "Form Name",
    ${generateInstalledQuantitySelector()} AS "Tasks Completed"
FROM
    "stock_ledgers" AS "Transaction"
    INNER JOIN "organization_stores" AS "Organization Store" ON "Organization Store"."id" = "Transaction"."store_id" AND "Organization Store"."is_active" = '1'
    INNER JOIN "organizations" AS "Organization" on "Organization"."id" = "Organization Store"."organization_id" AND "Organization"."is_active" = '1'
    INNER JOIN "master_maker_lovs" AS "Organization Type" ON "Organization Type"."id" = "Organization"."organization_type_id" AND "Organization Type"."is_active" = '1'
    INNER JOIN "materials" AS "Material" ON "Material"."id" = "Transaction"."material_id" AND "Material"."is_active" = '1'
    INNER JOIN "organization_store_locations" AS "Organization Store Location" ON "Organization Store Location"."id" = "Transaction"."store_location_id" AND "Organization Store Location"."is_active" = '1'
    INNER JOIN "stock_ledger_details" AS "Transaction Detail" ON "Transaction Detail"."id" = "Transaction"."stock_ledger_detail_id" AND "Transaction Detail"."is_active" = '1'
    INNER JOIN "master_maker_lovs" AS "Transaction Type" ON "Transaction Type"."id" = "Transaction"."transaction_type_id" AND "Transaction Type"."is_active" = '1'
    INNER JOIN "union_all_forms_for_metabase" ('Installation' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""}) AS "Form Response" ON "Form Response"."id" = "Transaction Detail"."response_id"
    INNER JOIN "forms" AS "Form" ON "Form"."table_name" = "Form Response"."forms_table_name" AND "Form"."is_active" = '1'
WHERE
    "Transaction Type"."id" IN (
        '${uuids.installedTransactionTypeId}'
    )
    AND "Material"."is_serial_number"
    AND "Transaction"."installer_id" IS NOT NULL
    AND NOT "Transaction"."is_cancelled"
    ${useCurrentDateConstraint ? `AND ${currentDateConstraint}` : ""}
GROUP BY
    "Form Name"
`;

const generateOAndMQuery = ({ gaaColumnName, gaaColumnValue, useCurrentDateConstraint = false }) => `
SELECT
    "Form"."name" AS "Form Name",
    COUNT(*) AS "Tasks Completed"
FROM
    "union_all_forms_for_metabase" ('O&M' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""}) AS "Form Response"
    INNER JOIN "forms" AS "Form" ON "Form"."table_name" = "Form Response"."forms_table_name" AND "Form"."is_active" = '1'
WHERE
    TRUE
    ${useCurrentDateConstraint ? `AND ${currentDateConstraint}` : ""}
GROUP BY
    "Form Name"
`;

const generateContractorWiseQuery = ({ gaaColumnName, gaaColumnValue, useCurrentDateConstraint = false }) => `
SELECT
    "SUBQUERY"."Organization Name",
    SUM("SUBQUERY"."Is Associated With CI"::INT) AS "CI Workforce",
    SUM("SUBQUERY"."Is Associated With Installation"::INT) AS "MI Workforce",
    SUM("SUBQUERY"."Is Associated With O&M"::INT) AS "O&M Workforce",
    COUNT(*) - SUM(
        (
            "SUBQUERY"."Is Associated With CI"
            OR "SUBQUERY"."Is Associated With Installation"
            OR "SUBQUERY"."Is Associated With O&M"
        )::INT
    ) AS "Is Not Working"
FROM
    (
        SELECT
            "Organization"."name" AS "Organization Name",
            "User"."id",
            EXISTS (
                SELECT
                    TRUE
                FROM
                    "union_all_forms_for_metabase" ('Survey' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""}) AS "Form Response"
                WHERE
                    "Form Response"."created_by" = "User"."id"
                    ${useCurrentDateConstraint ? `AND ${currentDateConstraint}` : ""}
                LIMIT
                    1
            ) AS "Is Associated With CI",
            EXISTS (
                SELECT
                    TRUE
                FROM
                    "union_all_forms_for_metabase" ('Installation' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""}) AS "Form Response"
                WHERE
                    "Form Response"."created_by" = "User"."id"
                    ${useCurrentDateConstraint ? `AND ${currentDateConstraint}` : ""}
                LIMIT
                    1
            ) AS "Is Associated With Installation",
            EXISTS (
                SELECT
                    TRUE
                FROM
                    "union_all_forms_for_metabase" ('O&M' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""}) AS "Form Response"
                WHERE
                    "Form Response"."created_by" = "User"."id"
                    ${useCurrentDateConstraint ? `AND ${currentDateConstraint}` : ""}
                LIMIT
                    1
            ) AS "Is Associated With O&M"
        FROM
            "users" AS "User"
            INNER JOIN "organizations" AS "Organization" ON "Organization"."id" = "User"."organization_id"
            AND "Organization"."is_active" = '1'
        WHERE
            "User"."is_active" = '1'
        GROUP BY
            "Organization Name",
            "User"."id"
    ) "SUBQUERY"
GROUP BY
    "SUBQUERY"."Organization Name"
`;

const generateCumulativeStatusQuery = ({ gaaColumnName, gaaColumnValue, projectId, fromDate, toDate, type }) => {
    const topQuerySelectors = ` "SUBQUERY"."Form Name" AS "Form Name",
    "SUBQUERY"."Activity Type" AS "Activity Type",
    COALESCE("SUBQUERY"."Scope", 0) AS "Scope",
    SUM("SUBQUERY"."count") AS "Actual",
    SUM(
        (
            "SUBQUERY"."L1 Approval Status" = 'Approval Pending'
        )::INT
    ) AS "L1 Approval Pending",
    SUM(
        ("SUBQUERY"."L1 Approval Status" = 'Approved')::INT
    ) AS "L1 Approved",
    SUM(
        ("SUBQUERY"."L1 Approval Status" = 'Rejected')::INT
    ) AS "L1 Rejected",
    SUM(
        ("SUBQUERY"."L1 Approval Status" = 'On-Hold')::INT
    ) AS "L1 On-Hold",
    SUM(
        (
            "SUBQUERY"."L1 Approval Status" = 'Approved' AND "SUBQUERY"."L2 Approval Status" = 'Approval Pending'
        )::INT
    ) AS "L2 Approval Pending",
    SUM(
        ("SUBQUERY"."L1 Approval Status" = 'Approved' AND "SUBQUERY"."L2 Approval Status" = 'Approved')::INT
    ) AS "L2 Approved",
    SUM(
        ("SUBQUERY"."L1 Approval Status" = 'Approved' AND "SUBQUERY"."L2 Approval Status" = 'Rejected')::INT
    ) AS "L2 Rejected",
    SUM(
        ("SUBQUERY"."L1 Approval Status" = 'Approved' AND "SUBQUERY"."L2 Approval Status" = 'On-Hold')::INT
    ) AS "L2 On-Hold"`;

    const groupBySelectors = `"SUBQUERY"."Form Name",
    "SUBQUERY"."Activity Type",
    "SUBQUERY"."Scope"`;
  
    if (type === "Survey") {
        return `
SELECT
    ${topQuerySelectors}
FROM
    (
        SELECT
            'Survey' AS "Activity Type",
            "Form"."name" AS "Form Name",
            "Project Scope"."total_quantity" AS "Scope",
            1 as "count",
            COALESCE("L1 Approval Status"."name", 'Approval Pending') AS "L1 Approval Status",
            COALESCE("L2 Approval Status"."name", 'Approval Pending') AS "L2 Approval Status"
        FROM
            "union_all_forms_for_metabase" ('Survey' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""}) AS "Form Response"
            ${join({ type: "inner", table: "forms", alias: "Form", on: '"Form"."table_name" = "Form Response"."forms_table_name"' })}
            ${join({ type: "left", table: "project_master_maker_lovs", alias: "L1 Approval Status", on: '"L1 Approval Status"."id" = "Form Response"."l_a_approval_status"' })}
            ${join({ type: "left", table: "project_master_maker_lovs", alias: "L2 Approval Status", on: '"L2 Approval Status"."id" = "Form Response"."l_b_approval_status"' })}
            ${join({ type: "left", table: "project_scopes", alias: "Project Scope", on: '"Project Scope"."form_id" = "Form"."id"' })}
        WHERE 
            TRUE
            ${projectId ? `AND "Form"."project_id" = '${projectId}'` : ""}
            ${fromDate ? `AND "Form Response"."created_at" >= '${fromDate}'` : ""}
            ${toDate ? `AND "Form Response"."created_at" <= '${toDate}'::date + interval '1 day'` : ""}
    ) "SUBQUERY"
GROUP BY
    ${groupBySelectors}
`;
    } else if (type === "Installation") {
        return `
SELECT
    ${topQuerySelectors}
FROM 
    (
        SELECT
            'Installation' AS "Activity Type",
            "Form"."name" AS "Form Name",
            "Project Scope"."total_quantity" AS "Scope",
            ${generateInstalledQuantitySelector()} as "count",
            COALESCE("L1 Approval Status"."name", 'Approval Pending') AS "L1 Approval Status",
            COALESCE("L2 Approval Status"."name", 'Approval Pending') AS "L2 Approval Status"
        FROM
            "union_all_forms_for_metabase" ('Installation') AS "Form Response"
            ${join({ type: "inner", table: "forms", alias: "Form", on: '"Form"."table_name" = "Form Response"."forms_table_name"' })}
            ${join({ type: "left", table: "projects", alias: "Project", on: '"Project"."id" = "Form"."project_id"' })}
            ${join({ type: "left", table: "project_scopes", alias: "Project Scope", on: '"Project Scope"."project_id" = "Form"."project_id" AND "Project Scope"."form_id" = "Form"."id"' })}
            ${join({ type: "left", table: "stock_ledger_details", alias: "Transaction Detail", on: '"Transaction Detail"."response_id" = "Form Response"."id"' })}
            ${join({ type: "left", table: "stock_ledgers", alias: "Transaction", on: '"Transaction"."stock_ledger_detail_id" = "Transaction Detail"."id"' })}
            ${join({ type: "left", table: "organization_stores", alias: "Organization Store", on: '"Organization Store"."id" = "Transaction"."store_id"' })}
            ${join({ type: "left", table: "organizations", alias: "Organization", on: '"Organization"."id" = "Organization Store"."organization_id"' })}
            ${join({ type: "left", table: "master_maker_lovs", alias: "Organization Type", on: '"Organization Type"."id" = "Organization"."organization_type_id"' })}
            ${join({ type: "left", table: "materials", alias: "Material", on: '"Material"."id" = "Transaction"."material_id"' })}
            ${join({ type: "left", table: "organization_store_locations", alias: "Organization Store Location", on: '"Organization Store Location"."id" = "Transaction"."store_location_id"' })}
            ${join({ type: "left", table: "master_maker_lovs", alias: "Transaction Type", on: '"Transaction Type"."id" = "Transaction"."transaction_type_id"' })}
            ${join({ type: "left", table: "project_master_maker_lovs", alias: "L1 Approval Status", on: '"L1 Approval Status"."id" = "Form Response"."l_a_approval_status"' })}
            ${join({ type: "left", table: "project_master_maker_lovs", alias: "L2 Approval Status", on: '"L2 Approval Status"."id" = "Form Response"."l_b_approval_status"' })}
        WHERE
            TRUE
            ${projectId ? `AND "Form"."project_id" = '${projectId}'` : ""}
            ${fromDate ? `AND "Form Response"."created_at" >= '${fromDate}'` : ""}
            ${toDate ? `AND "Form Response"."created_at" <= '${toDate}'::date + interval '1 day'` : ""}
        GROUP BY
            "Form"."name",
            "Project Scope"."total_quantity",
            "L1 Approval Status"."name",
            "L2 Approval Status"."name"
    ) "SUBQUERY"
GROUP BY
    ${groupBySelectors}
`;
    } else if (type === "O&M") {
        return `
SELECT
    ${topQuerySelectors}
FROM 
    (
        SELECT
            'O&M' AS "Activity Type",
            "Form"."name" AS "Form Name",
            "Project Scope"."total_quantity" AS "Scope",
            1 as "count",
            COALESCE("L1 Approval Status"."name", 'Approval Pending') AS "L1 Approval Status",
            COALESCE("L2 Approval Status"."name", 'Approval Pending') AS "L2 Approval Status"
        FROM
            "union_all_forms_for_metabase" ('O&M') AS "Form Response"
            ${join({ type: "inner", table: "forms", alias: "Form", on: '"Form"."table_name" = "Form Response"."forms_table_name"' })}
            ${join({ type: "left", table: "project_master_maker_lovs", alias: "L1 Approval Status", on: '"L1 Approval Status"."id" = "Form Response"."l_a_approval_status"' })}
            ${join({ type: "left", table: "project_master_maker_lovs", alias: "L2 Approval Status", on: '"L2 Approval Status"."id" = "Form Response"."l_b_approval_status"' })}
            ${join({ type: "left", table: "project_scopes", alias: "Project Scope", on: '"Project Scope"."form_id" = "Form"."id"' })}
        WHERE
            TRUE
            ${projectId ? `AND "Form"."project_id" = '${projectId}'` : ""}
            ${fromDate ? `AND "Form Response"."created_at" >= '${fromDate}'` : ""}
            ${toDate ? `AND "Form Response"."created_at" <= '${toDate}'::date + interval '1 day'` : ""}
    ) "SUBQUERY"
GROUP BY
    ${groupBySelectors}
`;
    }
};

function generateGaaLevelEntrySelector(variant, gaaColumnName) {
    let selector = "";
    if (!["day", "month"].includes(variant)) {
        if (["division", "subdivision"].includes(variant)) {
            selector = `"${gaaColumnName.replace("_name", "")}"[1]`;
        } else {
            selector = `"${gaaColumnName}"[1]`;
        }
    }
    return selector ? `${selector} AS "gaa_level_entry_id",` : "";
}

const generateProgressQuery = ({ gaaColumnName: gaaColumnNameOrig, gaaColumnValue: gaaColumnValueOrig, projectId, fromDate, toDate, formId, variant = "day" } = {}) => {
    let mainColumnSelector = "";
    let itemsLimit = 15;

    let gaaColumnName = gaaColumnNameOrig;
    let gaaColumnValue = gaaColumnValueOrig;

    if (variant === "day") {
        mainColumnSelector = 'DATE ("Response"."created_at")';
    } else if (variant === "month") {
        mainColumnSelector = 'TO_CHAR("Response"."created_at", \'Mon-YYYY\')';
        itemsLimit = 12;
    } else {
        mainColumnSelector = `COALESCE("GAA"."name", 'Unknown ${variant.charAt(0).toUpperCase()}${variant.slice(1)}')`;
        gaaColumnName = `${variant}_name`;
        gaaColumnValue = "All";
    }

    const gaaLevelEntrySelector = generateGaaLevelEntrySelector(variant, gaaColumnName);

    return `
SELECT
    ${mainColumnSelector} AS "name",
    SUM(
        CASE
            WHEN "Response"."type" = 'Survey' THEN "Response"."count"
            ELSE 0
        END
    ) AS "Consumer Indexing",
    COUNT(
        DISTINCT CASE
            WHEN "Response"."type" = 'Survey' THEN "Response"."created_by"
        END
    ) AS "CI Workforce",
    SUM(
        CASE
            WHEN "Response"."type" = 'Installation' THEN "Response"."count"
            ELSE 0
        END
    ) AS "Meter Installation",
    COUNT(
        DISTINCT CASE
            WHEN "Response"."type" = 'Installation' THEN "Response"."created_by"
        END
    ) AS "MI Workforce"
FROM
    (
        SELECT
            "created_at",
            ${gaaLevelEntrySelector}
            "created_by",
            1 AS "count",
            'Survey' AS "type"
        FROM
            "union_all_forms_for_metabase" ('Survey' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""})
        WHERE
            ${projectId ? `"project_id" = '${projectId}'` : ""}
            ${fromDate ? `AND "created_at" >= '${fromDate}'` : ""}
            ${toDate ? `AND "created_at" <= '${toDate}'::date + interval '1 day'` : ""}
            ${formId ? `AND "form_id" = '${formId}'` : ""}
        UNION
        SELECT
            "Form Response"."created_at",
            ${gaaLevelEntrySelector ? `"Form Response".${gaaLevelEntrySelector}` : ""}
            "Form Response"."created_by",
            ${generateInstalledQuantitySelector()} AS "count",
            'Installation' AS "type"
        FROM
            "stock_ledgers" AS "Transaction"
            ${join({ type: "inner", table: "organization_stores", alias: "Organization Store", on: '"Organization Store"."id" = "Transaction"."store_id"' })}
            ${join({ type: "inner", table: "organizations", alias: "Organization", on: '"Organization"."id" = "Organization Store"."organization_id"' })}
            ${join({ type: "inner", table: "master_maker_lovs", alias: "Organization Type", on: '"Organization Type"."id" = "Organization"."organization_type_id"' })}
            ${join({ type: "inner", table: "materials", alias: "Material", on: '"Material"."id" = "Transaction"."material_id"' })}
            ${join({ type: "inner", table: "organization_store_locations", alias: "Organization Store Location", on: '"Organization Store Location"."id" = "Transaction"."store_location_id"' })}
            ${join({ type: "inner", table: "stock_ledger_details", alias: "Transaction Detail", on: '"Transaction Detail"."id" = "Transaction"."stock_ledger_detail_id"' })}
            ${join({ type: "inner", table: "master_maker_lovs", alias: "Transaction Type", on: '"Transaction Type"."id" = "Transaction"."transaction_type_id"' })}
            ${join({ type: "inner", table: "union_all_forms_for_metabase('Installation')", alias: "Form Response", on: '"Form Response"."id" = "Transaction Detail"."response_id"', onlyActive: false })}
            ${join({ type: "inner", table: "forms", alias: "Form", on: '"Form"."table_name" = "Form Response"."forms_table_name"' })}
        WHERE
            "Transaction Type"."id" IN (
                '${uuids.installedTransactionTypeId}'
            )
            AND "Material"."is_serial_number"
            AND "Transaction"."installer_id" IS NOT NULL
            AND NOT "Transaction"."is_cancelled"
            ${projectId ? `AND "Form"."project_id" = '${projectId}'` : ""}
            ${fromDate ? `AND "Form Response"."created_at" >= '${fromDate}'` : ""}
            ${toDate ? `AND "Form Response"."created_at" <= '${toDate}'::date + interval '1 day'` : ""}
            ${formId ? `AND "Form Response"."form_id" = '${formId}'` : ""}
        GROUP BY
            "Form Response"."created_at",
            "Form Response"."created_by"
            ${gaaLevelEntrySelector ? `, "Form Response".${gaaLevelEntrySelector.split("AS")[0].trim()}` : ""}
        UNION
        SELECT
            "created_at" AS "created_at",
            ${gaaLevelEntrySelector}
            "created_by" AS "created_by",
            1 AS "count",
            'O&M' AS "type"
        FROM
            "union_all_forms_for_metabase" ('O&M' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""})
        WHERE
            ${projectId ? `"project_id" = '${projectId}'` : ""}
            ${fromDate ? `AND "created_at" >= '${fromDate}'` : ""}
            ${toDate ? `AND "created_at" <= '${toDate}'::date + interval '1 day'` : ""}
            ${formId ? `AND "form_id" = '${formId}'` : ""}
        GROUP BY
            "created_at",
            "created_by"
            ${gaaLevelEntrySelector ? `, ${gaaLevelEntrySelector.split("AS")[0].trim()}` : ""}
        ORDER BY
            "created_at" ASC
    ) AS "Response"
    ${gaaLevelEntrySelector ? join({ type: "left", table: "gaa_level_entries", alias: "GAA", on: '"GAA"."id" = "Response"."gaa_level_entry_id"' }) : ""}
GROUP BY
    ${mainColumnSelector}
LIMIT
    ${itemsLimit}
`;
};

const getAreaWiseProgressDashboard = async ({ gaaLevelDetails, projectId, fromDate, toDate, activityType }) => {
    try {
        const { db } = new Forms();
        const [gaaColumnName, gaaColumnValue] = Object.entries(gaaLevelDetails || {})[0] || [];
        
        const [
            todaysProgressCi,
            todaysProgressMi,
            todaysProgressOAndM,
            todaysStatusContractorWise,

            allTimeProgressCi,
            allTimeProgressMi,
            allTimeProgressOAndM,
            allTimeStatusContractorWise,

            cumulativeStatusSurvey,
            cumulativeStatusInstallation,
            cumulativeStatusOAndM,
            allDateWiseData,
            allMonthWiseData,
            allCircleWiseData,
            allDivisionWiseData,
            allSubDivisionWiseData,
            contractorSummaryMainTable
        ] = await Promise.all([

            ...[true, false].map((flag) => [
                generateSurveyQuery({ gaaColumnName, gaaColumnValue, useCurrentDateConstraint: flag }),
                generateInstallationQuery({ gaaColumnName, gaaColumnValue, useCurrentDateConstraint: flag }),
                generateOAndMQuery({ gaaColumnName, gaaColumnValue, useCurrentDateConstraint: flag }),
                generateContractorWiseQuery({ gaaColumnName, gaaColumnValue, useCurrentDateConstraint: flag })
            ]).flat(),
            
            ...["Survey", "Installation", "O&M"].map((type) => generateCumulativeStatusQuery({ gaaColumnName, gaaColumnValue, projectId, fromDate, toDate, type })),
            ...["day", "month", "circle", "division", "subdivision"].map((variant) => generateProgressQuery({
                gaaColumnName,
                gaaColumnValue,
                projectId,
                fromDate,
                toDate,
                formId: activityType,
                variant
            })),
            contractorSummaryMainTableQuery({ gaaColumnName, gaaColumnValue, projectId, fromDate, toDate })
        ].map((q) => executeQuery(db, q)));

        return {
            todaysProgressCi,
            todaysProgressMi,
            todaysProgressOAndM,
            todaysStatusContractorWise,

            allTimeProgressCi,
            allTimeProgressMi,
            allTimeProgressOAndM,
            allTimeStatusContractorWise,

            cumulativeStatus: [...cumulativeStatusSurvey, ...cumulativeStatusInstallation, ...cumulativeStatusOAndM],
            allDateWiseData,
            allMonthWiseData,
            allCircleWiseData,
            allDivisionWiseData,
            allSubDivisionWiseData,
            contractorSummaryMainTable
        };
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE,
            error
        );
    }
};
// ====================== || Area Wise Progress Dashboard End || ====================== //

// ====================== Contractor Dashboard Start ====================== //

const getContractorDashboard = async ({ projectId, meterTypeId }) => {
    try {
        const { db } = new Forms();

        const baseQuery = `
WITH
  "Stock Ledger Selections" AS (
    SELECT
      "Organization"."id" AS "Organization ID",
      "Organization"."name" AS "Organization Name",
      ${generateMeterIssuedToContractorSelector()} AS "Meter Issued To Contractor",
      ${generateMeterAvailableAtContractorSelector()} AS "Meter Available At Contractor",
      ${generateMeterIssuedToInstallerSelector()} AS "Meter Issued To Installer",
      ${generateMeterAvailableAtInstallerSelector()} AS "Meter Available At Installer",
      ${generateInstalledQuantitySelector()} AS "Total Installation"
    FROM
      "stock_ledgers" AS "Transaction"
      INNER JOIN "organization_stores" AS "Organization Store" ON "Transaction"."store_id" = "Organization Store"."id"
      INNER JOIN "organizations" AS "Organization" ON "Organization Store"."organization_id" = "Organization"."id"
      INNER JOIN "master_maker_lovs" AS "Organization Type" ON "Organization"."organization_type_id" = "Organization Type"."id"
      INNER JOIN "organization_store_locations" AS "Organization Store Location" ON "Transaction"."store_location_id" = "Organization Store Location"."id"
      INNER JOIN "master_maker_lovs" AS "Transaction Type" ON "Transaction"."transaction_type_id" = "Transaction Type"."id"
      INNER JOIN "materials" AS "Material" ON "Transaction"."material_id" = "Material"."id"
      INNER JOIN "master_maker_lovs" AS "Material Type" ON "Material Type"."id" = "Material"."material_type_id"
      INNER JOIN "projects" ON "projects"."id" = "Transaction"."project_id"
    WHERE
      NOT "Transaction"."is_cancelled"
      AND "Material"."is_serial_number"
      ${projectId ? `AND "projects"."id" ${formatConditionForSQL(projectId)}` : ""}
      ${meterTypeId ? `AND "Material Type"."id" ${formatConditionForSQL(meterTypeId)}` : ""}
    GROUP BY
      "Organization"."id"
  ),
  "Form Responses Selections" AS (
    SELECT
      "Organization"."id" AS "Organization ID",
      CONCAT(
        "Organization"."name",
        ' - ',
        "Organization"."code"
      ) AS "Organization Name",
      COALESCE(
        SUM(("L1 Approval Status"."name" IS NULL)::INT),
        0
      ) AS "L1 Level - Pending",
      COALESCE(
        SUM(("L1 Approval Status"."name" = 'Approved')::INT),
        0
      ) AS "L1 Level - Approved",
      COALESCE(
        SUM(("L1 Approval Status"."name" = 'Rejected')::INT),
        0
      ) AS "L1 Level - Rejected",
      COALESCE(
        SUM(("L1 Approval Status"."name" = 'On-Hold')::INT),
        0
      ) AS "L1 Level - On-Hold",
      COALESCE(
        SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" IS NULL)::INT),
        0
      ) AS "L2 Level - Pending",
      COALESCE(
        SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" = 'Approved')::INT),
        0
      ) AS "L2 Level - Approved",
      COALESCE(
        SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" = 'Rejected')::INT),
        0
      ) AS "L2 Level - Rejected",
      COALESCE(
        SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" = 'On-Hold')::INT),
        0
      ) AS "L2 Level - On-Hold"
    FROM
      "union_all_forms_for_metabase" ('Installation') AS "Form Response"
      INNER JOIN "users" AS "Users" ON "Form Response"."created_by" = "Users"."id"
      INNER JOIN "organizations" AS "Organization" ON "Users"."organization_id" = "Organization"."id"
      LEFT JOIN "project_master_maker_lovs" AS "L1 Approval Status" ON "Form Response"."l_a_approval_status"::UUID = "L1 Approval Status"."id"
      LEFT JOIN "project_master_maker_lovs" AS "L2 Approval Status" ON "Form Response"."l_b_approval_status"::UUID = "L2 Approval Status"."id"
      LEFT JOIN "projects" ON "projects"."id" = "Form Response"."project_id"
    WHERE
      1 = 1 
      ${projectId ? `AND "projects"."id" ${formatConditionForSQL(projectId)}` : ""}
    GROUP BY
      "Organization"."id"
  )
SELECT
  COALESCE(
    "Stock Ledger Selections"."Organization Name",
    "Form Responses Selections"."Organization Name"
  ) AS "Organization Name",
  COALESCE(
    SUM(
      "Stock Ledger Selections"."Meter Issued To Contractor"
    ),
    0
  ) AS "Meter Issued To Contractor",
  COALESCE(
    SUM(
      "Stock Ledger Selections"."Meter Available At Contractor"
    ),
    0
  ) AS "Meter Available At Contractor",
  COALESCE(
    SUM(
      "Stock Ledger Selections"."Meter Issued To Installer"
    ),
    0
  ) AS "Meter Issued To Installer",
  COALESCE(
    SUM("Stock Ledger Selections"."Total Installation"),
    0
  ) AS "Total Installation",
  COALESCE(
    SUM("Form Responses Selections"."L1 Level - Pending"),
    0
  ) AS "L1 Level - Pending",
  COALESCE(
    SUM("Form Responses Selections"."L1 Level - Approved"),
    0
  ) AS "L1 Level - Approved",
  COALESCE(
    SUM("Form Responses Selections"."L1 Level - Rejected"),
    0
  ) AS "L1 Level - Rejected",
  COALESCE(
    SUM("Form Responses Selections"."L1 Level - On-Hold"),
    0
  ) AS "L1 Level - On-Hold",
  COALESCE(
    SUM("Form Responses Selections"."L2 Level - Pending"),
    0
  ) AS "L2 Level - Pending",
  COALESCE(
    SUM("Form Responses Selections"."L2 Level - Approved"),
    0
  ) AS "L2 Level - Approved",
  COALESCE(
    SUM("Form Responses Selections"."L2 Level - Rejected"),
    0
  ) AS "L2 Level - Rejected",
  COALESCE(
    SUM("Form Responses Selections"."L2 Level - On-Hold"),
    0
  ) AS "L2 Level - On-Hold"
FROM
  "Form Responses Selections"
  RIGHT JOIN "Stock Ledger Selections" ON "Form Responses Selections"."Organization ID" = "Stock Ledger Selections"."Organization ID"
GROUP BY
  "Stock Ledger Selections"."Organization ID",
  "Stock Ledger Selections"."Organization Name",
  "Form Responses Selections"."Organization ID",
  "Form Responses Selections"."Organization Name"
        `;

        const contractorCountQuery = `
SELECT
    count(distinct "source"."Organization Name") AS "count"
    FROM
(
    ${baseQuery}
) AS "source"
`;

        const activeUsersBase = `
SELECT
    "Form Response"."created_at",
    "Form Response"."created_by"
FROM
    "union_all_forms_for_metabase" ('Default') AS "Form Response"
    INNER JOIN "forms" as "Form" ON "Form Response"."form_id" = "Form"."id"
    INNER JOIN "projects" as "Project" ON "Form"."project_id" = "Project"."id"
WHERE
    1 = 1
    ${projectId ? `AND "Project"."id" ${formatConditionForSQL(projectId)}` : ""}
`;

        const teamAvailaibilityTodayQuery = `
SELECT
  COUNT(
    DISTINCT CASE
      WHEN CAST("source"."created_at" AS date) = CAST(NOW() AS date) THEN "source"."created_by"
    END
  ) AS "Sum of count"
FROM
  ( ${activeUsersBase} ) AS "source"
`;

        const teamAvailaibilityCurrentWeekQuery = `
SELECT
    COUNT(
        DISTINCT CASE
        WHEN (
            CAST(
            DATE_TRUNC(
                'week',
                (
                CAST("source"."created_at" AS timestamp) + INTERVAL '1 day'
                )
            ) AS timestamp
            ) + INTERVAL '-1 day'
        ) = (
            CAST(
                DATE_TRUNC('week', (NOW() + INTERVAL '1 day')) AS timestamp
            ) + INTERVAL '-1 day'
        ) THEN "source"."created_by"
        END
    ) AS "Sum of count"
FROM
(
    ${activeUsersBase}
) AS "source"
`;

        const teamAvailabilityLastWeekQuery = `
SELECT
    COUNT(
        DISTINCT CASE
        WHEN (
            CAST(
            DATE_TRUNC(
                'week',
                (
                CAST("source"."created_at" AS timestamp) + INTERVAL '1 day'
                )
            ) AS timestamp
            ) + INTERVAL '-1 day'
        ) = (
            CAST(
            DATE_TRUNC(
                'week',
                ((NOW() + INTERVAL '-1 week') + INTERVAL '1 day')
            ) AS timestamp
            ) + INTERVAL '-1 day'
        ) THEN "source"."created_by"
        END
    ) AS "Sum of count"
FROM
(
    ${activeUsersBase}
) AS "source"
`;

        const teamAvailabilityCurrentMonthQuery = `
SELECT
    COUNT(
        DISTINCT CASE
        WHEN DATE_TRUNC('month', CAST("source"."created_at" AS timestamp)) = DATE_TRUNC('month', NOW()) THEN "source"."created_by"
        END
    ) AS "Sum of count"
FROM
(
    ${activeUsersBase}
) AS "source"
`;

        const teamAvailabilityLastMonthQuery = `
SELECT
    COUNT(
        DISTINCT CASE
        WHEN DATE_TRUNC('month', CAST("source"."created_at" AS timestamp)) = DATE_TRUNC('month', (NOW() + INTERVAL '-1 month')) THEN "source"."created_by"
        END
    ) AS "Sum of count"
FROM
(
    ${activeUsersBase}
) AS "source"
`;

        const taskCompletedVsManpowerBase = `
SELECT
    DATE ("Transaction"."created_at") AS "Created Date",
    "Organization"."name" AS "Organization Name",
    COUNT(DISTINCT "Transaction"."installer_id") AS "Manpower",
    ${generateInstalledQuantitySelector()} AS "Tasks Completed",
    'Installation' AS "type"
FROM
    "stock_ledgers" AS "Transaction"
    INNER JOIN "organization_stores" AS "Organization Store" ON "Transaction"."store_id" = "Organization Store"."id"
    INNER JOIN "organizations" AS "Organization" ON "Organization Store"."organization_id" = "Organization"."id"
    INNER JOIN "master_maker_lovs" AS "Organization Type" ON "Organization"."organization_type_id" = "Organization Type"."id"
    INNER JOIN "organization_store_locations" AS "Organization Store Location" ON "Transaction"."store_location_id" = "Organization Store Location"."id"
    INNER JOIN "master_maker_lovs" AS "Transaction Type" ON "Transaction"."transaction_type_id" = "Transaction Type"."id"
    INNER JOIN "projects" ON "Transaction"."project_id" = "projects"."id"
    INNER JOIN "materials" AS "Material" ON "Transaction"."material_id" = "Material"."id"
    INNER JOIN "master_maker_lovs" AS "Material Type" ON "Material Type"."id" = "Material"."material_type_id"
WHERE
    NOT "Transaction"."is_cancelled"
    AND "Transaction"."installer_id" IS NOT NULL
    AND "Transaction Type"."id" IN (
        'f3848838-6e7c-4240-a4e2-27e084164a17',
        '923fa9a0-5ed5-4bc2-9946-dad0da5f34c4'
    )
    ${projectId ? `AND "projects"."id" ${formatConditionForSQL(projectId)}` : ""}
    ${meterTypeId ? `AND "Material Type"."id" ${formatConditionForSQL(meterTypeId)}` : ""}
GROUP BY
    DATE ("Transaction"."created_at"),
    "Organization"."name"
UNION
SELECT
    DATE ("Form Response"."created_at") AS "Created Date",
    "organizations"."name" AS "Organization Name",
    COUNT(DISTINCT "Form Response"."created_by") AS "Manpower",
    1 AS "Tasks Completed",
    'Survey' AS "type"
FROM
    "union_all_forms_for_metabase" ('Survey') AS "Form Response"
    INNER JOIN "users" ON "users"."id" = "Form Response"."created_by"
    INNER JOIN "organizations" ON "organizations"."id" = "users"."organization_id"
    INNER JOIN "forms" ON "forms"."id" = "Form Response"."form_id"
    INNER JOIN "projects" ON "forms"."project_id" = "projects"."id"
WHERE
    1 = 1
    ${projectId ? `AND "projects"."id" ${formatConditionForSQL(projectId)}` : ""}
GROUP BY
    DATE ("Form Response"."created_at"),
    "organizations"."name"
UNION
SELECT
    DATE ("Form Response"."created_at") AS "Created Date",
    "organizations"."name" AS "Organization Name",
    COUNT(DISTINCT "Form Response"."created_by") AS "Manpower",
    1 AS "Tasks Completed",
    'O&M' AS "type"
FROM
    "union_all_forms_for_metabase" ('O&M') AS "Form Response"
    INNER JOIN "users" ON "users"."id" = "Form Response"."created_by"
    INNER JOIN "organizations" ON "organizations"."id" = "users"."organization_id"
    INNER JOIN "forms" ON "forms"."id" = "Form Response"."form_id"
    INNER JOIN "projects" ON "forms"."project_id" = "projects"."id"
WHERE
    1 = 1
    ${projectId ? `AND "projects"."id" ${formatConditionForSQL(projectId)}` : ""}
GROUP BY
    DATE ("Form Response"."created_at"),
    "organizations"."name"
`;

        const todaysStatusQuery = `
SELECT
        "source"."Organization Name" AS "Organization Name",
        SUM("source"."Tasks Completed") AS "Tasks Completed",
        SUM("source"."Manpower") AS "Manpower"
FROM
    (
        ${taskCompletedVsManpowerBase}
    ) AS "source"
WHERE
    ("source"."Created Date" >= CAST(NOW() AS date))
    AND (
        "source"."Created Date" < CAST((NOW() + INTERVAL '1 day') AS date)
    )
GROUP BY "source"."Organization Name"
        `;

        const currentMonthStatusQuery = `
SELECT
    "source"."Organization Name" AS "Organization Name",
    SUM("source"."Tasks Completed") AS "Tasks Completed",
    SUM("source"."Manpower") AS "Manpower"
FROM
    (        
        ${taskCompletedVsManpowerBase}
    ) AS "source"
WHERE
    (
        "source"."Created Date" >= DATE_TRUNC('month', NOW())
    )
    AND (
        "source"."Created Date" < DATE_TRUNC('month', (NOW() + INTERVAL '1 month'))
    )
GROUP BY "source"."Organization Name"
        `;

        const [
            baseTable,
            [{ count: contractorCount }],
            [{ "Sum of count": teamAvailaibilityToday }],
            [{ "Sum of count": teamAvailaibilityCurrentWeek }],
            [{ "Sum of count": teamAvailabilityLastWeek }],
            [{ "Sum of count": teamAvailabilityCurrentMonth }],
            [{ "Sum of count": teamAvailabilityLastMonth }],
            todaysStatus,
            currentMonthStatus
        ] = await Promise.all([
            executeQuery(db, baseQuery),
            executeQuery(db, contractorCountQuery),
            executeQuery(db, teamAvailaibilityTodayQuery),
            executeQuery(db, teamAvailaibilityCurrentWeekQuery),
            executeQuery(db, teamAvailabilityLastWeekQuery),
            executeQuery(db, teamAvailabilityCurrentMonthQuery),
            executeQuery(db, teamAvailabilityLastMonthQuery),
            executeQuery(db, todaysStatusQuery),
            executeQuery(db, currentMonthStatusQuery)
        ]);

        return {
            baseTable,
            contractorCount: Number(contractorCount),
            teamAvailaibilityToday: Number(teamAvailaibilityToday),
            teamAvailaibilityCurrentWeek: Number(teamAvailaibilityCurrentWeek),
            teamAvailabilityLastWeek: Number(teamAvailabilityLastWeek),
            teamAvailabilityCurrentMonth: Number(teamAvailabilityCurrentMonth),
            teamAvailabilityLastMonth: Number(teamAvailabilityLastMonth),
            todaysStatus,
            currentMonthStatus
        };
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE,
            error
        );
    }
};

// ====================== Contractor Dashboard End ====================== //

// ====================== Project Summary Dashboard Start ====================== //

const transformCumulativeStatus = (data = []) => {
    const initializeSummary = (item) => ({
        "Response Type": item["Response Type"],
        "Form Name": item["Form Name"],
        "Task Completed": 0,
        "L1 Approval Pending": 0,
        "L2 Approval Pending": 0,
        "L1 Approved": 0,
        "L2 Approved": 0,
        "L1 Rejected": 0,
        "L2 Rejected": 0,
        "L1 On-Hold": 0,
        "L2 On-Hold": 0
    });

    const parseValue = (value) => parseInt(value || 0, 10);

    const updateSummary = (acc, key, item) => {
        acc[key]["Task Completed"] += parseValue(item["Task Completed"]);
        acc[key]["L1 Approval Pending"] += parseValue(item["L1 Approval Pending"]);
        acc[key]["L2 Approval Pending"] += parseValue(item["L2 Approval Pending"]);
        acc[key]["L1 Approved"] += parseValue(item["L1 Approved"]);
        acc[key]["L2 Approved"] += parseValue(item["L2 Approved"]);
        acc[key]["L1 Rejected"] += parseValue(item["L1 Rejected"]);
        acc[key]["L2 Rejected"] += parseValue(item["L2 Rejected"]);
        acc[key]["L1 On-Hold"] += parseValue(item["L1 On-Hold"]);
        acc[key]["L2 On-Hold"] += parseValue(item["L2 On-Hold"]);
    };

    const summary = data.reduce((acc, item) => {
        const key = `${item["Response Type"]}_${item["Form Name"]}`;
        if (!acc[key]) {
            acc[key] = initializeSummary(item);
        }
        updateSummary(acc, key, item);
        return acc;
    }, {});

    return Object.values(summary);
};

const transformProgressData = (data = [], options = {}) => {
    const { where = {}, sortBy = "Created At", sortOrder = "DESC", limit = 15, variant = "day" } = options;
  
    const parseDate = (dateString) => {
        const date = new Date(dateString);
        if (variant === "month") {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return {
                dateRaw: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
                date: `${monthNames[date.getMonth()]}-${date.getFullYear()}`
            };
        } else {
        // default to day
            return {
                dateRaw: date.toISOString().split("T")[0],
                date: `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`
            };
        }
    };
  
    const filterData = (item) => Object.keys(where).every((key) => {
        if (typeof where[key] === "object") {
            if (Object.prototype.hasOwnProperty.call(where[key], "gt") && item[key] <= where[key].gt) return false;
            if (Object.prototype.hasOwnProperty.call(where[key], "lt") && item[key] >= where[key].lt) return false;
            if (Object.prototype.hasOwnProperty.call(where[key], "dateFrom") && new Date(item[key]) < new Date(where[key].dateFrom)) return false;
            if (Object.prototype.hasOwnProperty.call(where[key], "dateTo") && new Date(item[key]) > new Date(where[key].dateTo)) return false;
        } else {
            return item[key] === where[key];
        }
        return true;
    });
  
    const groupedData = data.filter(filterData).reduce((acc, item) => {
        const { dateRaw, date } = parseDate(item[sortBy]);
        if (!acc[dateRaw]) {
            acc[dateRaw] = {
                date: date,
                dateRaw: dateRaw,
                totalTasksCompleted: 0,
                uniqueInstallers: new Set()
            };
        }
        acc[dateRaw].totalTasksCompleted += parseInt(item["Task Completed"], 10);
        acc[dateRaw].uniqueInstallers.add(item["Installer ID"]);
        return acc;
    }, {});
  
    const result = Object.values(groupedData)
        .map((entry) => ({
            date: entry.date,
            dateRaw: entry.dateRaw,
            totalTasksCompleted: entry.totalTasksCompleted,
            uniqueInstallersCount: entry.uniqueInstallers.size
        }))
        .sort((a, b) => {
            if (sortOrder === "DESC") {
                return variant === "month" ? b.dateRaw.localeCompare(a.dateRaw) : new Date(b.dateRaw) - new Date(a.dateRaw);
            } else {
                return variant === "month" ? a.dateRaw.localeCompare(b.dateRaw) : new Date(a.dateRaw) - new Date(b.dateRaw);
            }
        })
        .slice(0, limit)
        .map((entry) => ({
            date: entry.date,
            "Total Tasks Completed": entry.totalTasksCompleted,
            Manpower: entry.uniqueInstallersCount
        }))
        .reverse();
  
    return result;
};

const transformTaskTypeWiseStatus = (data = []) => {
    const formatDate = (date) => date.toISOString().split("T")[0];

    const now = new Date();
    const todayDate = formatDate(now);

    // Start of the current week (assuming Monday as the first day)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const startOfWeekDate = formatDate(startOfWeek);

    // Start of the previous week
    const startOfPreviousWeekDate = formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() - 7)));

    // Start of the current month
    const startOfMonthDate = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));

    // Start of the previous month
    const startOfPreviousMonthDate = formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    const result = data.reduce((acc, item) => {
        const responseType = item["Response Type"];
        const createdAt = (new Date(item["Created At"])).toISOString().split("T")[0];

        if (!acc[responseType]) {
            acc[responseType] = {
                "Response Type": responseType,
                "Tasks Completed Today": 0,
                "Tasks Completed At This Week": 0,
                "Tasks Completed At Previous Week": 0,
                "Tasks Completed At This Month": 0,
                "Tasks Completed At Previous Month": 0
            };
        }

        if (createdAt === todayDate) {
            acc[responseType]["Tasks Completed Today"] += Number(item["Task Completed"]);
        }

        if ((createdAt >= startOfWeekDate) && (createdAt <= todayDate)) {
            acc[responseType]["Tasks Completed At This Week"] += Number(item["Task Completed"]);
        }

        if ((createdAt >= startOfPreviousWeekDate) && (createdAt < startOfWeekDate)) {
            acc[responseType]["Tasks Completed At Previous Week"] += Number(item["Task Completed"]);
        }

        if (createdAt > startOfMonthDate && createdAt < todayDate) {
            acc[responseType]["Tasks Completed At This Month"] += Number(item["Task Completed"]);
        }

        if (createdAt > startOfPreviousMonthDate && createdAt <= startOfMonthDate) {
            acc[responseType]["Tasks Completed At Previous Month"] += Number(item["Task Completed"]);
        }

        return acc;
    }, {});

    return Object.values(result).sort((a, b) => a["Response Type"].localeCompare(b["Response Type"]));
};

const getProjectSummaryDashboard = async ({ projectId, dateTimeFrom, dateTimeTo, cumulativeStatusOnly = false }) => {
    try {
        const { db } = new Forms();

        const dayWiseStatusQuery = `
        SELECT
            "Form Response"."Response Type" as "Response Type",
            "Form"."name" as "Form Name",
            "Form Response"."created_by" AS "Installer ID",
            CAST("Form Response"."created_at" AS DATE) AS "Created At",
            COUNT(1) AS "Task Completed",
            SUM(("L1 Approval Status"."name" IS NULL)::INT) AS "L1 Approval Pending",
            SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" IS NULL)::INT) AS "L2 Approval Pending",
            SUM(("L1 Approval Status"."name" = 'Approved')::INT) AS "L1 Approved",
            SUM(("L1 Approval Status"."name" = 'Approved' AND  "L2 Approval Status"."name" = 'Approved')::INT) AS "L2 Approved",
            SUM(("L1 Approval Status"."name" = 'Rejected')::INT) AS "L1 Rejected",
            SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" = 'Rejected')::INT) AS "L2 Rejected",
            SUM(("L1 Approval Status"."name" = 'On-Hold')::INT) AS "L1 On-Hold",
            SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" = 'On-Hold')::INT) AS "L2 On-Hold"
        FROM
            (
                SELECT
                    *,
                    'Survey' as "Response Type"
                FROM
                    "union_all_forms_for_metabase" ('Survey')
                UNION ALL
                SELECT
                    *,
                    'Installation' as "Response Type"
                FROM
                    "union_all_forms_for_metabase" ('Installation')
                UNION ALL
                SELECT
                    *,
                    'O&M' as "Response Type"
                FROM
                    "union_all_forms_for_metabase" ('O&M')
            ) AS "Form Response"
            LEFT JOIN "public"."project_master_maker_lovs" AS "L1 Approval Status" ON "Form Response"."l_a_approval_status" = "L1 Approval Status"."id"
            LEFT JOIN "public"."project_master_maker_lovs" AS "L2 Approval Status" ON "Form Response"."l_b_approval_status" = "L2 Approval Status"."id"
            INNER JOIN "public"."forms" AS "Form" ON "Form Response"."forms_table_name" = "Form"."table_name"
        WHERE
            (
                (
                    "Form Response"."Response Type" != 'Installation'
                    AND "Form Response"."is_active" = '1'
                )
                OR "Form Response"."Response Type" = 'Installation'
            )
            ${projectId ? `AND "Form"."project_id" ${formatConditionForSQL(projectId)}` : ""}
            ${dateTimeFrom ? `AND "Form Response"."created_at"::Date >= '${dateTimeFrom}'` : ""}
            ${dateTimeTo ? `AND "Form Response"."created_at"::Date <= '${dateTimeTo}'` : ""}
        GROUP BY 
            "Form Response"."Response Type",
            "Form"."name",
            "Form Response"."created_by",
            CAST("Form Response"."created_at" AS DATE)
        ORDER BY
            "Response Type" ASC,
            "Form Name" ASC
`;

        const dayWiseStatus = await executeQuery(db, dayWiseStatusQuery);

        return (dateTimeFrom || dateTimeTo) && cumulativeStatusOnly ? {
            cumulativeStatus: transformCumulativeStatus(dayWiseStatus)
        } : {
            taskTypeWiseStatus: transformTaskTypeWiseStatus(dayWiseStatus),
            cumulativeStatus: transformCumulativeStatus(dayWiseStatus),
            dayWiseSurveyStatus: transformProgressData(dayWiseStatus, {
                where: { "Response Type": "Survey" },
                sortBy: "Created At",
                sortOrder: "DESC",
                limit: 25
            }),
            dayWiseInstallationStatus: transformProgressData(dayWiseStatus, {
                where: { "Response Type": "Installation" },
                sortBy: "Created At",
                sortOrder: "DESC",
                limit: 25
            }),
            dayWiseOMStatus: transformProgressData(dayWiseStatus, {
                where: { "Response Type": "O&M" },
                sortBy: "Created At",
                sortOrder: "DESC",
                limit: 25
            }),
            monthWiseSurveyStatus: transformProgressData(dayWiseStatus, {
                variant: "month",
                where: { "Response Type": "Survey" },
                sortBy: "Created At",
                sortOrder: "DESC",
                limit: 12
            }),
            monthWiseInstallationStatus: transformProgressData(dayWiseStatus, {
                variant: "month",
                where: { "Response Type": "Installation" },
                sortBy: "Created At",
                sortOrder: "DESC",
                limit: 12
            }),
            monthWiseOMStatus: transformProgressData(dayWiseStatus, {
                variant: "month",
                where: { "Response Type": "O&M" },
                sortBy: "Created At",
                sortOrder: "DESC",
                limit: 12
            })
        };
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE,
            error
        );
    }
};

// ====================== Project Summary Dashboard End ====================== //

// ====================== Supervisor Dashboard Start ====================== //

const getSupervisorDashboard = async ({ projectId, dateTimeFrom, dateTimeTo, cumulativeStatusOnly = false, taskType, userId, isSuperUser }) => {
    try {
        const { db } = new Forms();
        
        let supervisorAssignments = [];
        if (!isSuperUser) {
            supervisorAssignments = await getAllSupervisorAssignments({ supervisorId: userId });
            supervisorAssignments = JSON.parse(JSON.stringify(supervisorAssignments));
            supervisorAssignments = supervisorAssignments?.rows?.map((item) => item?.userId);
            throwIfNot(supervisorAssignments?.length > 0, statusCodes.BAD_REQUEST, statusMessages.SUPERVISOR_ASSIGNMENTS_NOT_EXIST);
        }
        
        const dayWiseStatusQuery = `
        SELECT
            "Form Response"."Response Type" as "Response Type",
            "Form"."name" as "Form Name",
            "Form Response"."created_by" AS "Installer ID",
            "Installer"."name" AS "Installer Name",
            CAST("Form Response"."created_at" AS DATE) AS "Created At",
            COUNT(1) AS "Task Completed",
            COALESCE(SUM(("L1 Approval Status"."name" IS NULL)::INT), 0) AS "L1 Approval Pending",
            COALESCE(SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" IS NULL)::INT), 0) AS "L2 Approval Pending",
            COALESCE(SUM(("L1 Approval Status"."name" = 'Approved')::INT), 0) AS "L1 Approved",
            COALESCE(SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" = 'Approved')::INT), 0) AS "L2 Approved",
            COALESCE(SUM(("L1 Approval Status"."name" = 'Rejected')::INT), 0) AS "L1 Rejected",
            COALESCE(SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" = 'Rejected')::INT), 0) AS "L2 Rejected",
            COALESCE(SUM(("L1 Approval Status"."name" = 'On-Hold')::INT), 0) AS "L1 On-Hold",
            COALESCE(SUM(("L1 Approval Status"."name" = 'Approved' AND "L2 Approval Status"."name" = 'On-Hold')::INT), 0) AS "L2 On-Hold",
            EXTRACT(
                HOUR
                FROM
                    (
                        MAX(
                            DATE_TRUNC(
                                'minute',
                                CAST("Form Response"."created_at" AS timestamp)
                            )
                        ) - MIN(
                            DATE_TRUNC(
                                'minute',
                                CAST("Form Response"."created_at" AS timestamp)
                            )
                        )
                    )
            ) || ' Hours ' || EXTRACT(
                minute
                FROM
                    (
                        MAX(
                            DATE_TRUNC(
                                'minute',
                                CAST("Form Response"."created_at" AS timestamp)
                            )
                        ) - MIN(
                            DATE_TRUNC(
                                'minute',
                                CAST("Form Response"."created_at" AS timestamp)
                            )
                        )
                    )
            ) || ' Minutes' as "Total Working Hours",
            MIN(
                DATE_TRUNC(
                    'minute',
                    CAST("Form Response"."created_at" AS timestamp)
                ) AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata'
            ) AS "Execution Started At",
            MAX(
                DATE_TRUNC(
                    'minute',
                    CAST("Form Response"."created_at" AS timestamp)
                ) AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata'
            ) AS "Execution Ended At"
        FROM
            (
                SELECT
                    *,
                    'Survey' as "Response Type"
                FROM
                    "union_all_forms_for_metabase" ('Survey')
                UNION ALL
                SELECT
                    *,
                    'Installation' as "Response Type"
                FROM
                    "union_all_forms_for_metabase" ('Installation')
                UNION ALL
                SELECT
                    *,
                    'O&M' as "Response Type"
                FROM
                    "union_all_forms_for_metabase" ('O&M')
            ) AS "Form Response"
            LEFT JOIN "public"."project_master_maker_lovs" AS "L1 Approval Status" ON "Form Response"."l_a_approval_status" = "L1 Approval Status"."id"
            LEFT JOIN "public"."project_master_maker_lovs" AS "L2 Approval Status" ON "Form Response"."l_b_approval_status" = "L2 Approval Status"."id"
            INNER JOIN "public"."forms" AS "Form" ON "Form Response"."forms_table_name" = "Form"."table_name"
            INNER JOIN "public"."users" AS "Installer" ON "Form Response"."created_by" = "Installer"."id"
        WHERE
            1 = 1
            ${taskType ? `AND "Form Response"."Response Type" ${formatConditionForSQL(taskType)}` : ""}
            AND (
                (
                    "Form Response"."Response Type" != 'Installation'
                    AND "Form Response"."is_active" = '1'
                )
                OR "Form Response"."Response Type" = 'Installation'
            )
            ${!isSuperUser ? `AND "Form Response"."created_by" IN ('${supervisorAssignments.join("','")}')` : ""}
            ${projectId ? `AND "Form"."project_id" ${formatConditionForSQL(projectId)}` : ""}
            ${dateTimeFrom ? `AND "Form Response"."created_at"::Date >= '${dateTimeFrom}'` : ""}
            ${dateTimeTo ? `AND "Form Response"."created_at"::Date <= '${dateTimeTo}'` : ""}
        GROUP BY
            "Form Response"."Response Type",
            "Form"."name",
            "Form Response"."created_by",
            "Installer"."name",
            CAST("Form Response"."created_at" AS DATE)
        ORDER BY
            "Response Type" ASC,
            "Form Name" ASC
    `;
    
        const todaysStatusQuery = `
        SELECT
            "Form Response"."Installer ID" AS "Installer ID",
            "Form Response"."Installer Name" AS "Installer Name",
            "Form Response"."Created At" AS "Created At",
            SUM("Form Response"."Task Completed") AS "Task Completed",
            SUM("Form Response"."L1 Approval Pending") AS "L1 Approval Pending",
            SUM("Form Response"."L2 Approval Pending") AS "L2 Approval Pending",
            SUM("Form Response"."L1 Approved") AS "L1 Approved",
            SUM("Form Response"."L2 Approved") AS "L2 Approved",
            SUM("Form Response"."L1 Rejected") AS "L1 Rejected",
            SUM("Form Response"."L2 Rejected") AS "L2 Rejected",
            SUM("Form Response"."L1 On-Hold") AS "L1 On-Hold",
            SUM("L2 On-Hold") AS "L2 On-Hold",
            MIN("Form Response"."Execution Started At") AS "Execution Started At",
            MAX("Form Response"."Execution Ended At") AS "Execution Ended At",
            EXTRACT(
                HOUR
                FROM
                    (
                        MAX("Form Response"."Execution Ended At") - MIN("Form Response"."Execution Started At")
                    )
            ) || ' Hours ' || EXTRACT(
                minute
                FROM
                    (
                        MAX("Form Response"."Execution Ended At") - MIN("Form Response"."Execution Started At")
                    )
            ) || ' Minutes' as "Total Working Hours"
        FROM
            (
                ${dayWiseStatusQuery}
            ) AS "Form Response"
        WHERE 
            "Created At" = CURRENT_DATE
        GROUP BY
            "Installer ID",
            "Installer Name",
            "Created At"
        ORDER BY
            "Installer ID" ASC,
            "Created At" ASC
    `;

        const [dayWiseStatus, todaysStatus] = await Promise.all([dayWiseStatusQuery, todaysStatusQuery].map((query) => executeQuery(db, query)));
  
        const cumulativeStatus = transformCumulativeStatus(dayWiseStatus);
        
        return cumulativeStatusOnly ? { cumulativeStatus } : {
            todaysStatus,
            cumulativeStatus,
            taskTypeWiseStatus: transformTaskTypeWiseStatus(dayWiseStatus),
            dayWiseProductivityStatus: transformProgressData(dayWiseStatus, {
                sortBy: "Created At",
                sortOrder: "DESC",
                limit: 25
            }),
            monthWiseProductivityStatus: transformProgressData(dayWiseStatus, {
                variant: "month",
                sortBy: "Created At",
                sortOrder: "DESC",
                limit: 12
            })
        };
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE,
            error
        );
    }
};

// ====================== Supervisor Dashboard End ====================== //

// ====================== Project Summary Report Start ====================== //
const getProjectSummaryReport = async ({ projectId, pagination, fromDate, toDate, gaaColumnName, gaaColumnValue, pageNumber = 1, rowPerPage = 25 }) => {
    try {
        const page = ((pagination === "true") || (pagination === true)) ? `OFFSET (${pageNumber}-1)*${rowPerPage} LIMIT ${rowPerPage}` : "";
        const { db } = new Forms();
        
        const query = `SELECT
            DATE("Form Response"."created_at") AS created_date,
            SUM(("Response Type" = 'Survey')::INT) AS survey_total,
            COUNT(DISTINCT "Form Response".created_by) FILTER (WHERE "Response Type" = 'Survey') AS survey_user_count,
            SUM(("Response Type" = 'Installation')::INT) AS installation_total,
            COUNT(DISTINCT "Form Response".created_by) FILTER (WHERE "Response Type" = 'Installation') AS installation_user_count,
            SUM(("Response Type" = 'O&M')::INT) AS oanddump_total,
            COUNT(DISTINCT "Form Response".created_by) FILTER (WHERE "Response Type" = 'O&M') AS oanddump_user_count,
            COUNT(*) AS total_count_daywise
            FROM (
                SELECT *, 'Survey' as "Response Type"
                FROM "union_all_forms_for_metabase" ('Survey' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""})
                UNION ALL
                SELECT *, 'Installation' as "Response Type"
                FROM "union_all_forms_for_metabase" ('Installation' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""})
                UNION ALL
                SELECT *, 'O&M' as "Response Type"
                FROM "union_all_forms_for_metabase" ('O&M' ${gaaColumnName && gaaColumnValue ? `, '${gaaColumnName}', '${gaaColumnValue}'` : ""})
            ) AS "Form Response"
            INNER JOIN "public"."forms" AS "Form" ON "Form Response"."forms_table_name" = "Form"."table_name"
            ${projectId ? `AND "Form"."project_id"  = '${projectId}'` : ""}
            ${fromDate ? `AND DATE("Form Response"."created_at") >= '${fromDate}'` : ""}
            ${toDate ? `AND DATE("Form Response"."created_at") <= '${toDate}'` : ""}
            
            GROUP BY 
                CAST("Form Response"."created_at" AS DATE)

            ORDER BY
                DATE("Form Response"."created_at") DESC
            ${page}
            `;

        const projectSummaryData = executeQuery(db, query);
        return projectSummaryData;

    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FETCH_REQUEST_LIST_FAILURE,
            error
        );
    }
};
// ====================== Project Summary Report Start ====================== //

module.exports = {
    getAllStockLedgerDetailsWithAssociation,
    generateReportWhereCondition,
    getTxnsForStockReport,
    getAllTransactions,
    getGrnSerialNumbers,
    createAgingMaterialReportQuery,
    createAgingMaterialSubReportQuery,
    createAgingMaterialSerialNumbersQuery,
    validationStatusReport,
    getDateWiseProductivityReport,
    getExecutiveDashboard,
    getAreaWiseProgressDashboard,
    executeAgingMaterialReportQuery,
    getContractorDashboard,
    getProjectSummaryDashboard,
    getSupervisorDashboard,
    getProjectSummaryReport
};