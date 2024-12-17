const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateurbanLevelEntrySaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.URBAN_LEVEL_ENTRIES_NAME_NOT_FOUND,
        statusMessage.URBAN_LEVEL_ENTRIES_NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.URBAN_LEVEL_ENTRIES_CODE_NOT_FOUND
    )
];

module.exports = {
    validateurbanLevelEntrySaveOrUpdate
};
