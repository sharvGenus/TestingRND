const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateProjectScopeSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "formId",
        statusMessage.FORM_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "materialTypeId",
        statusMessage.MATERIAL_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "uomId",
        statusMessage.MATERIAL_UOM_NOT_FOUND
    ),
    requestValidation.validateIfFloat(
        "orderQuantity",
        statusMessage.ORDER_QUANTITY_NOT_FOUND
    )
];

const validateProjectScopeExtensionSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectScopeId",
        statusMessage.PROJECT_SCOPE_ID_NOT_FOUND
    ),
    requestValidation.validateIfFloat(
        "extensionQuantity",
        statusMessage.EXTENSION_QUANTITY_NOT_FOUND
    )
];

const validateProjectScopeSatSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectScopeId",
        statusMessage.PROJECT_SCOPE_ID_NOT_FOUND
    ),
    requestValidation.validateIfFloat(
        "satExecutionQuantity",
        statusMessage.SAT_EXECUTION_QUANTITY_NOT_FOUND
    )
];

module.exports = {
    validateProjectScopeSaveOrUpdate,
    validateProjectScopeExtensionSaveOrUpdate,
    validateProjectScopeSatSaveOrUpdate
};