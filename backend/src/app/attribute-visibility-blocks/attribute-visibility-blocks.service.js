const { Op } = require("sequelize");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AttributeVisibilityBlocks = require("../../database/operation/attribute-visibility-blocks");

const isAttributeVisibilityBlockExists = async (where) => {
    try {
        const attributeVisibilityBlock = new AttributeVisibilityBlocks();
        const data = await attributeVisibilityBlock.isAlreadyExists(where, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_ALREADY_EXISTS, error);
    }
};

const createAttributeVisibilityBlock = async (formDetails) => {
    try {
        const attributeVisibilityBlock = new AttributeVisibilityBlocks();
        const data = await attributeVisibilityBlock.create(formDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_BLOCK_CREATE, error);
    }
};

const updateAttributeVisibilityBlock = async (formDetails, where) => {
    try {
        const attributeVisibilityBlock = new AttributeVisibilityBlocks();
        const data = await attributeVisibilityBlock.update(formDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_BLOCK_UPDATE, error);
    }
};

const deleteAttributeVisibilityBlock = async (where) => {
    try {
        const attributeVisibilityBlock = new AttributeVisibilityBlocks();
        const data = await attributeVisibilityBlock.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_BLOCK_DELETE, error);
    }
};

const getAllAttrVisBlocks = async (where) => {
    try {
        const attributeVisibilityBlock = new AttributeVisibilityBlocks();
        const data = await attributeVisibilityBlock
            .findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_BLOCK_FETCH, error);
    }
};

const getVisibilityFromAttributeId = async (formAttributeId) => {
    const attributeVisibilityBlock = new AttributeVisibilityBlocks();
    attributeVisibilityBlock.queryObject = {};
    const showConditions = await attributeVisibilityBlock.findAll({
        visibleColumns: {
            [Op.contains]: [formAttributeId]
        }
    }, ["id", "name", "type"], true, undefined, undefined, undefined, undefined, true);
    const hideConditions = await attributeVisibilityBlock.findAll({
        nonVisibleColumns: {
            [Op.contains]: [formAttributeId]
        }
    }, ["id", "name", "type"], true, undefined, undefined, undefined, undefined, true);
    return { showConditions, hideConditions };
};

const getAttributeVisibilityBlockByFormId = async (formId) => {
    try {
        const attributeVisibilityBlock = new AttributeVisibilityBlocks();
        const data = await attributeVisibilityBlock.findAll({ formId }, ["id"], false, false, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_BLOCK_FETCH, error);
    }
};

const deleteFormsAttributeVisibilityBlock = async (where, transaction, isDeleted) => {
    try {
        const attributeVisibilityBlock = new AttributeVisibilityBlocks();
        const data = await attributeVisibilityBlock.delete(where, transaction, isDeleted);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_DELETE, error);
    }
};

module.exports = {
    isAttributeVisibilityBlockExists,
    createAttributeVisibilityBlock,
    updateAttributeVisibilityBlock,
    deleteAttributeVisibilityBlock,
    getAllAttrVisBlocks,
    getVisibilityFromAttributeId,
    getAttributeVisibilityBlockByFormId,
    deleteFormsAttributeVisibilityBlock
};
