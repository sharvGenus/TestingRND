const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateWorkAreaAssignmentSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "userId",
        statusMessage.USER_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "dateFrom",
        statusMessage.DATE_FROM_IS_REQUIRED
    )
];

module.exports = {
    validateWorkAreaAssignmentSaveOrUpdate
};
