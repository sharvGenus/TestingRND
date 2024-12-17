const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const WorkAreaAssignmnet = require("../../database/operation/work-area-assignment");
const WorkAreaAssignmnetHistory = require("../../database/operation/work-area-assignment-history");
const GaaLevelEntries = require("../../database/operation/gaa-level-entries");
const { activeTicketsForUserCheck } = require("../tickets/tickets.service");

const isWorkAreaAssignmentExists = async (where) => {
    try {
        const workAreaAssignmnet = new WorkAreaAssignmnet();
        const data = await workAreaAssignmnet.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.MISSING_WORK_AREA_ASSIGNMENT_DETAILS,
            error
        );
    }
};

const createWorkAreaAssignment = async (where, workAreaAssignmentDetails) => {
    try {
        const workAreaAssignmnet = new WorkAreaAssignmnet();
        const notFoundResult = await workAreaAssignmnet.isNotExists(where);
        let data;
        if (notFoundResult) {
            data = await workAreaAssignmnet.create(workAreaAssignmentDetails);
        } else {
            // Check for active tickets
            const hasActiveTickets = await activeTicketsForUserCheck(where.userId);
            if (!hasActiveTickets) {
                data = await workAreaAssignmnet.update(workAreaAssignmentDetails, where);
            } else {
                throwError(statusCodes.BAD_REQUEST, statusMessages.USER_HAS_ACTIVE_TICKETS);
            }
        }
        return data;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_WORK_AREA_ASSIGNMENT_CREATE,
            error
        );
    }
};

const updateWorkAreaAssignment = async (workAreaAssignmentDetails, where) => {
    try {
        const workAreaAssignmnet = new WorkAreaAssignmnet();
        const data = await workAreaAssignmnet.update(
            workAreaAssignmentDetails,
            where
        );
        return data;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_WORK_AREA_ASSIGNMENT_UPDATE,
            error
        );
    }
};

const getWorkAreaAssignmentByUserId = async (where, raw = false) => {
    try {
        const workAreaAssignmnet = new WorkAreaAssignmnet();
        const data = await workAreaAssignmnet.findOne(where, undefined, true, undefined, raw);
        return data;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_WORK_AREA_ASSIGNMENT_FETCH,
            error
        );
    }
};

const getWorkAreaAssignment = async (where) => {
    try {
        const workAreaAssignmnet = new WorkAreaAssignmnet();
        const data = await workAreaAssignmnet.findAll(where, undefined, true, undefined, undefined, true);
        const value = await getWorkAreaAssignmentData(data);
        return { data: value, count: value?.length };
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_WORK_AREA_ASSIGNMENT_FETCH,
            error
        );
    }
};

const getWorkAreaAssignmentData = (value) => Promise.all(
    value.map(async (x) => {
        const { gaaLevelEntryId, networkLevelEntryId } = x;
        let gaa, network;
        const gaaLevelEntriesInstance = new GaaLevelEntries();
        if (gaaLevelEntryId && gaaLevelEntryId.length > 0) {
            gaa = await gaaLevelEntriesInstance.findAll(
                { id: gaaLevelEntryId },
                ["name"],
                false,
                false,
                undefined,
                true,
                undefined
            );

        }
        const gaaLevelEntryNames = gaa?.map((entry) => entry.name);
        if (networkLevelEntryId && networkLevelEntryId.length > 0) {
            network = await gaaLevelEntriesInstance.findAll(
                { id: networkLevelEntryId },
                ["name"],
                false,
                false,
                undefined,
                true,
                undefined
            );
        }
        const networkLevelEntryNames = network?.map((entry) => entry.name);
        return { ...x, gaaLevelEntryNames, networkLevelEntryNames };
    })
);

const getAllWorkAreaAssignment = async () => {
    try {
        const workAreaAssignmnet = new WorkAreaAssignmnet();
        const data = await workAreaAssignmnet.findAndCountAll(
            {},
            undefined,
            true,
            true,
            undefined
        );
        return data;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_WORK_AREA_ASSIGNMENT_FETCH,
            error
        );
    }
};

const deleteWorkAreaAssignment = async (where) => {
    try {
        // Check for active tickets
        const workAreaAssignmnet = new WorkAreaAssignmnet();
        const workAreaAssignmentData = await workAreaAssignmnet.findOne(where, ['userId']);
        const hasActiveTickets = await activeTicketsForUserCheck(workAreaAssignmentData?.userId);
        if (!hasActiveTickets) {
            const data = await workAreaAssignmnet.delete(where);
            return data;
        }
        
        throwError(statusCodes.BAD_REQUEST, statusMessages.USER_HAS_ACTIVE_TICKETS);
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_WORK_AREA_ASSIGNMENT_DELETE,
            error
        );
    }
};

const getWorkAreaAssignmentHistory = async (where) => {
    try {
        const workAreaAssignmnetHistory = new WorkAreaAssignmnetHistory();
        const data = await workAreaAssignmnetHistory.findAll(
            where,
            undefined,
            true,
            true,
            undefined,
            true
        );
        const value = await getWorkAreaAssignmentData(data);
        return { data: value, count: value?.length };
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_WORK_AREA_ASSIGNMENT_FETCH
        );
    }
};

const createArrayOfObjects = (data) => {
    const result = [];
    const { userId, gaaLevelEntryId, ...restData } = data;
    const levelEntryIdsKey = gaaLevelEntryId
        ? "gaaLevelEntryId"
        : "networkLevelEntryId";
    const levelEntryIds = data[levelEntryIdsKey];

    if (userId && levelEntryIds) {
        userId?.forEach((userId) => {
            levelEntryIds?.forEach((levelEntryId) => {
                const obj = {
                    userId,
                    ...restData
                };
                obj[levelEntryIdsKey] = levelEntryId;
                result.push(obj);
            });
        });
    }
    return result;
};

module.exports = {
    isWorkAreaAssignmentExists,
    createWorkAreaAssignment,
    updateWorkAreaAssignment,
    getWorkAreaAssignmentByUserId,
    getAllWorkAreaAssignment,
    deleteWorkAreaAssignment,
    getWorkAreaAssignmentHistory,
    createArrayOfObjects,
    getWorkAreaAssignment
};
