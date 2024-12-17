const router = require("express").Router();
const qaMasterMakers = require("./qa-master-makers.controller");
const { validateQaMasterMakerSaveOrUpdate } = require("./qa-master-makers.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/qa-master-maker/create", ensureAuthentications, validateQaMasterMakerSaveOrUpdate(), handleResponse.bind(this, qaMasterMakers.createQaMasterMaker));
router.get("/qa-master-maker/list", ensureAuthentications, handleResponse.bind(this, qaMasterMakers.getQaMasterMakerList));
router.put("/qa-master-maker/update/:id", ensureAuthentications, validateQaMasterMakerSaveOrUpdate(), handleResponse.bind(this, qaMasterMakers.updateQaMasterMaker));
router.delete("/qa-master-maker/delete/:id", ensureAuthentications, handleResponse.bind(this, qaMasterMakers.deleteQaMasterMaker));
router.get("/qa-master-maker/history/:recordId", ensureAuthentications, handleResponse.bind(this, qaMasterMakers.getQaMasterMakerHistory));

module.exports = router;
