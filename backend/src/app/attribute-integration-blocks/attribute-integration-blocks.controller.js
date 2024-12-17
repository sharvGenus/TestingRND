const { Op } = require("sequelize");
const { throwIfNot, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const attributeIntegrationBlockService = require("./attribute-integration-blocks.service");
const { createAttributeIntegrationConditionByBlock, updateExistingAttributeIntegrationCondition } = require("../attribute-integration-conditions/attribute-integration-conditions.service");
const { getFormByCondition } = require("../forms/forms.service");

const createAttributeIntegrationBlocks = async (req) => {
    const { name, formId, conditionsArray } = req.body;
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_INTEGRATION_BLOCK);
    throwIfNot(conditionsArray.filter( x => !Object.hasOwn(x, 'isActive') || x.isActive == 1).length, statusCodes.BAD_REQUEST, statusMessages.ATLEAST_ONE_INTEGRATION_CONDITION_REQUIRED);

    const isAttributeIntegrationBlockExists = await attributeIntegrationBlockService.isAttributeIntegrationBlockExists({ name, formId, isActive: "1" });
    throwIf(isAttributeIntegrationBlockExists, statusCodes.DUPLICATE, statusMessages.ATTRIBUTE_INTEGRATION_BLOCK_ALREADY_EXISTS);

    const data = await attributeIntegrationBlockService.createAttributeIntegrationBlock(req.body);
    if (conditionsArray && conditionsArray.length) {
        await createAttributeIntegrationConditionByBlock(conditionsArray, data?.id);
    }
    return { data };
};

/**
 * Method to delete integration block by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteAttributeIntegrationBlocks = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_INTEGRATION_BLOCK_ID_REQUIRED);
    const data = await attributeIntegrationBlockService.deleteAttributeIntegrationBlock({ id });
    return { data };
};

/**
 * Method to get integration block details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getAttributeIntegrationBlocksDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_INTEGRATION_BLOCK_ID_REQUIRED);
    const data = await attributeIntegrationBlockService.getAllAttrIntegrationBlocksByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all integration condition blocks
 * @returns { object } data
 */
const getAllAttributeIntegrationBlocks = async (req) => {
    const { formId } = req.query;
    const condition = {};
    if (formId) condition.formId = formId;
    const [form, data] = await Promise.all([
        getFormByCondition({ id: formId }),
        attributeIntegrationBlockService.getAllAttributeIntegrationBlocks(condition)
    ]);
    data.formName = form.name;
    return { data };
};

/**
 * Method to update
 * @param { object } req.body
 * @returns { string } message
 */
const updateBlockAndConditions = async (req) => {
    const { id } = req.params;
    const { name, conditionsArray, formId } = req.body;
    const isAttributeIntegrationBlockExists = await attributeIntegrationBlockService.isAttributeIntegrationBlockExists({ name, formId, id: { [Op.ne]: id }, isActive: "1" });
    throwIf(isAttributeIntegrationBlockExists, statusCodes.DUPLICATE, statusMessages.ATTRIBUTE_INTEGRATION_BLOCK_ALREADY_EXISTS);
    const formData = await getFormByCondition({ id: formId });
    throwIfNot(formData, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXISTS);
    throwIfNot(
        conditionsArray.filter( x => !Object.hasOwn(x, 'isActive') || x.isActive == 1).length,
        statusCodes.BAD_REQUEST,
        statusMessages.ATLEAST_ONE_INTEGRATION_CONDITION_REQUIRED
    );
    await attributeIntegrationBlockService.updateAttributeIntegrationBlock(req.body, { id });
    if(conditionsArray) {
        const objectsWithId = conditionsArray.filter((obj) => obj.id);
        const objectsWithoutId = conditionsArray.filter((obj) => !obj.id && obj.isActive !== 0);
        if (objectsWithoutId && objectsWithoutId.length) {
            await createAttributeIntegrationConditionByBlock(objectsWithoutId, id);
        }
        if (objectsWithId && objectsWithId.length) {
            await updateExistingAttributeIntegrationCondition(objectsWithId, formData?.isPublished);
        }
    }
    return { message: statusMessages.ATTRIBUTE_INTEGRATION_BLOCK_UPDATED };
};

module.exports = {
    createAttributeIntegrationBlocks,
    deleteAttributeIntegrationBlocks,
    getAllAttributeIntegrationBlocks,
    updateBlockAndConditions,
    getAttributeIntegrationBlocksDetails
};
