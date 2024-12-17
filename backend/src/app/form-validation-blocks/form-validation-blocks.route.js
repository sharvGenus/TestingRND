const router = require("express").Router();
const formValidationBlocks = require("./form-validation-blocks.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/form-validation-blocks/create", ensureAuthentications, handleResponse.bind(this, formValidationBlocks.createFormValidationBlocks));
router.get("/form-validation-blocks/list", ensureAuthentications, handleResponse.bind(this, formValidationBlocks.getAllformValidationBlocks));
router.get("/form-validation-blocks/details/:id", ensureAuthentications, handleResponse.bind(this, formValidationBlocks.getformValidationBlockDetails));
router.put("/form-validation-blocks/update/:id", ensureAuthentications, handleResponse.bind(this, formValidationBlocks.updateformValidationBlocks));
router.delete("/form-validation-blocks/delete/:id", ensureAuthentications, handleResponse.bind(this, formValidationBlocks.deleteformValidationBlocks));

module.exports = router;
