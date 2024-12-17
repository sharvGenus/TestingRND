const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateCountrySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.COUNTRY_NAME_NOT_FOUND,
        statusMessage.COUNTRY_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.COUNTRY_CODE_NOT_FOUND
    )
];

module.exports = {
    validateCountrySaveOrUpdate
};