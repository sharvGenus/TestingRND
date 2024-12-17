const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const LocationSiteStores = require("../../database/operation/location-site-stores");

const createLocationSiteStores = async (locationSiteStoresDetails) => {
    try {
        const locationSiteStores = new LocationSiteStores();
        const data = await locationSiteStores.create(locationSiteStoresDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_LOCATION_SITE_STORE_FAILURE);
    }
};
const getLocationSiteStoresByCondition = async (where) => {
    try {
        const locationSiteStores = new LocationSiteStores();
        const data = await locationSiteStores.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_LOCATION_SITE_STORE_FAILURE);
    }
};

const checkLocationSiteStoresDataExist = async (where) => {
    try {
        const locationSiteStores = new LocationSiteStores();
        const count = await locationSiteStores.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_LOCATION_SITE_STORE_FAILURE);
        
    }
};

const updateLocationSiteStores = async (locationSiteStoresDetails, where) => {
    try {
        const locationSiteStores = new LocationSiteStores();
        const data = await locationSiteStores.update(locationSiteStoresDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.LOCATION_SITE_STORE_UPDATE_FAILURE);
    }
};

const getAllLocationSiteStores = async () => {
    try {
        const locationSiteStores = new LocationSiteStores();
        const data = await locationSiteStores.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_LOCATION_SITE_STORE_LIST_FAILURE);
    }
};

const getAllLocationSiteStoresByDropdown = async () => {
    try {
        const locationSiteStores = new LocationSiteStores();
        const data = await locationSiteStores.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_LOCATION_SITE_STORE_LIST_FAILURE);
    }
};

const deleteLocationSiteStores = async (where) => {
    try {
        const locationSiteStores = new LocationSiteStores();
        const data = await locationSiteStores.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_LOCATION_SITE_STORE_FAILURE);
    }
};

module.exports = {
    getLocationSiteStoresByCondition,
    createLocationSiteStores,
    updateLocationSiteStores,
    getAllLocationSiteStores,
    deleteLocationSiteStores,
    checkLocationSiteStoresDataExist,
    getAllLocationSiteStoresByDropdown
};
