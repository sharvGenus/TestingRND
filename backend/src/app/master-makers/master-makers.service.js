const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const MasterMakers = require("../../database/operation/master-makers");
const MasterMakersHistory = require("../../database/operation/master-makers-history");

const masterMakerAlreadyExists = async (where) => {
    try {
        const masterMakers = new MasterMakers();
        const data = await masterMakers.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MASTER_MAKER_FAILURE, error);
    }
};

const getMasterMakerByCondition = async (where) => {
    try {
        const masterMakers = new MasterMakers();
        const data = await masterMakers.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MASTER_MAKER_FAILURE, error);
    }
};

const createMasterMaker = async (masterMakerDetails) => {
    try {
        const masterMakers = new MasterMakers();
        const data = await masterMakers.create(masterMakerDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_MASTER_MAKER_FAILURE, error);
    }
};

const updateMasterMaker = async (masterMakerDetails, where) => {
    try {
        const masterMakers = new MasterMakers();
        const data = await masterMakers.update(masterMakerDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MASTER_MAKER_UPDATE_FAILURE, error);
    }
};

const getAllMasterMaker = async (where = {}) => {
    try {
        const masterMakers = new MasterMakers();
        const data = await masterMakers.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MASTER_MAKER_LIST_FAILURE, error);
    }
};

const deleteMasterMaker = async (where) => {
    try {
        const masterMakers = new MasterMakers();
        const data = await masterMakers.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_MASTER_MAKER_FAILURE, error);
    }
};

const getMasterMakerHistory = async (where) => {
    try {
        const historyModelInstance = new MasterMakersHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MASTER_MAKER_ID_REQUIRED, error);
    }
};

module.exports = {
    masterMakerAlreadyExists,
    getMasterMakerByCondition,
    createMasterMaker,
    updateMasterMaker,
    getAllMasterMaker,
    getMasterMakerHistory,
    deleteMasterMaker
};
