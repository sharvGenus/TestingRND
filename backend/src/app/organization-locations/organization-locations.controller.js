/* eslint-disable max-len */
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const organizationLocationsServices = require("./organization-locations.service");

/**
 * Method to create OrganizationLocation
 * @param { object } req.body
 * @returns { object } data
 */
const createOrganizationLocations = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_REQUIRED_DETAILS);
    const OrganizationLocationDetails = await organizationLocationsServices.checkOrganizationLocationsDataExist({ code: req.body.code });
    throwIf(OrganizationLocationDetails, statusCodes.DUPLICATE, statusMessages.LOCATION_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await organizationLocationsServices.createOrganizationLocations(req.body);
    return { data };
};

/**
 * Method to update OrganizationLocation
 * @param { object } req.body
 * @returns { object } data
 */
const updateOrganizationLocations = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.LOCATION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_REQUIRED_DETAILS);
    const OrganizationLocationDetails = await organizationLocationsServices.checkOrganizationLocationsDataExist({ id: req.params.id });
    throwIfNot(OrganizationLocationDetails, statusCodes.DUPLICATE, statusMessages.LOCATION_NOT_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await organizationLocationsServices.updateOrganizationLocations(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get OrganizationLocation details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getOrganizationLocationsDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.LOCATION_ID_REQUIRED);
    const data = await organizationLocationsServices.getOrganizationLocationsByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all OrganizationLocation
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizationLocation = async (req) => {
    const data = await organizationLocationsServices.getAllOrganizationLocations({ organizationTypeId: req.params.organizationTypeId });
    return { data };
};

/**
 * Method to get organization list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganiationLocationsByDropdown = async (req) => {
    const data = await organizationLocationsServices.getAllOrganizationLocationsByDropdown();
    return { data };
};

/**
 * Method to delete OrganizationLocation by OrganizationLocation id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteOrganizationLocations = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.LOCATION_ID_REQUIRED);
    const data = await organizationLocationsServices.deleteOrganizationLocations({ id: req.params.id });
    return { data };
};

/**
 * Method to get Organization location history
 * @param {object} req 
 * @returns { object } data
 */

const getOrganizationLocationsHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_LOCATION_ID_REQUIRED);
    const data = await organizationLocationsServices.getOrganizationLocationsHistory({ recordId: req.params.recordId });
    return { data };
};

module.exports = {
    createOrganizationLocations,
    updateOrganizationLocations,
    getOrganizationLocationsDetails,
    getAllOrganizationLocation,
    deleteOrganizationLocations,
    getAllOrganiationLocationsByDropdown,
    getOrganizationLocationsHistory
};
