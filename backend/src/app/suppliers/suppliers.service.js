const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Suppliers = require("../../database/operation/suppliers");

const createSuppliers = async (suppliersDetails) => {
    try {
        const suppliers = new Suppliers();
        const data = await suppliers.create(suppliersDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_SUPPLIER_FAILURE);
    }
};
const getSuppliersByCondition = async (where) => {
    try {
        const suppliers = new Suppliers();
        const data = await suppliers.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPPLIER_FAILURE);
    }
};

const checkSuppliersDataExist = async (where) => {
    try {
        const suppliers = new Suppliers();
        const count = await suppliers.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPPLIER_FAILURE);
        
    }
};

const updateSuppliers = async (suppliersDetails, where) => {
    try {
        const suppliers = new Suppliers();
        const data = await suppliers.update(suppliersDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.SUPPLIER_UPDATE_FAILURE);
    }
};

const getAllSuppliers = async () => {
    try {
        const suppliers = new Suppliers();
        const data = await suppliers.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPPLIER_LIST_FAILURE);
    }
};

const getAllSuppliersByDropdown = async () => {
    try {
        const suppliers = new Suppliers();
        const data = await suppliers.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPPLIER_LIST_FAILURE);
    }
};

const deleteSuppliers = async (where) => {
    try {
        const suppliers = new Suppliers();
        const data = await suppliers.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_SUPPLIER_FAILURE);
    }
};

module.exports = {
    getSuppliersByCondition,
    createSuppliers,
    updateSuppliers,
    getAllSuppliers,
    deleteSuppliers,
    checkSuppliersDataExist,
    getAllSuppliersByDropdown
};
