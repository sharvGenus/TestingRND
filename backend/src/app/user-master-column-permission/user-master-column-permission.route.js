const router = require("express").Router();
const userMasterColumnPermission = require("./user-master-column-permission.controller");
const { validateUserMasterColumnPermission } = require("./user-master-column-permission.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/user-master-column-permission/create", ensureAuthentications, validateUserMasterColumnPermission(), handleResponse.bind(this, userMasterColumnPermission.createUserMasterColumnPermission));
router.put("/user-master-column-permission/update/:id", ensureAuthentications, validateUserMasterColumnPermission(), handleResponse.bind(this, userMasterColumnPermission.updateUserMasterColumnPermission));
router.delete("/user-master-column-permission/delete/:id", ensureAuthentications, handleResponse.bind(this, userMasterColumnPermission.deleteUserMasterColumnPermission));
router.get("/user-master-column-permission-by-userId/details/:id", ensureAuthentications, handleResponse.bind(this, userMasterColumnPermission.getUserMasterColumnPermissionByUserId));
router.get("/user-master-column-permission/getDetails", ensureAuthentications, handleResponse.bind(this, userMasterColumnPermission.getUserMasterColumnPermission));

module.exports = router;
