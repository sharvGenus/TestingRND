const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const userMasterColumnPermissionService = require("./user-master-column-permission.service");

/**
 * Method to create user master column permission
 * @param { object } req.body
 * @returns { object } data
 */
const createUserMasterColumnPermission = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_MASTER_COLUMN_PERMISSION_DETAILS);
    const data = await userMasterColumnPermissionService.createUserMasterColumnPermission(req.body);
    return { data };
};

/**
 * Method to update user master column permission
 * @param { object } req.body
 * @returns { object } data
 */
const updateUserMasterColumnPermission = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_MASTER_COLUMN_PERMISSION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_MASTER_COLUMN_PERMISSION_DETAILS);
    const isUserColumnPerExists = await userMasterColumnPermissionService.isUserMasterColumnPermExists({ id });
    throwIfNot(isUserColumnPerExists, statusCodes.DUPLICATE, statusMessages.USER_MASTER_COLUMN_PERMISSION_NOT_EXIST);
    const data = await userMasterColumnPermissionService.updateUserMasterColumnPermission(req.body, { id });
    return { data };
};

/**
 * Method to get user master column permission details by userId
 * @param { object } req.body
 * @returns { object } data
 */
const getUserMasterColumnPermissionByUserId = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_ID_REQUIRED);
    const data = await userMasterColumnPermissionService.getUserMasterColumnPermissionByUserId({ userId: id });
    return { data };
};

/**
 * Method to get user master column permission details
 * @param { object } req.body
 * @returns { object } data
 */
const getUserMasterColumnPermission = async (req) => {
    const data = await userMasterColumnPermissionService.getUserMasterColumnPermission();
    return { data };
};

/**
 * Method to delete user master column permission by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteUserMasterColumnPermission = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_MASTER_COLUMN_PERMISSION_ID_REQUIRED);
    const data = await userMasterColumnPermissionService.deleteUserMasterColumnPermission({ id });
    return { data };
};

module.exports = {
    createUserMasterColumnPermission,
    updateUserMasterColumnPermission,
    deleteUserMasterColumnPermission,
    getUserMasterColumnPermissionByUserId,
    getUserMasterColumnPermission
};
