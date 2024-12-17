const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateProjectMasterMakerLovsSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.PROJECT_MASTER_MAKER_LOV_NOT_FOUND,
        statusMessage.PROJECT_MASTER_MAKER_LOV_LENGTH
    )
];

module.exports = {
    validateProjectMasterMakerLovsSaveOrUpdate
};
