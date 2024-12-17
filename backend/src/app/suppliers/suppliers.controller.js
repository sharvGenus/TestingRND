/* eslint-disable max-len */
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const suppliersServices = require("./suppliers.service");

/**
 * Method to create Suppliers
 * @param { object } req.body
 * @returns { object } data
 */
const createSuppliers = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_SUPPLIER_DETAILS);
    const SuppliersDetails = await suppliersServices.checkSuppliersDataExist({ code: req.body.code });
    throwIf(SuppliersDetails, statusCodes.DUPLICATE, statusMessages.SUPPLIER_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await suppliersServices.createSuppliers(req.body);
    return { data };
};

/**
 * Method to update Suppliers
 * @param { object } req.body
 * @returns { object } data
 */
const updateSuppliers = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SUPPLIER_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_SUPPLIER_DETAILS);
    const SuppliersDetails = await suppliersServices.checkSuppliersDataExist({ id: req.params.id });
    throwIfNot(SuppliersDetails, statusCodes.DUPLICATE, statusMessages.SUPPLIER_NOT_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await suppliersServices.updateSuppliers(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get Suppliers details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getSuppliersDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SUPPLIER_ID_REQUIRED);
    const data = await suppliersServices.getSuppliersByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all Suppliers
 * @param { object } req.body
 * @returns { object } data
 */
const getAllSuppliers = async (req) => {
    const data = await suppliersServices.getAllSuppliers();
    return { data };
};

/**
 * Method to get supplier list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllSuppliersByDropdown = async (req) => {
    const data = await suppliersServices.getAllSuppliersByDropdown();
    return { data };
};

/**
 * Method to delete Suppliers by Suppliers id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteSuppliers = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SUPPLIER_ID_REQUIRED);
    const data = await suppliersServices.deleteSuppliers({ id: req.params.id });
    return { data };
};

module.exports = {
    createSuppliers,
    updateSuppliers,
    getSuppliersDetails,
    getAllSuppliers,
    deleteSuppliers,
    getAllSuppliersByDropdown
};
