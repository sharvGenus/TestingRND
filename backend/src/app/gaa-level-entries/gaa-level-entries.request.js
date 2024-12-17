const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validategaaLevelEntrySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.GAA_LEVEL_ENTRIES_NAME_NOT_FOUND,
        statusMessage.GAA_LEVEL_ENTRIES_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.GAA_LEVEL_ENTRIES_CODE_NOT_FOUND
    )
];

module.exports = {
    validategaaLevelEntrySaveOrUpdate
};
