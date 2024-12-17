const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateMasterMakerSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.MASTER_MAKER_NAME_NOT_FOUND,
        statusMessage.MASTER_MAKER_NAME_LENGTH
    )
];

module.exports = {
    validateMasterMakerSaveOrUpdate
};
