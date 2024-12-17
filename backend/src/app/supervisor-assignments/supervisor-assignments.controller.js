/* eslint-disable max-len */
const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const supervisorAssignmentsService = require("./supervisor-assignments.service");
const { updateUser } = require("../users/users.service");
const { ticketSupervisorHandler } = require("../tickets/tickets.service");
const SupervisorAssignments = require("../../database/operation/supervisor-assignments");

/**
 * Method to create SupervisorAssignments
 * @param { object } req.body
 * @returns { object } data
 */
const createSupervisorAssignments = async (req) => {
    const { userId, ...restData } = req.body.supervisorAssignmentsDetails;
    const { supervisorId } = restData;
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.SUPERVISOR_ASSIGNMENTS_DETAILS);
    const arrayOfObjects = userId.map((userId) => ({ userId, ...restData }));
    const data = await supervisorAssignmentsService.createSupervisorAssignments(arrayOfObjects);
    const updatePromises = userId.map((id) => updateUser({ supervisorId }, { id }));
    const ticketUpdatePromises = userId.map((id) => ticketSupervisorHandler(id, supervisorId))
    await Promise.all([...updatePromises, ...ticketUpdatePromises]);
    return { data };
};

/**
 * Method to update supervisorAssignments
 * @param { object } req.body
 * @returns { object } data
 */
const updateSupervisorAssignments = async (req) => {
    const { id } = req.params;
    const { supervisorId, userId } = req.body;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.SUPERVISOR_ASSIGNMENTS_ID_REQUIRED);
    const supervisorAssignmentsDetails = await supervisorAssignmentsService.getSupervisorAssignmentsByCondition({ id });
    throwIfNot(supervisorAssignmentsDetails, statusCodes.DUPLICATE, statusMessages.SUPERVISOR_ASSIGNMENTS_NOT_EXIST);
    const data = await supervisorAssignmentsService.updateSupervisorAssignments(req.body, { id: req.params.id });
    if (supervisorId && userId) {
        await updateUser({ supervisorId }, { id: userId });
    }
    if (req.body.isActive === "0" && supervisorAssignmentsDetails.userId) {
        await ticketSupervisorHandler(supervisorAssignmentsDetails.userId, null);

        const supervisorAssignment = new SupervisorAssignments();
        const supervisorActiveTeamCount = await supervisorAssignment.count({ supervisorId: supervisorAssignmentsDetails.supervisorId, isActive: '1' });
        if (!supervisorActiveTeamCount) {
            await ticketSupervisorHandler(supervisorAssignmentsDetails.supervisorId, null);
        }

        await updateUser({ supervisorId: null }, { id: supervisorAssignmentsDetails.userId });
    }
    return { data };
};

/**
 * Method to get supervisorAssignments details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getSupervisorAssignmentsDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SUPERVISOR_ASSIGNMENTS_ID_REQUIRED);
    const data = await supervisorAssignmentsService.getSupervisorAssignmentsByCondition({ id: req.params.id });
    return { data };
};

const getSupervisorAssignmentsHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.SUPERVISOR_ASSIGNMENTS_ID_REQUIRED);
    const data = await supervisorAssignmentsService.getSupervisorAssignmentsHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get all supervisorAssignments, get supervisor based on userId or supervisorId, if not providing any then get the list of data
 * @param { object } req.body
 * @returns { object } data
 */

const getAllSupervisorAssignments = async (req) => {
    const { userId, supervisorId } = req.query;
    const condition = {};
    if (userId) condition.userId = userId;
    if (supervisorId) condition.supervisorId = supervisorId;
    const data = await supervisorAssignmentsService.getAllSupervisorAssignments(condition);
    return { data };
};

/**
 * Method to get supervisor assignments list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllSupervisorAssignmentsByDropdown = async (req) => {
    const data = await supervisorAssignmentsService.getAllSupervisorAssignmentsByDropdown();
    return { data };
};

/**
 * Method to delete supervisorAssignments by supervisorAssignments id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteSupervisorAssignments = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.SUPERVISOR_ASSIGNMENTS_ID_REQUIRED);
    const getSupervisorAssignment = await supervisorAssignmentsService.getSupervisorAssignmentsByCondition({ id });
    const data = await supervisorAssignmentsService.deleteSupervisorAssignments({ id });
    await updateUser({ supervisorId: null }, { id: getSupervisorAssignment?.userId });
    return { data };
};

module.exports = {
    createSupervisorAssignments,
    updateSupervisorAssignments,
    getSupervisorAssignmentsDetails,
    getAllSupervisorAssignments,
    deleteSupervisorAssignments,
    getAllSupervisorAssignmentsByDropdown,
    getSupervisorAssignmentsHistory
};
