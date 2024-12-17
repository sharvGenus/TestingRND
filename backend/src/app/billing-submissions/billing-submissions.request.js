const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateBillingDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_NOT_FOUND
    )
];

const validateBillingMaterialDetailsArray = () => [
    body("billing_material_details")
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (!obj.quantity || !obj.rate) {
                    throw new Error(
                        "Invalid data format. Each object should have 'Quantity', 'Rate' key."
                    );
                }
            }
            return true;
        })
];

module.exports = {
    validateBillingDetailsSave,
    validateBillingMaterialDetailsArray
};