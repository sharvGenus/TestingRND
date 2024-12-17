const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateOrganizationStoreLocationSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.ORGANIZATION_STORE_LOCATION_NAME_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.ORGANIZATION_STORE_LOCATION_CODE_NOT_FOUND
    )
];

module.exports = {
    validateOrganizationStoreLocationSaveOrUpdate
};
