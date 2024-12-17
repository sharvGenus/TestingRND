const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateRequestArray = () => [
    body("payload")
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (!obj.transactionTypeId) {
                    throw new Error(
                        "Invalid data format. Each object should have 'transactionTypeId' key."
                    );
                }
            }
            return true;
        })
];

const validateApproveReject = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "requestNumber",
        statusMessage.REQUEST_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "requestName",
        statusMessage.REQUEST_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "storeId",
        statusMessage.STORE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "approverStoreId",
        statusMessage.STORE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "approverId",
        statusMessage.APPROVER_ID_REQUIRED
    ),
    requestValidation.validateIfInt(
        "rank",
        statusMessage.APPROVER_RANK_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "status",
        statusMessage.STATUS_NOT_FOUND
    )
];

const validateApprovedMaterialArray = () => [
    body("approvedMaterials")
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (
                    !obj.id
                  || !(obj.approvedQuantity >= 0)
                  || !(obj.value >= 0)
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
    validateRequestArray,
    validateApproveReject,
    validateApprovedMaterialArray
};
