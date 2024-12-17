const router = require("express").Router();
const attributeIntegrationCondition = require("./attribute-integration-conditions.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.get("/attribute-integration-condition-by-integrationBlock-id/list/:id", ensureAuthentications, handleResponse.bind(this, attributeIntegrationCondition.getAttributeIntegrationConditionByBLockId));

module.exports = router;
