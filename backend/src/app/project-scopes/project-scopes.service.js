const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ProjectScopes = require("../../database/operation/project-scopes");
const ProjectScopesHistory = require("../../database/operation/project-scopes-history");
const ProjectScopeExtensions = require("../../database/operation/project-scope-extensions");
const ProjectScopeExtensionsHistory = require("../../database/operation/project-scope-extensions-history");
const ProjectScopeSats = require("../../database/operation/project-scope-sats");
const ProjectScopeSatsHistory = require("../../database/operation/project-scope-sats-history");

const isProjectScopeExists = async (where) => {
    try {
        const projectScopes = new ProjectScopes();
        const data = await projectScopes.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_FAILURE, error);
    }
};

const createProjectScope = async (body) => {
    try {
        const projectScopes = new ProjectScopes();
        const data = await projectScopes.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PROJECT_SCOPE_FAILURE, error);
    }
};

const updateProjectScope = async (body, where) => {
    try {
        const projectScopes = new ProjectScopes();
        const data = await projectScopes.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_SCOPE_UPDATE_FAILURE, error);
    }
};

const getProjectScope = async (where) => {
    try {
        const projectScopes = new ProjectScopes();
        const data = await projectScopes.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_FAILURE, error);
    }
};

const getProjectScopeList = async (where) => {
    try {
        const projectScopes = new ProjectScopes();
        const data = await projectScopes.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_FAILURE, error);
    }
};

const deleteProjectScope = async (where) => {
    try {
        const projectScopes = new ProjectScopes();
        const data = await projectScopes.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_PROJECT_SCOPE_FAILURE, error);
    }
};

const getProjectScopeHistory = async (where) => {
    try {
        const projectScopesHistory = new ProjectScopesHistory();
        const data = await projectScopesHistory.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_HISTORY_FAILURE, error);
    }
};

const isProjectScopeExtensionExists = async (where) => {
    try {
        const projectScopeExtensions = new ProjectScopeExtensions();
        const data = await projectScopeExtensions.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_FAILURE, error);
    }
};

const sumProjectScopeExtension = async (column, where) => {
    try {
        const projectScopeExtensions = new ProjectScopeExtensions();
        const data = await projectScopeExtensions.sum(column, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_EXTENSION_FAILURE, error);
    }
};

const createProjectScopeExtension = async (body) => {
    try {
        const projectScopeExtensions = new ProjectScopeExtensions();
        const data = await projectScopeExtensions.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PROJECT_SCOPE_EXTENSION_FAILURE, error);
    }
};

const updateProjectScopeExtension = async (body, where) => {
    try {
        const projectScopeExtensions = new ProjectScopeExtensions();
        const data = await projectScopeExtensions.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_SCOPE_EXTENSION_UPDATE_FAILURE, error);
    }
};

const getProjectScopeExtension = async (where) => {
    try {
        const projectScopeExtensions = new ProjectScopeExtensions();
        const data = await projectScopeExtensions.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_EXTENSION_FAILURE, error);
    }
};

const getProjectScopeExtensionList = async (where) => {
    try {
        const projectScopeExtensions = new ProjectScopeExtensions();
        const data = await projectScopeExtensions.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_EXTENSION_FAILURE, error);
    }
};

const deleteProjectScopeExtension = async (where) => {
    try {
        const projectScopeExtensions = new ProjectScopeExtensions();
        const data = await projectScopeExtensions.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_PROJECT_SCOPE_EXTENSION_FAILURE, error);
    }
};

const projectScopeExtensionCount = async (where) => {
    try {
        const projectScopeExtensions = new ProjectScopeExtensions();
        const data = await projectScopeExtensions.count(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_FAILURE, error);
    }
};

const getProjectScopeExtensionHistory = async (where) => {
    try {
        const projectScopeExtensionsHistory = new ProjectScopeExtensionsHistory();
        const data = await projectScopeExtensionsHistory.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_EXTENSION_HISTORY_FAILURE, error);
    }
};

const isProjectScopeSatExists = async (where) => {
    try {
        const projectScopeSats = new ProjectScopeSats();
        const data = await projectScopeSats.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_FAILURE, error);
    }
};

const sumProjectScopeSat = async (column, where) => {
    try {
        const projectScopeSats = new ProjectScopeSats();
        const data = await projectScopeSats.sum(column, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_EXTENSION_FAILURE, error);
    }
};

const createProjectScopeSat = async (body) => {
    try {
        const projectScopeSats = new ProjectScopeSats();
        const data = await projectScopeSats.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PROJECT_SCOPE_SAT_FAILURE, error);
    }
};

const updateProjectScopeSat = async (body, where) => {
    try {
        const projectScopeSats = new ProjectScopeSats();
        const data = await projectScopeSats.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_SCOPE_SAT_UPDATE_FAILURE, error);
    }
};

const getProjectScopeSatList = async (where) => {
    try {
        const projectScopeSats = new ProjectScopeSats();
        const data = await projectScopeSats.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_SAT_FAILURE, error);
    }
};

const deleteProjectScopeSat = async (where) => {
    try {
        const projectScopeSats = new ProjectScopeSats();
        const data = await projectScopeSats.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_PROJECT_SCOPE_SAT_FAILURE, error);
    }
};

const getProjectScopeSatHistory = async (where) => {
    try {
        const projectScopeSatsHistory = new ProjectScopeSatsHistory();
        const data = await projectScopeSatsHistory.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SCOPE_SAT_HISTORY_FAILURE, error);
    }
};

module.exports = {
    isProjectScopeExists,
    createProjectScope,
    getProjectScope,
    getProjectScopeList,
    updateProjectScope,
    deleteProjectScope,
    getProjectScopeHistory,
    isProjectScopeExtensionExists,
    sumProjectScopeExtension,
    createProjectScopeExtension,
    getProjectScopeExtension,
    getProjectScopeExtensionList,
    updateProjectScopeExtension,
    deleteProjectScopeExtension,
    projectScopeExtensionCount,
    getProjectScopeExtensionHistory,
    isProjectScopeSatExists,
    sumProjectScopeSat,
    createProjectScopeSat,
    getProjectScopeSatList,
    updateProjectScopeSat,
    deleteProjectScopeSat,
    getProjectScopeSatHistory
};
