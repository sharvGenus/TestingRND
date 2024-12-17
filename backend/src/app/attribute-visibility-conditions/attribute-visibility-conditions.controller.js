const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const attributeVisibilityConditionsService = require("./attribute-visibility-conditions.service");

/**
 * Method to create form
 * @param { object } req.body
 * @returns { object } data
 */
const createAttributeVisibilittyConditions = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_VISIBILITY_CONDITION);
    const data = await attributeVisibilityConditionsService.createAttributeVisibilityCondition(req.body);
    return { data };
};

// /**
//  * Method to update form
//  * @param { object } req.body
//  * @returns { object } data
//  */
const updateAttributeVisibilityConditions = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VISIBILITY_CONDITION_ID_REQUIRED);

    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ATTRIBUTE_VISIBILITY_CONDITION);
    const isAttriVisConExist = await attributeVisibilityConditionsService.isAttributeVisibilityConditionExists({ id });
    throwIfNot(isAttriVisConExist, statusCodes.DUPLICATE, statusMessages.ATTRIBUTE_VISIBILITY_CONDITION_ALREADY_EXISTS);
    const data = await attributeVisibilityConditionsService.updateAttributeVisibilityCondition(req.body, { id });
    return { data };
};

// /**
//  * Method to delete state by state id
//  * @param { object } req.body
//  * @returns { object } data
//  */
const deleteAttributeVisibiliytConditions = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VISIBILITY_CONDITION_ID_REQUIRED);
    const data = await attributeVisibilityConditionsService.deleteAttributeVisibilityCondition({ id });
    return { data };
};

/**
 * Method to get all states
 * @returns { object } data
 */
const getAllAttributeVisibilityConditions = async () => {
    const data = await attributeVisibilityConditionsService.getAllAttrVisConditions();
    return { data };
};

/**
 * Method to get attribute validation condition details by attibute validaion block id
 * @param { object } req.body
 * @returns { object } data
 */
const getAttributeVisibilityConditionByVisibilityId = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.ATTRIBUTE_VISIBILITY_CONDITION_ID_REQUIRED);
    const data = await attributeVisibilityConditionsService.getByVisibilityBLockId({ visibilityBlockId: id });
    return { data };
};

module.exports = {
    createAttributeVisibilittyConditions,
    updateAttributeVisibilityConditions,
    deleteAttributeVisibiliytConditions,
    getAllAttributeVisibilityConditions,
    getAttributeVisibilityConditionByVisibilityId
};