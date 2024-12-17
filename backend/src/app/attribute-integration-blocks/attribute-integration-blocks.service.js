const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AttributeIntegrationBlocks = require("../../database/operation/attribute-integration-blocks");

const isAttributeIntegrationBlockExists = async (where) => {
    try {
        const attributeIntegrationBlock = new AttributeIntegrationBlocks();
        const data = await attributeIntegrationBlock.isAlreadyExists(where, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ATTRIBUTE_INTEGRATION_BLOCK_ALREADY_EXISTS, error);
    }
};

const createAttributeIntegrationBlock = async (formDetails) => {
    try {
        const attributeIntegrationBlock = new AttributeIntegrationBlocks();
        const data = await attributeIntegrationBlock.create(formDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_BLOCK_CREATE, error);
    }
};

const updateAttributeIntegrationBlock = async (formDetails, where) => {
    try {
        const attributeIntegrationBlock = new AttributeIntegrationBlocks();
        const data = await attributeIntegrationBlock.update(formDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_BLOCK_UPDATE, error);
    }
};

const deleteAttributeIntegrationBlock = async (where) => {
    try {
        const attributeIntegrationBlock = new AttributeIntegrationBlocks();
        const data = await attributeIntegrationBlock.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_BLOCK_DELETE, error);
    }
};

const getAllAttributeIntegrationBlocks = async (where) => {
    try {
        const attributeIntegrationBlock = new AttributeIntegrationBlocks();
        const data = await attributeIntegrationBlock
            .findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_BLOCK_FETCH, error);
    }
};

const getAllAttrIntegrationBlocksByCondition = async (where) => {
    try {
        const attributeIntegrationBlock = new AttributeIntegrationBlocks();
        const data = await attributeIntegrationBlock.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_BLOCK_FETCH, error);
    }
};

const getMappedDataWithConditionsAndFormAttributes = async (where) => {
    try {
        const attributeIntegrationBlock = new AttributeIntegrationBlocks();
        attributeIntegrationBlock.updateRelations();
        const data = await attributeIntegrationBlock.findOne(where, ["id", "name", "type"], true, undefined, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_BLOCK_FETCH, error);
    }
};

const deleteFormsAttributeIntegrationBlock = async (where, transaction, isDeleted) => {
    try {
        const attributeIntegrationBlock = new AttributeIntegrationBlocks();
        const data = await attributeIntegrationBlock.delete(where, transaction, isDeleted);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_BLOCK_DELETE, error);
    }
};

module.exports = {
    isAttributeIntegrationBlockExists,
    createAttributeIntegrationBlock,
    updateAttributeIntegrationBlock,
    deleteAttributeIntegrationBlock,
    getAllAttributeIntegrationBlocks,
    getAllAttrIntegrationBlocksByCondition,
    getMappedDataWithConditionsAndFormAttributes,
    deleteFormsAttributeIntegrationBlock
};
