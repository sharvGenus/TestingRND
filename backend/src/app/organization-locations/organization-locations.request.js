const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateOrganizationLocationsSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.LOCATION_CODE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "gstNumber",
        statusMessage.GST_NUMBER_REQUIRED
    ),
    requestValidation.validateIfEmailFormat("email"),
    requestValidation.validateIfEmpty(
        "mobileNumber",
        statusMessage.MOBILE_NUMBER_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "address",
        statusMessage.ADDRESS_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "pinCode",
        statusMessage.PINCODE_REQUIRED
    )
];

module.exports = {
    validateOrganizationLocationsSaveOrUpdate
};
