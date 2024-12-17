const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateGaaHierarchySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.GAA_NAME_NOT_FOUND,
        statusMessage.GAA_NAME_LENGTH
    )
];

module.exports = {
    validateGaaHierarchySaveOrUpdate
};
