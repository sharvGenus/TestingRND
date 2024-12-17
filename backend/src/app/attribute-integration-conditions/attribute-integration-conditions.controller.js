const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const attributeIntegrationConditionsService = require("./attribute-integration-conditions.service");

/**
 * Method to get attribute integration condition details by attibute integration block id
 * @param { object } req.body
 * @returns { object } data
 */
const getAttributeIntegrationConditionByBLockId = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_INTEGRATION_BLOCK_ID_REQUIRED);
    const data = await attributeIntegrationConditionsService.getByIntegrationBlockId({ integrationBlockId: id });
    return { data };
};

module.exports = {
    getAttributeIntegrationConditionByBLockId
};
