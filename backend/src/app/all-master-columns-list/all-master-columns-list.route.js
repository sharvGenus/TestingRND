const router = require("express").Router();
const allMasterColumnsList = require("./all-master-columns-list.controller");
const { validateAllMasterColumnsListSaveOrUpdate } = require("./all-master-columns-list.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/all-master-columns-list/create", ensureAuthentications, validateAllMasterColumnsListSaveOrUpdate(), handleResponse.bind(this, allMasterColumnsList.createAllMasterColumnsList));
router.get("/all-master-columns-list/list/:masterId", ensureAuthentications, handleResponse.bind(this, allMasterColumnsList.getAllMasterColumnsListByMasterId));
router.get("/all-master-columns-list/details/:id", ensureAuthentications, handleResponse.bind(this, allMasterColumnsList.getAllMasterColumnsListDetails));
router.put("/all-master-columns-list/update/:id", ensureAuthentications, validateAllMasterColumnsListSaveOrUpdate(), handleResponse.bind(this, allMasterColumnsList.updateAllMasterColumnsList));
router.delete("/all-master-columns-list/delete/:id", ensureAuthentications, handleResponse.bind(this, allMasterColumnsList.deleteAllMasterColumnsList));

module.exports = router;
