const statusCodes = require("../../config/status-codes");
const { throwIfNot, throwError } = require("../../services/throw-error-class");
const stockLedgers = require("../stock-ledgers/stock-ledgers.controller");
const stockLedgerService = require("../stock-ledgers/stock-ledgers.service");
const requestApprovals = require("../request-approvals/request-approvals.controller");
const requestApprovalsService = require("../request-approvals/request-approvals.service");
const receiptsService = require("./receipts.service");
const {
    getMasterMakerLovByCondition
} = require("../master-maker-lovs/master-maker-lovs.service");
const {
    getAllApproversByCondition
} = require("../approvers-master/approvers-master.service");
const statusMessage = require("../../config/status-message");
const { getReferrerHostOnly } = require("../../utilities/common-utils");
const {
    getOrganizationByCondition
} = require("../organizations/organizations.service");

const { getDevolutionDetails, getDevolutionFormData } = require("../devolutions/devolutions.controller");

// Update the imports to respective controllers
// whenever access control mechanisms are required in receipts.

const {
    prepareDataForReceipt,
    pickKeyFromTxDataObject,
    parseAddressFromObject,
    convertIfDate,
    parentOrganizationFetchers,
    formatIndianNumber,
    getLogoBufferFrom,
    groupRequestData,
    getGstNumberFrom,
    getStore,
    rupeeAmountToWords,
    generateReceiptResponse,
    templateNames,
    transactionIsCancelled
} = receiptsService;

const defaultLogoBuffer = getLogoBufferFrom({ logo: JSON.stringify(["genus-logo.png"]) }, false);

const receiptsUtils = {
    prepareDataForReceipt,
    pickKeyFromTxDataObject,
    parseAddressFromObject,
    convertIfDate,
    parentOrganizationFetchers,
    formatIndianNumber,
    getLogoBufferFrom,
    groupRequestData,
    getGstNumberFrom,
    getStore,
    rupeeAmountToWords,
    generateReceiptResponse,
    templateNames,
    transactionIsCancelled,
    defaultLogoBuffer
};

async function createApproversList(
    dataObject,
    transactionName,
    storeKeyForCurrentApprovers = "from_store",
    storeKeyForAllApprovers = "to_store"
) {
    const referenceDocumentNumber = dataObject?.referenceDocumentNumber;
    const { id: requestTransactionTypeId } = await getMasterMakerLovByCondition(
        { name: transactionName }
    );
    const storeIdForCurrentApprovers = dataObject[storeKeyForCurrentApprovers]?.id;
    const storeIdForAllApprovers = dataObject[storeKeyForAllApprovers]?.id;
    const currentApproversWhere = {
        requestNumber: referenceDocumentNumber,
        transactionTypeId: requestTransactionTypeId,
        ...(storeIdForCurrentApprovers && {
            storeId: storeIdForCurrentApprovers
        })
    };
    const allApproversWhere = {
        projectId: pickKeyFromTxDataObject(dataObject, "projectId"),
        transactionTypeId: requestTransactionTypeId,
        ...(storeIdForAllApprovers && { storeId: storeIdForAllApprovers })
    };

    let [currentApproversData, allApproversData] = await Promise.all([
        requestApprovalsService.getAllRequestApprovers(currentApproversWhere),
        getAllApproversByCondition(allApproversWhere)
    ]);
    currentApproversData = JSON.parse(JSON.stringify(currentApproversData.rows)) || [];
    allApproversData = JSON.parse(JSON.stringify(allApproversData.rows)) || [];

    const createdApproversList = receiptsService.createApproverList(
        allApproversData,
        currentApproversData
    );
    return createdApproversList;
}

const getGrnReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const mrfNumber = pickKeyFromTxDataObject(
            modifiedData,
            "requestNumber"
        );

        if (mrfNumber) {
            const { id: mrfTransactionTypeId } = await getMasterMakerLovByCondition({ name: "MRF" });
            const { id: minTransactionTypeId } = await getMasterMakerLovByCondition({ name: "MIN" });

            const toStoreId = modifiedData?.stock_ledgers?.[0]?.storeId;

            let requestData = await requestApprovalsService.getAllRequests({
                referenceDocumentNumber: mrfNumber,
                transactionTypeId: mrfTransactionTypeId,
                ...(toStoreId && { toStoreId: toStoreId })
            });

            requestData = JSON.parse(JSON.stringify(requestData.rows))?.[0] || [];

            // get corresponding MIN transaction details
            const correspondingMinWhere = {
                projectId: modifiedData?.stock_ledgers?.[0]?.projectId,
                storeId: requestData?.from_store?.id,
                requestNumber: mrfNumber,
                transactionTypeId: minTransactionTypeId
            };
            let correspondingMinTransaction = await stockLedgers.getAllStockLedgers({
                query: correspondingMinWhere
            });
            correspondingMinTransaction = JSON.parse(
                JSON.stringify(correspondingMinTransaction)
            );
            correspondingMinTransaction = correspondingMinTransaction?.data?.rows?.[0];

            Object.assign(modifiedData, {
                isMinBased: true,
                fromOrganization: requestData?.from_store?.organization,
                toOrganization: requestData?.to_store?.organization,
                fromStore: requestData?.from_store,
                correspondingMinTransaction
            });
        }

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.grnReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getMrfReceipt = async (req) => {
    try {
        const requestData = await requestApprovals.getAllRequests(req);
        throwIfNot(
            requestData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = groupRequestData(
            JSON.parse(JSON.stringify(requestData.data.rows))
        )[0] || {};
        const referrerBase = getReferrerHostOnly(req);

        const createdApproversList = await createApproversList(
            modifiedData,
            "MRF",
            "to_store",
            "from_store"
        );

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            createdApproversList,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.mrfReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getMinReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );
        const { id: mrfTransactionTypeId } = await getMasterMakerLovByCondition(
            { name: "MRF" }
        );

        const toStoreId = modifiedData?.toStoreId;
        let approverStoreId = null;
        if (
            modifiedData?.stock_ledgers
            && modifiedData?.stock_ledgers.length > 0
        ) {
            approverStoreId = modifiedData?.stock_ledgers?.[0]?.storeId;
        }
        const requestNumber = pickKeyFromTxDataObject(
            modifiedData,
            "requestNumber"
        );

        let requestData = await requestApprovalsService.getAllRequests({
            referenceDocumentNumber: requestNumber,
            transactionTypeId: mrfTransactionTypeId,
            ...(toStoreId && { toStoreId: toStoreId })
        });
        const requestDataOriginal = JSON.parse(
            JSON.stringify(requestData.rows)
        );
        requestData = requestDataOriginal?.[0] || [];

        let [reqApproversData, approversListData] = await Promise.all([
            requestApprovalsService.getAllRequestApprovers({
                requestNumber,
                transactionTypeId: mrfTransactionTypeId,
                ...(toStoreId && { storeId: toStoreId })
            }),
            getAllApproversByCondition({
                projectId: pickKeyFromTxDataObject(modifiedData, "projectId"),
                transactionTypeId: mrfTransactionTypeId,
                ...(approverStoreId && { storeId: approverStoreId })
            })
        ]);

        reqApproversData = JSON.parse(JSON.stringify(reqApproversData.rows)) || [];
        approversListData = JSON.parse(JSON.stringify(approversListData.rows)) || [];

        const highestRankedApprover = receiptsService.getHighestApproverName(
            reqApproversData,
            approversListData
        );

        const getRequestedQuantity = (materialId) => requestDataOriginal?.find((item) => item.materialId === materialId)
            ?.requestedQuantity;

        Object.assign(modifiedData, {
            fromOrganization: requestData?.from_store?.organization,
            toOrganization: requestData?.to_store?.organization,
            toStore: requestData?.to_store,
            fromStore: requestData?.from_store,
            supervisorName: requestData?.contractor_employee?.name,
            highestRankedApprover
        });

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            getRequestedQuantity,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.minReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getMrrReceipt = async (req) => {
    try {
        const requestData = await requestApprovals.getAllRequests(req);
        throwIfNot(
            requestData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = groupRequestData(
            JSON.parse(JSON.stringify(requestData.data.rows))
        )[0] || {};

        const referrerBase = getReferrerHostOnly(req);

        const createdApproversList = await createApproversList(
            modifiedData,
            "MRR"
        );

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            createdApproversList,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.mrrReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getMrnReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const { id: requestTransactionTypeId } = await getMasterMakerLovByCondition({ name: "MRR" });
        const requestNumber = pickKeyFromTxDataObject(
            modifiedData,
            "requestNumber"
        );
        const projectId = pickKeyFromTxDataObject(modifiedData, "projectId");
        const storeId = modifiedData?.stock_ledgers[0]?.storeId;

        let requestDataOriginal = await requestApprovalsService.getAllRequests({
            referenceDocumentNumber: requestNumber,
            transactionTypeId: requestTransactionTypeId,
            fromStoreId: storeId
        });
        requestDataOriginal = JSON.parse(
            JSON.stringify(requestDataOriginal.rows)
        );
        const requestData = requestDataOriginal?.[0] || [];

        // get approver's name
        const approverStoreId = modifiedData?.toStoreId;
        const toStoreId = storeId;
        let [reqApproversData, approversListData] = await Promise.all([
            requestApprovalsService.getAllRequestApprovers({
                requestNumber,
                transactionTypeId: requestTransactionTypeId,
                ...(toStoreId && { storeId: toStoreId })
            }),
            getAllApproversByCondition({
                projectId,
                transactionTypeId: requestTransactionTypeId,
                ...(approverStoreId && { storeId: approverStoreId })
            })
        ]);
        reqApproversData = JSON.parse(JSON.stringify(reqApproversData.rows)) || [];
        approversListData = JSON.parse(JSON.stringify(approversListData.rows)) || [];
        const highestRankedApprover = receiptsService.getHighestApproverName(
            reqApproversData,
            approversListData
        );

        Object.assign(modifiedData, {
            fromOrganization: requestData?.from_store?.organization,
            toOrganization: requestData?.to_store?.organization,
            fromStore: requestData?.from_store,
            toStore: requestData?.to_store,
            supervisorName: requestData?.contractor_employee?.name,
            highestRankedApprover
        });

        const referrerBase = getReferrerHostOnly(req);

        const getRequestedQuantity = (materialId) => requestDataOriginal?.find((item) => item.materialId === materialId)
            ?.requestedQuantity;

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            getRequestedQuantity,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.mrnReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getReturnMrnReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const { id: requestTransactionTypeId } = await getMasterMakerLovByCondition({ name: "MRR" });
        const { id: mrnTransactionTypeId } = await getMasterMakerLovByCondition({ name: "MRN" });
        const requestNumber = pickKeyFromTxDataObject(
            modifiedData,
            "requestNumber"
        );

        const dateNewVersionDeploy = "2023-12-20T09:19:33.134Z"; // 20 December 2023
        const isANewVersionTransaction = new Date(modifiedData?.createdAt) >= new Date(dateNewVersionDeploy);

        const toStoreId = modifiedData?.toStoreId;

        let requestDataOriginal = await requestApprovalsService.getAllRequests({
            referenceDocumentNumber: requestNumber,
            transactionTypeId: requestTransactionTypeId,
            ...(toStoreId && { fromStoreId: toStoreId })
        });
        requestDataOriginal = JSON.parse(
            JSON.stringify(requestDataOriginal.rows)
        );
        const requestData = requestDataOriginal?.[0] || [];

        let mrnNumber;

        if (isANewVersionTransaction) {
            mrnNumber = pickKeyFromTxDataObject(modifiedData, "requestNumber");
        } else {
            const correspondingMrnWhere = {
                projectId: modifiedData?.stock_ledgers?.[0]?.projectId,
                storeId: requestData?.from_store?.id,
                requestNumber,
                transactionTypeId: mrnTransactionTypeId
            };
            let correspondingMrfTransaction = await stockLedgers.getAllStockLedgers(
                { query: correspondingMrnWhere }
            );
            correspondingMrfTransaction = JSON.parse(
                JSON.stringify(correspondingMrfTransaction)
            );
            correspondingMrfTransaction = correspondingMrfTransaction?.data?.rows?.[0];
            mrnNumber = correspondingMrfTransaction?.referenceDocumentNumber;
        }

        let toStoreData, toOrganizationData;
        if (isANewVersionTransaction) {
            toStoreData = pickKeyFromTxDataObject(modifiedData, "organization_store");
            toOrganizationData = await getOrganizationByCondition({ id: toStoreData?.organization?.id });
        } else {
            toStoreData = requestData?.to_store;
        }

        let fromStoreData;
        if (isANewVersionTransaction) {
            fromStoreData = pickKeyFromTxDataObject(modifiedData, "other_store");
        } else {
            fromStoreData = requestData?.from_store;
        }

        Object.assign(modifiedData, {
            fromStore: fromStoreData,
            toStore: { ...toStoreData, organization: toOrganizationData },
            mrnNumber
        });

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.returnMrnReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getLtlReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.ltlReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getStsrcReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.stsrcReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getSrctsReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.srctsReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getStcReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const referrerBase = getReferrerHostOnly(req);

        const branchOnlyOrganizationId = parentOrganizationFetchers.getBranchOrganizationOnly(
            modifiedData?.fromStore
        )?.id;
        let branchOnlyOrganization;
        if (branchOnlyOrganizationId) {
            branchOnlyOrganization = await getOrganizationByCondition({
                id: branchOnlyOrganizationId
            });
            branchOnlyOrganization = JSON.parse(
                JSON.stringify(branchOnlyOrganization)
            );
        }

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            branchOnlyOrganization,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.stcReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getCtsReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.ctsReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getStrReceipt = async (req) => {
    try {
        const requestData = await requestApprovals.getAllRequests(req);
        throwIfNot(
            requestData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const groupByRequisionNumber = (data) => {
            if (!data) return [];

            const groupedData = data.reduce((accumulator, currentObject) => {
                const { transactionTypeId, referenceDocumentNumber } = currentObject;

                if (
                    !accumulator[
                        referenceDocumentNumber
                            + transactionTypeId
                            + getStore(currentObject)
                    ]
                ) {
                    accumulator[
                        referenceDocumentNumber
                            + transactionTypeId
                            + getStore(currentObject)
                    ] = [];
                }

                accumulator[
                    referenceDocumentNumber
                        + transactionTypeId
                        + getStore(currentObject)
                ].push(currentObject);

                return accumulator;
            }, {});

            return Object.entries(groupedData).map(([, value]) => ({
                transactionTypeId: value[0].transactionTypeId,
                referenceDocumentNumber: value[0].referenceDocumentNumber,
                fromStore: value[0].from_store,
                projectName: value[0].project.name,
                remarks: value[0].remarks,
                toStore: value[0].to_store,
                createdAt: value[0].createdAt,
                created: value[0].created,
                materialData: value
            }));
        };

        const requestDataOriginal = JSON.parse(
            JSON.stringify(requestData.data.rows)
        );
        const modifiedData = groupByRequisionNumber(requestDataOriginal)[0] || {};

        const referrerBase = getReferrerHostOnly(req);
        const createdApproversList = await createApproversList(
            requestDataOriginal?.[0],
            "STR",
            "to_store",
            "from_store"
        );

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            createdApproversList,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.strReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getStoReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const requestNumber = pickKeyFromTxDataObject(
            modifiedData,
            "requestNumber"
        );
        const projectId = pickKeyFromTxDataObject(modifiedData, "projectId");
        const { id: requestTransactionTypeId } = await getMasterMakerLovByCondition({ name: "STR" });
        const toStoreId = modifiedData?.toStoreId;
        const storeId = modifiedData?.stock_ledgers[0]?.storeId;
        let requestData = await requestApprovalsService.getAllRequests({
            referenceDocumentNumber: requestNumber,
            transactionTypeId: requestTransactionTypeId,
            ...(toStoreId && { toStoreId: toStoreId })
        });
        requestData = JSON.parse(JSON.stringify(requestData.rows))?.[0] || [];

        Object.assign(modifiedData, {
            fromOrganization: requestData?.from_store?.organization,
            toOrganization: requestData?.to_store?.organization,
            fromStore: requestData?.from_store,
            toStore: requestData?.to_store
        });
        const approversListStoreId = toStoreId;
        const approverStoreId = storeId;
        let [reqApproversData, approversListData] = await Promise.all([
            requestApprovalsService.getAllRequestApprovers({
                requestNumber,
                transactionTypeId: requestTransactionTypeId,
                ...(approversListStoreId && { storeId: approversListStoreId })
            }),
            getAllApproversByCondition({
                projectId,
                transactionTypeId: requestTransactionTypeId,
                ...(approverStoreId && { storeId: approverStoreId })
            })
        ]);
        reqApproversData = JSON.parse(JSON.stringify(reqApproversData.rows)) || [];
        approversListData = JSON.parse(JSON.stringify(approversListData.rows)) || [];

        const highestRankedApprover = receiptsService.getHighestApproverName(
            reqApproversData,
            approversListData
        );

        Object.assign(modifiedData, {
            highestRankedApprover
        });

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.stoReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getStoGrnReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const stoNumber = pickKeyFromTxDataObject(
            modifiedData,
            "requestNumber"
        );

        const { id: stoTransactionTypeId } = await getMasterMakerLovByCondition(
            { name: "STO" }
        );
        const toStoreId = modifiedData?.toStoreId;
        const projectId = modifiedData?.stock_ledgers?.[0]?.projectId;

        let requestData = await stockLedgerService.getAllStockLedgers({
            transactionTypeId: stoTransactionTypeId,
            referenceDocumentNumber: stoNumber,
            projectId,
            storeId: toStoreId
        });

        requestData = JSON.parse(JSON.stringify(requestData.rows))?.[0] || [];

        const fromStore = requestData?.organization_store;

        const fromOrganization = parentOrganizationFetchers.getImmediateParentOrganization(
            requestData?.organization_store
        );

        Object.assign(modifiedData, {
            fromStore,
            fromOrganization
        });

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.stoGrnReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getPtpReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.ptpReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getPtpGrnReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const referrerBase = getReferrerHostOnly(req);

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            referrerBase
        };
        
        const otherStoreData = modifiedData?.otherStore;
        const { id: otherStoreOrganizationId } = parentOrganizationFetchers.getImmediateParentOrganization(modifiedData?.otherStore) || {};

        if (otherStoreOrganizationId) {
            const otherStoreOrganization = await getOrganizationByCondition({ id: otherStoreOrganizationId });
            dataForEJS.otherStoreOrganization = otherStoreOrganization;
        }

        const { id: ptpTransactionTypeId } = await getMasterMakerLovByCondition({
            name: "PTP"
        });

        const correspondingPtpWhere = {
            projectId: modifiedData?.otherProjectId,
            storeId: otherStoreData.id,
            referenceDocumentNumber: modifiedData?.requestNumber,
            transactionTypeId: ptpTransactionTypeId
        };

        let correspondingPtpTransaction = await stockLedgers.getAllStockLedgers({ query: correspondingPtpWhere });
        correspondingPtpTransaction = correspondingPtpTransaction?.data?.rows[0];
        
        if (correspondingPtpTransaction) {
            dataForEJS.correspondingPtpTransaction = correspondingPtpTransaction;
        }
        
        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.ptpGrnReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getConsumptionRequestReceipt = async (req) => {
    try {
        const requestData = await requestApprovals.getAllRequests(req);
        throwIfNot(
            requestData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );
        const requestDataOriginal = JSON.parse(
            JSON.stringify(requestData.data.rows)
        );
        const modifiedData = groupRequestData(requestDataOriginal)[0] || {};

        const referrerBase = getReferrerHostOnly(req);

        const createdApproversList = await createApproversList(
            requestDataOriginal?.[0],
            "CONSUMPTIONREQUEST",
            "from_store",
            "to_store"
        );

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            createdApproversList,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.consumptionRequestReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getConsumptionReceipt = async (req) => {
    try {
        const stockLedgerData = await stockLedgers.getStockLedgerDetails(req);
        throwIfNot(
            stockLedgerData?.data,
            statusCodes.BAD_REQUEST,
            statusMessage.NO_RECEIPT_DATA
        );

        const modifiedData = prepareDataForReceipt(
            stockLedgerData.data.get({ plain: true })
        );

        const consumptionRequestNumber = pickKeyFromTxDataObject(
            modifiedData,
            "requestNumber"
        );

        let requestDataOriginal;

        if (consumptionRequestNumber) {
            const { id: consumptionRequestTransactionTypeId } = await getMasterMakerLovByCondition({
                name: "CONSUMPTIONREQUEST"
            });

            const fromStoreId = modifiedData?.stock_ledgers?.[0]?.storeId;

            // TODO add projectId in all requestApprovalsService.getAllRequests
            let requestData = await requestApprovalsService.getAllRequests({
                referenceDocumentNumber: consumptionRequestNumber,
                transactionTypeId: consumptionRequestTransactionTypeId,
                ...(fromStoreId && { fromStoreId: fromStoreId })
            });

            requestDataOriginal = JSON.parse(JSON.stringify(requestData.rows));

            requestData = requestDataOriginal?.[0] || [];

            Object.assign(modifiedData, {
                isMinBased: true,
                fromOrganization: requestData?.from_store?.organization,
                toOrganization: requestData?.to_store?.organization,
                fromStore: requestData?.from_store
            });
        }

        const referrerBase = getReferrerHostOnly(req);

        const getApprovedQuantity = (materialId) => requestDataOriginal?.find((item) => item.materialId === materialId)
            ?.approvedQuantity;

        const dataForEJS = {
            transaction: modifiedData,
            ...receiptsUtils,
            getApprovedQuantity,
            referrerBase
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.consumptionReceipt;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

const getDevolutionView = async (req) => {
    try {
        const devolutionDetailsData = await getDevolutionDetails(req);
        throwIfNot(devolutionDetailsData?.data, statusCodes.BAD_REQUEST, statusMessage.NO_RECEIPT_DATA);

        const reqBody = {
            projectId: devolutionDetailsData?.data?.project?.id,
            formId: devolutionDetailsData?.data?.form?.id,
            devolutionId: devolutionDetailsData?.data?.id,
            ...(devolutionDetailsData?.data?.approvalStatus == "0" && { isRejected: true })
        };

        req.body = {
            ...reqBody
            // pageNumber: 1,
            // rowPerPage: 5000
        };
        
        const devolutionMaterialsData = await getDevolutionFormData(req);

        const headerArr = [];
        if (devolutionMaterialsData?.data?.rows && devolutionMaterialsData?.data?.rows?.length) {
            Object.keys(devolutionMaterialsData?.data?.rows[0]).forEach((k) => {
                if (k !== "Response ID") headerArr.push(k);
            });
        }
        
        const referrerBase = getReferrerHostOnly(req);
        const modifiedData = {
            basicDetails: devolutionDetailsData?.data,
            materials: devolutionMaterialsData?.data?.rows,
            count: devolutionMaterialsData?.data?.count,
            headerArr: headerArr,
            materialReq: `${referrerBase}/api/v1/devolution-form-data`,
            materialReqBody: reqBody,
            apiHeader: {
                "Content-Type": "application/json",
                authorization: `Bearer ${req?.headers?.cookie?.split("auth_token=")[1]}`
            }
        };

        const dataForEJS = {
            devolution: modifiedData,
            convertIfDate,
            referrerBase,
            defaultLogoBuffer
        };

        const isPdfDownload = !!req.query.pdf;
        const templateName = templateNames.devolutionView;

        const outputData = await generateReceiptResponse(
            isPdfDownload,
            dataForEJS,
            templateName
        );

        return outputData;
    } catch (error) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessage.RECEIPT_FETCH_ERROR,
            error
        );
    }
};

module.exports = {
    getGrnReceipt,
    getMrfReceipt,
    getMinReceipt,
    getMrrReceipt,
    getMrnReceipt,
    getReturnMrnReceipt,
    getLtlReceipt,
    getStsrcReceipt,
    getSrctsReceipt,
    getStcReceipt,
    getStrReceipt,
    getStoReceipt,
    getCtsReceipt,
    getStoGrnReceipt,
    getPtpReceipt,
    getPtpGrnReceipt,
    getConsumptionRequestReceipt,
    getConsumptionReceipt,
    getDevolutionView
};
