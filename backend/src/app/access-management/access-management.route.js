const router = require("express").Router();
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");
const access = require("./access-management.controller");

// api for getting side bar governed masters
router.get("/get-masters/:userId", ensureAuthentications, handleResponse.bind(this, access.getAllMastersByUserId));

// api for governing the menus/master(side bar), rows and columns if needed
router.post("/govern-user-menus", ensureAuthentications, handleResponse.bind(this, access.governUserMenus));
router.post("/govern-user-rows", ensureAuthentications, handleResponse.bind(this, access.governUserRows));
router.post("/govern-user-columns", ensureAuthentications, handleResponse.bind(this, access.governUserColumns));

// get apis for the access management and get the user details with its form access
router.get("/get-lovs/:userId/:masterId/:organizationTypeId/:organizationType", ensureAuthentications, handleResponse.bind(this, access.getAllLov));
router.get("/user/list-with-form-access", ensureAuthentications, handleResponse.bind(this, access.getUsersWithFormAccess));
router.get("/get-project-wise-forms", ensureAuthentications, handleResponse.bind(this, access.getProjectWiseForms));

// update permissions role and users for the forms columns
router.put("/update-role-default-permissions", ensureAuthentications, handleResponse.bind(this, access.updateRoleColumnPermissions));
router.put("/update-role-column-permissions", ensureAuthentications, handleResponse.bind(this, access.updateRoleColumnWisePermissions));
router.put("/update-user-default-permissions", ensureAuthentications, handleResponse.bind(this, access.updateUserColumnPermissions));
router.put("/update-user-column-permissions", ensureAuthentications, handleResponse.bind(this, access.updateUserColumnWisePermissions));

// below api will be used for sending roles and their permissions
router.get("/get-form-with-roles", ensureAuthentications, handleResponse.bind(this, access.getFormWithRoles));

// below api will be used for sending users and their permissions when clicked on role
router.get("/get-form-with-users", ensureAuthentications, handleResponse.bind(this, access.getFormWithUsersByRole));

module.exports = router;
