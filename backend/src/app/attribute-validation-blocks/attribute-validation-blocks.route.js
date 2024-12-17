const router = require("express").Router();
const attributeValidationBlock = require("./attribute-validation-blocks.controller");
const { validateAttributeValidationBlockSaveOrUpdate } = require("./attribute-validation-blocks.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/attribute-validation-block/create", ensureAuthentications, validateAttributeValidationBlockSaveOrUpdate(), handleResponse.bind(this, attributeValidationBlock.createAttributeValidationBlocks));
router.put("/attribute-validation-block/update/:id", ensureAuthentications, validateAttributeValidationBlockSaveOrUpdate(), handleResponse.bind(this, attributeValidationBlock.updateAttributeValidationBLocks));
router.delete("/attribute-validation-block/delete/:id", ensureAuthentications, handleResponse.bind(this, attributeValidationBlock.deleteAttributeValidationBLocks));
router.get("/attribute-validation-block/list", ensureAuthentications, handleResponse.bind(this, attributeValidationBlock.getAllAttributeValidationBlocks));
router.put("/attribute-validation-block/update", ensureAuthentications, validateAttributeValidationBlockSaveOrUpdate(), handleResponse.bind(this, attributeValidationBlock.updateBlockAndConditions));

module.exports = router;
