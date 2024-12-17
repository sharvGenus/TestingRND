const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Project = require("../../database/operation/projects");
const ProjectsHistory = require("../../database/operation/projects-history");

const projectAlreadyExists = async (where) => {
    try {
        const projects = new Project();
        const data = await projects.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_FAILURE, error);
    }
};

const getProjectByCondition = async (where) => {
    try {
        const projects = new Project();
        const data = await projects.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_FAILURE, error);

    }
};

const createProject = async (companyDetails) => {
    try {
        const projects = new Project();
        const data = await projects.create(companyDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PROJECT_FAILURE, error);
    }
};

const updateProject = async (projectDetails, where) => {
    try {
        const projects = new Project();
        const data = await projects.update(projectDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_UPDATE_FAILURE, error);
    }
};

const getAllProjectByDropdown = async (where = {}) => {
    try {
        const projects = new Project();
        const data = await projects.findAll(where, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_LIST_FAILURE, error);
    }
};
const getProjectHistory = async (where) => {
    try {
        const historyModelInstance = new ProjectsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_ID_REQUIRED, error);
    }
};

// NOTE:- sending this raw = true while calling from access management
const getAllProjects = async (where = {}, raw = false, attributes = undefined, isRelated = true) => {
    try {
        const projects = new Project();
        const data = await projects.findAndCountAll(where, attributes, isRelated, true, undefined, raw);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_LIST_FAILURE, error);
    }
};

const deleteProject = async (where) => {
    try {
        const projects = new Project();
        const data = await projects.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_PROJECT_FAILURE, error);
    }
};

module.exports = {
    projectAlreadyExists,
    getProjectByCondition,
    createProject,
    updateProject,
    getAllProjects,
    deleteProject,
    getProjectHistory,
    getAllProjectByDropdown
};
