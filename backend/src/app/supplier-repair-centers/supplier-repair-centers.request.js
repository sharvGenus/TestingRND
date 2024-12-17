const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateSupplierRepairCentersSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.SUPPLIER_REPAIR_CENTER_NAME_NOT_FOUND,
        statusMessage.SUPPLIER_REPAIR_CENTER_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.SUPPLIER_REPAIR_CENTER_CODE_NOT_FOUND
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
    validateSupplierRepairCentersSaveOrUpdate
};
