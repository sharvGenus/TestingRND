const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AttributeValidationConditions = require("../../database/operation/attribute-validation-conditions");
const { addKeyValuePairToObject } = require("../../utilities/common-utils");

const isAttributeValidationConditionExists = async (where) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const data = await attributeValidationCondition.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ATTRIBUTE_VALIDATION_BLOCK_ALREADY_EXISTS, error);
    }
};

const createAttributeValidationCondition = async (formDetails) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const data = await attributeValidationCondition.create(formDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_CONDITION_CREATE, error);
    }
};

const updateAttributeValidationCondition = async (formDetails, where) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const data = await attributeValidationCondition.update(formDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_CONDITION_UPDATE, error);
    }
};

const deleteAttributeValidationCondition = async (where) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const data = await attributeValidationCondition.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_DELETE, error);
    }
};

const getAllAttrValConditions = async () => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const data = await attributeValidationCondition.findAndCountAll({}, undefined, true, false, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_CONDITION_FETCH, error);
    }
};

const getByValidationBLockId = async (where) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const data = await attributeValidationCondition.findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_CONDITION_FETCH, error);
    }
};

const getByValidationCondition = async (where) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const data = await attributeValidationCondition.findOne(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_CONDITION_FETCH, error);
    }
};

// eslint-disable-next-line max-len
const createAttributeValidationConditionByBlock = async (attributeValidationConditionData, ValidationBlockId) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const requiredObject = addKeyValuePairToObject(attributeValidationConditionData, "validationBlockId", ValidationBlockId);
        const data = await attributeValidationCondition.bulkCreate(requiredObject);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_CONDITION_CREATE, error);
    }
};

const updateExistingAttributeValidaionCondition = async (conditionData, isFormPublished) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const updates = conditionData.map(async (formData) => {
            const { id, ...updateData } = formData;
            const where = { id };
            if (Object.prototype.hasOwnProperty.call(updateData, "isActive") && +updateData.isActive === 0 && !isFormPublished) {
                return attributeValidationCondition.forceDelete(where);
            }
            delete updateData.validationBlockId;
            return attributeValidationCondition.update(updateData, where);
        });
        return Promise.all(updates);
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_CONDITION_CREATE, error);
    }
};

const deleteFormsAttributeValidationCondition = async (where, transaction, isDeleted) => {
    try {
        const attributeValidationCondition = new AttributeValidationConditions();
        const data = await attributeValidationCondition.delete(where, transaction, isDeleted);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_BLOCK_DELETE, error);
    }
};

module.exports = {
    isAttributeValidationConditionExists,
    createAttributeValidationCondition,
    updateAttributeValidationCondition,
    deleteAttributeValidationCondition,
    getAllAttrValConditions,
    getByValidationBLockId,
    createAttributeValidationConditionByBlock,
    updateExistingAttributeValidaionCondition,
    deleteFormsAttributeValidationCondition,
    getByValidationCondition
};
