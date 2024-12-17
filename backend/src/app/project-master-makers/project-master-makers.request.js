const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateProjectMasterMakerSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.PROJECT_MASTER_MAKER_NAME_NOT_FOUND,
        statusMessage.PROJECT_MASTER_MAKER_NAME_LENGTH
    )
];

module.exports = {
    validateProjectMasterMakerSaveOrUpdate
};
