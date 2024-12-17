const { ATTRIBUTE_VISIBILITY_BLOCK_NAME_NOT_FOUND, ATTRIBUTE_VISIBILITY_BLOCK_NAME_LENGTH } = require("../../config/status-message");
const { validateIfEmpty } = require("../../utilities/request-validation");

const validateAttributeVisibilityBlockSaveOrUpdate = () => [
    validateIfEmpty(
        "name",
        ATTRIBUTE_VISIBILITY_BLOCK_NAME_NOT_FOUND,
        ATTRIBUTE_VISIBILITY_BLOCK_NAME_LENGTH
    )
];

module.exports = {
    validateAttributeVisibilityBlockSaveOrUpdate
};
