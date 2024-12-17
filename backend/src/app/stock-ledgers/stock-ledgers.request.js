const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateStockLedgerDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    )
];

const validateStockLedgerArray = () => [
    body("stock_ledgers")
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

const validateMinTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "requestNumber",
        statusMessage.REQUEST_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromOrganizationId",
        statusMessage.FROM_ORGANIZATION_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromStoreId",
        statusMessage.FROM_STORE_ID_NOT_FOUND
    )
];

const validateCtiTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    )
];

const validateItiTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromInstallerId",
        statusMessage.FROM_INSTALLER_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "toInstallerId",
        statusMessage.TO_INSTALLER_ID_NOT_FOUND
    )
];

const validateStoTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "requestNumber",
        statusMessage.REQUEST_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromStoreId",
        statusMessage.FROM_STORE_ID_NOT_FOUND
    )
];

const validateStcTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromOrganizationId",
        statusMessage.FROM_ORGANIZATION_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromStoreId",
        statusMessage.FROM_STORE_ID_NOT_FOUND
    )
];

const validatePtpTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    )
];

const validateSltslTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    )
];

const validateMrnTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "requestNumber",
        statusMessage.REQUEST_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromOrganizationId",
        statusMessage.FROM_ORGANIZATION_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromStoreId",
        statusMessage.FROM_STORE_ID_NOT_FOUND
    )
];

const validateReturnMrnTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "requestNumber",
        statusMessage.REQUEST_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromStoreId",
        statusMessage.FROM_STORE_ID_NOT_FOUND
    )
];

const validateStsrcTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromOrganizationId",
        statusMessage.FROM_ORGANIZATION_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromStoreId",
        statusMessage.FROM_STORE_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "fromStoreLocationId",
        statusMessage.FROM_STORE_LOCATION_ID_NOT_FOUND
    )
];

const validateEWayBillUpdate = () => [
    requestValidation.validateIfEmpty(
        "eWayBillNumber",
        statusMessage.E_WAY_BILL_NUMBER_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "eWayBillDate",
        statusMessage.E_WAY_BILL_DATE_NOT_FOUND
    )
];

const validateConsumptionTransactionDetailsSave = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "requestNumber",
        statusMessage.REQUEST_NUMBER_NOT_FOUND
    )
];

module.exports = {
    validateStockLedgerDetailsSave,
    validateStockLedgerArray,
    validateMinTransactionDetailsSave,
    validateCtiTransactionDetailsSave,
    validateItiTransactionDetailsSave,
    validateStoTransactionDetailsSave,
    validateStcTransactionDetailsSave,
    validatePtpTransactionDetailsSave,
    validateSltslTransactionDetailsSave,
    validateMrnTransactionDetailsSave,
    validateReturnMrnTransactionDetailsSave,
    validateStsrcTransactionDetailsSave,
    validateEWayBillUpdate,
    validateConsumptionTransactionDetailsSave
};