const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const formVisibilityBlockService = require("./form-visibility-blocks.service");

/**
 * Method to create formVisibilityBlocks
 * @param { object } req.body
 * @returns { object } data
 */
const createFormVisibilityBlocks = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FORMVISIBILTIY_BLOCK);
    const data = await formVisibilityBlockService.createFormVisibilityBlocks(req.body.formId);
    return { data };
};

/**
 * Method to update formVisibilityBlocks
 * @param { object } req.body
 * @returns { object } data
 */
const updateformVisibilityBlocks = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMVISIBILTIYBLOCK_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FORMVISIBILTIY_BLOCK);
    const isformVisibilityBlockExists = await formVisibilityBlockService
        .formVisibilityBlockAlreadyExists({ id: req.params.id });
    throwIfNot(isformVisibilityBlockExists, statusCodes.DUPLICATE, statusMessages.FORMVISIBILTIYBLOCK_NOT_EXIST);
    const data = await formVisibilityBlockService.updateformVisibilityBlocks({ id: req.params.id });
    return { data };
};

/**
 * Method to get formVisibilityBlocks details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getformVisibilityBlockDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMVISIBILTIYBLOCK_ID_REQUIRED);
    const data = await formVisibilityBlockService.getformVisibilityBlocksByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all states
 * @param { object } req.body
 * @returns { object } data
 */
const getAllformVisibilityBlocks = async (req) => {
    const data = await formVisibilityBlockService.getAllformVisibilityBlocks();
    return { data };
};

/**
 * Method to delete state by state id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteformVisibilityBlocks = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMVISIBILTIYBLOCK_ID_REQUIRED);
    const data = await formVisibilityBlockService.deleteformVisibilityBlocks({ id: req.params.id });
    return { data };
};

module.exports = {
    createFormVisibilityBlocks,
    updateformVisibilityBlocks,
    getformVisibilityBlockDetails,
    getAllformVisibilityBlocks,
    deleteformVisibilityBlocks
};
