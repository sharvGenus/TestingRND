/* eslint-disable max-len */
const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const rolesMasterColumnPermissionService = require("./role-master-lov-permissions.service");

/**
 * Method to create roles master lov permission
 * @param { object } req.body
 * @returns { object } data
 */
const CreateRolesMasterLovPermission = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ROLE_MASTER_LOV_PERMISSION_DETAILS);
    const data = await rolesMasterColumnPermissionService.createRolesMasterLovPermission(req.body);
    return { data };
};

/**
 * Method to update roles master lov permission
 * @param { object } req.body
 * @returns { object } data
 */
const updateRolesMasterLovPermission = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ROLE_MASTER_LOV_PERMISSION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ROLE_MASTER_LOV_PERMISSION_DETAILS);
    const isRolesMasterLovPermissionExists = await rolesMasterColumnPermissionService.rolesMasterLovPermissionAlreadyExists({ id: req.params.id });
    throwIfNot(isRolesMasterLovPermissionExists, statusCodes.DUPLICATE, statusMessages.ROLE_MASTER_LOV_PERMISSION_NOT_EXIST);
    const data = await rolesMasterColumnPermissionService.updateRolesMasterLovPermission(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get roles master lov permission details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getRolesMasterLovPermissionDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ROLE_MASTER_LOV_PERMISSION_ID_REQUIRED);
    const data = await rolesMasterColumnPermissionService.getRolesMasterLovPermissionByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all roles master lov permission
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRoleMasterLovPermission = async (req) => {
    const data = await rolesMasterColumnPermissionService.getAllRoleMasterLovPermission();
    return { data };
};

/**
 * Method to get roles master lov permission list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRoleMasterLovPermissionByDropdown = async (req) => {
    const data = await rolesMasterColumnPermissionService.getAllRoleMasterLovPermissionByDropdown(req.params.id);
    return { data };
};

/**
 * Method to delete roles master lov permission by roles master lov permission id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteRolesMasterLovPermission = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ROLE_MASTER_LOV_PERMISSION_ID_REQUIRED);
    const data = await rolesMasterColumnPermissionService.deleteRolesMasterLovPermission({ id: req.params.id });
    return { data };
};

module.exports = {
    CreateRolesMasterLovPermission,
    updateRolesMasterLovPermission,
    getRolesMasterLovPermissionDetails,
    getAllRoleMasterLovPermission,
    deleteRolesMasterLovPermission,
    getAllRoleMasterLovPermissionByDropdown
};
