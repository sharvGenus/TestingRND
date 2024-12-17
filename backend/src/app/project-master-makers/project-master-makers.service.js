const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ProjectMasterMakers = require("../../database/operation/project-master-makers");
const ProjectMasterMakersHistory = require("../../database/operation/project-master-makers-history");

const projectMasterMakerAlreadyExists = async (where) => {
    try {
        const projectMasterMakers = new ProjectMasterMakers();
        const data = await projectMasterMakers.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_MASTER_MAKER_FAILURE, error);
    }
};

const getProjectMasterMakerByCondition = async (where) => {
    try {
        const projectMasterMakers = new ProjectMasterMakers();
        const data = await projectMasterMakers.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_MASTER_MAKER_FAILURE, error);
    }
};

const createProjectMasterMaker = async (projectMasterMakersDetails) => {
    try {
        const projectMasterMakers = new ProjectMasterMakers();
        const data = await projectMasterMakers.create(projectMasterMakersDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PROJECT_MASTER_MAKER_FAILURE, error);
    }
};

const updateProjectMasterMaker = async (projectMasterMakerDetails, where) => {
    try {
        const projectMasterMakers = new ProjectMasterMakers();
        const data = await projectMasterMakers.update(projectMasterMakerDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_MASTER_MAKER_UPDATE_FAILURE, error);
    }
};

const getAllProjectMasterMakers = async () => {
    try {
        const projectMasterMakers = new ProjectMasterMakers();
        const data = await projectMasterMakers.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_FETCH_MASTER_MAKER_LIST_FAILURE, error);
    }
};

const getProjectMasterMakerHistory = async (where) => {
    try {
        const historyModelInstance = new ProjectMasterMakersHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_MASTER_MAKER_ID_REQUIRED, error);
    }
};

const getAllProjectMasterMakersByProjectId = async (where) => {
    try {
        const projectMasterMakers = new ProjectMasterMakers();
        const data = await projectMasterMakers.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_FETCH_MASTER_MAKER_LIST_FAILURE, error);
    }
};

const deleteProjectMasterMaker = async (where) => {
    try {
        const projectMasterMakers = new ProjectMasterMakers();
        const data = await projectMasterMakers.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_MASTER_MAKER_FAILURE, error);
    }
};

module.exports = {
    projectMasterMakerAlreadyExists,
    getProjectMasterMakerByCondition,
    createProjectMasterMaker,
    updateProjectMasterMaker,
    getAllProjectMasterMakers,
    deleteProjectMasterMaker,
    getProjectMasterMakerHistory,
    getAllProjectMasterMakersByProjectId
};
