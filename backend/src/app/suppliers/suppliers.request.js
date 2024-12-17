const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateSuppliersSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.SUPPLIER_NAME_NOT_FOUND,
        statusMessage.SUPPLIER_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.SUPPLIER_CODE_NOT_FOUND
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
    validateSuppliersSaveOrUpdate
};
