const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateMasterMakerLovsSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "masterId",
        statusMessage.MASTER_MAKER_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.MASTER_MAKER_LOV_NOT_FOUND,
        statusMessage.MASTER_MAKER_LOV_LENGTH
    )
];

module.exports = {
    validateMasterMakerLovsSaveOrUpdate
};
