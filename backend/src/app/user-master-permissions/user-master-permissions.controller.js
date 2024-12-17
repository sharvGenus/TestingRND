const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const userMasterPermissionService = require("./user-master-permissions.service");

/**
 * Method to create user master permission
 * @param { object } req.body
 * @returns { object } data
 */
const createUserMasterPermission = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_MASTER_PERMISSION_DETAILS);
    const data = await userMasterPermissionService.createUserMasterPermission(req.body);
    return { data };
};

/**
 * Method to update user master permission
 * @param { object } req.body
 * @returns { object } data
 */
const updateUserMasterPermission = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_MASTER_PERMISSION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_MASTER_PERMISSION_DETAILS);
    const isUserPerExists = await userMasterPermissionService.isUserMasterPermExists({ id });
    throwIfNot(isUserPerExists, statusCodes.DUPLICATE, statusMessages.USER_MASTER_PERMISSION_NOT_EXIST);
    const data = await userMasterPermissionService.updateUserMasterPermission(req.body, { id });
    return { data };
};

/**
 * Method to get user master permission details by userId
 * @param { object } req.body
 * @returns { object } data
 */
const getUserMasterPermissionByUserId = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_ID_REQUIRED);
    const data = await userMasterPermissionService.getUserMasterPermissionByUserId({ userId: id });
    return { data };
};

/**
 * Method to delete user master permission by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteUserMasterPermission = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_MASTER_PERMISSION_ID_REQUIRED);
    const data = await userMasterPermissionService.deleteUserMasterPermission({ id });
    return { data };
};

module.exports = {
    createUserMasterPermission,
    updateUserMasterPermission,
    deleteUserMasterPermission,
    getUserMasterPermissionByUserId
};
