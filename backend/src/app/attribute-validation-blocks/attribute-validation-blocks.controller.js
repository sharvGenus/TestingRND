const { throwIfNot, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const attributeValidationBlockService = require("./attribute-validation-blocks.service");
const { createAttributeValidationConditionByBlock, updateExistingAttributeValidaionCondition } = require("../attribute-validation-conditions/attribute-validation-conditions.service");
const { getFormByCondition } = require("../forms/forms.service");

const createAttributeValidationBlocks = async (req) => {
    const { name, formId, conditionsArray, primaryColumn } = req.body;
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_VALIDATION_BLOCK);
    throwIfNot(
        conditionsArray.filter( x => !Object.hasOwn(x, 'isActive') || x.isActive == 1).length,
        statusCodes.BAD_REQUEST,
        statusMessages.ATLEAST_ONE_VALIDATION_CONDITION_REQUIRED
    );
    // eslint-disable-next-line max-len
    const isAttributeValidationBlockExists = await attributeValidationBlockService
        .isAttributeValidationBlockExists({ name, formId });
    const checkIfPrimaryColumnExists = await attributeValidationBlockService
        .isAttributeValidationBlockExists({ primaryColumn, isActive: "1" });
    throwIf(
        isAttributeValidationBlockExists,
        statusCodes.DUPLICATE,
        statusMessages.ATTRIBUTE_VALIDATION_BLOCK_ALREADY_EXISTS
    );
    throwIf(
        checkIfPrimaryColumnExists,
        statusCodes.DUPLICATE,
        statusMessages.PRIMARY_COLUMN_ALREADY_USED
    );
    
    const data = await attributeValidationBlockService.createAttributeValidationBlock(req.body);
    if (conditionsArray && conditionsArray.length) {
        await createAttributeValidationConditionByBlock(conditionsArray, data?.id);
    }
    return { message: statusMessages.ATTRIBUTE_VALIDATION_BLOCK_CREATED_SUCCESSFULLY };
};

/**
 * Method to update validation condition block
 * @param { object } req.body
 * @returns { object } data
 */
const updateAttributeValidationBLocks = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VALIDATION_BLOCK_ID_REQUIRED);

    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_VALIDATION_BLOCK);
    const isAttriValidationBLockExists = await attributeValidationBlockService.isAttributeValidationBlockExists({ id });
    throwIfNot(isAttriValidationBLockExists, statusCodes.DUPLICATE, statusMessages.MISSING_ATTRIBUTE_VALIDATION_BLOCK);
    const data = await attributeValidationBlockService.updateAttributeValidationBlock(req.body, { id });
    return { data };
};

/**
 * Method to delete validation condition block by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteAttributeValidationBLocks = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VALIDATION_BLOCK_ID_REQUIRED);
    const data = await attributeValidationBlockService.deleteAttributeValidationBlock({ id });
    return { data };
};

/**
 * Method to get all validation condition blocks
 * @returns { object } data
 */
const getAllAttributeValidationBlocks = async (req) => {
    const { formId } = req.query;
    const condition = {};
    if (formId) condition.formId = formId;
    const [form, data] = await Promise.all([
        getFormByCondition({ id: formId }),
        attributeValidationBlockService.getAllAttrValBlocks(condition)
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
    const { validationBlockId: id, conditionsArray, formId } = req.body;
    const isBlockExists = await attributeValidationBlockService.getAllAttrValBlocksByCondition({ id });
    throwIfNot(isBlockExists, statusCodes.NOT_FOUND, statusMessages.MISSING_ATTRIBUTE_VALIDATION_BLOCK);
    const formData = await getFormByCondition({ id: formId });
    throwIfNot(formData, statusCodes.NOT_FOUND, statusMessages.FORM_NOT_EXISTS);
    throwIfNot(
        conditionsArray.filter( x => !Object.hasOwn(x, 'isActive') || x.isActive == 1).length,
        statusCodes.BAD_REQUEST,
        statusMessages.ATLEAST_ONE_VALIDATION_CONDITION_REQUIRED
    );
    await attributeValidationBlockService.updateAttributeValidationBlock(req.body, { id });
    const objectsWithId = conditionsArray.filter((obj) => obj.id);
    const objectsWithoutId = conditionsArray.filter((obj) => !obj.id && obj.isActive !== 0);
    if (objectsWithoutId && objectsWithoutId.length) {
        await createAttributeValidationConditionByBlock(objectsWithoutId, id);
    }
    if (objectsWithId && objectsWithId.length) {
        await updateExistingAttributeValidaionCondition(objectsWithId, formData?.isPublished);
    }
    return { message: statusMessages.ATTRIBUTE_VALIDATION_BLOCK_UPDATED };
};

module.exports = {
    createAttributeValidationBlocks,
    updateAttributeValidationBLocks,
    deleteAttributeValidationBLocks,
    getAllAttributeValidationBlocks,
    updateBlockAndConditions
};