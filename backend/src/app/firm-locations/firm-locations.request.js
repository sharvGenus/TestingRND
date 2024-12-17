const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateFirmLocationsSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.FIRM_LOCATION_CODE_NOT_FOUND
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
        "address",
        statusMessage.ADDRESS_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "pinCode",
        statusMessage.PINCODE_REQUIRED
    )
];

module.exports = {
    validateFirmLocationsSaveOrUpdate
};
