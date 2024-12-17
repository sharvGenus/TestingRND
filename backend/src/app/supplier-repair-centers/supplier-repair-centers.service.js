const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const SupplierRepairCenters = require("../../database/operation/supplier-repair-centers");

const createSupplierRepairCenter = async (supplierRepairCenterDetails) => {
    try {
        const supplierRepairCenters = new SupplierRepairCenters();
        const data = await supplierRepairCenters.create(supplierRepairCenterDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_SUPPLIER_REPAIR_CENTER_FAILURE);
    }
};
const getSupplierRepairCenterByCondition = async (where) => {
    try {
        const supplierRepairCenters = new SupplierRepairCenters();
        const data = await supplierRepairCenters.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPPLIER_REPAIR_CENTER_FAILURE);
    }
};

const checkSupplierRepairCenterDataExist = async (where) => {
    try {
        const supplierRepairCenters = new SupplierRepairCenters();
        const count = await supplierRepairCenters.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPPLIER_REPAIR_CENTER_FAILURE);

    }
};

const updateSupplierRepairCenter = async (supplierRepairCenterDetails, where) => {
    try {
        const supplierRepairCenters = new SupplierRepairCenters();
        const data = await supplierRepairCenters.update(supplierRepairCenterDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.SUPPLIER_REPAIR_CENTER_UPDATE_FAILURE);
    }
};

const getAllSupplierRepairCenter = async () => {
    try {
        const supplierRepairCenters = new SupplierRepairCenters();
        const data = await supplierRepairCenters.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPPLIER_REPAIR_CENTER_LIST_FAILURE);
    }
};

const deleteSupplierRepairCenter = async (where) => {
    try {
        const supplierRepairCenters = new SupplierRepairCenters();
        const data = await supplierRepairCenters.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_SUPPLIER_REPAIR_CENTER_FAILURE);
    }
};

module.exports = {
    getSupplierRepairCenterByCondition,
    createSupplierRepairCenter,
    updateSupplierRepairCenter,
    getAllSupplierRepairCenter,
    deleteSupplierRepairCenter,
    checkSupplierRepairCenterDataExist
};
