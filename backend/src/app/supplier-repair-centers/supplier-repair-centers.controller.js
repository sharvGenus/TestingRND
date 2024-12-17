/* eslint-disable max-len */
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const supplierRepairCentersService = require("./supplier-repair-centers.service");

/**
 * Method to create supplierRepairCenters
 * @param { object } req.body
 * @returns { object } data
 */
const createSupplierRepairCenters = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_SUPPLIER_REPAIR_CENTER_DETAILS);
    const supplierRepairCentersDetails = await supplierRepairCentersService.checkSupplierRepairCenterDataExist({ code: req.body.code });
    throwIf(supplierRepairCentersDetails, statusCodes.DUPLICATE, statusMessages.SUPPLIER_REPAIR_CENTER_ALREADY_EXIST);
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await supplierRepairCentersService.createSupplierRepairCenter(req.body);
    return { data };
};

/**
 * Method to update supplierRepairCenters
 * @param { object } req.body
 * @returns { object } data
 */
const updateSupplierRepairCenters = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SUPPLIER_REPAIR_CENTER_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_SUPPLIER_REPAIR_CENTER_DETAILS);
    const supplierRepairCentersDetails = await supplierRepairCentersService.checkSupplierRepairCenterDataExist({ id: req.params.id });
    throwIfNot(supplierRepairCentersDetails, statusCodes.DUPLICATE, statusMessages.SUPPLIER_REPAIR_CENTER_NOT_EXIST);
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await supplierRepairCentersService.updateSupplierRepairCenter(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get supplierRepairCenters details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getSupplierRepairCentersDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SUPPLIER_REPAIR_CENTER_ID_REQUIRED);
    const data = await supplierRepairCentersService.getSupplierRepairCenterByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all supplierRepairCenters
 * @param { object } req.body
 * @returns { object } data
 */
const getAllSupplierRepairCenters = async (req) => {
    const data = await supplierRepairCentersService.getAllSupplierRepairCenter();
    return { data };
};

/**
 * Method to delete supplierRepairCenters by supplierRepairCenters id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteSupplierRepairCenters = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SUPPLIER_REPAIR_CENTER_ID_REQUIRED);
    const data = await supplierRepairCentersService.deleteSupplierRepairCenter({ id: req.params.id });
    return { data };
};

module.exports = {
    createSupplierRepairCenters,
    updateSupplierRepairCenters,
    getSupplierRepairCentersDetails,
    getAllSupplierRepairCenters,
    deleteSupplierRepairCenters
};
