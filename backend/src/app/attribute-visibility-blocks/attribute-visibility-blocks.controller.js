const { throwIfNot, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const attributeVisibilitylBlockService = require("./attribute-visibility-blocks.service");
const { createAttributeVisibilityCondition, updateExistingAttributeVisibilityCondition } = require("../attribute-visibility-conditions/attribute-visibility-conditions.service");
const { getFormByCondition } = require("../forms/forms.service");

const createAttributeVisibilityBlocks = async (req) => {
    const { name, conditionsArray, formId } = req.body;
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_VISIBILITY_BLOCK);
    // eslint-disable-next-line max-len
    throwIfNot(conditionsArray.filter( x => !Object.hasOwn(x, 'isActive') || x.isActive == 1).length, statusCodes.BAD_REQUEST, statusMessages.ATLEAST_ONE_VISIBILITY_CONDITION_REQUIRED);
    const isAttriVisibiBlockExists = await attributeVisibilitylBlockService
        .isAttributeVisibilityBlockExists({ name, formId });
    throwIf(isAttriVisibiBlockExists, statusCodes.DUPLICATE, statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_ALREADY_EXISTS);
    const data = await attributeVisibilitylBlockService.createAttributeVisibilityBlock(req.body);
    if (conditionsArray && conditionsArray.length) {
        await createAttributeVisibilityCondition(conditionsArray, data?.id);
    }
    return { message: statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_CREATED_SUCCESSFULLY };
};

/**
 * Method to update form
 * @param { object } req.body
 * @returns { object } data
 */
const updateAttributeVisibilityBLock = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_ID_REQUIRED);

    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_VISIBILITY_BLOCK);
    const isAttrVisiBlockExist = await attributeVisibilitylBlockService.isAttributeVisibilityBlockExists({ id });
    throwIfNot(isAttrVisiBlockExist, statusCodes.DUPLICATE, statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_NOT_EXIST);
    const data = await attributeVisibilitylBlockService.updateAttributeVisibilityBlock(req.body, { id });
    return { data };
};

/**
 * Method to delete state by state id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteAttributeVisibilityBLocks = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_ID_REQUIRED);
    const data = await attributeVisibilitylBlockService.deleteAttributeVisibilityBlock({ id });
    return { data };
};

/**
 * Method to get all states
 * @returns { object } data
 */
const getAllAttributeVisibilityBlocks = async (req) => {
    const { formId } = req.query;
    const condition = {};
    if (formId) condition.formId = formId;
    const [form, data] = await Promise.all([
        getFormByCondition({ id: formId }),
        attributeVisibilitylBlockService.getAllAttrVisBlocks(condition)
    ]);
    data.formName = form.name;
    return { data };
};

/**
 * Method to update form
 * @param { object } req.body
 * @returns { string } message
 */
const updateBlockAndConditions = async (req) => {
    const { visibilityBlockId: id, conditionsArray, formId } = req.body;
    const isAttrVisiBlockExist = await attributeVisibilitylBlockService.isAttributeVisibilityBlockExists({ id });
    throwIfNot(isAttrVisiBlockExist, statusCodes.NOT_FOUND, statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_NOT_EXIST);
    const formData = await getFormByCondition({ id: formId });
    throwIfNot(formData, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXISTS);
    throwIfNot(conditionsArray.filter( x => !Object.hasOwn(x, 'isActive') || x.isActive == 1).length, statusCodes.BAD_REQUEST, statusMessages.ATLEAST_ONE_VISIBILITY_CONDITION_REQUIRED);
    await attributeVisibilitylBlockService.updateAttributeVisibilityBlock(req.body, { id });
    const objectsWithId = conditionsArray.length > 0 ? conditionsArray.filter((obj) => obj.id) : [];
    const objectsWithoutId = conditionsArray.length > 0
        ? conditionsArray.filter((obj) => !obj.id && obj.isActive !== 0) : [];
    if (objectsWithoutId && objectsWithoutId.length > 0) {
        await createAttributeVisibilityCondition(objectsWithoutId, id);
    }
    if (objectsWithId && objectsWithId.length > 0) {
        await updateExistingAttributeVisibilityCondition(objectsWithId, formData?.isPublished);
    }
    return { message: statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_UPDATED };
};

module.exports = {
    createAttributeVisibilityBlocks,
    updateAttributeVisibilityBLock,
    deleteAttributeVisibilityBLocks,
    getAllAttributeVisibilityBlocks,
    updateBlockAndConditions
};