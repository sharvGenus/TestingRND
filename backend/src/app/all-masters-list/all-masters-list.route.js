const router = require("express").Router();
const allMastersList = require("./all-masters-list.controller");
const { validateAllMastersListSaveOrUpdate } = require("./all-masters-list.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/all-masters-list/create", ensureAuthentications, validateAllMastersListSaveOrUpdate(), handleResponse.bind(this, allMastersList.createAllMastersList));
router.get("/all-masters-list/list", ensureAuthentications, handleResponse.bind(this, allMastersList.getAllMastersList));
router.get("/all-masters-list/details/:id", ensureAuthentications, handleResponse.bind(this, allMastersList.getAllMastersListDetails));
router.put("/all-masters-list/update/:id", ensureAuthentications, validateAllMastersListSaveOrUpdate(), handleResponse.bind(this, allMastersList.updateAllMastersList));
router.delete("/all-masters-list/delete/:id", ensureAuthentications, handleResponse.bind(this, allMastersList.deleteAllMastersList));
router.get("/all-masters-list/rights-for", ensureAuthentications, handleResponse.bind(this, allMastersList.getRightsForDropdownData));

module.exports = router;
