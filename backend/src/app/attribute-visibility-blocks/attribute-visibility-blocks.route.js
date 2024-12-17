const router = require("express").Router();
const attributeVisibilityBlock = require("./attribute-visibility-blocks.controller");
const { validateAttributeVisibilityBlockSaveOrUpdate } = require("./attribute-visibility-blocks.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/attribute-visibility-block/create", ensureAuthentications, validateAttributeVisibilityBlockSaveOrUpdate(), handleResponse.bind(this, attributeVisibilityBlock.createAttributeVisibilityBlocks));
router.put("/attribute-visibility-block/update/:id", ensureAuthentications, validateAttributeVisibilityBlockSaveOrUpdate(), handleResponse.bind(this, attributeVisibilityBlock.updateAttributeVisibilityBLock));
router.delete("/attribute-visibility-block/delete/:id", ensureAuthentications, handleResponse.bind(this, attributeVisibilityBlock.deleteAttributeVisibilityBLocks));
router.get("/attribute-visibility-block/list", ensureAuthentications, handleResponse.bind(this, attributeVisibilityBlock.getAllAttributeVisibilityBlocks));
router.put("/attribute-visibility-block/update", ensureAuthentications, validateAttributeVisibilityBlockSaveOrUpdate(), handleResponse.bind(this, attributeVisibilityBlock.updateBlockAndConditions));

module.exports = router;
