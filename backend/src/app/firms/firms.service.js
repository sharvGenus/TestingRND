const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Firms = require("../../database/operation/firms");

const firmAlreadyExists = async (where) => {
    try {
        const firms = new Firms();
        const data = await firms.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_FAILURE, error);
    }
};

const getFirmByCondition = async (where) => {
    try {
        const firms = new Firms();
        const data = await firms.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_FAILURE, error);
    }
};

const createFirm = async (firmDetails) => {
    try {
        const firms = new Firms();
        const data = await firms.create(firmDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_FIRM_FAILURE, error);
    }
};

const getAllFirmsByDropdown = async () => {
    try {
        const firms = new Firms();
        const data = await firms.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LIST_FAILURE, error);
    }
};

const updateFirm = async (firmDetails, where) => {
    try {
        const firms = new Firms();
        const data = await firms.update(firmDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FIRM_UPDATE_FAILURE, error);
    }
};

const getAllFirms = async () => {
    try {
        const firms = new Firms();
        const data = await firms.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LIST_FAILURE, error);
    }
};

const deleteFirm = async (where) => {
    try {
        const firms = new Firms();
        const data = await firms.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FIRM_FAILURE, error);
    }
};

module.exports = {
    firmAlreadyExists,
    getFirmByCondition,
    createFirm,
    updateFirm,
    getAllFirms,
    deleteFirm,
    getAllFirmsByDropdown
};
