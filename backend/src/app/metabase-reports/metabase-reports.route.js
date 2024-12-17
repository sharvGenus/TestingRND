const router = require("express").Router();
const metabaseReports = require("./metabase-reports.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/reports-dashboard", ensureAuthentications, handleResponse.bind(this, metabaseReports.fetchDashboard));
router.get("/form-response-report", ensureAuthentications, handleResponse.bind(this, metabaseReports.fetchFormReport));
router.get("/gaa-hierarchies-report/:projectId", ensureAuthentications, handleResponse.bind(this, metabaseReports.getGaaHierarchiesReport));

router.get("/supervisor-wise-material-report", ensureAuthentications, handleResponse.bind(this, metabaseReports.supervisorMaterialReport));
router.get("/installer-list/stock-ledger", ensureAuthentications, handleResponse.bind(this, metabaseReports.getStockLedgerInstallerList));

router.get("/site-exception-report", ensureAuthentications, handleResponse.bind(this, metabaseReports.getSiteExceptionReport));
router.get("/area-wise-productivity", ensureAuthentications, handleResponse.bind(this, metabaseReports.getAreaWiseProductivity));

module.exports = router;
