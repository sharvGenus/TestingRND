const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateNetworkHierarchySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.NETWORK_HIERARCHY_NAME_NOT_FOUND,
        statusMessage.NETWORK_HIERARCHY_NAME_LENGTH
    )
];

module.exports = {
    validateNetworkHierarchySaveOrUpdate
};
