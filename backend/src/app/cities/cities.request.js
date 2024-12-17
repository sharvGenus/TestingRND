const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateCitySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.CITY_NAME_NOT_FOUND,
        statusMessage.CITY_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.CITY_CODE_NOT_FOUND
    )
];

module.exports = {
    validateCitySaveOrUpdate
};