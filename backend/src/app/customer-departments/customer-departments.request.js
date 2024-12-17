const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateCustomerDepartmentsSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.CUSTOMER_DEPARTMENT_NAME_NOT_FOUND,
        statusMessage.CUSTOMER_DEPARTMENT_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.CUSTOMER_DEPARTMENT_CODE_NOT_FOUND
    )
];

module.exports = {
    validateCustomerDepartmentsSaveOrUpdate
};
