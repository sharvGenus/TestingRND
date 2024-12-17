const router = require("express").Router();
const qaMasterMakerLovs = require("./qa-master-maker-lovs.controller");
const { validateQaMasterMakerLovSaveOrUpdate } = require("./qa-master-maker-lovs.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/qa-master-maker-lov/create", ensureAuthentications, validateQaMasterMakerLovSaveOrUpdate(), handleResponse.bind(this, qaMasterMakerLovs.createQaMasterMakerLov));
router.get("/qa-master-maker-lov/list", ensureAuthentications, handleResponse.bind(this, qaMasterMakerLovs.getQaMasterMakerLovList));
router.put("/qa-master-maker-lov/update/:id", ensureAuthentications, validateQaMasterMakerLovSaveOrUpdate(), handleResponse.bind(this, qaMasterMakerLovs.updateQaMasterMakerLov));
router.delete("/qa-master-maker-lov/delete/:id", ensureAuthentications, handleResponse.bind(this, qaMasterMakerLovs.deleteQaMasterMakerLov));
router.get("/qa-master-maker-lov/history/:recordId", ensureAuthentications, handleResponse.bind(this, qaMasterMakerLovs.getQaMasterMakerLovHistory));
router.post("/qa-master-maker-lov-schema-export", ensureAuthentications, qaMasterMakerLovs.qaMasterMakerLovSchemaExport);
router.post("/qa-master-maker-lov-import", ensureAuthentications, handleResponse.bind(this, qaMasterMakerLovs.qaMasterMakerLovImport));

module.exports = router;
