const { Op } = require("sequelize");
const { throwIfNot, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const attributeIntegrationPayloadService = require("./attribute-integration-payload.service");

/**
 * Method to create attribute integration payload
 * @param { object } req.body
 * @returns { object } data
 */
const createAttributeIntegrationPayload = async (req) => {
    // const { name, integrationBlockId } = req.body;
    // const isAttributeIntegrationPayloadExists = await attributeIntegrationPayloadService.attributeIntegrationPayloadAlreadyExists({ name, integrationBlockId, isActive: "1" });
    // throwIf(isAttributeIntegrationPayloadExists, statusCodes.DUPLICATE, statusMessages.ATTRIBUTE_INTEGRATION_PAYLOAD_ALREADY_EXIST);
    const data = await attributeIntegrationPayloadService.createAttributeIntegrationPayload(req.body);
    return { data };
};
/**
 * Method to get attribute integration payload details by attibute integration block id
 * @param { object } req.body
 * @returns { object } data
 */
const getAttributeIntegrationPayloadByBLockId = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_INTEGRATION_BLOCK_ID_REQUIRED);
    const data = await attributeIntegrationPayloadService.getByIntegrationBlockId({ integrationBlockId: id });
    return { data };
};

/**
 * Method to update
 * @param { object } req.body
 * @returns { object } data
 */
const updateAttributeIntegrationPayload = async (req) => {
    // const { id } = req.params;
    // const { name, integrationBlockId } = req.body;
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_INTEGRATION_PAYLOAD_ID_REQUIRED);
    // const isAttributeIntegrationPayloadExists = await attributeIntegrationPayloadService.attributeIntegrationPayloadAlreadyExists({ name, integrationBlockId, id: { [Op.ne]: id }, isActive: "1" });
    // throwIf(isAttributeIntegrationPayloadExists, statusCodes.DUPLICATE, statusMessages.ATTRIBUTE_INTEGRATION_PAYLOAD_ALREADY_EXIST);
    const data = await attributeIntegrationPayloadService.updateAttributeIntegrationPayload(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to delete
 * @param { object } req.body
 * @returns { object } data
 */
const deleteAttributeIntegrationPayload = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_INTEGRATION_PAYLOAD_ID_REQUIRED);
    const data = await attributeIntegrationPayloadService.deleteAttributeIntegrationPayload({ id: req.params.id });
    return { data };
};

/**
 * Method to get attribute integration payload list in dropdown
 * @param { object } req.body
 * @returns { object } data
 */
const getAllAttributeIntegrationPayloadByDropdown = async (req) => {
    const { id } = req.params;
    const data = await attributeIntegrationPayloadService.getAllAttributeIntegrationPayloadByDropdown({ integrationBlockId: id });
    return { data };
};

module.exports = {
    getAttributeIntegrationPayloadByBLockId,
    createAttributeIntegrationPayload,
    updateAttributeIntegrationPayload,
    deleteAttributeIntegrationPayload,
    getAllAttributeIntegrationPayloadByDropdown
};
