const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateLocationSiteStoresSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.LOCATION_SITE_STORE_NAME_NOT_FOUND,
        statusMessage.LOCATION_SITE_STORE_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.LOCATION_SITE_STORE_CODE_NOT_FOUND
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
    validateLocationSiteStoresSaveOrUpdate
};
