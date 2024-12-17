const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const PurchaseOrders = require("../../database/operation/purchase-orders");

const createPurchaseOrder = async (poDetailsArray) => {
    try {
        const purchaseOrders = new PurchaseOrders();
        const data = await purchaseOrders.bulkCreate(poDetailsArray);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PURCHASE_ORDER_FAILURE, error);
    }
};

const getAllDataByColumn = async (groupColumn, where) => {
    try {
        const purchaseOrders = new PurchaseOrders();
        const data = await purchaseOrders.groupWithCount(groupColumn, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PURCHASE_ORDER_LIST_FAILURE, error);
    }
};

const getAllPurchaseOrders = async (where) => {
    try {
        const purchaseOrders = new PurchaseOrders();
        const data = await purchaseOrders.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PURCHASE_ORDER_LIST_FAILURE, error);
    }
};

module.exports = {
    createPurchaseOrder,
    getAllDataByColumn,
    getAllPurchaseOrders
};
