const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const UserMasterColumnPermission = require("../../database/operation/user-master-column-permissions");

const isUserMasterColumnPermExists = async (where) => {
    try {
        const userMasterColumnPermission = new UserMasterColumnPermission();
        const data = await userMasterColumnPermission.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_USER_MASTER_COLUMN_PERMISSION_DETAILS, error);
    }
};

const createUserMasterColumnPermission = async (userDetails) => {
    try {
        const userMasterColumnPermission = new UserMasterColumnPermission();
        const data = await userMasterColumnPermission.create(userDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_COLUMN_PERMISSION_CREATE, error);
    }
};

const updateUserMasterColumnPermission = async (userDetails, where) => {
    try {
        const userMasterColumnPermission = new UserMasterColumnPermission();
        const data = await userMasterColumnPermission.update(userDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_COLUMN_PERMISSION_UPDATE, error);
    }
};

const getUserMasterColumnPermissionByUserId = async (where) => {
    try {
        const userMasterColumnPermission = new UserMasterColumnPermission();
        const data = await userMasterColumnPermission.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_COLUMN_PERMISSION_FETCH, error);
    }
};

const getUserMasterColumnPermission = async () => {
    try {
        const userMasterColumnPermission = new UserMasterColumnPermission();
        const data = await userMasterColumnPermission.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_COLUMN_PERMISSION_FETCH, error);
    }
};

const deleteUserMasterColumnPermission = async (where) => {
    try {
        const userMasterColumnPermission = new UserMasterColumnPermission();
        const data = await userMasterColumnPermission.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_COLUMN_PERMISSION_FETCH, error);
    }
};

const deleteExistingUserColumnsPermissions = async (where) => {
    try {
        const userMasterColumnPermission = new UserMasterColumnPermission();
        const data = await userMasterColumnPermission.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_COLUMN_PERMISSION_DELETE, error);
    }
};

module.exports = {
    createUserMasterColumnPermission,
    isUserMasterColumnPermExists,
    updateUserMasterColumnPermission,
    getUserMasterColumnPermissionByUserId,
    deleteUserMasterColumnPermission,
    getUserMasterColumnPermission,
    deleteExistingUserColumnsPermissions
};