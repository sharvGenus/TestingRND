const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateCompanySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.COMPANY_NAME_NOT_FOUND,
        statusMessage.COMPANY_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.COMPANY_CODE_NOT_FOUND
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
        "registeredOfficePincode",
        statusMessage.REGISTERED_OFFICE_PINCODE_REQUIRED
    )
];

module.exports = {
    validateCompanySaveOrUpdate
};
