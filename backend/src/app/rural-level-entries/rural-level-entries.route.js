const router = require("express").Router();
const ruralLevelEntries = require("./rural-level-entries.controller");
const { validateRuralLevelEntriesSaveOrUpdate } = require("./rural-level-entries.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/rural-level-entry/create", ensureAuthentications, validateRuralLevelEntriesSaveOrUpdate(), handleResponse.bind(this, ruralLevelEntries.createRuralLevelEntries));
router.put("/rural-level-entry/update/:id", ensureAuthentications, validateRuralLevelEntriesSaveOrUpdate(), handleResponse.bind(this, ruralLevelEntries.updateRuralLevelEntries));
router.get("/rural-level-entry/details/:id", ensureAuthentications, handleResponse.bind(this, ruralLevelEntries.getRuralLevelEntriesDetails));
router.get("/rural-level-entry/list", ensureAuthentications, handleResponse.bind(this, ruralLevelEntries.getAllRuralLevelEntries));
router.delete("/rural-level-entry/delete/:id", ensureAuthentications, handleResponse.bind(this, ruralLevelEntries.deleteAllRuralLevelEntries));
router.get("/rural-level-entry/dropdown/:id", ensureAuthentications, handleResponse.bind(this, ruralLevelEntries.getAllRuralLevelEntryByDropdown));
router.get("/rural-level-entry/history/:recordId", ensureAuthentications, handleResponse.bind(this, ruralLevelEntries.getRuralLevelEntryHistory));

module.exports = router;