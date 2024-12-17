const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateAllMastersListSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.ALL_MASTERS_NAME_NOT_FOUND,
        statusMessage.ALL_MASTERS_NAME_LENGTH
    )
];

module.exports = {
    validateAllMastersListSaveOrUpdate
};
