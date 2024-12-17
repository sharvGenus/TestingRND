const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateMaterialsSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "materialTypeId",
        statusMessage.MATERIAL_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.MATERIAL_NAME_NOT_FOUND,
        statusMessage.NAME_LENGTH
    ),
    requestValidation.validateIfEmpty(
        "code",
        statusMessage.MATERIAL_CODE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "description",
        statusMessage.MATERIAL_DESCRIPTION_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "hsnCode",
        statusMessage.MATERIAL_HSN_CODE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "uomId",
        statusMessage.MATERIAL_UOM_NOT_FOUND
    ),
    requestValidation.validateIfBoolean(
        "isSerialNumber",
        statusMessage.IS_SERIAL_NUMBER_NOT_FOUND
    )
];

module.exports = {
    validateMaterialsSaveOrUpdate
};
