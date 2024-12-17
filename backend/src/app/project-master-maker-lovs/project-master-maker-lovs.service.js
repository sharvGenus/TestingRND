const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ProjectMasterMakerLovs = require("../../database/operation/project-master-maker-lovs");
const ProjectMasterMakerLovsHistory = require("../../database/operation/project-master-maker-lovs-history");

const projectMasterMakerLovsAlreadyExists = async (where) => {
    try {
        const projectMasterMakerLovs = new ProjectMasterMakerLovs();
        const data = await projectMasterMakerLovs.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_FETCH_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const getProjectMasterMakerLovByCondition = async (where) => {
    try {
        const projectMasterMakerLovs = new ProjectMasterMakerLovs();
        const data = await projectMasterMakerLovs.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_FETCH_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const createProjectMasterMakerLovs = async (masterMakerLovDetails) => {
    try {
        const projectMasterMakerLovs = new ProjectMasterMakerLovs();
        const data = await projectMasterMakerLovs.create(masterMakerLovDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_PROJECT_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const updateProjectMasterMakerLovs = async (projectMasterMakerLovDetails, where) => {
    try {
        const projectMasterMakerLovs = new ProjectMasterMakerLovs();
        const data = await projectMasterMakerLovs.update(projectMasterMakerLovDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MASTER_MAKER_LOV_UPDATE_FAILURE, error);
    }
};

const getAllProjectMasterMakerLovs = async () => {
    try {
        const projectMasterMakerLovs = new ProjectMasterMakerLovs();
        const data = await projectMasterMakerLovs.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_MASTER_MAKER_LOV_LIST_FAILURE, error);
    }
};

const getProjectMasterMakerLovHistory = async (where) => {
    try {
        const historyModelInstance = new ProjectMasterMakerLovsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PROJECT_MASTER_MAKER_LOV_ID_REQUIRED, error);
    }
};

const deleteProjectMasterMakerLov = async (where) => {
    try {
        const projectMasterMakerLovs = new ProjectMasterMakerLovs();
        const data = await projectMasterMakerLovs.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_MASTER_MAKER_LOV_FAILURE, error);
    }
};

const getAllProjectMasterMakerLovsByMasterId = async (where) => {
    try {
        const projectMasterMakersLovs = new ProjectMasterMakerLovs();
        const data = await projectMasterMakersLovs.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_MASTER_MAKER_LOV_LIST_FAILURE, error);
    }
};

const getAllProjectMasterMakerLovsByMasterIdGetSpecificFields = async (where, fields) => {
    try {
        const projectMasterMakersLovs = new ProjectMasterMakerLovs();
        projectMasterMakersLovs.nameIdRelation();
        const data = await projectMasterMakersLovs.findAndCountAll(where, fields, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_MASTER_MAKER_LOV_LIST_FAILURE, error);
    }
};

const bulkInsertLOVs = async (lovList) => {
    try {
        const projectMasterMakerLovs = new ProjectMasterMakerLovs();
        const data = await projectMasterMakerLovs.bulkCreate(lovList);
        return data;
    } catch(error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_MASTER_MAKER_LOV_LIST_FAILURE, error);
    }
}

module.exports = {
    bulkInsertLOVs,
    projectMasterMakerLovsAlreadyExists,
    getProjectMasterMakerLovByCondition,
    createProjectMasterMakerLovs,
    updateProjectMasterMakerLovs,
    getAllProjectMasterMakerLovs,
    deleteProjectMasterMakerLov,
    getProjectMasterMakerLovHistory,
    getAllProjectMasterMakerLovsByMasterId,
    getAllProjectMasterMakerLovsByMasterIdGetSpecificFields
};
