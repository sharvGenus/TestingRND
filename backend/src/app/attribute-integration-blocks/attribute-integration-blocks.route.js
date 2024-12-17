const router = require("express").Router();
const attributeIntegrationBlock = require("./attribute-integration-blocks.controller");
const { validateAttributeIntegrationBlocksSaveOrUpdate } = require("./attribute-integration-blocks.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/attribute-integration-block/create", ensureAuthentications, validateAttributeIntegrationBlocksSaveOrUpdate(), handleResponse.bind(this, attributeIntegrationBlock.createAttributeIntegrationBlocks));
router.delete("/attribute-integration-block/delete/:id", ensureAuthentications, handleResponse.bind(this, attributeIntegrationBlock.deleteAttributeIntegrationBlocks));
router.put("/attribute-integration-block/update/:id", ensureAuthentications, validateAttributeIntegrationBlocksSaveOrUpdate(), handleResponse.bind(this, attributeIntegrationBlock.updateBlockAndConditions));
router.get("/attribute-integration-block/list", ensureAuthentications, handleResponse.bind(this, attributeIntegrationBlock.getAllAttributeIntegrationBlocks));
router.get("/attribute-integration-block/details/:id", ensureAuthentications, handleResponse.bind(this, attributeIntegrationBlock.getAttributeIntegrationBlocksDetails));

module.exports = router;
