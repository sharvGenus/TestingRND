const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const FormValidationBlocks = require("../../database/operation/form-validation-blocks");

const formValidationBlockAlreadyExists = async (where) => {
    try {
        const formValidationBlocks = new FormValidationBlocks();
        const data = await formValidationBlocks.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMVALIDATIONBLOCK_ALREADY_EXIST, error);
    }
};

const createFormValidationBlocks = async (formValidationBlockDetails) => {
    try {
        const formValidationBlocks = new FormValidationBlocks();
        const data = await formValidationBlocks.create(formValidationBlockDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_FORMVALIDATIONBLOCK_FAILURE, error);
    }
};
const updateformValidationBlocks = async (formValidationBlockDetails, where) => {
    try {
        const formValidationBlocks = new FormValidationBlocks();
        const data = await formValidationBlocks.update(formValidationBlockDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMVALIDATIONBLOCK_UPDATE_FAILURE, error);
    }
};

const getAllformValidationBlocks = async () => {
    try {
        const formValidationBlocks = new FormValidationBlocks();
        const data = await formValidationBlocks.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORMVALIDATIONBLOCK_LIST_FAILURE, error);
    }
};
const deleteformValidationBlocks = async (where) => {
    try {
        const formValidationBlocks = new FormValidationBlocks();
        const data = await formValidationBlocks.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FORMVALIDATIONBLOCK_FAILURE, error);
    }
};
const getformValidationBlocksByCondition = async (where) => {
    try {
        const formValidationBlocks = new FormValidationBlocks();
        const data = await formValidationBlocks.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMVALIDATIONBLOCK_FAILURE, error);
    }
};
module.exports = {
    formValidationBlockAlreadyExists,
    createFormValidationBlocks,
    updateformValidationBlocks,
    getAllformValidationBlocks,
    deleteformValidationBlocks,
    getformValidationBlocksByCondition
};
