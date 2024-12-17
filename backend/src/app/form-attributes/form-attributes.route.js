const router = require("express").Router();
const formAttributes = require("./form-attributes.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/form-attributes/create", ensureAuthentications, handleResponse.bind(this, formAttributes.createformAttributes));
router.get("/form-attributes/list", ensureAuthentications, handleResponse.bind(this, formAttributes.getAllformAttributes));
router.get("/form-attributes/details/:id", ensureAuthentications, handleResponse.bind(this, formAttributes.getformAttributesDetails));
router.put("/form-attributes/update/:id", ensureAuthentications, handleResponse.bind(this, formAttributes.updateformAttributes));
router.delete("/form-attributes/delete/:id", ensureAuthentications, handleResponse.bind(this, formAttributes.deleteformAttributes));

module.exports = router;
