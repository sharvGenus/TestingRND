const { Op } = require("sequelize");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const AttributeIntegrationPayload = require("../../database/operation/attribute-integration-payload");

const getByIntegrationBlockId = async (where) => {
    try {
        const attributeIntegrationPayload = new AttributeIntegrationPayload();
        const data = await attributeIntegrationPayload.findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_PAYLOAD_FETCH, error);
    }
};

const attributeIntegrationPayloadAlreadyExists = async (where) => {
    try {
        const attributeIntegrationPayload = new AttributeIntegrationPayload();
        const data = await attributeIntegrationPayload.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ATTRIBUTE_INTEGRATION_PAYLOAD_NOT_EXIST, error);
    }
};

const createAttributeIntegrationPayload = async (attributeIntegrationPayloadDetails) => {
    try {
        const attributeIntegrationPayload = new AttributeIntegrationPayload();
        const data = await attributeIntegrationPayload.create(attributeIntegrationPayloadDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_ATTRIBUTE_INTEGRATION_PAYLOAD_FAILURE, error);
    }
};

const updateAttributeIntegrationPayload = async (attributeIntegrationPayloadDetails, where) => {
    try {
        const attributeIntegrationPayload = new AttributeIntegrationPayload();
        const data = await attributeIntegrationPayload.update(attributeIntegrationPayloadDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ATTRIBUTE_INTEGRATION_PAYLOAD_UPDATE_FAILURE, error);
    }
};

const getAllAttributeIntegrationPayloadByDropdown = async (where) => {
    try {
        const attributeIntegrationPayload = new AttributeIntegrationPayload();
        const data = await attributeIntegrationPayload.findAll({ ...where, type: { [Op.not]: "key" } }, ["name", "id", "type"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ATTRIBUTE_INTEGRATION_PAYLOAD_LIST_FAILURE, error);
    }
};

/** Check if form is not published then do hard delete, and if form is published then do soft delete.and check if a row is getting deleted, then all other rows which contains it's id as parent should also get deleted */
const deleteUtil = async (payload, isForceDelete = false) => {
    if (!payload) return;

    const attributeIntegrationPayload = new AttributeIntegrationPayload();
    const customPayload = JSON.parse(JSON.stringify(payload));
    const { id } = customPayload;

    /** Fetching 'is_published' from payload's integrationBlockId.form */
    if (!customPayload?.attribute_integration_block?.form) return;
    const isPublished = customPayload?.attribute_integration_block?.form?.is_published || false;
    let forceDeleteFlag = isForceDelete; // Set force delete flag based on argument

    if (isPublished && !forceDeleteFlag) {
        /** Soft delete if published and not forced */
        await attributeIntegrationPayload.delete({ id: customPayload.id });
    } else {
        /** Hard delete if not published or forced */
        forceDeleteFlag = true; // Force delete for child elements
        await attributeIntegrationPayload.forceDelete({ id: customPayload.id });
    }

    /** Find all child payloads and delete recursively */
    const childPayloads = await attributeIntegrationPayload.findAll({ parent: id, isActive: { [Op.in]: ["0", "1"] } }, undefined, true);
    for (const childPayload of childPayloads) {
        deleteUtil(childPayload, forceDeleteFlag); // Recursively delete children
    }
};

const deleteAttributeIntegrationPayload = async (where) => {
    try {
        const attributeIntegrationPayload = new AttributeIntegrationPayload();
        const attributeIntegrationPayloadData = await attributeIntegrationPayload.findOne(where, undefined, true);
        await deleteUtil(attributeIntegrationPayloadData);
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_PAYLOAD_DELETE, error);
    }
};

const getAllAttrIntegrationPayloadByCondition = async (where) => {
    try {
        const attributeIntegrationPayload = new AttributeIntegrationPayload();
        const data = await attributeIntegrationPayload.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ATTRIBUTE_INTEGRATION_BLOCK_FETCH, error);
    }
};

module.exports = {
    getByIntegrationBlockId,
    attributeIntegrationPayloadAlreadyExists,
    createAttributeIntegrationPayload,
    updateAttributeIntegrationPayload,
    deleteAttributeIntegrationPayload,
    getAllAttributeIntegrationPayloadByDropdown,
    getAllAttrIntegrationPayloadByCondition
};
