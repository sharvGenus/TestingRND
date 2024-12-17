const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIfNot, throwIf, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const requestApprovalService = require("./request-approvals.service");
// const cancelTransactionService = require("../cancel-transactions/cancel-transactions.service");
const approverService = require("../approvers-master/approvers-master.service");
const smtpConfigurationService = require("../smtp-configurations/smtp-configurations.service");
const transactionTypeRangeService = require("../transaction-type-ranges/transaction-type-ranges.service");
const { getUserGovernedLovArray } = require("../access-management/access-management.service");
const { getTransactionTypeOfApprovers } = require("../approvers-master/approvers-master.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "request_approvals.reference_document_number": "referenceDocumentNumber",
    "project.name": "project.name",
    "from_store.organization.name": "from_store.organization.name",
    "from_store.name": "from_store.name",
    "to_store.organization.name": "to_store.organization.name",
    "contractor_employee.name": "contractor_employee.name",
    "request_approvals.po_number": "poNumber",
    "request_approvals.remarks": "remarks",
    "request_approvals.vehicle_number": "vehicleNumber",
    "to_store.name": "to_store.name"
};

/**
 * Method to create request
 * @param { object } req.body
 * @returns { object } data
 */
const createRequest = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_REQUEST_DETAILS);
    throwIfNot(req.body.payload, statusCodes.BAD_REQUEST, statusMessages.MISSING_REQUEST_DETAILS);
    throwIfNot(
        req.body.payload[0].transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.payload[0].requestName,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.payload[0].requestOrganizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.payload[0].requestStoreId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    throwIfNot(
        req.body.payload[0].approverStoreId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.payload[0].requestOrganizationId,
        storeId: req.body.payload[0].requestStoreId,
        transactionTypeIds: { [Op.contains]: [req.body.payload[0].transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    const referenceDocumentNumber = await requestApprovalService.generateReferenceDocumentNumber(rangeData, req.body.payload[0].requestName);
    req.body.payload.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const isApproverExists = await approverService.approverAlreadyExists({
        projectId: req.body.payload[0].projectId,
        transactionTypeId: req.body.payload[0].transactionTypeId,
        storeId: req.body.payload[0].approverStoreId,
        isActive: "1"
    });
    if (!isApproverExists) {
        req.body.payload.forEach((object) => {
            object.approvedQuantity = object.requestedQuantity;
            object.approvalStatus = "1";
        });
    }

    const data = await requestApprovalService.createRequest(req.body.payload);

    const createApproverEmailData = async (id) => {
        const requestData = await requestApprovalService.getRequestByCondition({ id }, undefined);
        return {
            referenceDocumentNumber: requestData?.referenceDocumentNumber,
            requestNumber: requestData?.referenceDocumentNumber,
            email: requestData?.contractor_employee?.email,
            name: requestData?.contractor_employee?.name
        };
    };

    if (
        data
        && data.length > 0
        && data[0]
        && data[0].transactionTypeId
        && data[0].toProjectId
    ) {
        await smtpConfigurationService.sendEmail(
            data[0].transactionTypeId,
            data[0].toProjectId,
            data[0],
            false
        );
        if (isApproverExists) {
            const getApproverData = await approverService.getApproverByCondition({
                projectId: req.body.payload[0].projectId,
                transactionTypeId: req.body.payload[0].transactionTypeId,
                storeId: req.body.payload[0].approverStoreId,
                rank: "1",
                isActive: "1"
            });
            if (getApproverData?.email) {
                const dataForEmail = await createApproverEmailData(data[0]?.id);
                await smtpConfigurationService.sendEmail(
                    data[0].transactionTypeId,
                    data[0].toProjectId,
                    dataForEmail,
                    true,
                    [],
                    getApproverData.email
                );
            }
        }
    } else if (
        data
        && data.length > 0
        && data[0]
        && data[0].transactionTypeId
        && data[0].projectId
    ) {
        await smtpConfigurationService.sendEmail(
            data[0].transactionTypeId,
            data[0].projectId,
            data[0],
            false
        );
        if (isApproverExists) {
            const getApproverData = await approverService.getApproverByCondition({
                projectId: req.body.payload[0].projectId,
                transactionTypeId: req.body.payload[0].transactionTypeId,
                storeId: req.body.payload[0].approverStoreId,
                rank: "1",
                isActive: "1"
            });
            if (getApproverData?.email) {
                const dataForEmail = await createApproverEmailData(data[0]?.id);
                await smtpConfigurationService.sendEmail(
                    data[0].transactionTypeId,
                    data[0].projectId,
                    dataForEmail,
                    true,
                    [],
                    getApproverData.email
                );
            }
        }
    }
    return { data };
};

/**
 * Method to get request details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getRequestDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.REQUEST_ID_REQUIRED);
    const data = await requestApprovalService.getRequestByCondition({ id: req.params.id }, undefined);
    return { data };
};

/**
 * Method to get all requests
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRequests = async (req) => {
    const { searchString, accessors } = req.query;
    const where = { [Op.and]: [] };
    const referrer = req.headers.referer || req.headers.referrer;
    const referrerURL = new URL(referrer);
    const referrerPath = referrerURL.pathname;
    const referrerPathWithoutHost = referrerPath.replace(referrerURL.origin, "");

    if (searchString && searchString.length > 0) {
        const accessorArray = accessors ? JSON.parse(accessors) : [];
        const keysInArray = getMappingKeysInArray(accessorArray, mapping);
        const castingConditions = [];
        keysInArray.forEach((column) => {
            castingConditions.push([
                sequelize.where(
                    sequelize.cast(sequelize.col(column), "varchar"),
                    { [Op.iLike]: `%${searchString}%` }
                )
            ]);
        });

        // Create an OR condition for all columns
        const orConditions = { [Op.or]: castingConditions };
        where[Op.and].push(orConditions);
    }

    if (req.query && req.query.transactionTypeId) {
        // where.transactionTypeId = req.query.transactionTypeId;
        where[Op.and].push({ transactionTypeId: req.query.transactionTypeId });
        const lovData = await getUserGovernedLovArray(req.user.userId, "Project");
        if (referrerPathWithoutHost !== "/consumption" && referrerPathWithoutHost !== "/project-to-project" && referrerPathWithoutHost !== "/store-to-store" && referrerPathWithoutHost !== "/sto" && referrerPathWithoutHost !== "/min" && referrerPathWithoutHost !== "/mrn" && !referrerPathWithoutHost.includes("/cancel") && Array.isArray(lovData)) {
            // where = {
            //     transactionTypeId: req.query.transactionTypeId,
            //     projectId: lovData
            // };
    
            let toStoreLovData, fromStoreLovData;
            if (req.query.transactionTypeId === "bb4eb2d6-4a64-4456-bcbf-4bee0561086a") { // MRF
                toStoreLovData = await getUserGovernedLovArray(req.user.userId, "Contractor Store");
            } else if (req.query.transactionTypeId === "b938c0b7-8ee0-491e-af4b-ae7f3cbd9821") { // MRR
                fromStoreLovData = await getUserGovernedLovArray(req.user.userId, "Contractor Store");
            } else if (req.query.transactionTypeId === "ba23b5a7-2ed1-44f6-a673-c924cae9ba8a") { // STR
                toStoreLovData = await getUserGovernedLovArray(req.user.userId, "Company Store");
            } else if (req.query.transactionTypeId === "671306a0-48c5-4e0c-a604-d86624f35d6d") { // CONSUMPTIONREQUEST
                const companyStoreLovData = await getUserGovernedLovArray(req.user.userId, "Company Store");
                const contractorStoreLovData = await getUserGovernedLovArray(req.user.userId, "Contractor Store");
                fromStoreLovData = [...contractorStoreLovData, ...companyStoreLovData];
            }
    
            where[Op.and].push({
                transactionTypeId: req.query.transactionTypeId,
                projectId: lovData,
                ...toStoreLovData && { toStoreId: toStoreLovData },
                ...fromStoreLovData && { fromStoreId: fromStoreLovData }
            });
        }
    }
    if (req.query && req.query.referenceDocumentNumber) {
        // where.referenceDocumentNumber = req.query.referenceDocumentNumber;
        where[Op.and].push({ referenceDocumentNumber: req.query.referenceDocumentNumber });
    }
    if (req.query && req.query.projectId) {
        // where.projectId = req.query.projectId;
        where[Op.and].push({ projectId: req.query.projectId });
        const data = await getTransactionTypeOfApprovers({ userId: req.user.userId }, true);
        const array = data.flatMap((x) => x.transactionTypeId);
        const { isSuperUser } = req.user;
        if (referrerPathWithoutHost !== "/consumption" && referrerPathWithoutHost !== "/project-to-project" && referrerPathWithoutHost !== "/store-to-store" && referrerPathWithoutHost !== "/sto" && referrerPathWithoutHost !== "/min" && referrerPathWithoutHost !== "/mrn" && !referrerPathWithoutHost.includes("/cancel") && !isSuperUser && Array.isArray(array)) {
            // where = {
            //     projectId: req.query.projectId,
            //     transactionTypeId: array
            // };
            where[Op.and].push({
                projectId: req.query.projectId,
                transactionTypeId: array
            });
        }
    }
    if (req.query && req.query.fromStoreId) {
        // where.fromStoreId = req.query.fromStoreId;
        where[Op.and].push({ fromStoreId: req.query.fromStoreId });

    }
    if (req.query && req.query.toStoreId) {
        // where.toStoreId = req.query.toStoreId;
        where[Op.and].push({ toStoreId: req.query.toStoreId });
    }
    if (req.query && req.query.excludeCancel === "1") {
        // where.requestNumber = null;
        where[Op.and].push({ requestNumber: null });
    }
    if (req.query && req.query.status) {
        // where.status = req.query.status;
        where[Op.and].push({ status: req.query.status });
    }
    if (req.query && req.query.approvalStatus) {
        // where.approvalStatus = req.query.approvalStatus;
        where[Op.and].push({ approvalStatus: req.query.approvalStatus });
    }
    if (req.query && req.query.isProcessed) {
        // where.isProcessed = req.query.isProcessed;
        where[Op.and].push({ isProcessed: req.query.isProcessed });
    }
    const data = await requestApprovalService.getAllRequests(where);
    return { data };
};

/**
 * Method to create cancel request
 * @param { object } req.body
 * @returns { object } data
 */
const createCancelRequest = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_REQUEST_DETAILS);
    throwIfNot(req.body.payload, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_REQUEST_DETAILS);
    throwIfNot(req.body.payload[0].requestIds, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_REQUEST_DETAILS);
    throwIfNot(
        req.body.payload[0].transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.payload[0].requestName,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.payload[0].requestOrganizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.payload[0].requestStoreId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.payload[0].requestOrganizationId,
        storeId: req.body.payload[0].requestStoreId,
        transactionTypeIds: { [Op.contains]: [req.body.payload[0].transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.payload?.[0]?.requestName && req.body?.payload?.[0]?.requestIds) {
        const isRequestProcessed = await requestApprovalService.isRequestApprovalAlreadyExists(
            {
                id: req.body.payload[0].requestIds,
                isProcessed: true
            }
        );
        throwIf(isRequestProcessed, statusCodes.BAD_REQUEST, statusMessages.REQUEST_CAN_NOT_BE_CANCELLED);
        const isRequestCancelled = await requestApprovalService.isRequestApprovalAlreadyExists(
            {
                id: req.body.payload[0].requestIds,
                status: "0"
            }
        );
        throwIf(isRequestCancelled, statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_CANCELLED);
        const referenceDocumentNumber = await requestApprovalService.generateReferenceDocumentNumber(rangeData, req.body.payload[0].requestName);
        req.body.payload.forEach((object) => {
            object.referenceDocumentNumber = referenceDocumentNumber;
        });
        const data = await requestApprovalService.createRequest(req.body.payload);
        if (data?.[0]?.referenceDocumentNumber) {
            await requestApprovalService.updateRequestApproval({ status: "0", cancelRequestDocNo: data?.[0]?.referenceDocumentNumber }, { id: req.body.payload[0].requestIds });
        }
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_REQUEST_DETAILS);
    }
};

/**
 * Method to get all request approvers
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRequestApprovers = async (req) => {
    const where = {};
    if (req.query) {
        if (req.query.transactionTypeId) {
            where.transactionTypeId = req.query.transactionTypeId;
        }
        if (req.query.requestNumber) {
            where.requestNumber = req.query.requestNumber;
        }
        if (req.query.storeId) {
            where.storeId = req.query.storeId;
        }
    }
    const data = await requestApprovalService.getAllRequestApprovers(where);
    return { data };
};

/**
 * Method to approve or reject request by approver
 * @param { object } req.body
 * @returns { object } data
 */
const approveRejectRequest = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_REQUEST_APPROVE_REJECT_DETAILS);
    const requestDetails = await requestApprovalService.getRequestByCondition(
        {
            transactionTypeId: req.body.transactionTypeId,
            referenceDocumentNumber: req.body.requestNumber,
            ...req.body.requestName && (req.body.requestName === "MRR" || req.body.requestName === "CONSUMPTIONREQUEST") ? { fromStoreId: req.body.storeId } : { toStoreId: req.body.storeId }
        },
        undefined
    );
    const sendEmailToApprover = async (approverId = undefined, currentApproverRank = undefined) => {
        const { transactionTypeId, projectId, approverStoreId, requestNumber, employeeEmail, employeeName } = req.body;
        if (transactionTypeId && projectId && approverStoreId && req.body && (approverId || currentApproverRank)) {
            let approverData;
            if (approverId) {
                approverData = await approverService.getApproverByCondition({ id: approverId });
            } else if (currentApproverRank) {
                approverData = await approverService.getApproverByCondition({
                    transactionTypeId,
                    projectId,
                    storeId: approverStoreId,
                    rank: currentApproverRank + 1,
                    isActive: "1"
                });
            }
            const requestAndApproverData = {
                referenceDocumentNumber: requestNumber,
                requestNumber: requestNumber,
                email: employeeEmail,
                name: employeeName
            };
            if (approverData?.email) {
                await smtpConfigurationService.sendEmail(
                    transactionTypeId,
                    projectId,
                    requestAndApproverData,
                    true,
                    [],
                    approverData.email
                );
            }
        }
    };
    if (requestDetails && requestDetails.approvalStatus === "2") {
        const maxRank = await approverService.getApproverCount({
            transactionTypeId: req.body.transactionTypeId,
            projectId: req.body.projectId,
            storeId: req.body.approverStoreId,
            isActive: "1"
        });
        const requestApproversData = await requestApprovalService.isRequestApproverAlreadyExists({
            transactionTypeId: req.body.transactionTypeId,
            requestNumber: req.body.requestNumber,
            storeId: req.body.storeId
        });
        if (!requestApproversData) {
            if (req.body.rank == 1) {
                if (req.body.status == 1) {
                    const approverData = await requestApprovalService.createRequestApprover(req.body);
                    if (approverData && req.body.rank == maxRank) {
                        for await (const material of approverData.approvedMaterials) {
                            await requestApprovalService.updateRequestApproval({
                                approvedQuantity: material.approvedQuantity,
                                value: material.value,
                                approvalStatus: "1"
                            }, {
                                transactionTypeId: req.body.transactionTypeId,
                                referenceDocumentNumber: req.body.requestNumber,
                                ...req.body.requestName && (req.body.requestName === "MRR" || req.body.requestName === "CONSUMPTIONREQUEST") ? { fromStoreId: req.body.storeId } : { toStoreId: req.body.storeId },
                                materialId: material.id
                            });
                        }
                    } else {
                        // Send email to next approver
                        await sendEmailToApprover(undefined, req.body.rank);
                    }
                }
                if (req.body.status == 0) {
                    await requestApprovalService.createRequestApprover(req.body);
                    await requestApprovalService.updateApprovalStatus(
                        req.body.transactionTypeId,
                        req.body.requestNumber,
                        req.body.requestName,
                        req.body.storeId,
                        req.body.status
                    );
                }
            } else {
                throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_NOT_APPROVED_BY_ANYONE);
            }
        } else if (requestApproversData) {
            if (req.body.rank == 1) {
                const firstApproverDetails = await requestApprovalService.getRequestApproverByCondition(
                    {
                        transactionTypeId: req.body.transactionTypeId,
                        requestNumber: req.body.requestNumber,
                        storeId: req.body.storeId,
                        rank: req.body.rank
                    },
                    undefined
                );
                if (req.body.rank == maxRank) {
                    if (firstApproverDetails.status == "0") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_REJECTED);
                    }
                    if (firstApproverDetails.status == "1") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_APPROVED);
                    }
                }
                if (req.body.rank < maxRank) {
                    const nextRequestApproverDetails = await requestApprovalService.getRequestApproverByCondition(
                        {
                            transactionTypeId: req.body.transactionTypeId,
                            requestNumber: req.body.requestNumber,
                            storeId: req.body.storeId,
                            rank: req.body.rank + 1
                        },
                        undefined
                    );
                    if (firstApproverDetails && nextRequestApproverDetails) {
                        if (firstApproverDetails.status == "1" && nextRequestApproverDetails.status == "0") {
                            if (req.body.status == 1) {
                                await requestApprovalService.updateRequestApprover({
                                    status: req.body.status,
                                    approvedMaterials: req.body.approvedMaterials,
                                    remarks: req.body.remarks ? req.body.remarks : ""
                                }, {
                                    id: firstApproverDetails.id
                                });
                                // Send email to next approver
                                if (nextRequestApproverDetails?.approverId) await sendEmailToApprover(nextRequestApproverDetails.approverId, undefined);
                            }
                            if (req.body.status == 0) {
                                await requestApprovalService.updateRequestApprover({
                                    status: req.body.status,
                                    remarks: req.body.remarks ? req.body.remarks : ""
                                }, {
                                    id: firstApproverDetails.id
                                });
                                await requestApprovalService.updateApprovalStatus(
                                    req.body.transactionTypeId,
                                    req.body.requestNumber,
                                    req.body.requestName,
                                    req.body.storeId,
                                    req.body.status
                                );
                            }
                        } else if (firstApproverDetails.status == "1" && nextRequestApproverDetails.status == "1") {
                            throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_APPROVED);
                        } else if (firstApproverDetails.status == "0") {
                            throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_REJECTED);
                        }
                    }
                    if (firstApproverDetails && !nextRequestApproverDetails) {
                        if (firstApproverDetails.status == "1") {
                            if (req.body.status == 1) {
                                await requestApprovalService.updateRequestApprover({
                                    status: req.body.status,
                                    approvedMaterials: req.body.approvedMaterials,
                                    remarks: req.body.remarks ? req.body.remarks : ""
                                }, {
                                    id: firstApproverDetails.id
                                });
                                // Send email to next approver
                                await sendEmailToApprover(undefined, req.body.rank);
                            }
                            if (req.body.status == 0) {
                                await requestApprovalService.updateRequestApprover({
                                    status: req.body.status,
                                    remarks: req.body.remarks ? req.body.remarks : ""
                                }, {
                                    id: firstApproverDetails.id
                                });
                                await requestApprovalService.updateApprovalStatus(
                                    req.body.transactionTypeId,
                                    req.body.requestNumber,
                                    req.body.requestName,
                                    req.body.storeId,
                                    req.body.status
                                );
                            }
                        } else if (firstApproverDetails.status == "0") {
                            throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_REJECTED);
                        }
                    }
                }
            } else if (req.body.rank > 1 && req.body.rank < maxRank) {
                const currentApproverDetails = await requestApprovalService.getRequestApproverByCondition(
                    {
                        transactionTypeId: req.body.transactionTypeId,
                        requestNumber: req.body.requestNumber,
                        storeId: req.body.storeId,
                        rank: req.body.rank
                    },
                    undefined
                );
                const prevRequestApproverDetails = await requestApprovalService.getRequestApproverByCondition(
                    {
                        transactionTypeId: req.body.transactionTypeId,
                        requestNumber: req.body.requestNumber,
                        storeId: req.body.storeId,
                        rank: req.body.rank - 1
                    },
                    undefined
                );
                const nextRequestApproverDetails = await requestApprovalService.getRequestApproverByCondition(
                    {
                        transactionTypeId: req.body.transactionTypeId,
                        requestNumber: req.body.requestNumber,
                        storeId: req.body.storeId,
                        rank: req.body.rank + 1
                    },
                    undefined
                );
                if (prevRequestApproverDetails && currentApproverDetails && nextRequestApproverDetails) {
                    if ((currentApproverDetails.status == "1" && nextRequestApproverDetails.status == "0") || (prevRequestApproverDetails.status == "1" && currentApproverDetails.status == "0" && nextRequestApproverDetails.status == "0")) {
                        if (req.body.status == 1) {
                            await requestApprovalService.updateRequestApprover({
                                status: req.body.status,
                                approvedMaterials: req.body.approvedMaterials,
                                remarks: req.body.remarks ? req.body.remarks : ""
                            }, {
                                id: currentApproverDetails.id
                            });
                            // Send email to next approver
                            if (nextRequestApproverDetails?.approverId) await sendEmailToApprover(nextRequestApproverDetails.approverId, undefined);
                        }
                        if (req.body.status == 0) {
                            await requestApprovalService.updateRequestApprover({
                                status: req.body.status,
                                remarks: req.body.remarks ? req.body.remarks : ""
                            }, {
                                id: currentApproverDetails.id
                            });
                            // Send email to prev approver
                            if (prevRequestApproverDetails?.approverId) await sendEmailToApprover(prevRequestApproverDetails.approverId, undefined);
                        }
                    } else if (nextRequestApproverDetails.status == "1") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_APPROVED_BY_NEXT_APPROVER);
                    } else if (prevRequestApproverDetails.status == "0") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_REJECTED_BY_PREVIOUS_APPROVER);
                    }
                } else if (prevRequestApproverDetails && currentApproverDetails && !nextRequestApproverDetails) {
                    if ((prevRequestApproverDetails.status == "1" && currentApproverDetails.status == "0") || (prevRequestApproverDetails.status == "1" && currentApproverDetails.status == "1")) {
                        if (req.body.status == 1) {
                            await requestApprovalService.updateRequestApprover({
                                status: req.body.status,
                                approvedMaterials: req.body.approvedMaterials,
                                remarks: req.body.remarks ? req.body.remarks : ""
                            }, {
                                id: currentApproverDetails.id
                            });
                            // Send email to next approver
                            await sendEmailToApprover(undefined, req.body.rank);
                        }
                        if (req.body.status == 0) {
                            await requestApprovalService.updateRequestApprover({
                                status: req.body.status,
                                remarks: req.body.remarks ? req.body.remarks : ""
                            }, {
                                id: currentApproverDetails.id
                            });
                            // Send email to prev approver
                            if (prevRequestApproverDetails?.approverId) await sendEmailToApprover(prevRequestApproverDetails.approverId, undefined);
                        }
                    } else if (prevRequestApproverDetails.status == "0") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_REJECTED_BY_PREVIOUS_APPROVER);
                    }
                } else if (prevRequestApproverDetails && !currentApproverDetails) {
                    if (prevRequestApproverDetails.status == "1") {
                        if (req.body.status == 1) {
                            await requestApprovalService.createRequestApprover(req.body);
                            // Send email to next approver
                            await sendEmailToApprover(undefined, req.body.rank);
                        }
                        if (req.body.status == 0) {
                            await requestApprovalService.createRequestApprover(req.body);
                            // Send email to prev approver
                            if (prevRequestApproverDetails?.approverId) await sendEmailToApprover(prevRequestApproverDetails.approverId, undefined);
                        }
                    } else if (prevRequestApproverDetails.status == "0") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_REJECTED_BY_PREVIOUS_APPROVER);
                    }
                } else if (!prevRequestApproverDetails) {
                    throwError(statusCodes.BAD_REQUEST, statusMessages.APPROVAL_PENDING_FROM_PREVIOUS_APPROVER);
                }
            } else if (req.body.rank != 1 && req.body.rank == maxRank) {
                const maxRankRequestApproverDetails = await requestApprovalService.getRequestApproverByCondition(
                    {
                        transactionTypeId: req.body.transactionTypeId,
                        requestNumber: req.body.requestNumber,
                        storeId: req.body.storeId,
                        rank: maxRank
                    },
                    undefined
                );
                const prevRequestApproverDetails = await requestApprovalService.getRequestApproverByCondition(
                    {
                        transactionTypeId: req.body.transactionTypeId,
                        requestNumber: req.body.requestNumber,
                        storeId: req.body.storeId,
                        rank: req.body.rank - 1
                    },
                    undefined
                );
                if (maxRankRequestApproverDetails && prevRequestApproverDetails) {
                    if (prevRequestApproverDetails.status == "1" && maxRankRequestApproverDetails.status == "0") {
                        if (req.body.status == 1) {
                            const updateApproverData = await requestApprovalService.updateRequestApprover({
                                status: req.body.status,
                                approvedMaterials: req.body.approvedMaterials,
                                remarks: req.body.remarks ? req.body.remarks : ""
                            }, {
                                id: maxRankRequestApproverDetails.id
                            });
                            const updateApprover = updateApproverData?.[1]?.[0];
                            if (updateApprover) {
                                for await (const material of updateApprover.approvedMaterials) {
                                    await requestApprovalService.updateRequestApproval({
                                        approvedQuantity: material.approvedQuantity,
                                        value: material.value,
                                        approvalStatus: "1"
                                    }, {
                                        transactionTypeId: req.body.transactionTypeId,
                                        referenceDocumentNumber: req.body.requestNumber,
                                        ...req.body.requestName && (req.body.requestName === "MRR" || req.body.requestName === "CONSUMPTIONREQUEST") ? { fromStoreId: req.body.storeId } : { toStoreId: req.body.storeId },
                                        materialId: material.id
                                    });
                                }
                            }
                        }
                        if (req.body.status == 0) {
                            await requestApprovalService.updateRequestApprover({
                                status: req.body.status,
                                remarks: req.body.remarks ? req.body.remarks : ""
                            }, {
                                id: maxRankRequestApproverDetails.id
                            });
                            // Send email to prev approver
                            if (prevRequestApproverDetails?.approverId) await sendEmailToApprover(prevRequestApproverDetails.approverId, undefined);
                        }
                    } else if (maxRankRequestApproverDetails.status == "1") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_APPROVED);
                    } else if (prevRequestApproverDetails.status == "0") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_REJECTED_FROM_PREVIOUS_APPROVER);
                    }
                } else if (!maxRankRequestApproverDetails && prevRequestApproverDetails) {
                    if (prevRequestApproverDetails.status == "1") {
                        if (req.body.status == 1) {
                            const approverData = await requestApprovalService.createRequestApprover(req.body);
                            if (approverData) {
                                for await (const material of approverData.approvedMaterials) {
                                    await requestApprovalService.updateRequestApproval({
                                        approvedQuantity: material.approvedQuantity,
                                        value: material.value,
                                        approvalStatus: "1"
                                    }, {
                                        transactionTypeId: req.body.transactionTypeId,
                                        referenceDocumentNumber: req.body.requestNumber,
                                        ...req.body.requestName && (req.body.requestName === "MRR" || req.body.requestName === "CONSUMPTIONREQUEST") ? { fromStoreId: req.body.storeId } : { toStoreId: req.body.storeId },
                                        materialId: material.id
                                    });
                                }
                            }
                        }
                        if (req.body.status == 0) {
                            await requestApprovalService.createRequestApprover(req.body);
                            // Send email to prev approver
                            if (prevRequestApproverDetails?.approverId) await sendEmailToApprover(prevRequestApproverDetails.approverId, undefined);
                        }
                    } else if (prevRequestApproverDetails.status == "0") {
                        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_REJECTED_BY_PREVIOUS_APPROVER);
                    }
                } else if (!prevRequestApproverDetails) {
                    throwError(statusCodes.BAD_REQUEST, statusMessages.APPROVAL_PENDING_FROM_PREVIOUS_APPROVER);
                }
            }
        }
    } else if (requestDetails && requestDetails.approvalStatus === "1") {
        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_APPROVED);
    } else if (requestDetails && requestDetails.approvalStatus === "0") {
        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_ALREADY_REJECTED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.REQUEST_NOT_FOUND);
    }
};

module.exports = {
    createRequest,
    getRequestDetails,
    getAllRequests,
    createCancelRequest,
    getAllRequestApprovers,
    approveRejectRequest
};
