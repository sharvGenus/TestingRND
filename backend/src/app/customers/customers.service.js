const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Customer = require("../../database/operation/customers");

const customerAlreadyExists = async (where) => {
    try {
        const customers = new Customer();
        const data = await customers.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_FAILURE);
    }
};

const getCustomerByCondition = async (where) => {
    try {
        const customers = new Customer();
        const data = await customers.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_FAILURE);
    }
};

const createCustomer = async (customerDetails) => {
    try {
        const customers = new Customer();
        const data = await customers.create(customerDetails);

        return data;
    } catch (error) {
        console.log("error: ....>>>", error);
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_CUSTOMER_FAILURE);
    }
};

const updateCustomer = async (customerDetails, where) => {
    try {
        const customers = new Customer();
        const data = await customers.update(customerDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CUSTOMER_UPDATE_FAILURE);
    }
};

const getAllCustomers = async () => {
    try {
        const customers = new Customer();
        const data = await customers.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_LIST_FAILURE);
    }
};
const getAllCustomersByDropdown = async () => {
    try {
        const customers = new Customer();
        const data = await customers.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_LIST_FAILURE);
    }
};

const deleteCustomer = async (where) => {
    try {
        const customers = new Customer();
        const data = await customers.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_CUSTOMER_FAILURE);
    }
};

module.exports = {
    customerAlreadyExists,
    getCustomerByCondition,
    createCustomer,
    updateCustomer,
    getAllCustomers,
    deleteCustomer,
    getAllCustomersByDropdown
};
