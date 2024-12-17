const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateDevolutionSave = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "formId",
        statusMessage.FORM_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "customerId",
        statusMessage.CUSTOMER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "customerStoreId",
        statusMessage.CUSTOMER_STORE_NOT_FOUND
    )
];

const validateDevolutionMaterialSave = () => [
    body("devolution_materials")
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (!obj.responseId || !obj.oldSerialNo) {
                    throw new Error(
                        "Invalid data format. Each object should have 'responseId' & 'oldSerialNo'."
                    );
                }
            }
            return true;
        })
];

module.exports = {
    validateDevolutionSave,
    validateDevolutionMaterialSave
};
