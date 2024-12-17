const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const UserMasterPermission = require("../../database/operation/user-master-permissions");

const isUserMasterPermExists = async (where) => {
    try {
        const userMasterPermission = new UserMasterPermission();
        const data = await userMasterPermission.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_USER_MASTER_PERMISSION_DETAILS, error);
    }
};

const createUserMasterPermission = async (cityDetails) => {
    try {
        const userMasterPermission = new UserMasterPermission();
        const data = await userMasterPermission.create(cityDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_PERMISSION_CREATE, error);
    }
};

const updateUserMasterPermission = async (cityDetails, where) => {
    try {
        const userMasterPermission = new UserMasterPermission();
        const data = await userMasterPermission.update(cityDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_PERMISSION_UPDATE, error);
    }
};

const getUserMasterPermissionByCondition = async (where) => {
    try {
        const userMasterPermission = new UserMasterPermission();
        const data = await userMasterPermission.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_WORK_AREA_ASSIGNMENT_FETCH, error);
    }
};

const deleteUserMasterPermission = async (where) => {
    try {
        const userMasterPermission = new UserMasterPermission();
        const data = await userMasterPermission.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_PERMISSION_DELETE, error);
    }
};

const deleteExistingUserMasterPermissions = async (where) => {
    try {
        const userMasterPermission = new UserMasterPermission();
        const data = await userMasterPermission.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_PERMISSION_DELETE, error);
    }
};

const getAllUserMasterPermissionByUserId = async (where) => {
    try {
        const userMasterPermission = new UserMasterPermission();
        userMasterPermission.queryObject = {};
        const data = await userMasterPermission.findAll(where, ["masterId"], true, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_WORK_AREA_ASSIGNMENT_FETCH, error);
    }
};

const getAllUserMasterRoutesByUserId = async (where) => {
    try {
        const userMasterPermission = new UserMasterPermission();
        userMasterPermission.queryObject = {};
        const data = await userMasterPermission.findAll(where, ["masterRoute"], false, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_WORK_AREA_ASSIGNMENT_FETCH, error);
    }
};

module.exports = {
    createUserMasterPermission,
    isUserMasterPermExists,
    updateUserMasterPermission,
    getUserMasterPermissionByCondition,
    deleteUserMasterPermission,
    deleteExistingUserMasterPermissions,
    getAllUserMasterPermissionByUserId,
    getAllUserMasterRoutesByUserId
};