const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const SupervisorAssignments = require("../../database/operation/supervisor-assignments");
const SupervisorAssignmentsHistory = require("../../database/operation/supervisor-assignments-history");

const createSupervisorAssignments = async (supervisorAssignmentsDetails) => {
    try {
        const supervisorAssignments = new SupervisorAssignments();
        return Promise.all(supervisorAssignmentsDetails.map(async (x) => supervisorAssignments.createOrUpdate({ userId: x.userId }, { ...x, isActive: "1", dateTo: null })));
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_SUPERVISOR_ASSIGNMENTS_FAILURE, error);
    }
};
const getSupervisorAssignmentsByCondition = async (where) => {
    try {
        const supervisorAssignments = new SupervisorAssignments();
        const data = await supervisorAssignments.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPERVISOR_ASSIGNMENTS_FAILURE, error);
    }
};

const checkSupervisorAssignmentsDataExist = async (where) => {
    try {
        const supervisorAssignments = new SupervisorAssignments();
        const count = await supervisorAssignments.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPERVISOR_ASSIGNMENTS_FAILURE, error);

    }
};

const updateSupervisorAssignments = async (supervisorAssignmentsDetails, where) => {
    try {
        const supervisorAssignments = new SupervisorAssignments();
        const data = await supervisorAssignments.update(supervisorAssignmentsDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.SUPERVISOR_ASSIGNMENTS_UPDATE_FAILURE, error);
    }
};

const getAllSupervisorAssignments = async (where) => {
    try {
        const supervisorAssignments = new SupervisorAssignments();
        // eslint-disable-next-line max-len
        const data = await supervisorAssignments.findAndCountAll(where, undefined, true, undefined, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPERVISOR_ASSIGNMENTS_LIST_FAILURE, error);
    }
};

const getAllSupervisorAssignmentsByDropdown = async () => {
    try {
        const supervisorAssignments = new SupervisorAssignments();
        const data = await supervisorAssignments.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SUPERVISOR_ASSIGNMENTS_LIST_FAILURE, error);
    }
};
const getSupervisorAssignmentsHistory = async (where) => {
    try {
        const historyModelInstance = new SupervisorAssignmentsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.SUPERVISOR_ASSIGNMENTS_ID_REQUIRED, error);
    }
};

const deleteSupervisorAssignments = async (where) => {
    try {
        const supervisorAssignments = new SupervisorAssignments();
        const data = await supervisorAssignments.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_SUPERVISOR_ASSIGNMENTS_FAILURE, error);
    }
};

module.exports = {
    getSupervisorAssignmentsByCondition,
    createSupervisorAssignments,
    updateSupervisorAssignments,
    getAllSupervisorAssignments,
    deleteSupervisorAssignments,
    checkSupervisorAssignmentsDataExist,
    getAllSupervisorAssignmentsByDropdown,
    getSupervisorAssignmentsHistory
};
