const router = require("express").Router();
const roleMasterLovPermission = require("./role-master-lov-permissions.controller");
const { validateRoleMasterLovPermissionSaveOrUpdate } = require("./role-master-lov-permissions.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/role-master-lov-permission/create", ensureAuthentications, validateRoleMasterLovPermissionSaveOrUpdate(), handleResponse.bind(this, roleMasterLovPermission.CreateRolesMasterLovPermission));
router.put("/role-master-lov-permission/update/:id", ensureAuthentications, validateRoleMasterLovPermissionSaveOrUpdate(), handleResponse.bind(this, roleMasterLovPermission.updateRolesMasterLovPermission));
router.get("/role-master-lov-permission/details/:id", ensureAuthentications, handleResponse.bind(this, roleMasterLovPermission.getRolesMasterLovPermissionDetails));
router.get("/role-master-lov-permission/list", ensureAuthentications, handleResponse.bind(this, roleMasterLovPermission.getAllRoleMasterLovPermission));
router.delete("/role-master-lov-permission/delete/:id", ensureAuthentications, handleResponse.bind(this, roleMasterLovPermission.deleteRolesMasterLovPermission));
router.get("/role-master-lov-permission/dropdown/:id", ensureAuthentications, handleResponse.bind(this, roleMasterLovPermission.getAllRoleMasterLovPermissionByDropdown));

module.exports = router;