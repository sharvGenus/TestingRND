const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const StockLedgers = require("../../database/operation/stock-ledgers");

const transactionAlreadyExists = async (where) => {
    try {
        const stockLedgers = new StockLedgers();
        const data = await stockLedgers.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_FAILURE, error);
    }
};

module.exports = {
    transactionAlreadyExists
};
