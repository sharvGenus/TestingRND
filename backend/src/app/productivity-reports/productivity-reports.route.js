const router = require("express").Router();
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");
const { getUserWiseProductivityReport } = require("./productivity-reports.controller");
const { handleResponse } = require("../../utilities/common-utils");

router.get("/userWise-productivity-reports", ensureAuthentications, handleResponse.bind(this, getUserWiseProductivityReport));

module.exports = router;