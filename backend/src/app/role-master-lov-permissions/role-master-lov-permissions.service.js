/* eslint-disable max-len */
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const RoleMasterLovPermissions = require("../../database/operation/role-master-lov-permissions");

const rolesMasterLovPermissionAlreadyExists = async (where) => {
    try {
        const roleMasterlovPermissions = new RoleMasterLovPermissions();
        const data = await roleMasterlovPermissions.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_LOV_PERMISSION_FAILURE, error);
    }
};

const getRolesMasterLovPermissionByCondition = async (where) => {
    try {
        const roleMasterlovPermissions = new RoleMasterLovPermissions();
        const data = await roleMasterlovPermissions.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_LOV_PERMISSION_FAILURE, error);
    }
};

const createRolesMasterLovPermission = async (roleMasterLovPermissionDetails) => {
    try {
        const roleMasterlovPermissions = new RoleMasterLovPermissions();
        const data = await roleMasterlovPermissions.create(roleMasterLovPermissionDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_ROLE_MASTER_LOV_PERMISSION_FAILURE, error);
    }
};

const getAllRoleMasterLovPermissionByDropdown = async (roleId) => {
    try {
        const roleMasterlovPermissions = new RoleMasterLovPermissions();
        const data = await roleMasterlovPermissions.findAndCountAll({ roleId }, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_LOV_PERMISSION_FAILURE, error);
    }
};

const updateRolesMasterLovPermission = async (roleMasterLovPermissionDetails, where) => {
    try {
        const roleMasterlovPermissions = new RoleMasterLovPermissions();
        const data = await roleMasterlovPermissions.update(roleMasterLovPermissionDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ROLE_MASTER_LOV_PERMISSION_UPDATE_FAILURE, error);
    }
};

const getAllRoleMasterLovPermission = async (where = {}) => {
    try {
        const roleMasterlovPermissions = new RoleMasterLovPermissions();
        const data = await roleMasterlovPermissions.findAndCountAll(where, undefined, true, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_LOV_PERMISSION_FAILURE, error);
    }
};

const deleteRolesMasterLovPermission = async (where) => {
    try {
        const roleMasterlovPermissions = new RoleMasterLovPermissions();
        const data = await roleMasterlovPermissions.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ROLE_MASTER_LOV_PERMISSION_FAILURE, error);
    }
};

const getLovArrayOfMasterOfRole = async (where) => {
    try {
        const roleMasterlovPermissions = new RoleMasterLovPermissions();
        const data = await roleMasterlovPermissions.findAll(where, ["masterId", "lovArray"], false, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_MASTER_LOV_PERMISSION_FAILURE, error);
    }
};

module.exports = {
    rolesMasterLovPermissionAlreadyExists,
    getRolesMasterLovPermissionByCondition,
    createRolesMasterLovPermission,
    updateRolesMasterLovPermission,
    getAllRoleMasterLovPermission,
    deleteRolesMasterLovPermission,
    getAllRoleMasterLovPermissionByDropdown,
    getLovArrayOfMasterOfRole
};
