const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const UrbanHierarchies = require("../../database/operation/urban-hierarchies");
const UrbanHierarchiesHistory = require("../../database/operation/urban-hierarchies-history");

// Used to check via where condition
const urbanHierarchyAlreadyExists = async (where) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        const data = await urbanHierarchy.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_FAILURE, error);
    }
};

const getUrbanHierarchyByCondition = async (where) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        const data = await urbanHierarchy.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_FAILURE, error);
    }
};

// Used to crated | Add the new Urban Hierarchy
const createUrbanHierarchy = async (urbanHierarchyDetails) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        const data = await urbanHierarchy.create(urbanHierarchyDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_URBAN_FAILURE, error);
    }
};

// Used to update and urban Hierarchy
const updateUrbanHierarchy = async (urbanHierarchyDetails, where) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        const data = await urbanHierarchy.update(urbanHierarchyDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.URBAN_UPDATE_FAILURE, error);
    }
};

const getAllUrbanHierarchies = async (where = {}, order = undefined) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        const data = await urbanHierarchy.findAndCountAll(where, undefined, true, true, order, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LIST_FAILURE, error);
    }
};

const getUrbanHierarchyHistory = async (where) => {
    try {
        const historyModelInstance = new UrbanHierarchiesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.URBAN_ID_REQUIRED, error);
    }
};

const deleteUrbanHierarchy = async (where) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        const data = await urbanHierarchy.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_URBAN_FAILURE, error);
    }
};

const getAllUrbanHierarchiesByProjectId = async (where) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        urbanHierarchy.updateRelations();
        const data = await urbanHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LIST_FAILURE, error);
    }
};

const getAllUrbanHierarchiesByProjectIdForSearch = async (where) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        urbanHierarchy.updateRelations();
        const data = await urbanHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LIST_FAILURE, error);
    }
};

const getAreaProjectLevelByProjectId = async (projectId) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        let allUrbanHierarchies = await urbanHierarchy.findAll({ projectId }, ["id", "name", "code", "rank", "isMapped", "levelType"], true, true, undefined, false);
        allUrbanHierarchies = JSON.parse(JSON.stringify(allUrbanHierarchies));
        return [
            { urbanLevels: allUrbanHierarchies.filter(({ levelType }) => levelType === "urban") },
            { networkLevels: allUrbanHierarchies.filter(({ levelType }) => levelType === "network") }
        ];
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LIST_FAILURE, error);
    }
};

const getUrbanForAccess = async (where) => {
    try {
        const urbanHierarchy = new UrbanHierarchies();
        const data = await urbanHierarchy.findAll(where, undefined, false, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LIST_FAILURE, error);
    }
};

module.exports = {
    urbanHierarchyAlreadyExists,
    getUrbanHierarchyByCondition,
    createUrbanHierarchy,
    getUrbanHierarchyHistory,
    updateUrbanHierarchy,
    getAllUrbanHierarchies,
    deleteUrbanHierarchy,
    getAllUrbanHierarchiesByProjectId,
    getAreaProjectLevelByProjectId,
    getUrbanForAccess,
    getAllUrbanHierarchiesByProjectIdForSearch
};
