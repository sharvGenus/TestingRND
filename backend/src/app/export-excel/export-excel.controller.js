/* eslint-disable no-plusplus */
const CsvParser = require("json2csv").Parser;
const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const { getAllUsers } = require("../users/users.controller");
const { getAllProjects } = require("../projects/projects.controller");
const { getAllMaterial } = require("../materials/materials.controller");
const { getAllCountries } = require("../countries/countries.controller");
const { getAllStates } = require("../states/states.controller");
const { getAllCities } = require("../cities/cities.controller");
const { getAllGaaHierarchiesByProjectId } = require("../gaa-hierarchies/gaa-hierarchies.service");
const { getAllGaaLevelEntryByDropdown } = require("../gaa-level-entries/gaa-level-entries.controller");
const { getAllNetworkHierarchyByProjectId } = require("../network-hierarchies/network-hierarchies.controller");
const { getAllNetworkLevelEntryByDropdown } = require("../network-level-entries/network-level-entries.controller");
const { getAllOrganizations, getAllOrganizationLocations } = require("../organizations/organizations.controller");
const { getAllCustomerDepartmentsByCustomerId } = require("../customer-departments/customer-departments.controller");
const { getAllCustomerDesignationsByCustomerDepartmentId } = require("../customer-designations/customer-designations.controller");
const { getAllOrganizationStores } = require("../organization-stores/organization-stores.controller");
const { getAllOrganizationStoreLocations } = require("../organization-store-locations/organization-store-locations.controller");
const { getAllApprovers } = require("../approvers-master/approvers-master.controller");
const { getAllMasterMakers } = require("../master-makers/master-makers.controller");
const { getAllMasterMakerLovs } = require("../master-maker-lovs/master-maker-lovs.controller");
const { getTransactionTypeRangeList } = require("../transaction-type-ranges/transaction-type-ranges.controller");
const { getAllProjectMasterMakersByProjectId } = require("../project-master-makers/project-master-makers.controller");
const { getAllProjectMasterMakerLovsByMasterId } = require("../project-master-maker-lovs/project-master-maker-lovs.controller");
const { getSmtpConfigurationList } = require("../smtp-configurations/smtp-configurations.controller");
const { getAllStockLedgerDetails } = require("../stock-ledgers/stock-ledgers.controller");
const { getRefererWithoutHost, formatTimeStamp, formatDate } = require("../../utilities/common-utils");
const { getAllRequests } = require("../request-approvals/request-approvals.controller");
const { getAllRoleByDropdown } = require("../roles/roles.controller");
const { getAllTickets } = require("../tickets/tickets.controller");
const { getGaaHierarchiesReport } = require("../metabase-reports/metabase-reports.service");
const { getValidationStatusReport, materialGrnReport, getProjectSummaryReport } = require("../stock-ledgers-reports/stock-ledgers-reports.controller");
const { supervisorMaterialReport, getAreaWiseProductivity } = require("../metabase-reports/metabase-reports.controller");
const { generateFormsReport } = require("../forms/forms.controller");
const { getQaMasterMakerList } = require("../qa-master-makers/qa-master-makers.controller");
const { getQaMasterMakerLovList } = require("../qa-master-maker-lovs/qa-master-maker-lovs.controller");
const { getDevolutionList } = require("../devolutions/devolutions.controller");
const { getFormDetails } = require("../forms/forms.service");
const { getUserWiseInstallerDetails, formatForInClause } = require("../productivity-reports/productivity-reports.service");
const stockLedgerService = require("../stock-ledgers-reports/stock-ledgers-reports.service");
const { getAllUrbanHierarchiesByProjectId } = require("../urban-hierarchies/urban-hierarchies.service");
const { getAllRuralHierarchiesByProjectId } = require("../rural-hierarchies/rural-hierarchies.service");
const { getAllUrbanLevelEntryByDropdown } = require("../urban-level-entries/urban-level-entries.controller");
const { getAllRuralLevelEntryByDropdown } = require("../rural-level-entries/rural-level-entries.controller");

const tables = {
    users: "users",
    project: "projects",
    material: "materials",
    roles: "roles",
    countries: "countries",
    states: "states",
    cities: "cities",
    gaa: "gaa_hierarchies",
    gaaEnteries: "gaa_level_entries",
    network: "network_hierarchies",
    networkEnteries: "network_level_entries",
    company: "company",
    customerDepartment: "customer_departments",
    customerDesignation: "customer_designations",
    approver: "approver",
    masterMaker: "master_makers",
    masterMakerLovs: "master_maker_lovs",
    transactionTypeRange: "transaction_type_ranges",
    projectMaker: "project_master_makers",
    projectMasterMakerLovs: "project_master_maker_lovs",
    qaMaker: "qa_master_makers",
    qaMasterMakerLovs: "qa_master_maker_lovs",
    smtp: "smtp",
    tickets: "tickets",
    supervisorWiseMaterialStatusReport: "supervisor-wise-material-status-report",
    installerWiseMaterialStatusReport: "installer-wise-material-status-report",
    dateWiseProductivityReport: "date_wise_productivity_report",
    userWiseProductivityReport: "user_wise_productivity_report",
    validationStatusReport: "validation_status_report",
    userWiseValidationReport: "user-wise-validation_status_report",
    materialGrnReport: "material-grn-report",
    devolutions: "devolutions",
    areaWiseProducticityReport: "area_wise_productivity_report",
    ProducticitySummaryReport: "productivity_summary_report",
    urbanHierarchy: "urban_hierarchies",
    urbanLevelEntry: "urban_level_entries",
    ruralHierarchy: "rural_hierarchies",
    ruralLevelEntry: "rural_level_entries"

};

const organization = ["supplier", "contractor", "company", "customer"];
const branchOffices = ["contractor_branch", "company_branch"];
const organizationStore = ["company_stores", "contractor_stores", "customer_stores", "supplier_stores"];
const organizationStoreLocation = ["contractor_store_locations", "company_store_locations"];
const receipts = [
    "grn_receipt",
    "min_receipt",
    "mrn_receipt",
    "return_mrn_receipt",
    "ltl_receipt",
    "stc_receipt",
    "sto_receipt",
    "sto_grn_receipt",
    "ptp_receipt",
    "ptp_grn_receipt",
    "stsrc_receipt",
    "srcts_receipt"
];
const requests = ["mrf_receipt", "str_receipt", "mrr_receipt"];
const reports = ["gaa_and_network_hierarchy"];

const staticDateKeys = ["createdAt", "updatedAt", "submittedAt"];

const exportExcel = async (req, res) => {
    try {
        const { tableName, requiredObject } = req.body;
        const referrer = await getRefererWithoutHost(req);
        let rows;
        throwIfNot(req.body, statusCodes.NOT_FOUND, statusMessages.TABLE_NAME_MISSING);
        const addedObject = {
            id: "Id",
            ...requiredObject
        };

        if (tableName === tables.users) {
            const { data } = await getAllUsers(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.project) {
            const { data } = await getAllProjects(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.material) {
            const { data } = await getAllMaterial(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.roles) {
            req.params.id = req.query.projectId;
            const { data } = await getAllRoleByDropdown(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.countries) {
            const { data } = await getAllCountries(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.states) {
            const { data } = await getAllStates(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.cities) {
            const { data } = await getAllCities(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.gaa) {
            const { projectId } = req.query;
            const data = await getAllGaaHierarchiesByProjectId({ projectId, levelType: "gaa" });
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.gaaEnteries) {
            req.params.id = req.query.gaaId;
            const { data } = await getAllGaaLevelEntryByDropdown(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.network) {
            const { projectId } = req.query;
            req.params.id = projectId;
            req.query.levelType = "network";
            const { data } = await getAllNetworkHierarchyByProjectId(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.networkEnteries) {
            req.params.id = req.query.networkId;
            const { data } = await getAllNetworkLevelEntryByDropdown(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.customerDepartment) {
            const { data } = await getAllCustomerDepartmentsByCustomerId(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.customerDesignation) {
            const { data } = await getAllCustomerDesignationsByCustomerDepartmentId(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.approver) {
            const { data } = await getAllApprovers(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.masterMaker) {
            const { data } = await getAllMasterMakers(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.masterMakerLovs) {
            const { data } = await getAllMasterMakerLovs(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.transactionTypeRange) {
            const { data } = await getTransactionTypeRangeList(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.projectMaker) {
            req.params.id = req.query.projectId;
            const { data } = await getAllProjectMasterMakersByProjectId(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.projectMasterMakerLovs) {
            req.params.id = req.query.masterId;
            const { data } = await getAllProjectMasterMakerLovsByMasterId(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.qaMaker) {
            req.params.id = req.query.projectId;
            const { data } = await getQaMasterMakerList(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.qaMasterMakerLovs) {
            req.params.id = req.query.masterId;
            const { data } = await getQaMasterMakerLovList(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.smtp) {
            req.params.id = req.query.masterId;
            const { data } = await getSmtpConfigurationList(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.tickets) {
            const { data } = await getAllTickets(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
            rows = rows.map((row) => ({ ...row, supervisor_obj: `${row?.supervisor_obj?.name || "N/A"}${row?.supervisor_obj?.name ? "-" : ""}${row?.supervisor_obj?.code || ""}`, assignee: `${row?.assignee?.name || "N/A"}${row?.assignee?.name ? "-" : ""}${row?.assignee?.code || ""}`, priority: row?.priority?.toUpperCase(), ticketStatus: row?.ticketStatus?.toUpperCase(), ticketNumber: row.updatedTicketNumber }));
        } else if (tableName === tables.dateWiseProductivityReport) {
            const { formId, approver, projectId, formType, gaaLevelDetails, dateFrom, dateTo } = req.query;
            const data = await stockLedgerService.getDateWiseProductivityReport({ projectId, formId, approver, formType, gaaLevelDetails, dateFrom, dateTo });
            // const { data } = await getDateWiseProductivityReport(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.supervisorWiseMaterialStatusReport || tableName === tables.installerWiseMaterialStatusReport) {
            const { data } = await supervisorMaterialReport(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.validationStatusReport) {
            const { formId, approver, projectId, formType, gaaLevelDetails, dateFrom, dateTo } = req.query;
            const data = await stockLedgerService.validationStatusReport({ projectId, formId, approver, formType, gaaLevelDetails, dateFrom, dateTo });
            // const { data } = await getValidationStatusReport(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.userWiseValidationReport) {
            const { data } = await generateFormsReport(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.materialGrnReport) {
            const { data } = await materialGrnReport(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.devolutions) {
            const { data } = await getDevolutionList(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.areaWiseProducticityReport) {
            const { data } = await getAreaWiseProductivity(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.userWiseProductivityReport) {
            const { formId, dateFrom, dateTo, gaaHierarchy, sort } = req.query;
            const columnValue = formatForInClause(gaaHierarchy.columnValue);
            const getformDetails = await getFormDetails(formId);
            const getFormUsersData = await getUserWiseInstallerDetails(getformDetails, dateFrom, dateTo, gaaHierarchy.columnName, columnValue, sort, false);
            rows = JSON.parse(JSON.stringify(getFormUsersData?.getFormUsersDetails));
        } else if (tableName === tables.ProducticitySummaryReport) {
            const { data } = await getProjectSummaryReport(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.urbanHierarchy) {
            const { projectId } = req.query;
            const data = await getAllUrbanHierarchiesByProjectId({ projectId, levelType: "urban" });
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.ruralHierarchy) {
            const { projectId } = req.query;
            const data = await getAllRuralHierarchiesByProjectId({ projectId, levelType: "rural" });
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.urbanLevelEntry) {
            req.params.id = req.query.urbanId;
            const { data } = await getAllUrbanLevelEntryByDropdown(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (tableName === tables.ruralLevelEntry) {
            req.params.id = req.query.urbanId;
            const { data } = await getAllRuralLevelEntryByDropdown(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        }

        if (organization.includes(tableName)) {
            req.params.organizationTypeId = req.query.organizationTypeId;
            const { data } = await getAllOrganizations(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (branchOffices.includes(tableName)) {
            req.params.organizationTypeId = req.query.organizationTypeId;
            const { data } = await getAllOrganizationLocations(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (organizationStore.includes(tableName)) {
            const { data } = await getAllOrganizationStores(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (organizationStoreLocation.includes(tableName)) {
            const { data } = await getAllOrganizationStoreLocations(req);
            rows = JSON.parse(JSON.stringify(data?.rows));
        } else if (receipts.includes(tableName)) {
            const { data } = await getAllStockLedgerDetails(req);
            rows = JSON.parse(JSON.stringify(data.rows));
        } else if (requests.includes(tableName)) {
            const { data } = await getAllRequests(req);
            rows = JSON.parse(JSON.stringify(data.rows));
        } else if (reports.includes(tableName)) {
            const { projectId } = req.query;
            throwIfNot(projectId, statusCodes.BAD_REQUEST, statusMessages.PROJECT_ID_NOT_FOUND);
            const data = await getGaaHierarchiesReport(projectId);
            rows = JSON.parse(JSON.stringify(data.rows));
        }

        const excelData = rows?.map((row) => {
            const newRow = {};
            for (const [key, value] of Object.entries(addedObject)) {
                let isGrnBased = false;
                if (referrer === "/grn-receipt") {
                    isGrnBased = !row?.stock_ledgers[0]?.requestNumber;
                }
                if (key.includes(".") && Object.hasOwnProperty.call(row, key.split(".")[0])) {
                    newRow[value] = getReccurssiveObjectKeys(row, key);
                } else if (staticDateKeys.includes(key)) {
                    newRow[value] = formatTimeStamp(row[key]);
                } else if (value.startsWith("Date") || key.endsWith("Date")) {
                    newRow[value] = formatDate(row[key]);
                } else if (referrer === "/gaa-master" && key === "isMapped") {
                    newRow[value] = row[key] == "1" ? "Yes" : "-";
                } else if (Object.hasOwnProperty.call(row, key)) {
                    newRow[value] = row[key];
                } else if (referrer === "/grn-receipt" && key === "supplierName" && isGrnBased) {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity > 0)?.organization?.name;
                } else if (referrer === "/grn-receipt" && key === "toProject.name") {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity > 0)?.project?.name;
                } else if (referrer === "/grn-receipt" && key === "toStore.name") {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity > 0)?.organization_store?.name;
                } else if ((referrer === "/min-receipt" || referrer === "/ltl-receipt" || referrer === "/sto-receipt" || referrer === "/sto-grn-receipt" || referrer === "/ptp-receipt") && key === "stock_ledgers[0].organization.name") {
                    newRow[value] = row?.stock_ledgers[0]?.organization?.name;
                } else if ((referrer === "/min-receipt" || referrer === "/ltl-receipt" || referrer === "/sto-receipt" || referrer === "/sto-grn-receipt" || referrer === "/ptp-receipt") && key === "stock_ledgers[0].organization_store.name") {
                    newRow[value] = row?.stock_ledgers[0]?.organization_store?.name;
                } else if ((referrer === "/min-receipt" || referrer === "/stsrc-receipt" || referrer === "/srcts-receipt" || referrer === "/ltl-receipt" || referrer === "/sto-receipt" || referrer === "/sto-grn-receipt" || referrer === "/ptp-receipt") && key === "stock_ledgers[0].project.name") {
                    newRow[value] = row?.stock_ledgers[0]?.project?.name;
                } else if ((referrer === "/mrn-receipt" || referrer === "/return-mrn-receipt") && key === "stock_ledgers[0].organization.name") {
                    newRow[value] = row?.stock_ledgers[0]?.organization?.name;
                } else if ((referrer === "/mrn-receipt" || referrer === "/return-mrn-receipt") && key === "stock_ledgers[0].project.name") {
                    newRow[value] = row?.stock_ledgers[0].project?.name;
                } else if (referrer === "/mrn-receipt" && key === "projectSiteStore") {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity < 0)?.organization_store?.name;
                } else if (referrer === "/return-mrn-receipt" && key === "toStore.name") {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity > 0)?.organization_store?.name;
                } else if (referrer === "/stc-receipt" && key === "fromStore.name") {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity < 0)?.organization_store?.name;
                } else if (referrer === "/stc-receipt" && key === "fromProject.name") {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity < 0)?.project?.name;
                } else if (referrer === "/stc-receipt" && key === "toStore.name") {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity > 0)?.organization_store?.name;
                } else if (referrer === "/stc-receipt" && key === "toStore.organization.name") {
                    newRow[value] = row.stock_ledgers.find((item) => item.quantity > 0)?.organization_store.organization?.name;
                } else if ((referrer === "/str-receipt" || referrer === "/ptpr-receipt") && key === "fromStore.name") {
                    newRow[value] = row.from_store?.name;
                } else if ((referrer === "/str-receipt" || referrer === "/ptpr-receipt") && key === "materialData[0].project.name") {
                    newRow[value] = row.project?.name;
                } else if (referrer === "/str-receipt" && key === "toStore.name") {
                    newRow[value] = row.to_store?.name;
                } else if (referrer === "/ptpr-receipt" && key === "toProject.name") {
                    newRow[value] = row.to_project?.name;
                } else if (referrer === "/transaction-type-range" && key === "traxnsName") {
                    newRow[value] = row.name;
                } else if (referrer === "/transaction-type-range" && key === "orgName") {
                    newRow[value] = `${row.organization.name} - ${row.organization.code}`;
                } else if (referrer === "/transaction-type-range" && key === "branchName") {
                    newRow[value] = row?.organization_store?.organization?.parentId && row?.organization_store?.organization?.parentId !== null
                        ? `${row?.organization_store?.organization?.name} - ${row?.organization_store?.organization?.code}`
                        : "-";
                } else if (referrer === "/material-master" && key === "isSerialNumberText") {
                    newRow[value] = row.isSerialNumber ? "Yes" : "No";
                }
            }
            return newRow;
        });

        const headers = Object.values(addedObject);
        const csvParser = new CsvParser({ headers });
        const data = csvParser.parse(excelData);

        res.setHeader("Content-Type", "text.csv");
        res.setHeader("Content-Disposition", "attachment: fileName=file.csv");
        res.status(200).end(data);
        // return exportToCSV(headers, excelData, res);
    } catch (error) {
        console.error("An error occurred:", error);
        // Handle the error and send an appropriate response to the client
        res.status(500).send({ message: "something went wrong" });
    }
};

function isObject(value) {
    const type = typeof value;
    return value != null && (type === "object" || type === "function");
}

const getReccurssiveObjectKeys = (object, path) => {
    if (!isObject(object)) {
        return object;
    }
    // eslint-disable-next-line no-param-reassign
    path = path?.split(".");
    const { length } = path;

    let index = -1;
    let nested = object;
    while (nested != null && ++index < length) {
        const key = path[index];
        nested = nested[key];
    }
    return nested;
};

module.exports = {
    exportExcel
};
