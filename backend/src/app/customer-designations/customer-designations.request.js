const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateCustomerDesignationsSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.CUSTOMER_DESIGNATION_NAME_NOT_FOUND,
        statusMessage.CUSTOMER_DESIGNATION_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.CUSTOMER_DESIGNATION_CODE_NOT_FOUND
    )
];

module.exports = {
    validateCustomerDesignationsSaveOrUpdate
};
