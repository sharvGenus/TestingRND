const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const CustomerDesignation = require("../../database/operation/customer-designations");
const CustomerDesignationsHistory = require("../../database/operation/customer-designations-history");

const createCustomerDesignations = async (CustomerDesignationsDetails) => {
    try {
        const CustomerDesignations = new CustomerDesignation();
        const data = await CustomerDesignations.create(CustomerDesignationsDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_CUSTOMER_DESIGNATION_FAILURE, error);
    }
};
const getCustomerDesignationsByCondition = async (where) => {
    try {
        const CustomerDesignations = new CustomerDesignation();
        const data = await CustomerDesignations.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DESIGNATION_FAILURE, error);
    }
};

const getCustomerDesignationHistory = async (where) => {
    try {
        const historyModelInstance = new CustomerDesignationsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CUSTOMER_DESIGNATION_ID_REQUIRED, error);
    }
};
const getAllCustomerDesignationsByCustomerDepartmentId = async (where) => {
    try {
        const CustomerDesignations = new CustomerDesignation();
        const data = await CustomerDesignations.findAndCountAll(where, undefined, true, undefined, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DESIGNATION_LIST_FAILURE, error);
    }
};

const checkCustomerDesignationsDataExist = async (where) => {
    try {
        const CustomerDesignations = new CustomerDesignation();
        const count = await CustomerDesignations.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DESIGNATION_FAILURE, error);

    }
};

const updateCustomerDesignations = async (CustomerDesignationsDetails, where) => {
    try {
        const CustomerDesignations = new CustomerDesignation();
        const data = await CustomerDesignations.update(CustomerDesignationsDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CUSTOMER_DESIGNATION_UPDATE_FAILURE, error);
    }
};

const getAllCustomerDesignations = async () => {
    try {
        const CustomerDesignations = new CustomerDesignation();
        const data = await CustomerDesignations.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DESIGNATION_LIST_FAILURE, error);
    }
};

const deleteCustomerDesignations = async (where) => {
    try {
        const CustomerDesignations = new CustomerDesignation();
        const data = await CustomerDesignations.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_CUSTOMER_DESIGNATION_FAILURE, error);
    }
};

module.exports = {
    getCustomerDesignationsByCondition,
    createCustomerDesignations,
    updateCustomerDesignations,
    getAllCustomerDesignations,
    deleteCustomerDesignations,
    getCustomerDesignationHistory,
    checkCustomerDesignationsDataExist,
    getAllCustomerDesignationsByCustomerDepartmentId
};
