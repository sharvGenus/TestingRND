const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const FirmLocations = require("../../database/operation/firm-locations");

const createFirmLocations = async (firmLocationsDetails) => {
    try {
        const firmLocations = new FirmLocations();
        const data = await firmLocations.create(firmLocationsDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_FIRM_LOCATION_FAILURE);
    }
};
const getFirmLocationsByCondition = async (where) => {
    try {
        const firmLocations = new FirmLocations();
        const data = await firmLocations.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LOCATION_FAILURE);
    }
};

const checkFirmLocationsDataExist = async (where) => {
    try {
        const firmLocations = new FirmLocations();
        const count = await firmLocations.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LOCATION_FAILURE);
        
    }
};

const updateFirmLocations = async (firmLocationsDetails, where) => {
    try {
        const firmLocations = new FirmLocations();
        const data = await firmLocations.update(firmLocationsDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FIRM_LOCATION_UPDATE_FAILURE);
    }
};

const getAllFirmLocations = async () => {
    try {
        const firmLocations = new FirmLocations();
        const data = await firmLocations.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LOCATION_LIST_FAILURE);
    }
};

const getAllFirmLocationsByDropdown = async () => {
    try {
        const firmLocations = new FirmLocations();
        const data = await firmLocations.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LIST_FAILURE);
    }
};

const deleteFirmLocations = async (where) => {
    try {
        const firmLocations = new FirmLocations();
        const data = await firmLocations.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FIRM_LOCATION_FAILURE);
    }
};

module.exports = {
    getFirmLocationsByCondition,
    createFirmLocations,
    updateFirmLocations,
    getAllFirmLocations,
    deleteFirmLocations,
    checkFirmLocationsDataExist,
    getAllFirmLocationsByDropdown
};
