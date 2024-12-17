const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateOrganizationSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.FIRM_NAME_NOT_FOUND,
        statusMessage.FIRM_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.FIRM_CODE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "gstNumber",
        statusMessage.GST_NUMBER_REQUIRED
    ),
    requestValidation.validateIfEmailId("email"),
    requestValidation.validateIfEmpty(
        "mobileNumber",
        statusMessage.MOBILE_NUMBER_REQUIRED
    )
];

module.exports = {
    validateOrganizationSaveOrUpdate
};
