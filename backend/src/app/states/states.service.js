const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const States = require("../../database/operation/states");
const StatesHistory = require("../../database/operation/states-history");

const StateAlreadyExists = async (where) => {
    try {
        const states = new States();
        const data = await states.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_STATE_DETAILS, error);
    }
};

const createState = async (stateDetails) => {
    try {
        const states = new States();
        const data = await states.create(stateDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.STATE_ALREADY_EXIST, error);
    }
};
const updateState = async (stateDetails, where) => {
    try {
        const states = new States();
        const data = await states.update(stateDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.STATE_UPDATE_FAILURE, error);
    }
};
const getStateByCondition = async (where) => {
    try {
        const states = new States();
        const data = await states.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.STATE_FAILURE, error);
    }
};
const getStateHistory = async (where) => {
    try {
        const historyModelInstance = new StatesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.STATE_ID_REQUIRED, error);
    }
};
const getAllStatesByDropdown = async (where) => {
    try {
        const states = new States();
        const data = await states.findAll(where, ["id", "name"], false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STATE_LIST_FAILURE, error);
    }
};

const getAllStates = async (where = {}) => {
    try {
        const states = new States();
        const data = await states.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STATE_LIST_FAILURE, error);
    }
};
const deleteState = async (where) => {
    try {
        const states = new States();
        const data = await states.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_STATE_FAILURE, error);
    }
};
module.exports = {
    StateAlreadyExists,
    createState,
    getStateHistory,
    updateState,
    getStateByCondition,
    getAllStates,
    deleteState,
    getAllStatesByDropdown
};
