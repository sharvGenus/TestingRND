const router = require("express").Router();
const roles = require("./roles.controller");
const { validateRoleSaveOrUpdate } = require("./roles.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/role/create", ensureAuthentications, validateRoleSaveOrUpdate(), handleResponse.bind(this, roles.createRole));
router.get("/role/list", ensureAuthentications, handleResponse.bind(this, roles.getAllRoles));
router.get("/roles/history/:recordId", ensureAuthentications, handleResponse.bind(this, roles.getRolesHistory));
router.get("/role/details/:id", ensureAuthentications, handleResponse.bind(this, roles.getRoleDetails));
router.put("/role/update/:id", ensureAuthentications, validateRoleSaveOrUpdate(), handleResponse.bind(this, roles.updateRole));
router.delete("/role/delete/:id", ensureAuthentications, handleResponse.bind(this, roles.deleteRole));
router.get("/role/dropdown/:id", ensureAuthentications, handleResponse.bind(this, roles.getAllRoleByDropdown));

module.exports = router;
