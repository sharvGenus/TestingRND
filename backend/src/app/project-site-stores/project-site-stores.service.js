const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ProjectSiteStores = require("../../database/operation/project-site-stores");

const createProjectSiteStores = async (projectSiteStoresDetails) => {
    try {
        const projectSiteStores = new ProjectSiteStores();
        const data = await projectSiteStores.create(projectSiteStoresDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PROJECT_SITE_STORE_FAILURE);
    }
};
const getProjectSiteStoresByCondition = async (where) => {
    try {
        const projectSiteStores = new ProjectSiteStores();
        const data = await projectSiteStores.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SITE_STORE_FAILURE);
    }
};

const checkProjectSiteStoresDataExist = async (where) => {
    try {
        const projectSiteStores = new ProjectSiteStores();
        const count = await projectSiteStores.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SITE_STORE_FAILURE);
        
    }
};

const updateProjectSiteStores = async (projectSiteStoresDetails, where) => {
    try {
        const projectSiteStores = new ProjectSiteStores();
        const data = await projectSiteStores.update(projectSiteStoresDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_SITE_STORE_UPDATE_FAILURE);
    }
};

const getAllProjectSiteStores = async () => {
    try {
        const projectSiteStores = new ProjectSiteStores();
        const data = await projectSiteStores.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SITE_STORE_LIST_FAILURE);
    }
};

const getAllProjectSiteStoresByDropdown = async () => {
    try {
        const projectSiteStores = new ProjectSiteStores();
        const data = await projectSiteStores.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SITE_STORE_LIST_FAILURE);
    }
};

const deleteProjectSiteStores = async (where) => {
    try {
        const projectSiteStores = new ProjectSiteStores();
        const data = await projectSiteStores.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_PROJECT_SITE_STORE_FAILURE);
    }
};

module.exports = {
    getProjectSiteStoresByCondition,
    createProjectSiteStores,
    updateProjectSiteStores,
    getAllProjectSiteStores,
    deleteProjectSiteStores,
    checkProjectSiteStoresDataExist,
    getAllProjectSiteStoresByDropdown
};
