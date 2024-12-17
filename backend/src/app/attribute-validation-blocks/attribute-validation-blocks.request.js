const { ATTRIBUTE_VALIDATION_BLOCK_NAME_NOT_FOUND, ATTRIBUTE_VALIDATION_BLOCK_MESSAGE_NOT_FOUND, ATTRIBUTE_VALIDATION_BLOCK_NAME_LENGTH } = require("../../config/status-message");
const { validateIfEmpty } = require("../../utilities/request-validation");

const validateAttributeValidationBlockSaveOrUpdate = () => [
    validateIfEmpty(
        "name",
        ATTRIBUTE_VALIDATION_BLOCK_NAME_NOT_FOUND,
        ATTRIBUTE_VALIDATION_BLOCK_NAME_LENGTH
    ),
    validateIfEmpty(
        "message",
        ATTRIBUTE_VALIDATION_BLOCK_MESSAGE_NOT_FOUND
    )
];

module.exports = {
    validateAttributeValidationBlockSaveOrUpdate
};
