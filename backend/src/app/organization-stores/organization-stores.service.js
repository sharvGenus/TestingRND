const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const OrganizationStores = require("../../database/operation/organization-stores");
const OrganizationStoresHistory = require("../../database/operation/organization-stores-history");

const organizationStoreAlreadyExists = async (where) => {
    try {
        const organizationStores = new OrganizationStores();
        const data = await organizationStores.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_FAILURE, error);
    }
};

const getOrganizationStoreByCondition = async (where) => {
    try {
        const organizationStores = new OrganizationStores();
        const data = await organizationStores.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_FAILURE, error);
    }
};

const createOrganizationStore = async (organizationStoreDetails) => {
    try {
        const organizationStores = new OrganizationStores();
        const data = await organizationStores.create(organizationStoreDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_ORGANIZATION_STORE_FAILURE, error);
    }
};

const updateOrganizationStore = async (organizationStoreDetails, where) => {
    try {
        const organizationStores = new OrganizationStores();
        const data = await organizationStores.update(organizationStoreDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ORGANIZATION_STORE_UPDATE_FAILURE, error);
    }
};

const getAllOrganizationStores = async (where) => {
    try {
        const organizationStores = new OrganizationStores();
        const data = await organizationStores.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LIST_FAILURE, error);
    }
};

const deleteOrganizationStore = async (where) => {
    try {
        const organizationStores = new OrganizationStores();
        const data = await organizationStores.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ORGANIZATION_STORE_FAILURE, error);
    }
};

const getOrganizationStoreHistory = async (where) => {
    try {
        const historyModelInstance = new OrganizationStoresHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ORGANIZATION_STORE_ID_REQUIRED, error);
    }
};

const getAllAccessedOrganizationStores = async (where) => {
    try {
        const organizationStores = new OrganizationStores();
        const data = await organizationStores.findAndCountAll(where, undefined, true, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LIST_FAILURE, error);
    }
};

const getOrganizationByPK = async (where) => {
    try {
        const organizationStores = new OrganizationStores();
        const data = await organizationStores.findOne(where, undefined, false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ORGANIZATION_STORE_LIST_FAILURE, error);
    }
};

module.exports = {
    organizationStoreAlreadyExists,
    getOrganizationStoreByCondition,
    createOrganizationStore,
    updateOrganizationStore,
    getAllOrganizationStores,
    deleteOrganizationStore,
    getOrganizationStoreHistory,
    getAllAccessedOrganizationStores,
    getOrganizationByPK
};
