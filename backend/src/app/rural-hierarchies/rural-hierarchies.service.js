const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const UrbanHierarchies = require("../../database/operation/urban-hierarchies");
const UrbanHierarchiesHistory = require("../../database/operation/urban-hierarchies-history");

// tables of urban and rural are combined that is why changing the class instance.
const ruralHierarchyAlreadyExists = async (where) => {
    try {
        const ruralHierarchy = new UrbanHierarchies();
        const data = await ruralHierarchy.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_HIERARCHY_FAILURE, error);
    }
};

const createRuralHierarchy = async (ruralHierarchyDetails) => {
    try {
        const ruralHierarchy = new UrbanHierarchies();
        const data = await ruralHierarchy.create(ruralHierarchyDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_NETWORK_HIERARCHY_FAILURE, error);
    }
};

const updateRuralHierarchy = async (ruralHierarchyDetails, where) => {
    try {
        const ruralHierarchy = new UrbanHierarchies();
        const data = await ruralHierarchy.update(ruralHierarchyDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.NETWORK_HIERARCHY_UPDATE_FAILURE, error);
    }
};

const getRuralHierarchyByCondition = async (where) => {
    try {
        const ruralHierarchy = new UrbanHierarchies();
        const data = await ruralHierarchy.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_HIERARCHY_FAILURE, error);
    }
};

const getAllRuralHierarchy = async (where = {}) => {
    try {
        const ruralHierarchy = new UrbanHierarchies();
        const data = await ruralHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_HIERARCHY_LIST_FAILURE, error);
    }
};

const deleteRuralHierarchy = async (where) => {
    try {
        const ruralHierarchy = new UrbanHierarchies();
        const data = await ruralHierarchy.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_NETWORK_HIERARCHY_FAILURE, error);
    }
};

const getRuralHierarchyHistory = async (where) => {
    try {
        const historyModelInstance = new UrbanHierarchiesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.NETWORK_HIERARCHY_ID_REQUIRED, error);
    }
};

const getAllRuralHierarchiesByProjectId = async (where) => {
    try {
        const ruralHierarchy = new UrbanHierarchies();
        const data = await ruralHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_HIERARCHY_LIST_FAILURE, error);
    }
};

const getAllRuralHierarchiesByProjectIdForSearch = async (where) => {
    try {
        const ruralHierarchy = new UrbanHierarchies();
        ruralHierarchy.updateRelations();
        const data = await ruralHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LIST_FAILURE, error);
    }
};

module.exports = {
    ruralHierarchyAlreadyExists,
    getRuralHierarchyByCondition,
    createRuralHierarchy,
    getRuralHierarchyHistory,
    updateRuralHierarchy,
    getAllRuralHierarchy,
    deleteRuralHierarchy,
    getAllRuralHierarchiesByProjectId,
    getAllRuralHierarchiesByProjectIdForSearch
};
