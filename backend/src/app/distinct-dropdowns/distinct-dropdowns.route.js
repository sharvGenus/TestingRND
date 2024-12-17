const router = require("express").Router();
const dropdowns = require("./distinct-dropdowns.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.get("/distinct-dropdowns/list", ensureAuthentications, handleResponse.bind(this, dropdowns.getDistinctDropdowns));

module.exports = router;