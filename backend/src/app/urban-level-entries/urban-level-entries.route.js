const router = require("express").Router();
const urbanLevelEntries = require("./urban-level-entries.controller");
const { validateurbanLevelEntrySaveOrUpdate } = require("./urban-level-entries.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/urban-level-entry/create", ensureAuthentications, validateurbanLevelEntrySaveOrUpdate(), handleResponse.bind(this, urbanLevelEntries.createUrbanLevelEntry));
router.put("/urban-level-entry/update/:id", ensureAuthentications, validateurbanLevelEntrySaveOrUpdate(), handleResponse.bind(this, urbanLevelEntries.updateUrbanLevelEntry));
router.get("/urban-level-entry/details/:id", ensureAuthentications, handleResponse.bind(this, urbanLevelEntries.getUrbanLevelEntryDetails));
router.get("/urban-level-entry/list", ensureAuthentications, handleResponse.bind(this, urbanLevelEntries.getAllUrbanLevelEntries));
router.delete("/urban-level-entry/delete/:id", ensureAuthentications, handleResponse.bind(this, urbanLevelEntries.deleteUrbanLevelEntry));
router.get("/urban-level-entry/dropdown/:id", ensureAuthentications, handleResponse.bind(this, urbanLevelEntries.getAllUrbanLevelEntryByDropdown));
router.get("/urban-level-entry/history/:recordId", ensureAuthentications, handleResponse.bind(this, urbanLevelEntries.getUrbanLevelEntryHistory));

module.exports = router;