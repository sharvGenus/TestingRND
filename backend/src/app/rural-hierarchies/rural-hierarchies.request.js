const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateRuralHierarchySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.RURAL_NAME_NOT_FOUND,
        statusMessage.RURAL_NAME_LENGTH
    )
];

module.exports = {
    validateRuralHierarchySaveOrUpdate
};
