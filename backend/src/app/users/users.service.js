const { throwError, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Users = require("../../database/operation/users");
const UsersHistory = require("../../database/operation/users-history");

const userAlreadyExists = async (where) => {
    try {
        const users = new Users();
        const data = await users.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const getUserByCondition = async (where, respectedBlacklist = true, updateRelations = false, noRelation = true) => {
    try {
        const users = new Users();
        if (updateRelations) users.updateRelationsForSupervisor();
        const data = await users.findOne(where, undefined, noRelation, undefined, undefined, respectedBlacklist);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const getUsersByOrganizationAndRole = async (where, respectedBlacklist = true) => {
    try {
        const users = new Users();
        const data = await users
            .findAndCountAll(where, undefined, true, undefined, undefined, undefined, respectedBlacklist);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const updateLastLogin = async (where, source) => {
    try {
        const users = new Users();
        const data = await users.update({ lastLogin: new Date(), source }, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const createUser = async (userDetails) => {
    try {
        const users = new Users();
        // eslint-disable-next-line no-param-reassign
        userDetails = Object.fromEntries(
            Object.entries(userDetails).filter((value) => users.fieldsList.includes(value[0]))
        );
        const data = await users.create({ ...userDetails, ...userDetails.email && { email: userDetails.email.toLowerCase() } });
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_USER_FAILURE, error);
    }
};

const updateUser = async (userDetails, where) => {
    try {
        const users = new Users();
        const data = await users.update({ ...userDetails, ...userDetails.email && { email: userDetails.email.toLowerCase() } }, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.USER_UPDATE_FAILURE, error);
    }
};

const getUserHistory = async (where) => {
    try {
        const historyModelInstance = new UsersHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.USER_ID_REQUIRED);
    }
};

const getAllUsers = async (where = {}, raw = false, attributes = undefined, isRelation = true, overRideQuery = false) => {
    try {
        const users = new Users();
        if (overRideQuery) users.whereClauseOverRide = {};
        const data = await users.findAndCountAll(where, attributes, isRelation, true, undefined, raw);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const getAllSuperUsersId = async (where = {}, attributes = undefined, isRelation = true) => {
    try {
        const users = new Users();
        const data = await users.findAndCountAllDistinctRows(where, attributes, isRelation, "supervisorId");
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const deleteUser = async (where) => {
    try {
        const users = new Users();
        const data = await users.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_USER_FAILURE, error);
    }
};

const deleteUserWithStatusUpdate = async (body, where) => {
    try {
        const users = new Users();

        const data = await users.deleteWithStatusUpdate(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_USER_FAILURE, error);
    }
};

const checkUserExist = async (where, type) => {
    try {
        const users = new Users();
        const data = await users.findOne(where, undefined, true);
        if (data) {
            return {
                id: data.id,
                usernameType: type,
                is2fa: data.is2faEnable,
                isFirstWebLogin: data.password,
                isFirstMobileLogin: data.mPin,
                isDataAvailable: Boolean(data)
            };
        } else {
            return { isDataAvailable: Boolean(data) };
        }

    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const getUserById = async (userId) => {
    try {
        const users = new Users();
        const data = await users.findOne({ id: userId });
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const getUserByRoleId = async (roleId) => {
    try {
        const users = new Users();
        const data = await users.findAll({ roleId }, ["id"], false, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const toggleLock = async (userId) => {
    try {
        const users = new Users();
        const existingUser = await users.findOne({ id: userId }, ["isLocked"]);
        // console.log(existingUser);
        throwIfNot(existingUser, statusCodes.BAD_REQUEST, statusMessages.USER_NOT_FOUND);
        await users.update({ isLocked: !existingUser.isLocked, status: existingUser.isLocked ? "cf9510a5-42a4-4931-8a40-a4876c8a49e5" : "2cce2d81-018c-4024-a54f-438600cd5513" }, { id: userId });
        return { data: { message: `Successfully ${existingUser.isLocked ? "Unlocked" : "Locked"} user` } };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_ERROR, error);
    }
};

// get all counts
const countUsers = async (where = {}) => {
    try {
        const users = new Users();
        const count = await users.count(where);
        
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.INTERNAL_ERROR, error);
    }
};

module.exports = {
    deleteUserWithStatusUpdate,
    userAlreadyExists,
    createUser,
    getUserHistory,
    getUserByCondition,
    updateUser,
    getAllUsers,
    deleteUser,
    checkUserExist,
    updateLastLogin,
    getUsersByOrganizationAndRole,
    getAllSuperUsersId,
    getUserById,
    getUserByRoleId,
    toggleLock,
    countUsers
};
