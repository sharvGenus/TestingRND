const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Roles = require("../../database/operation/roles");
const RolesHistory = require("../../database/operation/roles-history");

const RoleAlreadyExists = async (where) => {
    try {
        const roles = new Roles();
        const data = await roles.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_ROLE_DETAILS, error);
    }
};

const createRole = async (roleDetails) => {
    try {
        const roles = new Roles();
        const data = await roles.create(roleDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ROLE_ALREADY_EXIST, error);
    }
};
const updateRole = async (roleDetails, where) => {
    try {
        const roles = new Roles();
        const data = await roles.update(roleDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ROLE_UPDATE_FAILURE, error);
    }
};
const getRoleByCondition = async (where) => {
    try {
        const roles = new Roles();
        const data = await roles.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ROLE_FAILURE, error);
    }
};
const getAllRoles = async (where = {}) => {
    try {
        const roles = new Roles();
        const data = await roles.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_LIST_FAILURE, error);
    }
};

const getRoleHistory = async (where) => {
    try {
        const historyModelInstance = new RolesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ROLE_ID_REQUIRED, error);
    }
};
const deleteRole = async (where) => {
    try {
        const roles = new Roles();
        const data = await roles.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ROLE_FAILURE, error);
    }
};
const getAllRoleByDropdown = async (where) => {
    try {
        const roles = new Roles();
        const data = await roles.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_LIST_FAILURE, error);
    }
};

const getRoleIds = async (where = {}) => {
    try {
        const roles = new Roles();
        const data = await roles.findAll(where, ["id"], false, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ROLE_LIST_FAILURE, error);
    }
};

module.exports = {
    RoleAlreadyExists,
    createRole,
    updateRole,
    getRoleHistory,
    getRoleByCondition,
    getAllRoles,
    deleteRole,
    getAllRoleByDropdown,
    getRoleIds
};
