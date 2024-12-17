const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AttributeIntegrationConditions = require("../../database/operation/attribute-integration-conditions");
const { addKeyValuePairToObject } = require("../../utilities/common-utils");

const getByIntegrationBlockId = async (where) => {
    try {
        const attributeIntegrationCondition = new AttributeIntegrationConditions();
        const data = await attributeIntegrationCondition.findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_CONDITION_FETCH, error);
    }
};

const createAttributeIntegrationConditionByBlock = async (attributeIntegrationConditionData, integrationBlockId) => {
    try {
        const attributeIntegrationCondition = new AttributeIntegrationConditions();
        const requiredObject = addKeyValuePairToObject(attributeIntegrationConditionData, "integrationBlockId", integrationBlockId);
        const data = await attributeIntegrationCondition.bulkCreate(requiredObject);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_CONDITION_CREATE, error);
    }
};

const updateExistingAttributeIntegrationCondition = async (conditionData, isFormPublished) => {
    try {
        const attributeIntegrationCondition = new AttributeIntegrationConditions();
        const updates = conditionData.map(async (formData) => {
            const { id, ...updateData } = formData;
            const where = { id };
            if (Object.prototype.hasOwnProperty.call(updateData, "isActive") && +updateData.isActive === 0 && !isFormPublished) {
                return attributeIntegrationCondition.forceDelete(where);
            }
            delete updateData.integrationBlockId;
            return attributeIntegrationCondition.update(updateData, where);
        });
        return Promise.all(updates);
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_CONDITION_CREATE, error);
    }
};

module.exports = {
    getByIntegrationBlockId,
    createAttributeIntegrationConditionByBlock,
    updateExistingAttributeIntegrationCondition
};
