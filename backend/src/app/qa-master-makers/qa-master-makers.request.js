const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateQaMasterMakerSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "meterTypeId",
        statusMessage.METER_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.MASTER_NAME_NOT_FOUND
    )
];

module.exports = {
    validateQaMasterMakerSaveOrUpdate
};
