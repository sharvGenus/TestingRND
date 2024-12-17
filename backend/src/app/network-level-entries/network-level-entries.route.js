const router = require("express").Router();
const networkLevelEntries = require("./network-level-entries.controller");
const { validateNetworkLevelEntriesSaveOrUpdate } = require("./network-level-entries.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/network-level-entry/create", ensureAuthentications, validateNetworkLevelEntriesSaveOrUpdate(), handleResponse.bind(this, networkLevelEntries.createNetworkLevelEntries));
router.put("/network-level-entry/update/:id", ensureAuthentications, validateNetworkLevelEntriesSaveOrUpdate(), handleResponse.bind(this, networkLevelEntries.updateNetworkLevelEntries));
router.get("/network-level-entry/details/:id", ensureAuthentications, handleResponse.bind(this, networkLevelEntries.getNetworkLevelEntriesDetails));
router.get("/network-level-entry/list", ensureAuthentications, handleResponse.bind(this, networkLevelEntries.getAllNetworkLevelEntries));
router.delete("/network-level-entry/delete/:id", ensureAuthentications, handleResponse.bind(this, networkLevelEntries.deleteAllNetworkLevelEntries));
router.get("/network-level-entry/dropdown/:id", ensureAuthentications, handleResponse.bind(this, networkLevelEntries.getAllNetworkLevelEntryByDropdown));
router.get("/network-level-entry/history/:recordId", ensureAuthentications, handleResponse.bind(this, networkLevelEntries.getNetworkLevelEntryHistory));

module.exports = router;