const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateRoleSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.ROLE_NAME_NOT_FOUND,
        statusMessage.ROLE_NAME_LENGTH
    )
];

module.exports = {
    validateRoleSaveOrUpdate
};