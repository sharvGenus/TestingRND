const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateTicketSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "issueId",
        statusMessage.ISSUE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "subIssueId",
        statusMessage.SUB_ISSUE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "formId",
        statusMessage.FORM_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "responseId",
        statusMessage.RESPONSE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "assignBy",
        statusMessage.ASSIGN_BY_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "assigneeType",
        statusMessage.ASSIGNEE_TYPE_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "ticketStatus",
        statusMessage.TICKET_STATUS_REQUIRED
    )
];

const validateTicketMobileUpdate = () => [
    requestValidation.validateIfEmpty(
        "ticketStatus",
        statusMessage.TICKET_STATUS_REQUIRED
    )
];

module.exports = {
    validateTicketSaveOrUpdate,
    validateTicketMobileUpdate
};
