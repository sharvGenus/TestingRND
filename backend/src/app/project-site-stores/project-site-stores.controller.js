/* eslint-disable max-len */
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const projectSiteStoresService = require("./project-site-stores.service");

/**
 * Method to create projectSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const createProjectSiteStores = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_PROJECT_SITE_STORE_DETAILS);
    const projectSiteStoresDetails = await projectSiteStoresService.checkProjectSiteStoresDataExist({ code: req.body.code });
    throwIf(projectSiteStoresDetails, statusCodes.DUPLICATE, statusMessages.PROJECT_SITE_STORE_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await projectSiteStoresService.createProjectSiteStores(req.body);
    return { data };
};

/**
 * Method to update projectSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const updateProjectSiteStores = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_SITE_STORE_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_PROJECT_SITE_STORE_DETAILS);
    const projectSiteStoresDetails = await projectSiteStoresService.checkProjectSiteStoresDataExist({ id: req.params.id });
    throwIfNot(projectSiteStoresDetails, statusCodes.DUPLICATE, statusMessages.PROJECT_SITE_STORE_NOT_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await projectSiteStoresService.updateProjectSiteStores(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get projectSiteStores details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getProjectSiteStoresDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_SITE_STORE_ID_REQUIRED);
    const data = await projectSiteStoresService.getProjectSiteStoresByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all projectSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const getAllProjectSiteStores = async (req) => {
    const data = await projectSiteStoresService.getAllProjectSiteStores();
    return { data };
};

/**
 * Method to get project site store list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllProjectSiteStoresByDropdown = async (req) => {
    const data = await projectSiteStoresService.getAllProjectSiteStoresByDropdown();
    return { data };
};

/**
 * Method to delete projectSiteStores by projectSiteStores id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteProjectSiteStores = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_SITE_STORE_ID_REQUIRED);
    const data = await projectSiteStoresService.deleteProjectSiteStores({ id: req.params.id });
    return { data };
};

module.exports = {
    createProjectSiteStores,
    updateProjectSiteStores,
    getProjectSiteStoresDetails,
    getAllProjectSiteStores,
    deleteProjectSiteStores,
    getAllProjectSiteStoresByDropdown
};
