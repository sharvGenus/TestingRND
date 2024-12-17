const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateUserMasterPermissionSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "userId",
        statusMessage.USER_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "masterId",
        statusMessage.MASTER_ID_IS_REQUIRED
    ),
    requestValidation.validateIfBoolean(
        "view",
        statusMessage.VIEW_PERMISSION_DETAIL_REQUIRED
    ),
    requestValidation.validateIfBoolean(
        "add",
        statusMessage.ADD_PERMISSION_DETAIL_REQUIRED
    ),
    requestValidation.validateIfBoolean(
        "edit",
        statusMessage.EDIT_PERMISSION_DETAIL_REQUIRED
    ),
    requestValidation.validateIfBoolean(
        "delete",
        statusMessage.DELETE_PERMISSION_DETAIL_REQUIRED
    )
];

module.exports = {
    validateUserMasterPermissionSaveOrUpdate
};