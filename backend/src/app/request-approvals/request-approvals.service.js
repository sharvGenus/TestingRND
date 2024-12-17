const { Op } = require("sequelize");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const RequestApprovals = require("../../database/operation/request-approvals");
const RequestApprovers = require("../../database/operation/request-approvers");

/**
 * Method to generate reference document number
 */
const generateReferenceDocumentNumber = async (rangeData, requestName) => {
    if (
        rangeData
        && rangeData.transactionTypeIds
        && rangeData.storeId
        && rangeData.prefix
        && rangeData.startRange
        && rangeData.endRange
    ) {
        const lastTransactionData = await getRequestByCondition(
            {
                transactionTypeId: rangeData.transactionTypeIds,
                ...requestName && (requestName === "MRR" || requestName === "CONSUMPTIONREQUEST") ? { fromStoreId: rangeData.storeId } : { toStoreId: rangeData.storeId },
                referenceDocumentNumber: {
                    [Op.startsWith]: `${rangeData.prefix.replaceAll("\\", "\\\\")}`
                    // [Op.regexp]: `^${rangeData.prefix}[0-9]+`
                }
            },
            { order: [["createdAt", "DESC"]] }
        );
        if (
            lastTransactionData
            && lastTransactionData.referenceDocumentNumber
        ) {
            const referenceDocumentNumberEnd = parseInt(
                lastTransactionData.referenceDocumentNumber.replace(
                    `${rangeData.prefix}`,
                    ""
                )
            ) + 1;
            if (rangeData.startRange <= referenceDocumentNumberEnd) {
                if (referenceDocumentNumberEnd <= rangeData.endRange) {
                    const newReferenceDocumentNumber = `${rangeData.prefix}${referenceDocumentNumberEnd}`;
                    return newReferenceDocumentNumber;
                } else {
                    throwError(
                        statusCodes.INTERNAL_ERROR,
                        statusMessages.RANGE_EXCEEDED
                    );
                }
            } else {
                const referenceDocumentNumber = `${rangeData.prefix}${rangeData.startRange}`;
                return referenceDocumentNumber;
            }
        } else {
            const referenceDocumentNumber = `${rangeData.prefix}${rangeData.startRange}`;
            return referenceDocumentNumber;
        }
    } else {
        throwError(
            statusCodes.BAD_REQUEST,
            statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS
        );
    }
};

const createRequest = async (requestDetailsArray) => {
    try {
        const requestApprovals = new RequestApprovals();
        const data = await requestApprovals.bulkCreate(requestDetailsArray);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_REQUEST_FAILURE, error);
    }
};

const getRequestByCondition = async (where, paginated) => {
    try {
        const requestApprovals = new RequestApprovals();
        const data = await requestApprovals.findOne(where, undefined, true, paginated, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_REQUEST_FAILURE, error);
    }
};

const getAllRequests = async (where) => {
    try {
        const requestApprovals = new RequestApprovals();
        const data = await requestApprovals.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_REQUEST_LIST_FAILURE, error);
    }
};

/**
 * Method to update request status
 */
const updateRequestStatus = async (referenceDocumentNumber) => {
    try {
        const requestApprovals = new RequestApprovals();
        const data = await requestApprovals.update({ status: "0" }, { referenceDocumentNumber: referenceDocumentNumber, status: "1" });
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.REQUEST_STATUS_UPDATE_FAILURE, error);
    }
};

const isRequestApproverAlreadyExists = async (where) => {
    try {
        const requestApprovers = new RequestApprovers();
        const data = await requestApprovers.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_REQUEST_APPROVERS_FAILURE, error);
    }
};

const createRequestApprover = async (body) => {
    try {
        const requestApprovers = new RequestApprovers();
        const data = await requestApprovers.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_REQUEST_APPROVER_FAILURE, error);
    }
};

const updateApprovalStatus = async (transactionTypeId, requestNumber, requestName, storeId, status) => {
    try {
        const requestApprovals = new RequestApprovals();
        const data = await requestApprovals.update(
            { approvalStatus: status },
            {
                transactionTypeId,
                referenceDocumentNumber: requestNumber,
                ...requestName && (requestName === "MRR" || requestName === "CONSUMPTIONREQUEST") ? { fromStoreId: storeId } : { toStoreId: storeId },
                approvalStatus: "2"
            }
        );
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.REQUEST_APPROVAL_STATUS_UPDATE_FAILURE, error);
    }
};

const getRequestApproverByCondition = async (where, paginated) => {
    try {
        const requestApprovers = new RequestApprovers();
        const data = await requestApprovers.findOne(where, undefined, true, paginated, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_REQUEST_APPROVER_FAILURE, error);
    }
};

const updateRequestApproval = async (body, where) => {
    try {
        const requestApprovals = new RequestApprovals();
        const data = await requestApprovals.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.REQUEST_UPDATE_FAILURE);
    }
};

const updateRequestApprover = async (body, where) => {
    try {
        const requestApprovers = new RequestApprovers();
        const data = await requestApprovers.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.UPDATE_REQUEST_APPROVER_FAILURE, error);
    }
};

const getAllRequestApprovers = async (where) => {
    try {
        const requestApprovers = new RequestApprovers();
        const data = await requestApprovers.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_REQUEST_APPROVERS_FAILURE, error);
    }
};

const updateRequestProcessedStatus = async (requestName, requestTransactionTypeId, requestNumber, requestStoreId) => {
    try {
        const requestApprovals = new RequestApprovals();
        const data = await requestApprovals.update(
            { isProcessed: true },
            {
                transactionTypeId: requestTransactionTypeId,
                referenceDocumentNumber: requestNumber,
                ...requestName && (requestName === "MRR" || requestName === "CONSUMPTIONREQUEST") ? { fromStoreId: requestStoreId } : { toStoreId: requestStoreId },
                isProcessed: false
            }
        );
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.REQUEST_PROCESSED_STATUS_UPDATE_FAILURE, error);
    }
};

const isRequestApprovalAlreadyExists = async (where) => {
    try {
        const requestApprovals = new RequestApprovals();
        const data = await requestApprovals.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_REQUEST_FAILURE, error);
    }
};

module.exports = {
    generateReferenceDocumentNumber,
    createRequest,
    getRequestByCondition,
    getAllRequests,
    updateRequestStatus,
    isRequestApproverAlreadyExists,
    createRequestApprover,
    updateApprovalStatus,
    getRequestApproverByCondition,
    updateRequestApproval,
    updateRequestApprover,
    getAllRequestApprovers,
    updateRequestProcessedStatus,
    isRequestApprovalAlreadyExists
};
