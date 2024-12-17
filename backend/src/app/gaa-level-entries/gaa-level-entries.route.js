const router = require("express").Router();
const gaaLevelEntries = require("./gaa-level-entries.controller");
const { validategaaLevelEntrySaveOrUpdate } = require("./gaa-level-entries.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/gaa-level-entry/create", ensureAuthentications, validategaaLevelEntrySaveOrUpdate(), handleResponse.bind(this, gaaLevelEntries.creategaaLevelEntry));
router.put("/gaa-level-entry/update/:id", ensureAuthentications, validategaaLevelEntrySaveOrUpdate(), handleResponse.bind(this, gaaLevelEntries.updateGaaLevelEntry));
router.get("/gaa-level-entry/details/:id", ensureAuthentications, handleResponse.bind(this, gaaLevelEntries.getGaaLevelEntryDetails));
router.get("/gaa-level-entry/list", ensureAuthentications, handleResponse.bind(this, gaaLevelEntries.getAllGaaLevelEntries));
router.delete("/gaa-level-entry/delete/:id", ensureAuthentications, handleResponse.bind(this, gaaLevelEntries.deleteGaaLevelEntry));
router.get("/gaa-level-entry/dropdown/:id", ensureAuthentications, handleResponse.bind(this, gaaLevelEntries.getAllGaaLevelEntryByDropdown));
router.get("/gaa-level-entry/history/:recordId", ensureAuthentications, handleResponse.bind(this, gaaLevelEntries.getGaaLevelEntryHistory));

module.exports = router;