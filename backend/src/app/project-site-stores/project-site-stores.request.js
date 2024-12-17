const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateProjectSiteStoresSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.PROJECT_SITE_STORE_NAME_NOT_FOUND,
        statusMessage.PROJECT_SITE_STORE_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.PROJECT_SITE_STORE_CODE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "gstNumber",
        statusMessage.GST_NUMBER_REQUIRED
    ),
    requestValidation.validateIfEmailId("email"),
    requestValidation.validateIfEmpty(
        "mobileNumber",
        statusMessage.MOBILE_NUMBER_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "registeredOfficeAddress",
        statusMessage.REGISTERED_OFFICE_ADDRESS_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "registeredOfficePinCode",
        statusMessage.REGISTERED_OFFICE_PINCODE_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "currentOfficeAddress",
        statusMessage.CURRENT_OFFICE_ADDRESS_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "currentOfficePinCode",
        statusMessage.CURRENT_OFFICE_PINCODE_REQUIRED
    )
];

module.exports = {
    validateProjectSiteStoresSaveOrUpdate
};
