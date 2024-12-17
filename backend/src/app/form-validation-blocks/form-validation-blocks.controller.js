const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const formValidationBlockService = require("./form-validation-blocks.service");

/**
 * Method to create formValidationBlocks
 * @param { object } req.body
 * @returns { object } data
 */
const createFormValidationBlocks = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FORMVALIDATION_BLOCK);
    const data = await formValidationBlockService.createFormValidationBlocks(req.body.formId);
    return { data };
};

/**
 * Method to update formValidationBlocks
 * @param { object } req.body
 * @returns { object } data
 */
const updateformValidationBlocks = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMVALIDATIONBLOCK_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FORMVALIDATIONBLOCK_BLOCK);
    const isformValidationBlockExists = await formValidationBlockService
        .formValidationBlockAlreadyExists({ id: req.params.id });
    throwIfNot(isformValidationBlockExists, statusCodes.DUPLICATE, statusMessages.FORMVALIDATIONBLOCK_NOT_EXIST);
    const data = await formValidationBlockService.updateformValidationBlocks(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get formValidationBlocks details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getformValidationBlockDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMVALIDATIONBLOCK_ID_REQUIRED);
    const data = await formValidationBlockService.getformValidationBlocksByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all states
 * @param { object } req.body
 * @returns { object } data
 */
const getAllformValidationBlocks = async (req) => {
    const data = await formValidationBlockService.getAllformValidationBlocks();
    return { data };
};

/**
 * Method to delete state by state id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteformValidationBlocks = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMVALIDATIONBLOCK_ID_REQUIRED);
    const data = await formValidationBlockService.deleteformValidationBlocks({ id: req.params.id });
    return { data };
};

module.exports = {
    createFormValidationBlocks,
    updateformValidationBlocks,
    getformValidationBlockDetails,
    getAllformValidationBlocks,
    deleteformValidationBlocks
};
