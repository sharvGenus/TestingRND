/* eslint-disable max-len */
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const OrganizationStoreLocations = require("../../database/operation/organization-store-locations");
const OrganizationStoreLocationsHistory = require("../../database/operation/organization-store-locations-history");

const organizationStoreLocationAlreadyExists = async (where) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LOCATION_FAILURE, error);
    }
};

const getOrganizationStoreLocationByCondition = async (where) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LOCATION_FAILURE, error);
    }
};

const createOrganizationStoreLocation = async (organizationStoreLocationDetails) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.create(organizationStoreLocationDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_ORGANIZATION_STORE_LOCATION_FAILURE, error);
    }
};

const updateOrganizationStoreLocation = async (organizationStoreLocationDetails, where) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.update(organizationStoreLocationDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ORGANIZATION_STORE_LOCATION_UPDATE_FAILURE, error);
    }
};

const getAllOrganizationStoreLocations = async (where) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LOCATION_LIST_FAILURE, error);
    }
};

const deleteOrganizationStoreLocation = async (where) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ORGANIZATION_STORE_LOCATION_FAILURE, error);
    }
};

const getOrganizationStoreLocationHistory = async (where) => {
    try {
        const historyModelInstance = new OrganizationStoreLocationsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ORGANIZATION_STORE_LOCATION_ID_REQUIRED, error);
    }
};

const getAccessedOrganizationStoreLocations = async (where) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.findAndCountAll(where, undefined, true, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LOCATION_LIST_FAILURE, error);
    }
};

const getByOrganisationStoreId = async (organizationStoreId) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.findAll({ organizationStoreId }, ["id"], false, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LOCATION_LIST_FAILURE, error);
    }
};

const getOrgStoreLocationByCondition = async (where, paginated) => {
    try {
        const organizationStoreLocations = new OrganizationStoreLocations();
        const data = await organizationStoreLocations.findOne(where, undefined, true, paginated);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LOCATION_FAILURE, error);
    }
};

module.exports = {
    organizationStoreLocationAlreadyExists,
    getOrganizationStoreLocationByCondition,
    createOrganizationStoreLocation,
    updateOrganizationStoreLocation,
    getAllOrganizationStoreLocations,
    deleteOrganizationStoreLocation,
    getOrganizationStoreLocationHistory,
    getAccessedOrganizationStoreLocations,
    getByOrganisationStoreId,
    getOrgStoreLocationByCondition
};
