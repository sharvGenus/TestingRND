const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateCancelGrnTransaction = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "requestNumber",
        statusMessage.REQUEST_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "storeId",
        statusMessage.STORE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "transactionCreatedAt",
        statusMessage.CREATED_AT_REQUIRED
    )
];

const validateCancelMinTransaction = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "grnTxnCreatedAt",
        statusMessage.CREATED_AT_REQUIRED
    )
];

const validateCancelLtlTransaction = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "transactionCreatedAt",
        statusMessage.CREATED_AT_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "fromStoreLocationId",
        statusMessage.FROM_STORE_LOCATION_ID_NOT_FOUND
    )
];

const validateCancelStcTransaction = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "transactionCreatedAt",
        statusMessage.CREATED_AT_REQUIRED
    )
];

const validateCancelStoTransaction = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    )
];

const validateCancelStoGrnTransaction = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "transactionCreatedAt",
        statusMessage.CREATED_AT_REQUIRED
    )
];

const validateCancelMrnTransaction = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    )
];

const validateCancelReturnMrnTransaction = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "returnMrnTxnCreatedAt",
        statusMessage.CREATED_AT_REQUIRED
    )
];

const validateStockLedgerArr = (stockLedger) => [
    body(stockLedger)
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (!obj.transactionTypeId || !obj.projectId || !obj.organizationId || !obj.storeId || !obj.materialId || obj.quantity === null || obj.rate === null || obj.value === null || obj.tax === null || obj.quantity == 0 || parseFloat(obj.quantity).toString() == "NaN" || !(obj.rate >= 0) || !(obj.value >= 0) || !(obj.tax >= 0)) {
                    throw new Error(
                        "Invalid data format."
                    );
                }
            }
            return true;
        })
];

module.exports = {
    validateCancelGrnTransaction,
    validateCancelMinTransaction,
    validateCancelLtlTransaction,
    validateCancelStcTransaction,
    validateCancelStoTransaction,
    validateCancelStoGrnTransaction,
    validateCancelMrnTransaction,
    validateCancelReturnMrnTransaction,
    validateStockLedgerArr
};