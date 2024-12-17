const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const QaMasterMakerLovs = require("../../database/operation/qa-master-maker-lovs");
const QaMasterMakerLovsHistory = require("../../database/operation/qa-master-maker-lovs-history");

const qaMasterMakerLovAlreadyExists = async (where) => {
    try {
        const qaMasterMakerLovs = new QaMasterMakerLovs();
        const data = await qaMasterMakerLovs.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_QA_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const createQaMasterMakerLov = async (body) => {
    try {
        const qaMasterMakerLovs = new QaMasterMakerLovs();
        const data = await qaMasterMakerLovs.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_QA_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const bulkCreateQaMasterMakerLov = async (body) => {
    try {
        const qaMasterMakerLovs = new QaMasterMakerLovs();
        const data = await qaMasterMakerLovs.bulkCreate(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_QA_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const getQaMasterMakerLovList = async (where) => {
    try {
        const qaMasterMakerLovs = new QaMasterMakerLovs();
        const data = await qaMasterMakerLovs.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_QA_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const updateQaMasterMakerLov = async (body, where) => {
    try {
        const qaMasterMakerLovs = new QaMasterMakerLovs();
        const data = await qaMasterMakerLovs.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.UPDATE_QA_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const deleteQaMasterMakerLov = async (where) => {
    try {
        const qaMasterMakerLovs = new QaMasterMakerLovs();
        const data = await qaMasterMakerLovs.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_QA_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const getQaMasterMakerLovHistory = async (where) => {
    try {
        const qaMasterMakerLovsHistory = new QaMasterMakerLovsHistory();
        const data = await qaMasterMakerLovsHistory.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_QA_MASTER_MAKER_LOV_HISTORY_FAILURE, error);
    }
};

module.exports = {
    qaMasterMakerLovAlreadyExists,
    createQaMasterMakerLov,
    bulkCreateQaMasterMakerLov,
    getQaMasterMakerLovList,
    updateQaMasterMakerLov,
    deleteQaMasterMakerLov,
    getQaMasterMakerLovHistory
};
