const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateProjectSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.PROJECT_NAME_NOT_FOUND,
        statusMessage.PROJECT_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.COMPANY_CODE_NOT_FOUND
    )
];

module.exports = {
    validateProjectSaveOrUpdate
};
