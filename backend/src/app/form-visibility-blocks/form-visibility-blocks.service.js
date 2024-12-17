const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const FormVisibiltiyBlocks = require("../../database/operation/form-visibility-blocks");

const formVisibilityBlockAlreadyExists = async (where) => {
    try {
        const formVisibilityBlocks = new FormVisibiltiyBlocks();
        const data = await formVisibilityBlocks.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMVISIBILTIYBLOCK_ALREADY_EXIST, error);
    }
};

const createFormVisibilityBlocks = async (formVisibiltiyBlockDetails) => {
    try {
        const formVisibilityBlocks = new FormVisibiltiyBlocks();
        const data = await formVisibilityBlocks.create(formVisibiltiyBlockDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_FORMVISIBILTIYBLOCK_FAILURE, error);
    }
};
const updateformVisibilityBlocks = async (formVisibiltiyBlockDetails, where) => {
    try {
        const formVisibilityBlocks = new FormVisibiltiyBlocks();
        const data = await formVisibilityBlocks.update(formVisibiltiyBlockDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMVISIBILTIYBLOCK_UPDATE_FAILURE, error);
    }
};

const getAllformVisibilityBlocks = async () => {
    try {
        const formVisibilityBlocks = new FormVisibiltiyBlocks();
        const data = await formVisibilityBlocks.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORMVISIBILTIYBLOCK_LIST_FAILURE, error);
    }
};
const deleteformVisibilityBlocks = async (where) => {
    try {
        const formVisibilityBlocks = new FormVisibiltiyBlocks();
        const data = await formVisibilityBlocks.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FORMVISIBILTIYBLOCK_FAILURE, error);
    }
};
const getformVisibilityBlocksByCondition = async (where) => {
    try {
        const formVisibilityBlocks = new FormVisibiltiyBlocks();
        const data = await formVisibilityBlocks.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMVISIBILTIYBLOCK_FAILURE, error);
    }
};
module.exports = {
    formVisibilityBlockAlreadyExists,
    createFormVisibilityBlocks,
    updateformVisibilityBlocks,
    getAllformVisibilityBlocks,
    deleteformVisibilityBlocks,
    getformVisibilityBlocksByCondition
};
