const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateQaMasterMakerLovSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "masterId",
        statusMessage.MASTER_NAME_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "majorContributor",
        statusMessage.MAJOR_CONTRIBUTOR_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.CODE_NOT_FOUND
    ),
    requestValidation.validateIfInt(
        "priority",
        statusMessage.PRIORITY_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "defect",
        statusMessage.DEFECT_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "observationTypeId",
        statusMessage.OBSERVATION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "observationSeverityId",
        statusMessage.OBSERVATION_SEVERITY_NOT_FOUND
    )
];

module.exports = {
    validateQaMasterMakerLovSaveOrUpdate
};
