const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const OrganizationLocations = require("../../database/operation/organization-location");
const OrganizationLocationsHistory = require("../../database/operation/organization-location-history");

const createOrganizationLocations = async (organizationLocationsDetails) => {
    try {
        const organizationLocations = new OrganizationLocations();
        const data = await organizationLocations.create(organizationLocationsDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_LOCATION_FAILURE);
    }
};
const getOrganizationLocationsByCondition = async (where) => {
    try {
        const organizationLocations = new OrganizationLocations();
        const data = await organizationLocations.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_LOCATION_FAILURE);
    }
};

const checkOrganizationLocationsDataExist = async (where) => {
    try {
        const organizationLocations = new OrganizationLocations();
        const count = await organizationLocations.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_LOCATION_FAILURE);
        
    }
};

const updateOrganizationLocations = async (organizationLocationsDetails, where) => {
    try {
        const organizationLocations = new OrganizationLocations();
        const data = await organizationLocations.update(organizationLocationsDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.LOCATION_UPDATE_FAILURE);
    }
};

const getAllOrganizationLocations = async (where) => {
    try {
        const organizationLocations = new OrganizationLocations();
        const data = await organizationLocations.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_LIST_FAILURE);
    }
};

const getAllOrganizationLocationsByDropdown = async () => {
    try {
        const organizationLocations = new OrganizationLocations();
        const data = await organizationLocations.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_LIST_FAILURE);
    }
};

const deleteOrganizationLocations = async (where) => {
    try {
        const organizationLocations = new OrganizationLocations();
        const data = await organizationLocations.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ORGANIZATION_LOCATION_FAILURE);
    }
};

const getOrganizationLocationsHistory = async (where) => {
    try {
        const historyModelInstance = new OrganizationLocationsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ORGANIZATION_LOCATION_ID_REQUIRED, error);
    }
};

module.exports = {
    getOrganizationLocationsByCondition,
    createOrganizationLocations,
    updateOrganizationLocations,
    getAllOrganizationLocations,
    deleteOrganizationLocations,
    checkOrganizationLocationsDataExist,
    getAllOrganizationLocationsByDropdown,
    getOrganizationLocationsHistory
};
