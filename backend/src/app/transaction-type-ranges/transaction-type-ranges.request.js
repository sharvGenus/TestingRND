const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateTransactionTypeRangeSave = () => [
    requestValidation.validateIfEmpty(
        "organizationId",
        statusMessage.ORGANIZATION_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "storeId",
        statusMessage.STORE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "prefix",
        statusMessage.PREFIX_NOT_FOUND
    )
];

const validateTransactionTypeRangeArray = () => [
    body("ranges")
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (!obj.name) throw new Error("Name not found.");
                else if (!obj.transactionTypeIds) throw new Error("Transaction type ids not found.");
                else if (!Array.isArray(obj.transactionTypeIds)) throw new Error("Transaction type ids should be an array.");
                else if (!obj.startRange) throw new Error("Start range not found.");
                else if (!obj.endRange) throw new Error("End range not found.");
                else if (!obj.effectiveDate) throw new Error("Effective date not found.");
            }
            return true;
        })
];

const validateTransactionTypeRangeUpdate = () => [
    requestValidation.validateIfEmpty(
        "organizationId",
        statusMessage.ORGANIZATION_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "storeId",
        statusMessage.STORE_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "prefix",
        statusMessage.PREFIX_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.NAME_NOT_FOUND
    ),
    requestValidation.validateIfInt(
        "startRange",
        statusMessage.START_RANGE_NOT_FOUND
    ),
    requestValidation.validateIfInt(
        "endRange",
        statusMessage.END_RANGE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "effectiveDate",
        statusMessage.EFFECTIVE_DATE_NOT_FOUND
    )
];

const validateTransactionTypeIdsArray = () => [
    body("transactionTypeIds")
        .isArray()
        .withMessage("Transaction type ids should be an array.")
];

module.exports = {
    validateTransactionTypeRangeSave,
    validateTransactionTypeRangeArray,
    validateTransactionTypeRangeUpdate,
    validateTransactionTypeIdsArray
};
