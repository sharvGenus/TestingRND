/* eslint-disable max-len */
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const firmLocationsServices = require("./firm-locations.service");

/**
 * Method to create FirmLocation
 * @param { object } req.body
 * @returns { object } data
 */
const createFirmLocations = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FIRM_LOCATION_DETAILS);
    const FirmLocationDetails = await firmLocationsServices.checkFirmLocationsDataExist({ code: req.body.code });
    throwIf(FirmLocationDetails, statusCodes.DUPLICATE, statusMessages.FIRM_LOCATION_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await firmLocationsServices.createFirmLocations(req.body);
    return { data };
};

/**
 * Method to update FirmLocation
 * @param { object } req.body
 * @returns { object } data
 */
const updateFirmLocations = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_LOCATION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FIRM_LOCATION_DETAILS);
    const FirmLocationDetails = await firmLocationsServices.checkFirmLocationsDataExist({ id: req.params.id });
    throwIfNot(FirmLocationDetails, statusCodes.DUPLICATE, statusMessages.FIRM_LOCATION_NOT_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await firmLocationsServices.updateFirmLocations(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get FirmLocation details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getFirmLocationsDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_LOCATION_ID_REQUIRED);
    const data = await firmLocationsServices.getFirmLocationsByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all FirmLocation
 * @param { object } req.body
 * @returns { object } data
 */
const getAllFirmLocation = async (req) => {
    const data = await firmLocationsServices.getAllFirmLocations();
    return { data };
};

/**
 * Method to get firm list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllFirmLocationsByDropdown = async (req) => {
    const data = await firmLocationsServices.getAllFirmLocationsByDropdown();
    return { data };
};

/**
 * Method to delete FirmLocation by FirmLocation id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteFirmLocations = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_LOCATION_ID_REQUIRED);
    const data = await firmLocationsServices.deleteFirmLocations({ id: req.params.id });
    return { data };
};

module.exports = {
    createFirmLocations,
    updateFirmLocations,
    getFirmLocationsDetails,
    getAllFirmLocation,
    deleteFirmLocations,
    getAllFirmLocationsByDropdown
};
