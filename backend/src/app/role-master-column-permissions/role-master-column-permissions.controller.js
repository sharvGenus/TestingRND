/* eslint-disable max-len */
const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const rolesMasterColumnPermissionService = require("./role-master-column-permissions.service");

/**
 * Method to create roles master column permission
 * @param { object } req.body
 * @returns { object } data
 */
const CreateRolesMasterColumnPermission = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ROLE_MASTER_COLUMN_PERMISSION_DETAILS);
    const data = await rolesMasterColumnPermissionService.CreateRolesMasterColumnPermission(req.body);
    return { data };
};

/**
 * Method to update roles master column permission
 * @param { object } req.body
 * @returns { object } data
 */
const updateRolesMasterColumnPermission = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ROLE_MASTER_COLUMN_PERMISSION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ROLE_MASTER_COLUMN_PERMISSION_DETAILS);
    const isRolesMasterColumnPermissionExists = await rolesMasterColumnPermissionService.rolesMasterColumnPermissionAlreadyExists({ id: req.params.id });
    throwIfNot(isRolesMasterColumnPermissionExists, statusCodes.DUPLICATE, statusMessages.ROLE_MASTER_COLUMN_PERMISSION_NOT_EXIST);
    const data = await rolesMasterColumnPermissionService.updateRolesMasterColumnPermission(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get roles master column permission details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getRolesMasterColumnPermissionDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ROLE_MASTER_COLUMN_PERMISSION_ID_REQUIRED);
    const data = await rolesMasterColumnPermissionService.getRolesMasterColumnPermissionByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all roles master column permission
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRoleMasterColumnPermission = async (req) => {
    const data = await rolesMasterColumnPermissionService.getAllRoleMasterColumnPermission();
    return { data };
};

/**
 * Method to get roles master column permission list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRoleMasterColumnByDropdown = async (req) => {
    const data = await rolesMasterColumnPermissionService.getAllRoleMasterColumnByDropdown(req.params.id);
    return { data };
};

/**
 * Method to delete roles master column permission by roles master column permission id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteRolesMasterColumnPermission = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ROLE_MASTER_COLUMN_PERMISSION_ID_REQUIRED);
    const data = await rolesMasterColumnPermissionService.deleteRolesMasterColumnPermission({ id: req.params.id });
    return { data };
};

module.exports = {
    CreateRolesMasterColumnPermission,
    updateRolesMasterColumnPermission,
    getRolesMasterColumnPermissionDetails,
    getAllRoleMasterColumnPermission,
    deleteRolesMasterColumnPermission,
    getAllRoleMasterColumnByDropdown
};
