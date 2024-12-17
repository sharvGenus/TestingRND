const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const GaaHierarchies = require("../../database/operation/gaa-hierarchies");
const GaaHierarchiesHistory = require("../../database/operation/gaa-hierarchies-history");

// tables of gaa and network are combined that is why changing the class instance.
const networkHierarchyAlreadyExists = async (where) => {
    try {
        const networkHierarchy = new GaaHierarchies();
        const data = await networkHierarchy.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_HIERARCHY_FAILURE, error);
    }
};

const createNetworkHierarchy = async (networkHierarchyDetails) => {
    try {
        const networkHierarchy = new GaaHierarchies();
        const data = await networkHierarchy.create(networkHierarchyDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_NETWORK_HIERARCHY_FAILURE, error);
    }
};

const updateNetworkHierarchy = async (networkHierarchyDetails, where) => {
    try {
        const networkHierarchy = new GaaHierarchies();
        const data = await networkHierarchy.update(networkHierarchyDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.NETWORK_HIERARCHY_UPDATE_FAILURE, error);
    }
};

const getNetworkHierarchyByCondition = async (where) => {
    try {
        const networkHierarchy = new GaaHierarchies();
        const data = await networkHierarchy.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_HIERARCHY_FAILURE, error);
    }
};

const getAllNetworkHierarchy = async (where = {}) => {
    try {
        const networkHierarchy = new GaaHierarchies();
        const data = await networkHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_HIERARCHY_LIST_FAILURE, error);
    }
};

const deleteNetworkHierarchy = async (where) => {
    try {
        const networkHierarchy = new GaaHierarchies();
        const data = await networkHierarchy.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_NETWORK_HIERARCHY_FAILURE, error);
    }
};

const getNetworkHierarchyHistory = async (where) => {
    try {
        const historyModelInstance = new GaaHierarchiesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.NETWORK_HIERARCHY_ID_REQUIRED, error);
    }
};

const getAllNetworkHierarchyByProjectId = async (where) => {
    try {
        const networkHierarchy = new GaaHierarchies();
        networkHierarchy.updateRelations();
        const data = await networkHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_HIERARCHY_LIST_FAILURE, error);
    }
};

module.exports = {
    networkHierarchyAlreadyExists,
    getNetworkHierarchyByCondition,
    createNetworkHierarchy,
    getNetworkHierarchyHistory,
    updateNetworkHierarchy,
    getAllNetworkHierarchy,
    deleteNetworkHierarchy,
    getAllNetworkHierarchyByProjectId
};
