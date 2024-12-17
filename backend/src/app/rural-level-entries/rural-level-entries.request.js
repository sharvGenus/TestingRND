const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateRuralLevelEntriesSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.RURAL_LEVEL_ENTRIES_NAME_NOT_FOUND,
        statusMessage.RURAL_LEVEL_ENTRIES_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.RURAL_LEVEL_ENTRIES_CODE_NOT_FOUND
    )
];

module.exports = {
    validateRuralLevelEntriesSaveOrUpdate
};
