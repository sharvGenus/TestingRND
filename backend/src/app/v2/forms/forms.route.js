const router = require("express").Router();
const forms = require("./forms.controller");
const { handleResponse } = require("../../../utilities/common-utils");
const ensureAuthentications = require("../../../middlewares/verify-user-token.middleware");

router.post("/form/get-dropdown-field-data", ensureAuthentications, handleResponse.bind(this, forms.getDynamicQueryData));

module.exports = router;