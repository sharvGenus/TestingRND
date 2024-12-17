const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AttributeVisibilityConditions = require("../../database/operation/attribute-visibility-conditions");
const { addKeyValuePairToObject } = require("../../utilities/common-utils");

const isAttributeVisibilityConditionExists = async (where) => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const data = await attributeVisibilityCondition.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ATTRIBUTE_VISIBILITY_CONDITION_ALREADY_EXISTS, error);
    }
};

const updateAttributeVisibilityCondition = async (formDetails, where) => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const data = await attributeVisibilityCondition.update(formDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_CONDITION_UPDATE, error);
    }
};

const deleteAttributeVisibilityCondition = async (where) => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const data = await attributeVisibilityCondition.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_CONDITION_DELETE, error);
    }
};

const getAllAttrVisConditions = async () => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const data = await attributeVisibilityCondition.findAndCountAll({}, undefined, true, false, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_CONDITION_FETCH, error);
    }
};

const getByVisibilityBLockId = async (where) => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const data = await attributeVisibilityCondition.findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_CONDITION_FETCH, error);
    }
};

const getByVisibilityByCondition = async (where) => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const data = await attributeVisibilityCondition.findOne(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_CONDITION_FETCH, error);
    }
};

const createAttributeVisibilityCondition = async (attriVisibilityConditionData, VisibilityBlockId) => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const requiredObject = addKeyValuePairToObject(attriVisibilityConditionData, "visibilityBlockId", VisibilityBlockId);
        const data = await attributeVisibilityCondition.bulkCreate(requiredObject);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_CONDITION_CREATE, error);
    }
};

const updateExistingAttributeVisibilityCondition = async (conditionData, isFormPublished) => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const updates = conditionData.map(async (formData) => {
            const { id, ...updateData } = formData;
            const where = { id };
            if (updateData.isActive === 0 && !isFormPublished) {
                return attributeVisibilityCondition.forceDelete(where);
            }
            delete updateData.visibilityBlockId;
            return attributeVisibilityCondition.update(updateData, where);
        });
        return Promise.all(updates);
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VALIDATION_CONDITION_CREATE, error);
    }
};

const deleteFormsAttributeVisibilityCondition = async (where, transaction, isDeleted) => {
    try {
        const attributeVisibilityCondition = new AttributeVisibilityConditions();
        const data = await attributeVisibilityCondition.delete(where, transaction, isDeleted);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_VISIBILITY_CONDITION_DELETE, error);
    }
};

module.exports = {
    isAttributeVisibilityConditionExists,
    updateAttributeVisibilityCondition,
    deleteAttributeVisibilityCondition,
    getAllAttrVisConditions,
    getByVisibilityBLockId,
    createAttributeVisibilityCondition,
    updateExistingAttributeVisibilityCondition,
    deleteFormsAttributeVisibilityCondition,
    getByVisibilityByCondition
};
