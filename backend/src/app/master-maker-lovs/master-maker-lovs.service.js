const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const MasterMakerLovs = require("../../database/operation/master-maker-lovs");
const masterMaker = require("../master-makers/master-makers.service");
const MasterMakerLovsHistory = require("../../database/operation/master-maker-lovs-history");

const masterMakerLovsAlreadyExists = async (where) => {
    try {
        const masterMakerLovs = new MasterMakerLovs();
        const data = await masterMakerLovs.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const getMasterMakerLovByCondition = async (where) => {
    try {
        const masterMakerLovs = new MasterMakerLovs();
        const data = await masterMakerLovs.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const createMasterMakerLov = async (masterMakerLovDetails) => {
    try {
        const masterMakerLovs = new MasterMakerLovs();
        const data = await masterMakerLovs.create(masterMakerLovDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const updateMasterMakerLov = async (masterMakerLovDetails, where) => {
    try {
        const masterMakerLovs = new MasterMakerLovs();
        const data = await masterMakerLovs.update(masterMakerLovDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MASTER_MAKER_LOV_UPDATE_FAILURE, error);
    }
};

const getAllMasterMakerLov = async (where = {}, attributes = undefined, isRelation = true) => {
    try {
        const masterMakerLovs = new MasterMakerLovs();
        const data = await masterMakerLovs.findAndCountAll(where, attributes, isRelation, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MASTER_MAKER_LOV_LIST_FAILURE, error);
    }
};

const deleteMasterMakerLov = async (where) => {
    try {
        const masterMakerLovs = new MasterMakerLovs();
        const data = await masterMakerLovs.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const getAllLovByMasterName = async (where, isRelation = true, raw = false) => {
    try {
        const masterMakerLovs = new MasterMakerLovs();
        const masterMakerForUom = await masterMaker.getMasterMakerByCondition(where);
        let data = [];
        if (masterMakerForUom) {
            data = await masterMakerLovs.findAll(
                { master_id: masterMakerForUom.id },
                ["id", "name", "code"],
                isRelation,
                true,
                undefined,
                raw
            );
        }
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_LOV_FAILURE, error);
    }
};

const getMasterMakerLovHistory = async (where) => {
    try {
        const historyModelInstance = new MasterMakerLovsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MASTER_MAKER_LOV_ID_REQUIRED, error);
    }
};

module.exports = {
    masterMakerLovsAlreadyExists,
    getMasterMakerLovByCondition,
    createMasterMakerLov,
    updateMasterMakerLov,
    getAllMasterMakerLov,
    deleteMasterMakerLov,
    getMasterMakerLovHistory,
    getAllLovByMasterName
};
