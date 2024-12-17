const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateAttributeIntegrationBlocksSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.NAME_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "endpoint",
        statusMessage.ENDPOINT_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "type",
        statusMessage.TYPE_REQUIRED
    )
];

module.exports = {
    validateAttributeIntegrationBlocksSaveOrUpdate
};
