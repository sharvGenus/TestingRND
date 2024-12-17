const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const formAttributesService = require("./form-attributes.service");
const { getColumnPermissionsData } = require("../access-management/access-management.service");
const { getAllMastersList } = require("../all-masters-list/all-masters-list.service");
const { getFormByCondition } = require("../forms/forms.service");

/**
 * Method to create formAttributes
 * @param { object } req.body
 * @returns { object } data
 */
const createformAttributes = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FORMATTRIBUTES_DETAILS);
    const isformAttributesExists = await formAttributesService
        .formAttributeAlreadyExists({ name: req.body.name });
    throwIf(isformAttributesExists, statusCodes.DUPLICATE, statusMessages.FORMATTRIBUTES_ID_REQUIRED);
    const data = await formAttributesService.createformAttributes(req.body);
    return { data };
};

/**
 * Method to update formAttributes
 * @param { object } req.body
 * @returns { object } data
 */
const updateformAttributes = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMATTRIBUTES_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FORMATTRIBUTES_DETAILS);
    const isformAttributesExists = await formAttributesService.formAttributeAlreadyExists({ id: req.params.id });
    throwIfNot(isformAttributesExists, statusCodes.DUPLICATE, statusMessages.FORMATTRIBUTES_NOT_EXIST);
    const data = await formAttributesService.updateformAttributes(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get formAttributes details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getformAttributesDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMATTRIBUTES_ID_REQUIRED);
    const data = await formAttributesService.getformAttributesByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all states
 * @param { object } req.body
 * @returns { object } data
 */
const getAllformAttributes = async (req) => {
    const { formId } = req.query;
    const { isSuperUser, userId } = req.user;
    throwIfNot(formId, statusCodes.BAD_REQUEST, statusMessages.FORM_ID_REQUIRED);
    const condition = {};
    if (formId) condition.formId = formId;
    const isFormExists = await getFormByCondition({ id: formId });
    const getAttributesData = await formAttributesService.getAllformAttributes(condition);

    // eslint-disable-next-line max-len
    const data = getAttributesData?.rows?.length > 0 ? await formAttributesService.mapDataWithAttribute(JSON.parse(JSON.stringify(getAttributesData)).rows) : [];
    const { object, permissionsData } = getAttributesData?.rows?.length > 0 ? await getColumnPermissionsData(data, userId, formId, isSuperUser) : [];
    return { data: { rows: object, permissionsData, formsData: isFormExists } };
};

/**
 * Method to delete state by state id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteformAttributes = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORMATTRIBUTES_ID_REQUIRED);
    const data = await formAttributesService.deleteformAttributes({ id: req.params.id });
    return { data };
};
module.exports = {
    createformAttributes,
    updateformAttributes,
    getformAttributesDetails,
    getAllformAttributes,
    deleteformAttributes
};
