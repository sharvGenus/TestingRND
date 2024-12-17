/* eslint-disable max-len */
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const locationSiteStoresService = require("./location-site-stores.service");

/**
 * Method to create LocationSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const createLocationSiteStores = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_LOCATION_SITE_STORE_DETAILS);
    const locationSiteStoresDetails = await locationSiteStoresService.checkLocationSiteStoresDataExist({ code: req.body.code });
    throwIf(locationSiteStoresDetails, statusCodes.DUPLICATE, statusMessages.LOCATION_SITE_STORE_ALREADY_EXIST);
    const data = await locationSiteStoresService.createLocationSiteStores(req.body);
    return { data };
};

/**
 * Method to update projectSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const updateLocationSiteStores = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.LOCATION_SITE_STORE_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_LOCATION_SITE_STORE_DETAILS);
    const projectSiteStoresDetails = await locationSiteStoresService.checkLocationSiteStoresDataExist({ id: req.params.id });
    throwIfNot(projectSiteStoresDetails, statusCodes.DUPLICATE, statusMessages.LOCATION_SITE_STORE_NOT_EXIST);
    const data = await locationSiteStoresService.updateLocationSiteStores(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get projectSiteStores details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getLocationSiteStoresDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.LOCATION_SITE_STORE_ID_REQUIRED);
    const data = await locationSiteStoresService.getLocationSiteStoresByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all projectSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const getAllLocationSiteStores = async (req) => {
    const data = await locationSiteStoresService.getAllLocationSiteStores();
    return { data };
};

/**
 * Method to get location site store list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllLocationSiteStoresByDropdown = async (req) => {
    const data = await locationSiteStoresService.getAllLocationSiteStoresByDropdown();
    return { data };
};

/**
 * Method to delete projectSiteStores by projectSiteStores id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteLocationSiteStores = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.LOCATION_SITE_STORE_ID_REQUIRED);
    const data = await locationSiteStoresService.deleteLocationSiteStores({ id: req.params.id });
    return { data };
};

module.exports = {
    createLocationSiteStores,
    updateLocationSiteStores,
    getLocationSiteStoresDetails,
    getAllLocationSiteStores,
    deleteLocationSiteStores,
    getAllLocationSiteStoresByDropdown
};
