const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateSmtpConfigurationSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "server",
        statusMessage.SERVER_NOT_FOUND
    ),
    requestValidation.validateIfInt(
        "port",
        statusMessage.PORT_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "encryption",
        statusMessage.ENCRYPTION_NOT_FOUND
    ),
    requestValidation.validateIfEmailId("username"),
    requestValidation.validateIfEmpty(
        "password",
        statusMessage.PASSWORD_NOT_FOUND
    )
];

module.exports = {
    validateSmtpConfigurationSaveOrUpdate
};
