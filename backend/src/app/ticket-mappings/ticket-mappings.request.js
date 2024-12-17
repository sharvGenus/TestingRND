const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateProjectWiseTicketMappingSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "issueFields",
        statusMessage.ISSUE_FIELDS_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "forms",
        statusMessage.FORMS_REQUIRED
    )
];
const validateFormWiseTicketMappingSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "formId",
        statusMessage.FORM_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "formTypeId",
        statusMessage.FORM_TYPE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "searchFields",
        statusMessage.SEARCH_FIELDS_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "displayFields",
        statusMessage.DISPLAY_FIELDS_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "mobileFields",
        statusMessage.MOBILE_FIELDS_REQUIRED
    )
];

module.exports = {
    validateProjectWiseTicketMappingSaveOrUpdate,
    validateFormWiseTicketMappingSaveOrUpdate
};
