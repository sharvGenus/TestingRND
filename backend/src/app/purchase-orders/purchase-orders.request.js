const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validatePurchaseOrderBasicDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "poNumber",
        statusMessage.PO_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "poDate",
        statusMessage.PO_DATE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "revisionReference",
        statusMessage.REVISION_REFERENCE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "revisionDate",
        statusMessage.REVISION_DATE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "plantCode",
        statusMessage.PLANT_CODE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "organizationIntegrationId",
        statusMessage.ORGANIZATION_INTEGRATION_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "billingAddress",
        statusMessage.BILLING_ADDRESS_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "deliveryAddress",
        statusMessage.DELIVERY_ADDRESS_NOT_FOUND
    )
];

const validatePurchaseOrderArray = () => [
    body("materials")
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (
                    !obj.materialIntegrationId
                  || !obj.longDescription
                  || !(obj.quantity >= 0)
                  || !(obj.unitPrice >= 0)
                  || !(obj.priceUnit >= 1)
                  || !(obj.totalPrice >= 0)
                  || !(obj.tax >= 0)
                  || !obj.deliverySchedule
                ) {
                    throw new Error(
                        "Invalid data format."
                    );
                }
            }
            return true;
        })
];

module.exports = {
    validatePurchaseOrderBasicDetailsSave,
    validatePurchaseOrderArray
};