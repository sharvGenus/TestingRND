/* eslint-disable max-len */
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const RoleMasterColumnPermission = require("../../database/operation/role-master-column-permission");

const rolesMasterColumnPermissionAlreadyExists = async (where) => {
    try {
        const roleMasterColumnPermission = new RoleMasterColumnPermission();
        const data = await roleMasterColumnPermission.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_COLUMN_PERMISSION_FAILURE, error);
    }
};

const getRolesMasterColumnPermissionByCondition = async (where) => {
    try {
        const roleMasterColumnPermission = new RoleMasterColumnPermission();
        const data = await roleMasterColumnPermission.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_COLUMN_PERMISSION_FAILURE, error);
    }
};

const CreateRolesMasterColumnPermission = async (roleMasterColumnPermissionDetails) => {
    try {
        const roleMasterColumnPermission = new RoleMasterColumnPermission();
        const data = await roleMasterColumnPermission.create(roleMasterColumnPermissionDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_ROLE_MASTER_COLUMN_PERMISSION_FAILURE, error);
    }
};

const getAllRoleMasterColumnByDropdown = async (roleId) => {
    try {
        const roleMasterColumnPermission = new RoleMasterColumnPermission();
        const data = await roleMasterColumnPermission.findAndCountAll({ roleId }, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_COLUMN_PERMISSION_FAILURE, error);
    }
};

const updateRolesMasterColumnPermission = async (roleMasterColumnPermissionDetails, where) => {
    try {
        const roleMasterColumnPermission = new RoleMasterColumnPermission();
        const data = await roleMasterColumnPermission.update(roleMasterColumnPermissionDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ROLE_MASTER_COLUMN_PERMISSION_UPDATE_FAILURE, error);
    }
};

const getAllRoleMasterColumnPermission = async () => {
    try {
        const roleMasterColumnPermission = new RoleMasterColumnPermission();
        const data = await roleMasterColumnPermission.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_COLUMN_PERMISSION_FAILURE, error);
    }
};

const deleteRolesMasterColumnPermission = async (where) => {
    try {
        const roleMasterColumnPermission = new RoleMasterColumnPermission();
        const data = await roleMasterColumnPermission.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ROLE_MASTER_COLUMN_PERMISSION_FAILURE, error);
    }
};

module.exports = {
    rolesMasterColumnPermissionAlreadyExists,
    getRolesMasterColumnPermissionByCondition,
    CreateRolesMasterColumnPermission,
    updateRolesMasterColumnPermission,
    getAllRoleMasterColumnPermission,
    deleteRolesMasterColumnPermission,
    getAllRoleMasterColumnByDropdown
};
