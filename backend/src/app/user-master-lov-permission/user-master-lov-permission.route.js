const router = require("express").Router();
const userMasterLovPermission = require("./user-master-lov-permission.controller");
const { validateUserMasterLovPermission } = require("./user-master-lov-permission.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/user-master-lov-permission/create", ensureAuthentications, validateUserMasterLovPermission(), handleResponse.bind(this, userMasterLovPermission.createUserMasterLovPermission));
router.put("/user-master-lov-permission/update/:id", ensureAuthentications, validateUserMasterLovPermission(), handleResponse.bind(this, userMasterLovPermission.updateUserMasterLovPermission));
router.delete("/user-master-lov-permission/delete/:id", ensureAuthentications, handleResponse.bind(this, userMasterLovPermission.deleteUserMasterLovPermission));
router.get("/user-master-lov-permission-by-userId/details/:id", ensureAuthentications, handleResponse.bind(this, userMasterLovPermission.getUserMasterLovPermissionByUserId));
router.get("/user-master-lov-permission/getDetails", ensureAuthentications, handleResponse.bind(this, userMasterLovPermission.getUserMasterLovPermission));
router.get("/user-gaa-network", ensureAuthentications, handleResponse.bind(this, userMasterLovPermission.getUserForGaaNetwork));
router.get("/get-gaanetwork-userId", ensureAuthentications, handleResponse.bind(this, userMasterLovPermission.getGaaNetworkUserId));

module.exports = router;