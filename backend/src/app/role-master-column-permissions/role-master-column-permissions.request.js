const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateRoleMasterColumnPermissionSaveOrUpdate = () => [
    requestValidation.validateIfBoolean(
        "view",
        statusMessage.FIELD_REQUIRED
    ),
    requestValidation.validateIfBoolean(
        "add",
        statusMessage.FIELD_REQUIRED
    ),
    requestValidation.validateIfBoolean(
        "edit",
        statusMessage.FIELD_REQUIRED
    ),
    requestValidation.validateIfBoolean(
        "delete",
        statusMessage.FIELD_REQUIRED
    )
];

module.exports = {
    validateRoleMasterColumnPermissionSaveOrUpdate
};
