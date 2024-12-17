const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateEmailTemplateSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "organizationId",
        statusMessage.ORGANIZATION_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "from",
        statusMessage.FROM_EMAIL_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "to",
        statusMessage.TO_EMAIL_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "subject",
        statusMessage.SUBJECT_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "displayName",
        statusMessage.DISPLAY_NAME_NOT_FOUND
    )
];

const validateTicketEmailTemplateSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "issueIds",
        statusMessage.TICKET_ISSUE_FIELD_MISSING
    ),
    requestValidation.validateIfEmpty(
        "subIssueIds",
        statusMessage.TICKET_SUB_ISSUE_FIELD_MISSING
    ),
    requestValidation.validateIfEmpty(
        "from",
        statusMessage.FROM_EMAIL_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "subject",
        statusMessage.SUBJECT_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "displayName",
        statusMessage.DISPLAY_NAME_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "templateName",
        statusMessage.TEMPLATE_NAME_NOT_FOUND
    )
];

module.exports = {
    validateEmailTemplateSaveOrUpdate,
    validateTicketEmailTemplateSaveOrUpdate
};
