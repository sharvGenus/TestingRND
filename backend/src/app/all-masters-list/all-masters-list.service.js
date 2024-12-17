const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AllMastersList = require("../../database/operation/all-masters-list");

const allMastersListAlreadyExists = async (where) => {
    try {
        const firms = new AllMastersList();
        const data = await firms.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_ALL_MASTERS_LIST_DETAILS, error);
    }
};

const createAllMastersList = async (allMastersDetails) => {
    try {
        const allMastersList = new AllMastersList();
        const data = await allMastersList.create(allMastersDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_ALL_MASTERS_LIST_FAILURE, error);
    }
};
const getAllMastersList = async (where = {}, attributes = undefined, isRelation = true) => {
    try {
        const allMastersList = new AllMastersList();
        const data = await allMastersList.findAndCountAll(where, attributes, isRelation, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ALL_MASTERS_LIST_FAILURE, error);
    }
};

const getAllMastersListByCondition = async (where) => {
    try {
        const allMastersList = new AllMastersList();
        const data = await allMastersList.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ALL_MASTERS_LIST_FAILURE, error);
    }
};

const updateAllMastersList = async (allMastersDetails, where) => {
    try {
        const allMastersList = new AllMastersList();
        const data = await allMastersList.update(allMastersDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ALL_MASTERS_LIST_UPDATE_FAILURE, error);
    }
};
const deleteAllMastersList = async (where) => {
    try {
        const allMastersList = new AllMastersList();
        const data = await allMastersList.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ALL_MASTERS_LIST_FAILURE, error);
    }
};

const getUserDefinedMastersList = async (where, attributes) => {
    try {
        const allMastersList = new AllMastersList();
        const data = await allMastersList.findAll(where, attributes, false, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ALL_MASTERS_LIST_FAILURE, error);
    }
};

const getMasterTableName = async (where) => {
    try {
        const allMastersList = new AllMastersList();
        const data = await allMastersList.findOne(where, ["name", "visibleName"], true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ALL_MASTERS_LIST_FAILURE, error);
    }
};

module.exports = {
    allMastersListAlreadyExists,
    createAllMastersList,
    getAllMastersList,
    getAllMastersListByCondition,
    updateAllMastersList,
    deleteAllMastersList,
    getUserDefinedMastersList,
    getMasterTableName
};
