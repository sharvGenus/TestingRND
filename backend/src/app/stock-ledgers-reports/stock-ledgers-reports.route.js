const router = require("express").Router();
const stockLedgerReports = require("./stock-ledgers-reports.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.get("/delivery-report/list", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAllDeliveryReportDetails));
router.get("/contractor-reconciliation/list", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAllContractorReconciliationReportDetails));
router.get("/contractor-report/list", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAllContractorReportDetails));
router.get("/stock-report/list", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAllReportForStock));
router.get("/document-wise-report/list", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAllDeliveryReportDetails));
router.get("/get-material-types-for-report", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getMaterialTypesForReport));
router.get("/store-stock-report", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.stockReport));
router.get("/store-wise-material-summary-report", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.storeWiseMaterialSummaryReport));
router.get("/contractor-wise-material-summary-report", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.contractorWiseMaterialSummaryReport));
router.get("/aging-material-report/list", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAllAgingOfMaterialReport));
router.get("/aging-material-sub-report/list", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAllAgingOfMaterialSubReport));
router.get("/aging-material-serial-numbers/list", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAllAgingOfMaterialSerialNumbers));
router.get("/date-wise-productivity-report", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getDateWiseProductivityReport));
router.get("/validation-status-report", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getValidationStatusReport));
router.get("/executive-dashboard", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getExecutiveDashboard));
router.get("/area-wise-progress-dashboard", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getAreaWiseProgressDashboard));
router.get("/contractor-dashboard", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getContractorDashboard));
router.get("/project-summary-dashboard", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getProjectSummaryDashboard));
router.get("/supervisor-dashboard", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.getSupervisorDashboard));
router.get("/material-grn-report", ensureAuthentications, handleResponse.bind(this, stockLedgerReports.materialGrnReport));

// Post Routes 
router.use(
    "/reports",
    ensureAuthentications,
    router.post("/productivity-summary-report", handleResponse.bind(this, stockLedgerReports.getProjectSummaryReport))
);

module.exports = router;