const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateFormSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.FORM_NAME_NOT_FOUND,
        statusMessage.FORM_NAME_LENGTH
    )
];

module.exports = {
    validateFormSaveOrUpdate
};