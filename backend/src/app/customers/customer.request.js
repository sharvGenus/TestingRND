const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateCustomerSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.CUSTOMER_NAME_NOT_FOUND,
        statusMessage.CUSTOMER_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.CUSTOMER_CODE_NOT_FOUND
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
    validateCustomerSaveOrUpdate
};
