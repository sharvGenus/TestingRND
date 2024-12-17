const router = require("express").Router();
const attributeIntegrationPayload = require("./attribute-integration-payload.controller");
const { validateAttributeIntegrationPayloadSaveOrUpdate } = require("./attribute-integration-payload.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/attribute-integration-payload/create", ensureAuthentications, validateAttributeIntegrationPayloadSaveOrUpdate(), handleResponse.bind(this, attributeIntegrationPayload.createAttributeIntegrationPayload));
router.delete("/attribute-integration-payload/delete/:id", ensureAuthentications, handleResponse.bind(this, attributeIntegrationPayload.deleteAttributeIntegrationPayload));
router.put("/attribute-integration-payload/update/:id", ensureAuthentications, validateAttributeIntegrationPayloadSaveOrUpdate(), handleResponse.bind(this, attributeIntegrationPayload.updateAttributeIntegrationPayload));
router.get("/attribute-integration-payload-by-integrationBlock-id/list/:id", ensureAuthentications, handleResponse.bind(this, attributeIntegrationPayload.getAttributeIntegrationPayloadByBLockId));
router.get("/attribute-integration-payload/dropdown/:id", ensureAuthentications, handleResponse.bind(this, attributeIntegrationPayload.getAllAttributeIntegrationPayloadByDropdown));

module.exports = router;
