const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const UserMasterLovPermission = require("../../database/operation/user-master-lov-permissions");
const { getAllGaaLevelEntryByDropdown } = require("../gaa-level-entries/gaa-level-entries.service");
const { createRolesMasterLovPermission, deleteRolesMasterLovPermission } = require("../role-master-lov-permissions/role-master-lov-permissions.service");

const isUserMasterLovPermExists = async (where) => {
    try {
        const userMasterLovPermission = new UserMasterLovPermission();
        const data = await userMasterLovPermission.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_USER_MASTER_LOV_PERMISSION_DETAILS, error);
    }
};

const createUserMasterLovPermission = async (userDetails) => {
    try {
        const userMasterLovPermission = new UserMasterLovPermission();
        const data = await userMasterLovPermission.create(userDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_CREATE, error);
    }
};

const updateUserMasterLovPermission = async (cityDetails, where) => {
    try {
        const userMasterLovPermission = new UserMasterLovPermission();
        const data = await userMasterLovPermission.update(cityDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_UPDATE, error);
    }
};

const getUserMasterLovPermissionByUserId = async (where) => {
    try {
        const userMasterLovPermission = new UserMasterLovPermission();
        const data = await userMasterLovPermission.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_FETCH, error);
    }
};

const deleteUserMasterLovPermission = async (where) => {
    try {
        const userMasterLovPermission = new UserMasterLovPermission();
        const data = await userMasterLovPermission.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_FETCH, error);
    }
};

const getUserMasterLovPermission = async (where) => {
    try {
        const userMasterLovPermission = new UserMasterLovPermission();
        userMasterLovPermission.queryObject = {};
        const data = await userMasterLovPermission.findAll(where, undefined, false, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_FETCH, error);
    }
};

const deleteExistingUserLovPermissions = async (where) => {
    try {
        const userMasterLovPermission = new UserMasterLovPermission();
        const data = await userMasterLovPermission.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_FETCH, error);
    }
};

const saveUserRows = async (userData) => {
    try {
        const userMasterLovPermission = new UserMasterLovPermission();
        const { userId, lovArray, masterId } = userData;
        const spliceArray = splitArray(lovArray);
      
        const lovArrayObjects = spliceArray.map((arr) => ({
            userId,
            masterId,
            lovArray: arr
        }));
          
        const data = await userMasterLovPermission.bulkCreate(lovArrayObjects);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_CREATE, error);
    }
};
  
const splitArray = (array) => {
    const subarrays = [];
    while (array.length > 0) {
        subarrays.push(array.splice(0, 1000));
    }
    return subarrays;
};

const convertHierarchicalData = async (userData) => {
    const { masterId, userId, lovArray: rows, roleId } = userData;
    let lovArray = [];

    const dataPromises = rows.map(async (obj) => {
        const { isAll, id: parentId } = obj;
        lovArray.push(parentId);

        if (isAll === true) {
            await findChildData(parentId, lovArray);
        }

        return obj;
    });

    await Promise.all(dataPromises);
    lovArray = Array.from(new Set(lovArray));
    if (userId && userId !== null) {
        await deleteExistingUserLovPermissions({ userId, masterId });
        await saveUserRows({ userId, masterId, lovArray });
    } else if (roleId && roleId !== null) {
        await deleteRolesMasterLovPermission({ roleId, masterId });
        await createRolesMasterLovPermission({ roleId, masterId, lovArray });
    }
    
};

const findChildData = async (parentId, lovArray) => {
    const childResult = await getAllGaaLevelEntryByDropdown({ parentId }, ["id", "name"], false, true);

    if (childResult.rows.length > 0) {
        const childDataPromises = childResult.rows.map(async (childObj) => {
            lovArray.push(childObj.id);
            await findChildData(childObj.id, lovArray);
        });
        await Promise.all(childDataPromises);
    }
};

module.exports = {
    createUserMasterLovPermission,
    isUserMasterLovPermExists,
    updateUserMasterLovPermission,
    getUserMasterLovPermissionByUserId,
    deleteUserMasterLovPermission,
    getUserMasterLovPermission,
    deleteExistingUserLovPermissions,
    saveUserRows,
    convertHierarchicalData
};