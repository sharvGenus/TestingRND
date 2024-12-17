const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateAttributeIntegrationPayloadSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.NAME_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "type",
        statusMessage.TYPE_REQUIRED
    )
];

module.exports = {
    validateAttributeIntegrationPayloadSaveOrUpdate
};
