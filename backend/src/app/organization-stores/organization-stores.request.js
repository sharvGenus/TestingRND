const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateOrganizationStoreSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.ORGANIZATION_STORE_NAME_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.ORGANIZATION_STORE_CODE_NOT_FOUND
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
        "pincode",
        statusMessage.PINCODE_REQUIRED
    )
];

module.exports = {
    validateOrganizationStoreSaveOrUpdate
};
