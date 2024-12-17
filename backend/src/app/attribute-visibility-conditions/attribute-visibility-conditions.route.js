const router = require("express").Router();
const attributeVisibilityCondition = require("./attribute-visibility-conditions.controller");
const { validateAttributeVisibilityConditionSaveOrUpdate } = require("./attribute-visibility-conditions.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/attribute-visibility-condition/create", ensureAuthentications, validateAttributeVisibilityConditionSaveOrUpdate(), handleResponse.bind(this, attributeVisibilityCondition.createAttributeVisibilittyConditions));
router.put("/attribute-visibility-condition/update/:id", ensureAuthentications, validateAttributeVisibilityConditionSaveOrUpdate(), handleResponse.bind(this, attributeVisibilityCondition.updateAttributeVisibilityConditions));
router.delete("/attribute-visibility-condition/delete/:id", ensureAuthentications, handleResponse.bind(this, attributeVisibilityCondition.deleteAttributeVisibiliytConditions));
router.get("/attribute-visibility-condition/list", ensureAuthentications, handleResponse.bind(this, attributeVisibilityCondition.getAllAttributeVisibilityConditions));
router.get("/attribute-visibility-condition-by-visibilityBLock-id/list/:id", ensureAuthentications, handleResponse.bind(this, attributeVisibilityCondition.getAttributeVisibilityConditionByVisibilityId));

module.exports = router;
