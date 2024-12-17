const router = require("express").Router();
const attributeValidationCondition = require("./attribute-validation-conditions.controller");
const { validateAttributeValidationConditionSaveOrUpdate } = require("./attribute-validation-conditions.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/attribute-validation-condition/create", ensureAuthentications, validateAttributeValidationConditionSaveOrUpdate(), handleResponse.bind(this, attributeValidationCondition.createAttributeValidationConditions));
router.put("/attribute-validation-condition/update/:id", ensureAuthentications, validateAttributeValidationConditionSaveOrUpdate(), handleResponse.bind(this, attributeValidationCondition.updateAttributeValidationConditions));
router.delete("/attribute-validation-condition/delete/:id", ensureAuthentications, handleResponse.bind(this, attributeValidationCondition.deleteAttributeValidationConditions));
router.get("/attribute-validation-condition/list", ensureAuthentications, handleResponse.bind(this, attributeValidationCondition.getAllAttributeValidationConditions));
router.get("/attribute-validation-condition-by-validtionBLock-id/list/:id", ensureAuthentications, handleResponse.bind(this, attributeValidationCondition.getAttributeValidationConditionByBLockId));

module.exports = router;
