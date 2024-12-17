const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const QaMasterMakers = require("../../database/operation/qa-master-makers");
const QaMasterMakersHistory = require("../../database/operation/qa-master-makers-history");

const qaMasterMakerAlreadyExists = async (where) => {
    try {
        const qaMasterMakers = new QaMasterMakers();
        const data = await qaMasterMakers.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_QA_MASTER_MAKER_FAILURE, error);
    }
};

const createQaMasterMaker = async (body) => {
    try {
        const qaMasterMakers = new QaMasterMakers();
        const data = await qaMasterMakers.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_QA_MASTER_MAKER_FAILURE, error);
    }
};

const getQaMasterMakerByCondition = async (where) => {
    try {
        const qaMasterMakers = new QaMasterMakers();
        const data = await qaMasterMakers.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_QA_MASTER_MAKER_FAILURE, error);
    }
};

const getQaMasterMakerList = async (where) => {
    try {
        const qaMasterMakers = new QaMasterMakers();
        const data = await qaMasterMakers.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_QA_MASTER_MAKER_FAILURE, error);
    }
};

const updateQaMasterMaker = async (body, where) => {
    try {
        const qaMasterMakers = new QaMasterMakers();
        const data = await qaMasterMakers.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.UPDATE_QA_MASTER_MAKER_FAILURE, error);
    }
};

const deleteQaMasterMaker = async (where) => {
    try {
        const qaMasterMakers = new QaMasterMakers();
        const data = await qaMasterMakers.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_QA_MASTER_MAKER_FAILURE, error);
    }
};

const getQaMasterMakerHistory = async (where) => {
    try {
        const qaMasterMakersHistory = new QaMasterMakersHistory();
        const data = await qaMasterMakersHistory.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_QA_MASTER_MAKER_HISTORY_FAILURE, error);
    }
};

module.exports = {
    qaMasterMakerAlreadyExists,
    createQaMasterMaker,
    getQaMasterMakerByCondition,
    getQaMasterMakerList,
    updateQaMasterMaker,
    deleteQaMasterMaker,
    getQaMasterMakerHistory
};
