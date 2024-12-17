const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateStateSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.STATE_NAME_NOT_FOUND,
        statusMessage.STATE_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.STATE_CODE_NOT_FOUND
    )
];

module.exports = {
    validateStateSaveOrUpdate
};