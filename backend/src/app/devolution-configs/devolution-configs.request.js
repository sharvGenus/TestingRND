const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateDevolutionConfigSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "formId",
        statusMessage.FORM_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "prefix",
        statusMessage.DEVOLUTION_PREFIX_NOT_FOUND
    ),
    requestValidation.validateIfInt(
        "index",
        statusMessage.INDEX_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "oldSerialNoId",
        statusMessage.OLD_SERIAL_NO_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "oldMakeId",
        statusMessage.OLD_MAKE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "newSerialNoId",
        statusMessage.NEW_SERIAL_NO_NOT_FOUND
    )
];

const validateDevolutionMappingSave = () => [
    body("devolution_mappings")
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (!obj.formAttributeId || !obj.newName) {
                    throw new Error(
                        "Invalid data format. Each object should have 'formAttributeId' & 'newName'."
                    );
                }
            }
            return true;
        })
];

const validateDevolutionMappingSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "devolutionConfigId",
        statusMessage.DEVOLUTION_CONFIG_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "formAttributeId",
        statusMessage.FORM_ATTRIBUTE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "newName",
        statusMessage.NEW_NAME_NOT_FOUND
    )
];

module.exports = {
    validateDevolutionConfigSaveOrUpdate,
    validateDevolutionMappingSave,
    validateDevolutionMappingSaveOrUpdate
};
