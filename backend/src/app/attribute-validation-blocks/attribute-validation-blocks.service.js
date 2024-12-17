const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AttributeValidationBlocks = require("../../database/operation/attribute-validation-blocks");

const isAttributeValidationBlockExists = async (where) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        const data = await attributeValidationBlock.isAlreadyExists(where, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ATTRIBUTE_VALIDATION_BLOCK_ALREADY_EXISTS, error);
    }
};

const createAttributeValidationBlock = async (formDetails) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        const data = await attributeValidationBlock.create(formDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_CREATE, error);
    }
};

const updateAttributeValidationBlock = async (formDetails, where) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        const data = await attributeValidationBlock.update(formDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_UPDATE, error);
    }
};

const deleteAttributeValidationBlock = async (where) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        const data = await attributeValidationBlock.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_DELETE, error);
    }
};

const getAllAttrValBlocks = async (where) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        const data = await attributeValidationBlock
            .findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_FETCH, error);
    }
};

const getAllAttrValBlocksByCondition = async (where) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        const data = await attributeValidationBlock.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_FETCH, error);
    }
};

const getMappedDataWithConditionsAndFormAttributes = async (where) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        attributeValidationBlock.updateRelations();
        const data = await attributeValidationBlock.findOne(where, ["id", "name", "message", "type"], true, undefined, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_FETCH, error);
    }
};

const getAttributValidationBlockByFormId = async (formId) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        const data = await attributeValidationBlock.findAll({ formId }, ["id"], false, false, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_FETCH, error);
    }
};

const deleteFormsAttributeValidationBlock = async (where, transaction, isDeleted) => {
    try {
        const attributeValidationBlock = new AttributeValidationBlocks();
        const data = await attributeValidationBlock.delete(where, transaction, isDeleted);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_DELETE, error);
    }
};

module.exports = {
    isAttributeValidationBlockExists,
    createAttributeValidationBlock,
    updateAttributeValidationBlock,
    deleteAttributeValidationBlock,
    getAllAttrValBlocks,
    getAllAttrValBlocksByCondition,
    getMappedDataWithConditionsAndFormAttributes,
    getAttributValidationBlockByFormId,
    deleteFormsAttributeValidationBlock
};
