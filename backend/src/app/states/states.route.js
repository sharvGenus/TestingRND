const router = require("express").Router();
const states = require("./states.controller");
const { validateStateSaveOrUpdate } = require("./states.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/state/create", ensureAuthentications, validateStateSaveOrUpdate(), handleResponse.bind(this, states.createState));
router.get("/state/list", ensureAuthentications, handleResponse.bind(this, states.getAllStates));
router.get("/state/details/:id", ensureAuthentications, handleResponse.bind(this, states.getStateDetails));
router.get("/state/history/:recordId", ensureAuthentications, handleResponse.bind(this, states.getStateHistory));
router.put("/state/update/:id", ensureAuthentications, validateStateSaveOrUpdate(), handleResponse.bind(this, states.updateState));
router.delete("/state/delete/:id", ensureAuthentications, handleResponse.bind(this, states.deleteState));
router.get("/state/dropdown/:countryId", ensureAuthentications, handleResponse.bind(this, states.getAllStatesByDropdown));

module.exports = router;