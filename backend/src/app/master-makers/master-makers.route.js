const router = require("express").Router();
const masterMakers = require("./master-makers.controller");
const { validateMasterMakerSaveOrUpdate } = require("./master-makers.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/master-maker/create", ensureAuthentications, validateMasterMakerSaveOrUpdate(), handleResponse.bind(this, masterMakers.createMasterMaker));
router.put("/master-maker/update/:id", ensureAuthentications, validateMasterMakerSaveOrUpdate(), handleResponse.bind(this, masterMakers.updateMasterMaker));
router.get("/master-maker/details/:id", ensureAuthentications, handleResponse.bind(this, masterMakers.getMasterMakerDetails));
router.get("/master-maker/list", ensureAuthentications, handleResponse.bind(this, masterMakers.getAllMasterMakers));
router.delete("/master-maker/delete/:id", ensureAuthentications, handleResponse.bind(this, masterMakers.deleteMasterMaker));
router.get("/master-maker/history/:recordId", ensureAuthentications, handleResponse.bind(this, masterMakers.getMasterMakerHistory));

module.exports = router;
