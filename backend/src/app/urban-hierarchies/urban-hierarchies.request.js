const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateUrbanHierarchySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.URBAN_NAME_NOT_FOUND,
        statusMessage.URBAN_NAME_LENGTH
    )
];

module.exports = {
    validateUrbanHierarchySaveOrUpdate
};
