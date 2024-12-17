const router = require("express").Router();
const roleMasterColumnPermission = require("./role-master-column-permissions.controller");
const { validateRoleMasterColumnPermissionSaveOrUpdate } = require("./role-master-column-permissions.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/role-master-column-permission/create", ensureAuthentications, validateRoleMasterColumnPermissionSaveOrUpdate(), handleResponse.bind(this, roleMasterColumnPermission.CreateRolesMasterColumnPermission));
router.put("/role-master-column-permission/update/:id", ensureAuthentications, validateRoleMasterColumnPermissionSaveOrUpdate(), handleResponse.bind(this, roleMasterColumnPermission.updateRolesMasterColumnPermission));
router.get("/role-master-column-permission/details/:id", ensureAuthentications, handleResponse.bind(this, roleMasterColumnPermission.getRolesMasterColumnPermissionDetails));
router.get("/role-master-column-permission/list", ensureAuthentications, handleResponse.bind(this, roleMasterColumnPermission.getAllRoleMasterColumnPermission));
router.delete("/role-master-column-permission/delete/:id", ensureAuthentications, handleResponse.bind(this, roleMasterColumnPermission.deleteRolesMasterColumnPermission));
router.get("/role-master-column-permission/dropdown/:id", ensureAuthentications, handleResponse.bind(this, roleMasterColumnPermission.getAllRoleMasterColumnByDropdown));

module.exports = router;