const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateEscalationCreateOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "emailTemplateId",
        statusMessage.TEMPLATE_ID_REQUIRED
    )
];

module.exports = {
    validateEscalationCreateOrUpdate
};
