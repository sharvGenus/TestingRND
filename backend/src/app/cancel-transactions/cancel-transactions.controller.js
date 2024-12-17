const { Op } = require("sequelize");
const { throwIfNot, throwError, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const cancelTransactionService = require("./cancel-transactions.service");
const stockLedgerService = require("../stock-ledgers/stock-ledgers.service");
const transactionTypeRangeService = require("../transaction-type-ranges/transaction-type-ranges.service");

const cancelTxns = [
    "bec7c5ef-291f-4147-bb20-88bac5a2aec3", // CANCELGRN
    "ad02c1e9-1158-47b5-9022-13b8c9d3eaa3", // CANCELRETURNMRN
    "bd64de24-1756-4088-8400-07c943ac0403", // CANCELLTL
    "2d807559-c937-483d-aa22-24cc1faf8829", // CANCELSRCTS
    "c67632f4-8e46-4ef7-900b-cbb72e8903f8", // CANCELSTOGRN
    "73df529f-9008-4917-ab2b-088b9222fa68" // CANCELPTPGRN
];

/**
 * Method to create Cancel GRN(Goods Receive Note) Transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createCancelGrnTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    if (req.body?.grnIds?.length) {
        const isGrnCancelled = await cancelTransactionService.transactionAlreadyExists({
            transactionTypeId: req.body.grnIds,
            isCancelled: true
        });
        throwIf(isGrnCancelled, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    for await (const txn of req.body.stock_ledgers) {
        const where = {
            transactionTypeId: { [Op.notIn]: cancelTxns },
            projectId: txn.projectId,
            storeId: txn.storeId,
            storeLocationId: txn.storeLocationId,
            materialId: txn.materialId,
            createdAt: { [Op.gt]: req.body.transactionCreatedAt },
            quantity: { [Op.lt]: 0 },
            isCancelled: false
        };
        const isDebitTxnExists = await cancelTransactionService.transactionAlreadyExists(where);
        throwIf(isDebitTxnExists, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    }
    throwIfNot(req.body.transactionTypeId, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_TYPE_NOT_FOUND);
    throwIfNot(req.body.requestTransactionTypeId, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_TYPE_NOT_FOUND);
    throwIfNot(req.body.grnLedgerDetailId, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NOT_FOUND);
    throwIfNot(req.body.toOrganizationId, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_ID_NOT_FOUND);
    throwIfNot(req.body.storeId, statusCodes.BAD_REQUEST, statusMessages.STORE_ID_REQUIRED);
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.toOrganizationId,
        storeId: req.body.storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body && req.body.requestNumber && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        const creditArray = JSON.parse(JSON.stringify(req.body.stock_ledgers));
        const debitStockLedger = JSON.parse(JSON.stringify(creditArray));
        for await (const debitTxn of debitStockLedger) {
            debitTxn.requestNumber = req.body.requestNumber;
            debitTxn.quantity = 0 - debitTxn.quantity;
            const serialNumberArr = [];
            const grnDataByMaterial = await stockLedgerService.getActiveSerialNumbersInStore({
                "$stock_ledger.transaction_type_id$": req.body.requestTransactionTypeId,
                "$stock_ledger.project_id$": req.body.projectId,
                "$stock_ledger.store_id$": req.body.storeId,
                "$stock_ledger.reference_document_number$": req.body.requestNumber,
                "$stock_ledger.material_id$": debitTxn.materialId
            });
            if (grnDataByMaterial && grnDataByMaterial.count > 0) {
                debitTxn.material_serial_numbers = [];
                const serialNumberData = [];
                for (const row of grnDataByMaterial.rows) {
                    serialNumberArr.push(row.serialNumber);
                    serialNumberData.push({
                        materialId: debitTxn.materialId,
                        quantity: 1,
                        rate: debitTxn.rate,
                        serialNumber: row.serialNumber,
                        status: "0"
                    });
                }
                debitTxn.material_serial_numbers.push(...serialNumberData);
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, serialNumberArr);
            }
        }
        const debitArray = JSON.parse(JSON.stringify(debitStockLedger));
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    if (data?.referenceDocumentNumber) {
        await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.grnIds });
        await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.grnLedgerDetailId });
    }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create Cancel MIN(Material Issue Note) Transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createCancelMinTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    if (req.body?.grnLedgerIds?.length) {
        const isGrnCancelled = await cancelTransactionService.transactionAlreadyExists({
            transactionTypeId: req.body.grnLedgerIds,
            isCancelled: true
        });
        throwIf(isGrnCancelled, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    for await (const txn of req.body.grn_stock_ledgers) {
        const where = {
            transactionTypeId: { [Op.notIn]: cancelTxns },
            projectId: txn.projectId,
            storeId: txn.storeId,
            storeLocationId: txn.storeLocationId,
            materialId: txn.materialId,
            createdAt: { [Op.gt]: req.body.grnTxnCreatedAt },
            quantity: { [Op.lt]: 0 },
            isCancelled: false
        };
        const isDebitTxnExists = await cancelTransactionService.transactionAlreadyExists(where);
        throwIf(isDebitTxnExists, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    }
    throwIfNot(req.body.grnLedgerDetailId, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.minLedgerDetailId, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.minLedgerIds, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.grn_stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    throwIfNot(req.body.min_stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    const debitBody = structuredClone(req.body);
    const creditBody = structuredClone(req.body);
    const debitRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.grn_stock_ledgers[0].organizationId,
        storeId: req.body.grn_stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.grn_stock_ledgers[0].transactionTypeId] },
        isActive: "1"
    });
    const creditRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.min_stock_ledgers[0].organizationId,
        storeId: req.body.min_stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.min_stock_ledgers[0].transactionTypeId] },
        isActive: "1"
    });
    if (debitRangeData && creditRangeData) {
        debitBody.transactionTypeId = req.body.grn_stock_ledgers[0].transactionTypeId;
        debitBody.transactionTypeRangeId = debitRangeData.id;
        creditBody.transactionTypeRangeId = creditRangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.min_stock_ledgers?.length && req.body?.grn_stock_ledgers?.length) {
        req.body.min_stock_ledgers.forEach((object) => {
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = structuredClone(req.body.min_stock_ledgers);
        for await (const debitTxn of req.body.grn_stock_ledgers) {
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers = debitTxn.serialNumber.map((serialNumber) => ({
                    materialId: debitTxn.materialId,
                    quantity: 1,
                    rate: debitTxn.rate,
                    serialNumber,
                    status: "0"
                }));
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn?.serialNumber);
            }
        }
        const debitArray = structuredClone(req.body.grn_stock_ledgers);
        debitBody.stock_ledgers = [];
        debitBody.stock_ledgers = debitArray;
        creditBody.stock_ledgers = [];
        creditBody.stock_ledgers = creditArray;
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    }
    const transactionDataArray = [
        {
            body: debitBody,
            rangeData: debitRangeData,
            transactionType: "CANCELGRN"
        },
        {
            body: creditBody,
            rangeData: creditRangeData,
            transactionType: "CANCELMIN"
        }
    ];
    const referenceDocNo = {};
    for await (const transactionData of transactionDataArray) {
        const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
            transactionData.rangeData
        );
        transactionData.body.referenceDocumentNumber = referenceDocumentNumber;
        transactionData.body.stock_ledgers.forEach((object) => {
            object.referenceDocumentNumber = referenceDocumentNumber;
        });
        const data = await stockLedgerService.createStockLedger(transactionData.body);
        if (data?.referenceDocumentNumber) {
            if (transactionData.transactionType === "CANCELGRN") {
                referenceDocNo.CANCELGRN = data?.referenceDocumentNumber;
                await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.grnLedgerIds });
                await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.grnLedgerDetailId });
            }
            if (transactionData.transactionType === "CANCELMIN") {
                referenceDocNo.CANCELMIN = data?.referenceDocumentNumber;
                await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.minLedgerIds });
                await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.minLedgerDetailId });
            }
        }
    }
    return { message: statusMessages.TRANSACTION_CANCELLED_SUCCESSFULLY, referenceDocNo };
};

/**
 * Method to create Cancel LTL(Location To Location) Transfer Transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createCancelLtlTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    if (req.body?.ltlIds?.length) {
        const isLtlCancelled = await cancelTransactionService.transactionAlreadyExists({
            transactionTypeId: req.body.ltlIds,
            isCancelled: true
        });
        throwIf(isLtlCancelled, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    for await (const txn of req.body.stock_ledgers) {
        const where = {
            transactionTypeId: { [Op.notIn]: cancelTxns },
            projectId: txn.projectId,
            storeId: txn.storeId,
            storeLocationId: req.body.fromStoreLocationId,
            materialId: txn.materialId,
            createdAt: { [Op.gt]: req.body.transactionCreatedAt },
            quantity: { [Op.lt]: 0 },
            isCancelled: false
        };
        const isDebitTxnExists = await cancelTransactionService.transactionAlreadyExists(where);
        throwIf(isDebitTxnExists, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    }
    throwIfNot(req.body.ltlLedgerDetailId, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.stock_ledgers?.length) {
        req.body.stock_ledgers.forEach((object) => {
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = structuredClone(req.body.stock_ledgers);
        const debitStockLedger = structuredClone(creditArray);
        for await (const debitTxn of debitStockLedger) {
            debitTxn.otherStoreLocationId = debitTxn.storeLocationId;
            debitTxn.storeLocationId = req.body.fromStoreLocationId;
            debitTxn.quantity = 0 - debitTxn.quantity;
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers.forEach((obj) => { obj.status = "0"; });
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn?.serialNumber);
            }
        }
        const debitArray = structuredClone(debitStockLedger);
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray, ...creditArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    if (data?.referenceDocumentNumber) {
        await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.ltlIds });
        await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.ltlLedgerDetailId });
    }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create Cancel STC(Customer To Project Site Store) Transfer Transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createCancelStcTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    if (req.body?.stcIds?.length) {
        const isStcCancelled = await cancelTransactionService.transactionAlreadyExists({
            transactionTypeId: req.body.stcIds,
            isCancelled: true
        });
        throwIf(isStcCancelled, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    for await (const txn of req.body.debit_stock_ledgers) {
        const where = {
            transactionTypeId: { [Op.notIn]: cancelTxns },
            projectId: txn.projectId,
            organizationId: txn.organizationId,
            storeId: txn.storeId,
            storeLocationId: txn.storeLocationId,
            materialId: txn.materialId,
            createdAt: { [Op.gt]: req.body.transactionCreatedAt },
            quantity: { [Op.lt]: 0 },
            isCancelled: false
        };
        const isDebitTxnExists = await cancelTransactionService.transactionAlreadyExists(where);
        throwIf(isDebitTxnExists, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    }
    throwIfNot(req.body.stcLedgerDetailId, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.debit_stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    throwIfNot(req.body.credit_stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.credit_stock_ledgers[0].organizationId,
        storeId: req.body.credit_stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.debit_stock_ledgers?.length && req.body?.credit_stock_ledgers?.length) {
        req.body.credit_stock_ledgers.forEach((object) => {
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = structuredClone(req.body.credit_stock_ledgers);
        for await (const debitTxn of req.body.debit_stock_ledgers) {
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers = debitTxn.serialNumber.map((serialNumber) => ({
                    materialId: debitTxn.materialId,
                    quantity: 1,
                    rate: debitTxn.rate,
                    serialNumber,
                    status: "0"
                }));
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn?.serialNumber);
            }
        }
        const debitArray = structuredClone(req.body.debit_stock_ledgers);
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray, ...creditArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    if (data?.referenceDocumentNumber) {
        await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.stcIds });
        await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.stcLedgerDetailId });
    }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create Cancel STO(project site store to another project site store) Transfer Transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createCancelStoTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    if (req.body?.stoIds?.length) {
        const isStoProcessedOrCancelled = await cancelTransactionService.transactionAlreadyExists({
            transactionTypeId: req.body.stoIds,
            [Op.or]: [{ isProcessed: true }, { isCancelled: true }]
        });
        throwIf(isStoProcessedOrCancelled, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    throwIfNot(req.body.stoLedgerDetailId, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NOT_FOUND);
    throwIfNot(req.body.stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.stock_ledgers?.length) {
        req.body.stock_ledgers.forEach((object) => {
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = structuredClone(req.body.stock_ledgers);
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...creditArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    if (data?.referenceDocumentNumber) {
        await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.stoIds });
        await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.stoLedgerDetailId });
    }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create Cancel STO GRN Transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createCancelStoGrnTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    if (req.body?.stoGrnIds?.length) {
        const isStoGrnCancelled = await cancelTransactionService.transactionAlreadyExists({
            transactionTypeId: req.body.stoGrnIds,
            isCancelled: true
        });
        throwIf(isStoGrnCancelled, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    for await (const txn of req.body.stock_ledgers) {
        const where = {
            transactionTypeId: { [Op.notIn]: cancelTxns },
            projectId: txn.projectId,
            storeId: txn.storeId,
            storeLocationId: txn.storeLocationId,
            materialId: txn.materialId,
            createdAt: { [Op.gt]: req.body.transactionCreatedAt },
            quantity: { [Op.lt]: 0 },
            isCancelled: false
        };
        const isDebitTxnExists = await cancelTransactionService.transactionAlreadyExists(where);
        throwIf(isDebitTxnExists, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    }
    throwIfNot(req.body.stoGrnLedgerDetailId, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NOT_FOUND);
    throwIfNot(req.body.stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    throwIfNot(req.body.stock_ledgers[0].stoRefDocNo, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.stock_ledgers[0].transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.stock_ledgers?.length > 0) {
        for await (const debitTxn of req.body.stock_ledgers) {
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers = debitTxn.serialNumber.map((serialNumber) => ({
                    materialId: debitTxn.materialId,
                    quantity: 1,
                    rate: debitTxn.rate,
                    serialNumber,
                    status: "0"
                }));
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn?.serialNumber);
            }
        }
        const debitArray = structuredClone(req.body.stock_ledgers);
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    if (data?.referenceDocumentNumber) {
        await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.stoGrnIds });
        await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.stoGrnLedgerDetailId });
        const { transactionTypeId, projectId, storeId, otherStoreId, stoRefDocNo, otherProjectId } = req.body.stock_ledgers[0];
        let transactionType = "fadec802-92aa-4127-8ba1-e3d9b6bd4936"; // STO
        let project = projectId;
        if (transactionTypeId === "73df529f-9008-4917-ab2b-088b9222fa68") { // CANCELPTPGRN
            transactionType = "22ce5829-2a1e-407c-88f6-5ebc38455519"; // PTP
            project = otherProjectId;
        }
        const stoTxn = await stockLedgerService.getStockLedgerByCondition({ transactionTypeId: transactionType, projectId: project, storeId: otherStoreId, otherStoreId: storeId, referenceDocumentNumber: stoRefDocNo, ...otherProjectId && { otherProjectId: projectId } });
        if (stoTxn?.stockLedgerDetailId) {
            await stockLedgerService.updateStockLedger({ isProcessed: false }, { stockLedgerDetailId: stoTxn.stockLedgerDetailId, isProcessed: true });
        }
    }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to Cancel MRN(Material Return Note) Transaction
 * @param { object } req.body
 * @returns { object } data
 */
const cancelMrnTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    if (req.body?.mrnLedgerIds?.length) {
        const isMrnProcessedOrCancelled = await cancelTransactionService.transactionAlreadyExists({
            transactionTypeId: req.body.mrnLedgerIds,
            [Op.or]: [{ isProcessed: true }, { isCancelled: true }]
        });
        throwIf(isMrnProcessedOrCancelled, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    throwIfNot(req.body.mrnLedgerDetailId, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.stock_ledgers?.length) {
        req.body.stock_ledgers.forEach((object) => {
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = structuredClone(req.body.stock_ledgers);
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...creditArray];

    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    if (data?.referenceDocumentNumber) {
        await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.mrnLedgerIds });
        await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.mrnLedgerDetailId });
    }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to Cancel Return MRN(Return Material Return Note) Transaction
 * @param { object } req.body
 * @returns { object } data
 */
const cancelReturnMrnTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    if (req.body?.returnMrnIds?.length) {
        const isReturnMrnCancelled = await cancelTransactionService.transactionAlreadyExists({
            transactionTypeId: req.body.returnMrnIds,
            isCancelled: true
        });
        throwIf(isReturnMrnCancelled, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    for await (const txn of req.body.returnmrn_stock_ledgers) {
        const where = {
            transactionTypeId: { [Op.notIn]: cancelTxns },
            projectId: txn.projectId,
            storeId: txn.storeId,
            storeLocationId: txn.storeLocationId,
            materialId: txn.materialId,
            createdAt: { [Op.gt]: req.body.returnMrnTxnCreatedAt },
            quantity: { [Op.lt]: 0 },
            isCancelled: false
        };
        const isDebitTxnExists = await cancelTransactionService.transactionAlreadyExists(where);
        throwIf(isDebitTxnExists, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_CAN_NOT_BE_CANCELLED);
    }
    throwIfNot(req.body.returnMrnDetailId, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.mrnIds, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.mrnDetailId, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(req.body.mrn_stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    throwIfNot(req.body.returnmrn_stock_ledgers[0].requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    const debitBody = structuredClone(req.body);
    const creditBody = structuredClone(req.body);
    const debitRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.returnmrn_stock_ledgers[0].organizationId,
        storeId: req.body.returnmrn_stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.returnmrn_stock_ledgers[0].transactionTypeId] },
        isActive: "1"
    });
    const creditRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.mrn_stock_ledgers[0].organizationId,
        storeId: req.body.mrn_stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.mrn_stock_ledgers[0].transactionTypeId] },
        isActive: "1"
    });
    if (debitRangeData && creditRangeData) {
        debitBody.transactionTypeRangeId = debitRangeData.id;
        creditBody.transactionTypeId = req.body.mrn_stock_ledgers[0].transactionTypeId;
        creditBody.transactionTypeRangeId = creditRangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.mrn_stock_ledgers?.length && req.body?.returnmrn_stock_ledgers?.length) {
        req.body.mrn_stock_ledgers.forEach((object) => {
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = structuredClone(req.body.mrn_stock_ledgers);
        for await (const debitTxn of req.body.returnmrn_stock_ledgers) {
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers = debitTxn.serialNumber.map((serialNumber) => ({
                    materialId: debitTxn.materialId,
                    quantity: 1,
                    rate: debitTxn.rate,
                    serialNumber,
                    status: "0"
                }));
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn?.serialNumber);
            }
        }
        const debitArray = structuredClone(req.body.returnmrn_stock_ledgers);
        debitBody.stock_ledgers = [];
        debitBody.stock_ledgers = debitArray;
        creditBody.stock_ledgers = [];
        creditBody.stock_ledgers = creditArray;
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_CANCEL_TRANSACTION_DETAILS);
    }
    const transactionDataArray = [
        {
            body: debitBody,
            rangeData: debitRangeData,
            transactionType: "CANCELRETURNMRN"
        },
        {
            body: creditBody,
            rangeData: creditRangeData,
            transactionType: "CANCELMRN"
        }
    ];
    const referenceDocNo = {};
    for await (const transactionData of transactionDataArray) {
        const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
            transactionData.rangeData
        );
        transactionData.body.referenceDocumentNumber = referenceDocumentNumber;
        transactionData.body.stock_ledgers.forEach((object) => {
            object.referenceDocumentNumber = referenceDocumentNumber;
        });
        const data = await stockLedgerService.createStockLedger(transactionData.body);
        if (data?.referenceDocumentNumber) {
            if (transactionData.transactionType === "CANCELRETURNMRN") {
                referenceDocNo.CANCELRETURNMRN = data?.referenceDocumentNumber;
                await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.returnMrnIds });
                await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.returnMrnDetailId });
            }
            if (transactionData.transactionType === "CANCELMRN") {
                referenceDocNo.CANCELMRN = data?.referenceDocumentNumber;
                await stockLedgerService.updateStockLedger({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.mrnIds });
                await stockLedgerService.updateStockLedgerDetails({ cancelRefDocNo: data?.referenceDocumentNumber, isCancelled: true }, { id: req.body.mrnDetailId });
            }
        }
    }
    return { message: statusMessages.TRANSACTION_CANCELLED_SUCCESSFULLY, referenceDocNo };
};

module.exports = {
    createCancelGrnTransaction,
    createCancelMinTransaction,
    createCancelLtlTransaction,
    createCancelStcTransaction,
    createCancelStoTransaction,
    createCancelStoGrnTransaction,
    cancelMrnTransaction,
    cancelReturnMrnTransaction
};
