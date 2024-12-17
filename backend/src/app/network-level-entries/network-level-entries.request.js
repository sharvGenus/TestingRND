const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateNetworkLevelEntriesSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.NETWORK_LEVEL_ENTRIES_NAME_NOT_FOUND,
        statusMessage.NETWORK_LEVEL_ENTRIES_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.NETWORK_LEVEL_ENTRIES_CODE_NOT_FOUND
    )
];

module.exports = {
    validateNetworkLevelEntriesSaveOrUpdate
};
