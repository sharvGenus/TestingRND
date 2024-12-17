const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const RoleMasterPermissions = require("../../database/operation/role-master-permissions");

const deleteExistingRoleMasterPermissions = async (where) => {
    try {
        const roleMasterPermission = new RoleMasterPermissions();
        const data = await roleMasterPermission.forceDelete(where);
        return data;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_ROLE_MASTER_PERMISSION_DELETE,
            error
        );
    }
};

const createRoleMenuPermissions = async (payload) => {
    try {
        const roleMasterPermission = new RoleMasterPermissions();
        const data = await roleMasterPermission.bulkCreate(payload);
        return data;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_ROLE_MASTER_PERMISSION_CREATE,
            error
        );
    }
};

const getAllMasterPermissinsByRoleId = async (roleId) => {
    try {
        const roleMasterPermission = new RoleMasterPermissions();
        roleMasterPermission.queryObject = {};
        const data = await roleMasterPermission.findAll({ roleId }, ["masterId", "masterRoute"], false, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_WORK_AREA_ASSIGNMENT_FETCH, error);
    }
};

module.exports = {
    deleteExistingRoleMasterPermissions,
    createRoleMenuPermissions,
    getAllMasterPermissinsByRoleId
};
