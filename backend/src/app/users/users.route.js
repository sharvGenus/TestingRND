const router = require("express").Router();
const users = require("./users.controller");
const { validateUserSaveOrUpdate } = require("./users.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/user/create", ensureAuthentications, validateUserSaveOrUpdate(), handleResponse.bind(this, users.createUser));
router.put("/user/update/:id", ensureAuthentications, validateUserSaveOrUpdate(), handleResponse.bind(this, users.updateUser));
router.get("/user/details/:id", ensureAuthentications, handleResponse.bind(this, users.getUserDetails));
router.get("/user/history/:recordId", ensureAuthentications, handleResponse.bind(this, users.getUsersHistory));
router.get("/user/list", ensureAuthentications, handleResponse.bind(this, users.getAllUsers));
router.get("/supervisor/list", ensureAuthentications, handleResponse.bind(this, users.getAllSupervisors));
router.delete("/user/delete/:id/:status", ensureAuthentications, handleResponse.bind(this, users.deleteUser));
router.post("/user/user-exits/", handleResponse.bind(this, users.checkUserExist));
router.post("/export-users", ensureAuthentications, users.exportUsers);
router.get("/user/by-store-permission", ensureAuthentications, handleResponse.bind(this, users.getUsersByStorePermissions));
router.put("/user/update-roles", ensureAuthentications, handleResponse.bind(this, users.updateUsersRoles));

router.put("/user/toggle-lock/:id", ensureAuthentications, handleResponse.bind(this, users.toggleLock));

module.exports = router;
