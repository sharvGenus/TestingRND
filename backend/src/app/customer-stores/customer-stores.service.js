const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const CustomerStores = require("../../database/operation/customer-stores");

const createCustomerStores = async (customerStoresDetails) => {
    try {
        const customerStores = new CustomerStores();
        const data = await customerStores.create(customerStoresDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_CUSTOMER_STORE_FAILURE);
    }
};
const getCustomerStoresByCondition = async (where) => {
    try {
        const customerStores = new CustomerStores();
        const data = await customerStores.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_STORE_FAILURE);
    }
};

const checkCustomerStoresDataExist = async (where) => {
    try {
        const customerStores = new CustomerStores();
        const count = await customerStores.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_STORE_FAILURE);
        
    }
};

const updateCustomerStores = async (customerStoresDetails, where) => {
    try {
        const customerStores = new CustomerStores();
        const data = await customerStores.update(customerStoresDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CUSTOMER_STORE_UPDATE_FAILURE);
    }
};

const getAllCustomerStores = async () => {
    try {
        const customerStores = new CustomerStores();
        const data = await customerStores.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_STORE_LIST_FAILURE);
    }
};

const deleteCustomerStores = async (where) => {
    try {
        const customerStores = new CustomerStores();
        const data = await customerStores.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_CUSTOMER_STORE_FAILURE);
    }
};

module.exports = {
    getCustomerStoresByCondition,
    createCustomerStores,
    updateCustomerStores,
    getAllCustomerStores,
    deleteCustomerStores,
    checkCustomerStoresDataExist
};
