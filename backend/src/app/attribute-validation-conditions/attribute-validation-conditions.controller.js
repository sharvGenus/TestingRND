const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const attributeValidationConditionsService = require("./attribute-validation-conditions.service");

/**
 * Method to create attribute validation condition 
 * @param { object } req.body
 * @returns { object } data
 */
const createAttributeValidationConditions = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_VALIDATION_CONDITION);
    const data = await attributeValidationConditionsService.createAttributeValidationCondition(req.body);
    return { data };
};

// /**
//  * Method to update attribute validation condition
//  * @param { object } req.body
//  * @returns { object } data
//  */
const updateAttributeValidationConditions = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VALIDATION_CONDITION_ID_REQUIRED);

    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_VALIDATION_CONDITION);
    const isAttriValConExist = await attributeValidationConditionsService.isAttributeValidationConditionExists({ id });
    throwIfNot(isAttriValConExist, statusCodes.DUPLICATE, statusMessages.ATTRIBUTE_VALIDATION_CONDITION_ALREADY_EXISTS);
    const data = await attributeValidationConditionsService.updateAttributeValidationCondition(req.body, { id });
    return { data };
};

// /**
//  * Method to delete attribute validation condition by id
//  * @param { object } req.body
//  * @returns { object } data
//  */
const deleteAttributeValidationConditions = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VALIDATION_CONDITION_ID_REQUIRED);
    const data = await attributeValidationConditionsService.deleteAttributeValidationCondition({ id });
    return { data };
};

/**
 * Method to get all attribute validation conditions
 * @returns { object } data
 */
const getAllAttributeValidationConditions = async () => {
    const data = await attributeValidationConditionsService.getAllAttrValConditions();
    return { data };
};

/**
 * Method to get attribute validation condition details by attibute validaion block id
 * @param { object } req.body
 * @returns { object } data
 */
const getAttributeValidationConditionByBLockId = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VISIBILITY_BLOCK_ID_REQUIRED);
    const data = await attributeValidationConditionsService.getByValidationBLockId({ validationBlockId: id });
    return { data };
};

module.exports = {
    createAttributeValidationConditions,
    updateAttributeValidationConditions,
    deleteAttributeValidationConditions,
    getAllAttributeValidationConditions,
    getAttributeValidationConditionByBLockId
};