const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AllMasterColumnsList = require("../../database/operation/all-master-columns-list");

const allMasterColumnsListAlreadyExists = async (where) => {
    try {
        const firms = new AllMasterColumnsList();
        const data = await firms.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_ALL_MASTER_COLUMNS_LIST_DETAILS, error);
    }
};

const createAllMasterColumnsList = async (allMastersDetails) => {
    try {
        const allMasterColumnsList = new AllMasterColumnsList();
        const data = await allMasterColumnsList.create(allMastersDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_ALL_MASTER_COLUMNS_LIST_FAILURE, error);
    }
};
const getAllMasterColumnsList = async () => {
    try {
        const allMasterColumnsList = new AllMasterColumnsList();
        const data = await allMasterColumnsList.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ALL_MASTER_COLUMNS_LIST_FAILURE, error);
    }
};
const getAllMasterColumnsListByMasterId = async (where, attributes = undefined) => {
    try {
        const allMasterColumnsList = new AllMasterColumnsList();
        const data = await allMasterColumnsList.findAndCountAll(where, attributes, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ALL_MASTER_COLUMNS_LIST_FAILURE, error);
    }
};
const getAllMasterColumnsListByCondition = async (where) => {
    try {
        const allMasterColumnsList = new AllMasterColumnsList();
        const data = await allMasterColumnsList.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ALL_MASTER_COLUMNS_LIST_FAILURE, error);
    }
};
const updateAllMasterColumnsList = async (allMastersDetails, where) => {
    try {
        const allMasterColumnsList = new AllMasterColumnsList();
        const data = await allMasterColumnsList.update(allMastersDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ALL_MASTER_COLUMNS_LIST_UPDATE_FAILURE, error);
    }
};
const deleteAllMasterColumnsList = async (where) => {
    try {
        const allMasterColumnsList = new AllMasterColumnsList();
        const data = await allMasterColumnsList.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ALL_MASTER_COLUMNS_LIST_FAILURE, error);
    }
};
module.exports = {
    allMasterColumnsListAlreadyExists,
    createAllMasterColumnsList,
    getAllMasterColumnsList,
    getAllMasterColumnsListByCondition,
    updateAllMasterColumnsList,
    deleteAllMasterColumnsList,
    getAllMasterColumnsListByMasterId
};
