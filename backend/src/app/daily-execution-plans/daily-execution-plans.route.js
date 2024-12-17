const router = require("express").Router();
const dailyExecutionPlans = require("./daily-execution-plans.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/export-daily-execution-plan-schema", ensureAuthentications, dailyExecutionPlans.exportDailyExecutionPlanSchemaFile);
router.post("/import-daily-execution-plan", ensureAuthentications, handleResponse.bind(this, dailyExecutionPlans.importDailyExecutionPlan));
router.get("/daily-execution-plan/list", ensureAuthentications, handleResponse.bind(this, dailyExecutionPlans.getDailyExecutionPlanList));
router.delete("/daily-execution-plan/delete/:id", ensureAuthentications, handleResponse.bind(this, dailyExecutionPlans.deleteDailyExecutionPlan));
router.get("/daily-execution-plan/history/:recordId", ensureAuthentications, handleResponse.bind(this, dailyExecutionPlans.getDailyExecutionPlanHistory));

module.exports = router;
