const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Approvers = require("../../database/operation/approver-master");

const approverAlreadyExists = async (where) => {
    try {
        const approvers = new Approvers();
        const data = await approvers.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_APPROVER_FAILURE, error);
    }
};

const approverExists = async (where) => {
    try {
        const approvers = new Approvers();
        const data = await approvers.findAll(where, undefined, undefined, { order: [["updatedAt", "DESC"]] });
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_APPROVER_FAILURE, error);
    }
};

const createApprover = async (approverDetails) => {
    try {
        const approvers = new Approvers();
        const data = await approvers.create(approverDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_APPROVER_FAILURE, error);
    }
};

const getAllApproversByCondition = async (where) => {
    try {
        const approvers = new Approvers();
        const data = await approvers.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_APPROVER_FAILURE, error);
    }
};

const updateApprover = async (approverDetails, where) => {
    try {
        const approvers = new Approvers();
        const data = await approvers.update(approverDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.APPROVER_UPDATE_FAILURE, error);
    }
};

const getAllApprovers = async (where) => {
    try {
        const approvers = new Approvers();
        const data = await approvers.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_APPROVER_FAILURE, error);
    }
};

const deleteApprover = async (where) => {
    try {
        const approvers = new Approvers();
        const data = await approvers.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FIRM_FAILURE, error);
    }
};

const getApproverCount = async (where) => {
    try {
        const approvers = new Approvers();
        const count = await approvers.count(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_APPROVER_FAILURE, error);
    }
};

const getTransactionTypeOfApprovers = async (where, customSort) => {
    try {
        const approvers = new Approvers();
        if (customSort && customSort === true && approvers.queryObject.order) {
            approvers.queryObject.order = [approvers.queryObject.sort];
        }
        const data = await approvers.findAll(where, ["transactionTypeId"], true, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_APPROVER_FAILURE, error);
    }
};

const getApproverByCondition = async (where) => {
    try {
        const approvers = new Approvers();
        const data = await approvers.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_APPROVER_FAILURE, error);
    }
};

module.exports = {
    approverAlreadyExists,
    approverExists,
    createApprover,
    getAllApprovers,
    getAllApproversByCondition,
    updateApprover,
    deleteApprover,
    getApproverCount,
    getTransactionTypeOfApprovers,
    getApproverByCondition
};
