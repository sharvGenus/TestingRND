const router = require("express").Router();
const userMasterPermission = require("./user-master-permissions.controller");
const { validateUserMasterPermissionSaveOrUpdate } = require("./user-master-permissions.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/user-master-permission/create", ensureAuthentications, validateUserMasterPermissionSaveOrUpdate(), handleResponse.bind(this, userMasterPermission.createUserMasterPermission));
router.put("/user-master-permission/update/:id", ensureAuthentications, validateUserMasterPermissionSaveOrUpdate(), handleResponse.bind(this, userMasterPermission.updateUserMasterPermission));
router.delete("/user-master-permission/delete/:id", ensureAuthentications, handleResponse.bind(this, userMasterPermission.deleteUserMasterPermission));
router.get("/user-master-permission-by-userId/details/:id", ensureAuthentications, handleResponse.bind(this, userMasterPermission.getUserMasterPermissionByUserId));

module.exports = router;
