const router = require("express").Router();
const masterMakerLovs = require("./master-maker-lovs.controller");
const { validateMasterMakerLovsSaveOrUpdate } = require("./master-maker-lovs.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/master-maker-lovs/create", ensureAuthentications, validateMasterMakerLovsSaveOrUpdate(), handleResponse.bind(this, masterMakerLovs.createMasterMakerLovs));
router.put("/master-maker-lovs/update/:id", ensureAuthentications, validateMasterMakerLovsSaveOrUpdate(), handleResponse.bind(this, masterMakerLovs.updateMasterMakerLovs));
router.get("/master-maker-lovs/details/:id", ensureAuthentications, handleResponse.bind(this, masterMakerLovs.getMasterMakerLovsDetails));
router.get("/master-maker-lovs/list", ensureAuthentications, handleResponse.bind(this, masterMakerLovs.getAllMasterMakerLovs));
router.delete("/master-maker-lovs/delete/:id", ensureAuthentications, handleResponse.bind(this, masterMakerLovs.deleteMasterMakerLovs));
router.get("/lov/list/:masterName", ensureAuthentications, handleResponse.bind(this, masterMakerLovs.getAllLovByMasterName));
router.get("/master-maker-lovs/history/:recordId", ensureAuthentications, handleResponse.bind(this, masterMakerLovs.getMasterMakerHistory));

module.exports = router;
