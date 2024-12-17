const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const TransactionTypeRanges = require("../../database/operation/transaction-type-ranges");
const TransactionTypeRangesHistory = require("../../database/operation/transaction-type-ranges-history");

const isTransactionTypeRangeExists = async (where) => {
    try {
        const transactionTypeRanges = new TransactionTypeRanges();
        const data = await transactionTypeRanges.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TRANSACTION_TYPE_RANGE_FAILURE, error);
    }
};

const getTransactionTypeRangeByCondition = async (where) => {
    try {
        const transactionTypeRanges = new TransactionTypeRanges();
        const data = await transactionTypeRanges.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TRANSACTION_TYPE_RANGE_FAILURE, error);
    }
};

const createTransactionTypeRange = async (body) => {
    try {
        const transactionTypeRanges = new TransactionTypeRanges();
        const data = await transactionTypeRanges.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_TRANSACTION_TYPE_RANGE_FAILURE, error);
    }
};

const bulkCreateTransactionTypeRange = async (body) => {
    try {
        const transactionTypeRanges = new TransactionTypeRanges();
        const data = await transactionTypeRanges.bulkCreate(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_TRANSACTION_TYPE_RANGE_FAILURE, error);
    }
};

const updateTransactionTypeRange = async (body, where) => {
    try {
        const transactionTypeRanges = new TransactionTypeRanges();
        const data = await transactionTypeRanges.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.UPDATE_TRANSACTION_TYPE_RANGE_FAILURE, error);
    }
};

const getTransactionTypeRangeList = async (where = {}) => {
    try {
        const transactionTypeRanges = new TransactionTypeRanges();
        const data = await transactionTypeRanges.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TRANSACTION_TYPE_RANGE_FAILURE, error);
    }
};

const deleteTransactionTypeRange = async (where) => {
    try {
        const transactionTypeRanges = new TransactionTypeRanges();
        const data = await transactionTypeRanges.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_TRANSACTION_TYPE_RANGE_FAILURE, error);
    }
};

const getTransactionTypeRangeHistory = async (where) => {
    try {
        const transactionTypeRangesHistory = new TransactionTypeRangesHistory();
        const data = await transactionTypeRangesHistory.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TRANSACTION_TYPE_RANGE_HISTORY_FAILURE, error);
    }
};

const isRangeOverlap = async (body) => {
    function doRangesOverlap(startRange1, endRange1, startRange2, endRange2) {
        return (startRange1 <= endRange2 && endRange1 >= startRange2);
    }
    function areRangesNonOverlap(body) {
        for (let i = 0; i < body.length - 1; i++) {
            for (let j = i + 1; j < body.length; j++) {
                const obj1 = body[i];
                const obj2 = body[j];
                if (doRangesOverlap(obj1.startRange, obj1.endRange, obj2.startRange, obj2.endRange)) {
                    return true;
                }
            }
        }
        return false;
    }
    return areRangesNonOverlap(body);
};

const getTransactionTypeRangeListByCondition = async (where, attributes) => {
    try {
        const transactionTypeRanges = new TransactionTypeRanges();
        const data = await transactionTypeRanges.findAndCount(where, attributes, false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TRANSACTION_TYPE_RANGE_FAILURE, error);
    }
};

module.exports = {
    isTransactionTypeRangeExists,
    getTransactionTypeRangeByCondition,
    createTransactionTypeRange,
    updateTransactionTypeRange,
    getTransactionTypeRangeList,
    deleteTransactionTypeRange,
    getTransactionTypeRangeHistory,
    bulkCreateTransactionTypeRange,
    isRangeOverlap,
    getTransactionTypeRangeListByCondition
};