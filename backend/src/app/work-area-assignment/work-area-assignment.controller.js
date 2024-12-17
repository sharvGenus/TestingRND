const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const workAreaAssignmentService = require("./work-area-assignment.service");
const gaaHierarchyLevelService = require("../gaa-level-entries/gaa-level-entries.service");
const { getUserGovernedLovArray } = require("../access-management/access-management.service");
const { getAllFormIds } = require("../forms/forms.service");

/**
 * Method to create work area assignment
 * @param { object } req.body
 * @returns { object } data
 */
const createWorkAreaAssignment = async (req) => {
    const { gaaLevelEntryId, userId } = req.body;
    if (gaaLevelEntryId && gaaLevelEntryId.length > 0) {
        const gaaHierarchyLevelData = await gaaHierarchyLevelService.getGaaLevelEntryByCondition({
            id: gaaLevelEntryId
        });
        req.body.gaaHierarchyId = gaaHierarchyLevelData?.gaaHierarchyId || null;
    }
    const createWorkAreaAssignments = await Promise.all(userId.map(async (user) => {
        const createWorkAreaAssignment = await workAreaAssignmentService.createWorkAreaAssignment(
            { userId: user },
            { ...req.body, userId: user }
        );
        return createWorkAreaAssignment;
    }));
    return { createWorkAreaAssignments };
};

/**
 * Method to update work area assignment
 * @param { object } req.body
 * @returns { object } data
 */
const updateWorkAreaAssignment = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.WORK_AREA_ASSIGNMENT_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_WORK_AREA_ASSIGNMENT_DETAILS);
    const isWorkAreaAssigExists = await workAreaAssignmentService.isWorkAreaAssignmentExists({ id });
    throwIfNot(isWorkAreaAssigExists, statusCodes.DUPLICATE, statusMessages.WORK_AREA_ASSIGNMENT_NOT_EXIST);
    const data = await workAreaAssignmentService.updateWorkAreaAssignment(req.body, { id });
    return { data };
};

/**
 * Method to get work area assignment details by userId
 * @param { object } req.body
 * @returns { object } data
 */
const getWorkAreaAssignmentByUserId = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_ID_REQUIRED);
    const data = await workAreaAssignmentService.getWorkAreaAssignmentByUserId({ userId: id });
    return { data };
};

/**
 * Method to get all work area assignments list, if passing userId then get data for the particuler userId else get all list
 * @returns { object } data
 */
const getAllWorkAreaAssignment = async (req) => {
    const { userId } = req.query;
    const condition = {};
    if (userId) condition.userId = userId;
    const data = await workAreaAssignmentService.getWorkAreaAssignment(condition);
    return { data };
};

/**
 * Method to delete work area assignment by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteWorkAreaAssignment = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.WORK_AREA_ASSIGNMENT_ID_REQUIRED);
    const data = await workAreaAssignmentService.deleteWorkAreaAssignment({ id });
    return { data };
};

/**
 * Method to update work area assignment
 * @param { object } req.body
 * @returns { object } data
 */
const getlWorkAreaAssignmentHistory = async (req) => {
    const { recordId } = req.params;
    throwIfNot(recordId, statusCodes.BAD_REQUEST, statusMessages.WORK_AREA_ASSIGNMENT_ID_REQUIRED);
    const data = await workAreaAssignmentService.getWorkAreaAssignmentHistory({ recordId });
    return { data };
};

const getUserWorkAreaHierarchyData = async (req) => {
    const { userId } = req.query;
    const data = await workAreaAssignmentService.getWorkAreaAssignmentByUserId({ userId }, true);
    if (data) {
        const { newData } = await gaaHierarchyLevelService.getHierarchyDataForUser(data, userId);
        const projectLovData = await getUserGovernedLovArray(userId, "Project");
        const lovData = await getUserGovernedLovArray(userId, "Form Configurator");
        const formsData = await getAllFormIds({ id: lovData, projectId: projectLovData });
        const forms = formsData.length > 0 ? formsData.flatMap((x) => x?.name) : [];
        const object = { ...newData, forms };
        return { data: object };
    }
};

module.exports = {
    createWorkAreaAssignment,
    updateWorkAreaAssignment,
    deleteWorkAreaAssignment,
    getAllWorkAreaAssignment,
    getWorkAreaAssignmentByUserId,
    getlWorkAreaAssignmentHistory,
    getUserWorkAreaHierarchyData
};
