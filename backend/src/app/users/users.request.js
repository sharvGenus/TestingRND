const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateUserSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.USER_NAME_NOT_FOUND,
        statusMessage.USER_NAME_LENGTH
    ),
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
    validateUserSaveOrUpdate
};
