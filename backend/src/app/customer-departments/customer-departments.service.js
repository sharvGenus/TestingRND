const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const CustomerDepartment = require("../../database/operation/customer-departments");
const CustomerDepartmentHistory = require("../../database/operation/customer-departments-history");

const createCustomerDepartments = async (CustomerDepartmentsDetails) => {
    try {
        const CustomerDepartments = new CustomerDepartment();
        const data = await CustomerDepartments.create(CustomerDepartmentsDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_CUSTOMER_DEPARTMENT_FAILURE, error);
    }
};
const getCustomerDepartmentsByCondition = async (where) => {
    try {
        const CustomerDepartments = new CustomerDepartment();
        const data = await CustomerDepartments.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DEPARTMENT_FAILURE, error);
    }
};

const checkCustomerDepartmentsDataExist = async (where) => {
    try {
        const CustomerDepartments = new CustomerDepartment();
        const count = await CustomerDepartments.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DEPARTMENT_FAILURE, error);

    }
};

const updateCustomerDepartments = async (CustomerDepartmentsDetails, where) => {
    try {
        const CustomerDepartments = new CustomerDepartment();
        const data = await CustomerDepartments.update(CustomerDepartmentsDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CUSTOMER_DEPARTMENT_UPDATE_FAILURE, error);
    }
};

const getAllCustomerDepartments = async () => {
    try {
        const CustomerDepartments = new CustomerDepartment();
        const data = await CustomerDepartments.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DEPARTMENT_LIST_FAILURE, error);
    }
};

const getAllCustomerDepartmentsByCustomerId = async (where) => {
    try {
        const CustomerDepartments = new CustomerDepartment();
        const data = await CustomerDepartments.findAndCountAll(where, undefined, true, undefined, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DEPARTMENT_LIST_FAILURE, error);
    }
};

const getCustomerDepartmentHistory = async (where) => {
    try {
        const historyModelInstance = new CustomerDepartmentHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CUSTOMER_DEPARTMENT_ID_REQUIRED, error);
    }
};

const deleteCustomerDepartments = async (where) => {
    try {
        const CustomerDepartments = new CustomerDepartment();
        const data = await CustomerDepartments.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_CUSTOMER_DEPARTMENT_FAILURE, error);
    }
};

const getAllCustomerDepartmentByDropdown = async (where) => {
    try {
        const CustomerDepartments = new CustomerDepartment();
        const data = await CustomerDepartments.findAll(where, ["name", "id"], false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CUSTOMER_DEPARTMENT_LIST_FAILURE, error);
    }
};

module.exports = {
    getCustomerDepartmentsByCondition,
    createCustomerDepartments,
    getCustomerDepartmentHistory,
    updateCustomerDepartments,
    getAllCustomerDepartments,
    deleteCustomerDepartments,
    checkCustomerDepartmentsDataExist,
    getAllCustomerDepartmentByDropdown,
    getAllCustomerDepartmentsByCustomerId
};
