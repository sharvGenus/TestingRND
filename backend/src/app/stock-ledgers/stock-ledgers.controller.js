const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIfNot, throwError, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const stockLedgerService = require("./stock-ledgers.service");
const smtpConfigurationService = require("../smtp-configurations/smtp-configurations.service");
const transactionTypeRangeService = require("../transaction-type-ranges/transaction-type-ranges.service");
const requestApprovalService = require("../request-approvals/request-approvals.service");
const { getUserGovernedLovArray } = require("../access-management/access-management.service");
const { processFileTasks } = require("../files/files.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "stock_ledger_details.reference_document_number": "referenceDocumentNumber",
    "stock_ledger_details.challan_number": "challanNumber",
    "stock_ledger_details.invoice_number": "invoiceNumber",
    "stock_ledger_details.po_number": "poNumber",
    "stock_ledger_details.lr_number": "lrNumber",
    "stock_ledger_details.transporter_name": "transporterName",
    "stock_ledger_details.transporter_contact_number": "transporterContactNumber",
    "stock_ledger_details.vehicle_number": "vehicleNumber",
    "stock_ledger_details.e_way_bill_number": "eWayBillNumber",
    "stock_ledger_details.remarks": "remarks"
};

/**
 * Method to create stock ledger
 * @param { object } req.body
 * @returns { object } data
 */
const createStockLedger = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_STOCK_LEDGER_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.toOrganizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers,
        statusCodes.BAD_REQUEST,
        statusMessages.MISSING_STOCK_LEDGER_DETAILS
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.toOrganizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        req.body.stock_ledgers.forEach((txn) => {
            if (txn?.serialNumber?.length) {
                txn.material_serial_numbers = txn.serialNumber.map((serialNumber) => ({
                    materialId: txn.materialId,
                    quantity: 1,
                    rate: txn.rate,
                    serialNumber
                }));
            }
        });
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_STOCK_LEDGER_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });

    const attachments = [];
    if (Array.isArray(req.body.attachments)) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Inventory/Transactions/GRN/${req.body.referenceDocumentNumber.replaceAll("/", "_")}/Attachments`
        });
        req.body.attachments = processedArray;

        for (const file of processedArray) {
            const fileArr = file.split("/");
            const fileName = fileArr.pop();
            const fileObj = {
                filename: fileName,
                path: `${req.protocol}://${req.get("host")}/api/v1/attachments/Inventory/Transactions/GRN/${req.body.referenceDocumentNumber.replaceAll("/", "_")}/Attachments/${fileName}`
            };
            attachments.push(fileObj);
        }
    }

    const data = await stockLedgerService.createStockLedger(req.body);
    if (
        data
        && data.transactionTypeId
        && data.stock_ledgers
        && data.stock_ledgers.length > 0
        && data.stock_ledgers[0].projectId
    ) {
        await smtpConfigurationService.sendEmail(
            data.transactionTypeId,
            data.stock_ledgers[0].projectId,
            data.stock_ledgers[0],
            false,
            attachments
        );
    }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to get stock ledger details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getStockLedgerDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.STOCK_LEDGER_DETAILS_ID_REQUIRED);
    const data = await stockLedgerService.getStockLedgerDetailsByCondition({ id: req.params.id }, undefined);
    return { data };
};

/**
 * Method to get all stock ledger details
 * @param { object } req.body
 * @returns { object } data
 */
const getAllStockLedgerDetails = async (req) => {
    const { userId } = req.user;
    const { transactionTypeId, referenceDocumentNumber, searchString, accessors } = req.query;
    const where = { [Op.and]: [] };
    let keysInArray = [];
    let data;

    if (searchString && searchString.length > 0) {
        const accessorArray = accessors ? JSON.parse(accessors) : [];
        keysInArray = getMappingKeysInArray(accessorArray, mapping);
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

    const lovData = await getUserGovernedLovArray(userId, "Project");
    if (Array.isArray(lovData)) {
        if (lovData.length) {
            req.query.projectId = lovData;
            if (transactionTypeId === "86f7e47f-195a-4cbd-87a4-1f5a3e97025f") { // CTS
                req.query.storeId = [...await getUserGovernedLovArray(userId, "Customer Store")];
            } else {
                req.query.storeId = [...await getUserGovernedLovArray(userId, "Company Store"), ...await getUserGovernedLovArray(req.user.userId, "Contractor Store")];
            }
            if (req.query.storeId.length) {
                const mappingArray = (searchString && searchString.length > 0 && keysInArray.length) ? keysInArray : [];
                const { count, stockLedgerDetailIds } = await stockLedgerService.getStockLedgerDetailIds(req.query, mappingArray);
                req.query.pageNumber = "1";
                data = await stockLedgerService.getAllStockLedgerDetails({ id: stockLedgerDetailIds });
                data.count = count;
            } else {
                data = await stockLedgerService.getAllStockLedgerDetails({ id: [] });
            }
        } else {
            data = await stockLedgerService.getAllStockLedgerDetails({ id: [] });
        }
    } else {
        if (transactionTypeId) where[Op.and].push({ transactionTypeId });
        if (referenceDocumentNumber) where[Op.and].push({ referenceDocumentNumber });
        data = await stockLedgerService.getAllStockLedgerDetails(where);
    }

    return { data };
};

/**
 * Method to get all stock ledger
 * @param { object } req.body
 * @returns { object } data
 */
const getAllStockLedgers = async (req) => {
    const where = {};
    if (req.query) {
        if (req.query.transactionTypeId) {
            where.transactionTypeId = req.query.transactionTypeId;
        }
        if (req.query.requestNumber) {
            where.requestNumber = req.query.requestNumber;
        }
        if (req.query.referenceDocumentNumber) {
            where.referenceDocumentNumber = req.query.referenceDocumentNumber;
        }
        if (req.query.projectId) {
            where.projectId = req.query.projectId;
        }
        if (req.query.storeId) {
            where.storeId = req.query.storeId;
        }
        if (req.query.storeLocationId) {
            where.storeLocationId = req.query.storeLocationId;
        }
        if (req.query.otherStoreId) {
            where.otherStoreId = req.query.otherStoreId;
        }
        if (req.query.materialId) {
            where.materialId = req.query.materialId;
        }
        if (req.query.isCancelled) {
            where.isCancelled = req.query.isCancelled;
        }
        if (req.query.isProcessed) {
            where.isProcessed = req.query.isProcessed;
        }
        if (req.query && req.query.fromDate && req.query.toDate) {
            where.createdAt = {
                [Op.between]: [req.query.fromDate, req.query.toDate]
            };
        }
    }
    const data = await stockLedgerService.getAllStockLedgers(where);
    return { data };
};

const getAllStocks = async (req) => {
    const where = {};

    const { transactionTypeId, requestNumber, referenceDocumentNumber, projectId, storeId, storeLocationId, otherStoreId, materialId, installerId, isCancelled, isProcessed, fromDate, toDate } = req.query;

    if (transactionTypeId) where.transactionTypeId = transactionTypeId;
    if (requestNumber) where.requestNumber = requestNumber;
    if (referenceDocumentNumber) where.referenceDocumentNumber = referenceDocumentNumber;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (storeLocationId) where.storeLocationId = storeLocationId;
    if (otherStoreId) where.otherStoreId = otherStoreId;
    if (materialId) where.materialId = materialId;
    if (installerId) where.installerId = installerId;
    if (isCancelled) where.isCancelled = isCancelled;
    if (isProcessed) where.isProcessed = isProcessed;
    if (fromDate && toDate) where.createdAt = { [Op.between]: [fromDate, toDate] };
    const data = await stockLedgerService.getTxnsForStockLedger("ALLSTOCKS", where, ["id", "stockLedgerDetailId", "transactionTypeId", "referenceDocumentNumber", "requestNumber", "installerId", "storeLocationId", "materialId", "uomId", "quantity", "rate", "value", "otherStoreId", "otherProjectId", "createdBy", "createdAt"]);
    return { data };
};

/**
 * Method to get all stock ledger with serial numbers
 * @param { object } req.body
 * @returns { object } data
 */
const getAllStockLedgersWithSerialNumber = async (req) => {
    const where = {};
    if (req.query) {
        if (req.query.transactionTypeId) {
            where.transactionTypeId = req.query.transactionTypeId;
        }
        if (req.query.requestNumber) {
            where.requestNumber = req.query.requestNumber;
        }
        if (req.query.referenceDocumentNumber) {
            where.referenceDocumentNumber = req.query.referenceDocumentNumber;
        }
        if (req.query.projectId) {
            where.projectId = req.query.projectId;
        }
        if (req.query.storeId) {
            where.storeId = req.query.storeId;
        }
        if (req.query.storeLocationId) {
            where.storeLocationId = req.query.storeLocationId;
        }
        if (req.query.otherStoreId) {
            where.otherStoreId = req.query.otherStoreId;
        }
        if (req.query.otherProjectId) {
            where.otherProjectId = req.query.otherProjectId;
        }
        if (req.query.materialId) {
            where.materialId = req.query.materialId;
        }
        if (req.query.isCancelled) {
            where.isCancelled = req.query.isCancelled;
        }
        if (req.query.isProcessed) {
            where.isProcessed = req.query.isProcessed;
        }
        if (req.query.isNegative) {
            where.quantity = { [Op.lt]: 0 };
        }
    }
    const data = await stockLedgerService.getAllStockLedgersWithSerialNumber(where);
    return { data };
};

/**
 * Method to get transaction count by request number
 * @param { object } req.body
 * @returns { object } data
 */
const getTransactionCountByRequestNumber = async (req) => {
    throwIfNot(req.query.requestNumber, statusCodes.BAD_REQUEST, statusMessages.REQUEST_NUMBER_NOT_FOUND);
    const count = await stockLedgerService.getTransactionCount({ requestNumber: req.query.requestNumber });
    return { count };
};

/**
 * Method to get all transaction data
 * @param { object } req.body
 * @returns { object } data
 */
const getAllTransactionData = async (req) => {
    const where = {};
    let withTransaction = true;
    const { projectId, storeId, materialId, withoutTransaction } = req.query;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (materialId) where.materialId = materialId;
    if (withoutTransaction) withTransaction = false;

    const data = await stockLedgerService.getAllStockLedgers(where);
    const allTransactionData = [];
    if (data && data.count > 0) {
        const groupByMaterialObject = data.rows.reduce((group, arr) => {
            const { material } = arr;
            group[material.id] = group[material.id] ?? [];
            group[material.id].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByMaterialObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    store: val.organization_store,
                    materialId: val.materialId,
                    material: val.material,
                    uom: val.uom,
                    tax: val.tax,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity,
                    value: quantity === 0 ? 0 : totalValue,
                    ...withTransaction && { transactions: groupByMaterialObject[val.materialId] }
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            allTransactionData.push(totalMaterial);
        }
    }
    return { allTransactionData };
};

const getStockLedgerMaterialList = async (req) => {
    const where = {};
    const { projectId, storeId, materialId } = req.query;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (materialId) where.materialId = materialId;

    const data = await stockLedgerService.getTxnsForStockLedger("MATERIAL", where, ["storeId", "materialId", "uomId", "quantity", "rate", "value", "createdAt"]);
    
    const allTransactionData = [];
    if (data && data.count > 0) {
        const groupByMaterialObject = data.rows.reduce((group, arr) => {
            const { materialId } = arr;
            group[materialId] = group[materialId] ?? [];
            group[materialId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByMaterialObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    store: val.organization_store,
                    materialId: val.materialId,
                    material: val.material,
                    uom: val.uom,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity,
                    value: quantity === 0 ? 0 : totalValue
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            allTransactionData.push(totalMaterial);
        }
    }
    return { allTransactionData };
};

const getAllTxnMaterial = async (req) => {
    const where = {};
    const { projectId, storeId } = req.query;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    const data = await stockLedgerService.getTxnMaterials(where);
    return { data };
};

const getTxnsByMaterial = async (req) => {
    const where = {};
    const { projectId, storeId, materialId } = req.query;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (materialId) where.materialId = materialId;

    const data = await stockLedgerService.getTxnsDetails(where, ["materialId", "quantity", "rate", "value", "tax"]);
    
    const allTransactionData = [];
    if (data && data.count > 0) {
        const groupByMaterialObject = data.rows.reduce((group, arr) => {
            const { materialId } = arr;
            group[materialId] = group[materialId] ?? [];
            group[materialId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByMaterialObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    materialId: val.materialId,
                    tax: val.tax,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            allTransactionData.push(totalMaterial);
        }
    }
    return { allTransactionData };
};

/**
 * Method to get all store location transaction data
 * @param { object } req.body
 * @returns { object } data
 */
const getAllStoreLocationTransactionData = async (req) => {
    const where = {};
    if (req.query) {
        if (req.query.projectId) {
            where.projectId = req.query.projectId;
        }
        if (req.query.storeId) {
            if (req.query.storeLocationId) {
                where.storeId = req.query.storeId;
                where.storeLocationId = req.query.storeLocationId;
            } else {
                where.storeId = req.query.storeId;
                where.storeLocationId = { [Op.ne]: null };
            }
        }
        if (req.query.materialId) {
            where.materialId = req.query.materialId;
        }
        if (req.query.installerId) {
            where.installerId = req.query.installerId;
        }
    }
    const data = await stockLedgerService.getAllStockLedgers(where);
    const allStoreLocationTransactionData = [];
    if (data && data.count > 0) {
        const groupByStoreObject = data.rows.reduce((group, arr) => {
            // const { storeLocationId } = arr;
            // group[storeLocationId] = group[storeLocationId] ?? [];
            // group[storeLocationId].push(arr);
            const { storeLocationId, materialId } = arr;
            group[storeLocationId + materialId] = group[storeLocationId + materialId] ?? [];
            group[storeLocationId + materialId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByStoreObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    storeLocationId: val.storeLocationId,
                    storeLocation: val.organization_store_location,
                    materialId: val.materialId,
                    material: val.material,
                    uom: val.uom,
                    tax: val.tax,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity,
                    value: quantity === 0 ? 0 : totalValue,
                    transactions: groupByStoreObject[val.storeLocationId + val.materialId]
                    // transactions: groupByStoreObject[val.storeLocationId]
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            allStoreLocationTransactionData.push(totalMaterial);
        }
    }
    return { allStoreLocationTransactionData };
};

const getStockLedgerLocationList = async (req) => {
    const where = {};
    const { projectId, storeId, storeLocationId, materialId, installerId } = req.query;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (storeLocationId) where.storeLocationId = storeLocationId;
    if (materialId) where.materialId = materialId;
    if (installerId) where.installerId = installerId;

    const data = await stockLedgerService.getTxnsForStockLedger("LOCATION", where, ["storeLocationId", "materialId", "uomId", "quantity", "rate", "value", "createdAt"]);

    const allStoreLocationTransactionData = [];
    if (data && data.count > 0) {
        const groupByStoreObject = data.rows.reduce((group, arr) => {
            const { storeLocationId, materialId } = arr;
            group[storeLocationId + materialId] = group[storeLocationId + materialId] ?? [];
            group[storeLocationId + materialId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByStoreObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    storeLocationId: val.storeLocationId,
                    storeLocation: val.organization_store_location,
                    materialId: val.materialId,
                    material: val.material,
                    uom: val.uom,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity,
                    value: quantity === 0 ? 0 : totalValue
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            allStoreLocationTransactionData.push(totalMaterial);
        }
    }
    return { allStoreLocationTransactionData };
};

const getTxnsByLocationAndMaterial = async (req) => {
    const where = {};
    const { projectId, storeId, storeLocationId, materialId, installerId } = req.query;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (storeLocationId) where.storeLocationId = storeLocationId;
    if (materialId) where.materialId = materialId;
    if (installerId) where.installerId = installerId;

    const data = await stockLedgerService.getTxnsDetails(where, ["storeLocationId", "materialId", "quantity", "rate", "value", "tax"]);

    const allStoreLocationTransactionData = [];
    if (data && data.count > 0) {
        const groupByStoreObject = data.rows.reduce((group, arr) => {
            const { storeLocationId, materialId } = arr;
            group[storeLocationId + materialId] = group[storeLocationId + materialId] ?? [];
            group[storeLocationId + materialId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByStoreObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    storeLocationId: val.storeLocationId,
                    materialId: val.materialId,
                    tax: val.tax,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            allStoreLocationTransactionData.push(totalMaterial);
        }
    }
    return { allStoreLocationTransactionData };
};

/**
 * Method to get all installer stock in a store location with transactions
 * @param { object } req.body
 * @returns { object } data
 */
const getInstallerStockInStoreLocationWithTransaction = async (req) => {
    const where = {};
    if (req.query) {
        const queryParams = ["projectId", "storeId", "storeLocationId", "materialId", "installerId"];
        for (const param of queryParams) {
            where[param] = req.query[param] || { [Op.ne]: null };
        }
    }
    const data = await stockLedgerService.getAllStockLedgers(where);
    const installerStock = [];
    if (data && data.count > 0) {
        const groupByInstallerObject = data.rows.reduce((group, arr) => {
            const { installerId } = arr;
            group[installerId] = group[installerId] ?? [];
            group[installerId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByInstallerObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    installerId: val.installerId,
                    installer: val.installer,
                    storeLocationId: val.storeLocationId,
                    storeLocation: val.organization_store_location,
                    materialId: val.materialId,
                    material: val.material,
                    uom: val.uom,
                    tax: val.tax,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity,
                    value: quantity === 0 ? 0 : totalValue,
                    transactions: groupByInstallerObject[val.installerId]
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            installerStock.push(totalMaterial);
        }
    }
    return { installerStock };
};

const getStockLedgerInstallerList = async (req) => {
    const where = {};
    if (req.query) {
        const queryParams = ["projectId", "storeId", "storeLocationId", "materialId", "installerId"];
        for (const param of queryParams) {
            where[param] = req.query[param] || { [Op.ne]: null };
        }
    }

    const data = await stockLedgerService.getTxnsForStockLedger("INSTALLER", where, ["storeLocationId", "installerId", "materialId", "uomId", "quantity", "rate", "value", "createdAt"]);

    const installerStock = [];
    if (data && data.count > 0) {
        const groupByInstallerObject = data.rows.reduce((group, arr) => {
            const { installerId } = arr;
            group[installerId] = group[installerId] ?? [];
            group[installerId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByInstallerObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    storeLocationId: val.storeLocationId,
                    storeLocation: val.organization_store_location,
                    installerId: val.installerId,
                    installer: val.installer,
                    materialId: val.materialId,
                    material: val.material,
                    uom: val.uom,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity,
                    value: quantity === 0 ? 0 : totalValue
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            installerStock.push(totalMaterial);
        }
    }
    return { installerStock };
};

/**
 * Method to get quantiy in store
 * @param { object } req.body
 * @returns { object } data
 */
const getQuantityInStore = async (req) => {
    const where = {};
    const associationWhere = {};
    if (req.query) {
        if (req.query.projectId) {
            where.projectId = req.query.projectId;
        }
        if (req.query.storeId) {
            if (req.query.materialId) {
                where.storeId = req.query.storeId;
                where.materialId = req.query.materialId;
            } else {
                where.storeId = req.query.storeId;
                where.materialId = { [Op.ne]: null };
            }
        }
        if (req.query.isRestricted) {
            where.storeLocationId = { [Op.ne]: null };
            associationWhere.isRestricted = req.query.isRestricted;
        }
    }
    
    const data = await stockLedgerService.getAllStockLedgersByAssociationFilter(where, associationWhere, ["materialId", "quantity"]);

    const quantityInStore = [];
    if (data && data.count > 0) {
        const groupByMaterialObject = data.rows.reduce((group, arr) => {
            const { materialId } = arr;
            group[materialId] = group[materialId] ?? [];
            group[materialId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByMaterialObject)) {
            let quantity = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                materialInStore = {
                    materialId: val.materialId,
                    quantity: parseFloat(quantity.toFixed(3))
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            quantityInStore.push(totalMaterial);
        }
    }
    return { quantityInStore };
};

/**
 * Method to create MIN (Material Issue Note) transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createMinTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_MIN_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.requestTransactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.REQUEST_NUMBER_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].organizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    const debitBody = structuredClone(req.body);
    debitBody.toStoreId = req.body.stock_ledgers[0].storeId;
    const creditBody = structuredClone(req.body);
    creditBody.toStoreId = req.body.fromStoreId;
    const debitRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.fromOrganizationId,
        storeId: req.body.fromStoreId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    const creditRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.stock_ledgers[0].transactionTypeId] },
        isActive: "1"
    });
    if (debitRangeData && creditRangeData) {
        debitBody.transactionTypeRangeId = debitRangeData.id;
        creditBody.transactionTypeId = req.body.stock_ledgers[0].transactionTypeId;
        creditBody.transactionTypeRangeId = creditRangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body && req.body.requestNumber && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        req.body.stock_ledgers.forEach((object) => {
            object.otherStoreId = req.body.fromStoreId;
            object.otherStoreLocationId = object.fromStoreLocationId;
            object.requestNumber = req.body.requestNumber;
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
            debitTxn.otherStoreId = debitTxn.storeId;
            debitTxn.otherStoreLocationId = debitTxn.storeLocationId;
            debitTxn.transactionTypeId = req.body.transactionTypeId;
            debitTxn.requestNumber = req.body.requestNumber;
            debitTxn.organizationId = req.body.fromOrganizationId;
            debitTxn.storeId = req.body.fromStoreId;
            debitTxn.storeLocationId = debitTxn.fromStoreLocationId;
            debitTxn.quantity = 0 - debitTxn.quantity;
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers.forEach((obj) => { obj.status = "0"; });
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn.serialNumber);
            }
        }
        const debitArray = structuredClone(debitStockLedger);
        debitBody.stock_ledgers = [];
        debitBody.stock_ledgers = debitArray;
        creditBody.stock_ledgers = [];
        creditBody.stock_ledgers = creditArray;
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_MIN_TRANSACTION_DETAILS);
    }
    const transactionDataArray = [
        {
            body: debitBody,
            rangeData: debitRangeData,
            transactionType: "MIN"
        },
        {
            body: creditBody,
            rangeData: creditRangeData,
            transactionType: "GRN"
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
        if (transactionData.transactionType === "MIN") referenceDocNo.MIN = data?.dataValues?.referenceDocumentNumber;
        if (transactionData.transactionType === "GRN") referenceDocNo.GRN = data?.dataValues?.referenceDocumentNumber;
    }
    await requestApprovalService.updateRequestProcessedStatus("MRF", req.body.requestTransactionTypeId, req.body.requestNumber, debitBody.toStoreId);
    return { message: statusMessages.TRANSACTION_CREATED_SUCCESSFULLY, referenceDocNo };
};

/**
 * Method to create CTI & ITC transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createCtiTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].organizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
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
    if (req.body && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        req.body.stock_ledgers.forEach((object) => {
            object.otherStoreId = object.storeId;
            object.otherStoreLocationId = object.fromStoreLocationId;
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = JSON.parse(JSON.stringify(req.body.stock_ledgers));
        const debitStockLedger = JSON.parse(JSON.stringify(creditArray));
        for await (const debitTxn of debitStockLedger) {
            debitTxn.otherStoreId = debitTxn.storeId;
            debitTxn.otherStoreLocationId = debitTxn.storeLocationId;
            debitTxn.storeLocationId = debitTxn.fromStoreLocationId;
            debitTxn.installerId = req.body.transactionTypeId === "799ee00c-0819-498a-9e47-3ac269f33db8" ? req.body.installerId : null;
            debitTxn.quantity = 0 - debitTxn.quantity;
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers = debitTxn.serialNumber.map((serialNumber) => ({
                    materialId: debitTxn.materialId,
                    quantity: 1,
                    rate: debitTxn.rate,
                    serialNumber,
                    status: "0"
                }));
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn.serialNumber);
            }
        }
        const debitArray = JSON.parse(JSON.stringify(debitStockLedger));
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray, ...creditArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create ITI transaction (Installer To Another Installer)
 * @param { object } req.body
 * @returns { object } data
 */
const createItiTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ITI_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].organizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    const itcBody = structuredClone(req.body);
    const ctiBody = structuredClone(req.body);
    const itcRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    const ctiRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.stock_ledgers[0].transactionTypeId] },
        isActive: "1"
    });
    if (itcRangeData && ctiRangeData) {
        itcBody.transactionTypeRangeId = itcRangeData.id;
        ctiBody.transactionTypeId = req.body.stock_ledgers[0].transactionTypeId;
        ctiBody.transactionTypeRangeId = ctiRangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        // Initial stock ledger data
        const initialStockLedger = JSON.parse(JSON.stringify(req.body.stock_ledgers));
        // ITC credit stock ledger
        req.body.stock_ledgers.forEach((object) => {
            object.transactionTypeId = req.body.transactionTypeId;
            object.otherStoreId = object.storeId;
            object.otherStoreLocationId = object.fromStoreLocationId;
            object.storeLocationId = object.receivingStoreLocationId;
            object.installerId = null;
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber,
                    status: "0"
                }));
            }
        });
        const itcCreditArray = JSON.parse(JSON.stringify(req.body.stock_ledgers));
        // ICT debit stock ledger
        const debitStockLedger = JSON.parse(JSON.stringify(itcCreditArray));
        debitStockLedger.forEach((object) => {
            object.transactionTypeId = req.body.transactionTypeId;
            object.otherStoreId = object.storeId;
            object.otherStoreLocationId = object.receivingStoreLocationId;
            object.storeLocationId = object.fromStoreLocationId;
            object.installerId = req.body.fromInstallerId;
            object.quantity = 0 - object.quantity;
        });
        const itcDebitArray = JSON.parse(JSON.stringify(debitStockLedger));
        // CTI debit stock ledger
        const newDebitStockLedger = JSON.parse(JSON.stringify(itcCreditArray));
        for await (const debitTxn of newDebitStockLedger) {
            debitTxn.transactionTypeId = "5b4e46d5-7bf5-4f42-8c4a-b6337533fdff";
            debitTxn.otherStoreId = debitTxn.storeId;
            debitTxn.otherStoreLocationId = debitTxn.fromStoreLocationId;
            debitTxn.storeLocationId = debitTxn.receivingStoreLocationId;
            debitTxn.installerId = null;
            debitTxn.quantity = 0 - debitTxn.quantity;
            if (debitTxn?.serialNumber?.length) {
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn.serialNumber);
            }
        }
        const ctiDebitArray = JSON.parse(JSON.stringify(newDebitStockLedger));
        // CTI credit stock ledger
        const newCreditStockLedger = JSON.parse(JSON.stringify(initialStockLedger));
        newCreditStockLedger.forEach((object) => {
            object.otherStoreId = object.storeId;
            object.otherStoreLocationId = object.receivingStoreLocationId;
            object.installerId = req.body.toInstallerId;
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const ctiCreditArray = JSON.parse(JSON.stringify(newCreditStockLedger));
        itcBody.stock_ledgers = [];
        itcBody.stock_ledgers = [...itcDebitArray, ...itcCreditArray];
        ctiBody.stock_ledgers = [];
        ctiBody.stock_ledgers = [...ctiDebitArray, ...ctiCreditArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_ITI_TRANSACTION_DETAILS);
    }
    const transactionDataArray = [
        {
            body: itcBody,
            rangeData: itcRangeData,
            transactionType: "ITC"
        },
        {
            body: ctiBody,
            rangeData: ctiRangeData,
            transactionType: "CTI"
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
            if (transactionData.transactionType === "ITC") referenceDocNo.ITC = data.referenceDocumentNumber;
            if (transactionData.transactionType === "CTI") referenceDocNo.CTI = data.referenceDocumentNumber;
        }
    }
    return { message: statusMessages.TRANSACTION_CREATED_SUCCESSFULLY, referenceDocNo };
};

/**
 * Method to create STO(project site store to another project site store) transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createStoTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_STO_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.requestTransactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.REQUEST_NUMBER_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].organizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    req.body.toStoreId = req.body.stock_ledgers[0].storeId;
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.fromStoreId,
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
            debitTxn.otherStoreId = debitTxn.storeId;
            debitTxn.requestNumber = req.body.requestNumber;
            debitTxn.storeId = req.body.fromStoreId;
            debitTxn.storeLocationId = debitTxn.fromStoreLocationId;
            debitTxn.quantity = 0 - debitTxn.quantity;
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers = debitTxn.serialNumber.map((serialNumber) => ({
                    materialId: debitTxn.materialId,
                    quantity: 1,
                    rate: debitTxn.rate,
                    serialNumber,
                    status: "0"
                }));
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn.serialNumber);
            }
        }
        const debitArray = JSON.parse(JSON.stringify(debitStockLedger));
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_STO_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });

    if (Array.isArray(req.body.attachments)) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Inventory/Transactions/STO/${req.body.referenceDocumentNumber.replaceAll("/", "_")}/Attachments`
        });
        req.body.attachments = processedArray;
    }

    const data = await stockLedgerService.createStockLedger(req.body);
    await requestApprovalService.updateRequestProcessedStatus("STR", req.body.requestTransactionTypeId, req.body.requestNumber, req.body.toStoreId);
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to get details based on STO Number
 * @param { object } req.body
 * @returns { object } data
 */
const getStoRequestDetails = async (req) => {
    const where = {};
    if (req.query && req.query.transactionTypeId) {
        where.transactionTypeId = req.query.transactionTypeId;
    }
    if (req.query && req.query.referenceDocumentNumber) {
        where.referenceDocumentNumber = req.query.referenceDocumentNumber;
    }
    const data = await stockLedgerService.getStoRequestDetails(where);
    return { data };
};

/**
* Method to get get active serial numbers in store or store location
* @param { object } req.body
* @returns { object } data
*/
const getActiveSerialNumbersInStore = async (req) => {
    const where = { status: "1" };
    if (req.query) {
        if (req.query.projectId) {
            where["$stock_ledger.project_id$"] = req.query.projectId;
        }
        if (req.query.storeId) {
            if (req.query.materialId) {
                where["$stock_ledger.store_id$"] = req.query.storeId;
                where["$stock_ledger.material_id$"] = req.query.materialId;
            } else {
                where["$stock_ledger.store_id$"] = req.query.storeId;
                where["$stock_ledger.material_id$"] = { [Op.ne]: null };
            }
        }
        if (req.query.storeLocationId) {
            where["$stock_ledger.store_location_id$"] = req.query.storeLocationId;
        }
        if (req.query.installerId) {
            where["$stock_ledger.installer_id$"] = req.query.installerId;
        }
    }
    const data = await stockLedgerService.getActiveSerialNumbersInStore(where);
    let serialNumbersByMaterial = {};
    if (data && data.count > 0) {
        serialNumbersByMaterial = data.rows.reduce((group, arr) => {
            const stockLedger = arr.stock_ledger;
            group[stockLedger.materialId] = group[stockLedger.materialId] ?? [];
            group[stockLedger.materialId].push(arr.serialNumber);
            return group;
        }, {});
    }
    return { count: data.count, serialNumbersByMaterial };
};

/**
* Method to get get serial numbers
* @param { object } req.body
* @returns { object } data
*/
const getSerialNumbers = async (req) => {
    const where = {};
    if (req.query) {
        if (req.query.projectId) {
            where["$stock_ledger.project_id$"] = req.query.projectId;
        }
        if (req.query.storeId) {
            where["$stock_ledger.store_id$"] = req.query.storeId;
        }
        if (req.query.storeLocationId) {
            where["$stock_ledger.store_location_id$"] = req.query.storeLocationId;
        }
        if (req.query.materialId) {
            where["$stock_ledger.material_id$"] = req.query.materialId;
        }
        if (req.query.installerId) {
            where["$stock_ledger.installer_id$"] = req.query.installerId;
        }
        if (req.query.stockLedgerId) {
            where.stockLedgerId = req.query.stockLedgerId;
        }
        if (req.query.status) {
            where.status = req.query.status;
        }
    }
    const data = await stockLedgerService.getActiveSerialNumbersInStore(where);
    return { data };
};

/**
 * Method to get installed serial number
 * @param { object } req.body
 * @returns { object } data
 */
const getInstalledSerialNumber = async (req) => {
    throwIfNot(req.body.transactionIdArr, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    const { transactionIdArr } = req.body;
    if (Array.isArray(transactionIdArr) && transactionIdArr.length > 0) {
        const stockLedgerIdArr = transactionIdArr.map((dataObj) => dataObj.stockLedgerId);
        if (Array.isArray(stockLedgerIdArr) && stockLedgerIdArr.length > 0) {
            const serialNumberData = await stockLedgerService.getSerialNumbers({
                stockLedgerId: stockLedgerIdArr
            });
            if (serialNumberData.count > 0) {
                const serialNumberDict = {};
                for (const item of serialNumberData.rows) {
                    const { stockLedgerId, serialNumber } = item;
                    serialNumberDict[stockLedgerId] = serialNumber;
                }
                const mergedArr = transactionIdArr
                    .map(({ stockLedgerId, transaction }) => ({
                        serialNumber: serialNumberDict[stockLedgerId],
                        transaction: transaction.toLowerCase()
                    })).filter(({ serialNumber }) => serialNumber !== "" && serialNumber !== undefined && serialNumber !== null);
                if (mergedArr?.length > 0) {
                    const serialNumberCount = mergedArr.reduce((countMap, { serialNumber, transaction }) => {
                        countMap[serialNumber] = (countMap[serialNumber] || 0) + (transaction === "credit" ? 1 : -1);
                        return countMap;
                    }, {});
                    const serialNumber = Object.keys(serialNumberCount).filter((key) => serialNumberCount[key] === 1);
                    return { serialNumber };
                }
            }
        }
    }
};

/**
 * Method to create STO GRN transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createStoGrnTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_STO_GRN_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.stoIds,
        statusCodes.BAD_REQUEST,
        statusMessages.REQUEST_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].organizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.fromStoreId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
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
    if (req.body && req.body.requestNumber && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        req.body.stock_ledgers.forEach((object) => {
            object.otherStoreId = req.body.fromStoreId;
            object.otherStoreLocationId = object.fromStoreLocationId;
            object.requestNumber = req.body.requestNumber;
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = JSON.parse(JSON.stringify(req.body.stock_ledgers));
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...creditArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_STO_GRN_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    req.body.toStoreId = req.body.fromStoreId;
    const data = await stockLedgerService.createStockLedger(req.body);
    await stockLedgerService.updateStockLedger({ isProcessed: true }, {
        id: req.body.stoIds,
        isProcessed: false
    });
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create STC transaction (Project Site Store to Customer)
 * @param { object } req.body
 * @returns { object } data
 */
const createStcTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_STC_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.transactionTypeId === "86f7e47f-195a-4cbd-87a4-1f5a3e97025f" ? req.body.stock_ledgers[0].organizationId : req.body.fromOrganizationId,
        storeId: req.body.transactionTypeId === "86f7e47f-195a-4cbd-87a4-1f5a3e97025f" ? req.body.stock_ledgers[0].storeId : req.body.fromStoreId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        req.body.stock_ledgers.forEach((object) => {
            // Add requestNumber if transaction is CTS(Customer to store)
            if (req.body.transactionTypeId === "86f7e47f-195a-4cbd-87a4-1f5a3e97025f") {
                object.requestNumber = req.body.requestNumber;
            }
            object.otherStoreId = req.body.fromStoreId;
            object.otherStoreLocationId = object.fromStoreLocationId;
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = JSON.parse(JSON.stringify(req.body.stock_ledgers));
        const debitStockLedger = JSON.parse(JSON.stringify(creditArray));
        for await (const debitTxn of debitStockLedger) {
            debitTxn.otherStoreId = debitTxn.storeId;
            debitTxn.otherStoreLocationId = debitTxn.storeLocationId;
            debitTxn.organizationId = req.body.fromOrganizationId;
            debitTxn.storeId = req.body.fromStoreId;
            debitTxn.storeLocationId = debitTxn.fromStoreLocationId;
            debitTxn.quantity = 0 - debitTxn.quantity;
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers.forEach((obj) => { obj.status = "0"; });
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn.serialNumber);
            }
        }
        const debitArray = JSON.parse(JSON.stringify(debitStockLedger));
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray, ...creditArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_STC_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    // Update stock ledger if transaction is CTS(Customer to store)
    if (req.body.transactionTypeId === "86f7e47f-195a-4cbd-87a4-1f5a3e97025f" && Array.isArray(req.body.stockLedgerIds) && req.body.stockLedgerIds.length > 0) {
        await stockLedgerService.updateStockLedger({ isProcessed: true }, {
            id: req.body.stockLedgerIds,
            isProcessed: false
        });
    }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create PTP transaction (Project to another Project)
 * @param { object } req.body
 * @returns { object } data
 */
const createPtpTransaction = async (req) => {
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    throwIfNot(rangeData, statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    req.body.transactionTypeRangeId = rangeData.id;
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(rangeData);
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    for await (const debitTxn of req.body.stock_ledgers) {
        debitTxn.referenceDocumentNumber = referenceDocumentNumber;
        debitTxn.quantity = -debitTxn.quantity;
        if (debitTxn?.serialNumber?.length) {
            debitTxn.material_serial_numbers = debitTxn.serialNumber.map((serialNumber) => ({
                materialId: debitTxn.materialId,
                quantity: 1,
                rate: debitTxn.rate,
                serialNumber,
                status: "0"
            }));
            await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn.serialNumber);
            delete debitTxn.serialNumber;
        }
    }
    const data = await stockLedgerService.createStockLedger(req.body);
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create PTP GRN transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createPtpGrnTransaction = async (req) => {
    throwIfNot(req.body?.requestIds?.length, statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_DETAILS);
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    throwIfNot(rangeData, statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    req.body.transactionTypeRangeId = rangeData.id;
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(rangeData);
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((creditTxn) => {
        creditTxn.referenceDocumentNumber = referenceDocumentNumber;
        if (creditTxn?.serialNumber?.length) {
            creditTxn.material_serial_numbers = creditTxn.serialNumber.map((serialNumber) => ({
                materialId: creditTxn.materialId,
                quantity: 1,
                rate: creditTxn.rate,
                serialNumber
            }));
            delete creditTxn.serialNumber;
        }
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    await stockLedgerService.updateStockLedger({ isProcessed: true }, { id: req.body.requestIds });
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create SLTSL transaction (Store Location to Another Store Location)
 * @param { object } req.body
 * @returns { object } data
 */
const createSltslTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].organizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
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
    if (req.body && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        req.body.stock_ledgers.forEach((object) => {
            // Add requestNumber if transaction is RCTS(Repair center to store)
            // if (req.body.transactionTypeId === "8ae879e6-7b55-4040-8254-7f4420a6a1c1") {
            //     object.requestNumber = req.body.requestNumber;
            // }
            object.otherStoreId = object.storeId;
            object.otherStoreLocationId = object.fromStoreLocationId;
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber
                }));
            }
        });
        const creditArray = JSON.parse(JSON.stringify(req.body.stock_ledgers));
        const debitStockLedger = JSON.parse(JSON.stringify(creditArray));
        for await (const debitTxn of debitStockLedger) {
            debitTxn.otherStoreId = debitTxn.storeId;
            debitTxn.otherStoreLocationId = debitTxn.storeLocationId;
            debitTxn.storeLocationId = debitTxn.fromStoreLocationId;
            debitTxn.quantity = 0 - debitTxn.quantity;
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers.forEach((obj) => { obj.status = "0"; });
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn.serialNumber);
            }
        }
        const debitArray = JSON.parse(JSON.stringify(debitStockLedger));
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray, ...creditArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    // Update stock ledger if transaction is RCTS(Repair center to store)
    // if (req.body.transactionTypeId === "8ae879e6-7b55-4040-8254-7f4420a6a1c1" && Array.isArray(req.body.stockLedgerIds) && req.body.stockLedgerIds.length > 0) {
    //     await stockLedgerService.updateStockLedger({ isProcessed: true }, {
    //         id: req.body.stockLedgerIds,
    //         isProcessed: false
    //     });
    // }
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create MRN (Material Return Note) transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createMrnTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_MRN_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.requestIds,
        statusCodes.BAD_REQUEST,
        statusMessages.REQUEST_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    req.body.toStoreId = req.body.stock_ledgers[0].storeId;
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.fromOrganizationId,
        storeId: req.body.fromStoreId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        req.body.transactionTypeRangeId = rangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    if (req.body?.requestNumber && req.body.stock_ledgers?.length > 0) {
        const creditArray = structuredClone(req.body.stock_ledgers);
        const debitStockLedger = structuredClone(creditArray);
        for await (const debitTxn of debitStockLedger) {
            debitTxn.otherStoreId = debitTxn.storeId;
            debitTxn.requestNumber = req.body.requestNumber;
            debitTxn.organizationId = req.body.fromOrganizationId;
            debitTxn.storeId = req.body.fromStoreId;
            debitTxn.storeLocationId = debitTxn.fromStoreLocationId;
            debitTxn.quantity = 0 - debitTxn.quantity;
            if (debitTxn?.serialNumber?.length) {
                debitTxn.material_serial_numbers = debitTxn.serialNumber.map((serialNumber) => ({
                    materialId: debitTxn.materialId,
                    quantity: 1,
                    rate: debitTxn.rate,
                    serialNumber,
                    status: "0"
                }));
                await stockLedgerService.updateMaterialSerialNumberStatus(debitTxn.materialId, debitTxn.serialNumber);
            }
        }
        const debitArray = structuredClone(debitStockLedger);
        req.body.stock_ledgers = [];
        req.body.stock_ledgers = [...debitArray];
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_MRN_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    await requestApprovalService.updateRequestApproval({ isProcessed: true }, { id: req.body.requestIds, isProcessed: false });
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to create RETURN MRN (Return Material Return Note) transaction
 * @param { object } req.body
 * @returns { object } data
 */
const createReturnMrnTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.mrnIds,
        statusCodes.BAD_REQUEST,
        statusMessages.REQUEST_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].organizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    req.body.toStoreId = req.body.fromStoreId;
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
    if (req.body?.requestNumber && req.body.stock_ledgers?.length > 0) {
        req.body.stock_ledgers.forEach((object) => {
            object.otherStoreId = req.body.fromStoreId;
            object.otherStoreLocationId = object.fromStoreLocationId;
            object.requestNumber = req.body.requestNumber;
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
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
        rangeData
    );
    req.body.referenceDocumentNumber = referenceDocumentNumber;
    req.body.stock_ledgers.forEach((object) => {
        object.referenceDocumentNumber = referenceDocumentNumber;
    });
    const data = await stockLedgerService.createStockLedger(req.body);
    await stockLedgerService.updateStockLedger({ isProcessed: true }, {
        id: req.body.mrnIds,
        isProcessed: false
    });
    return { data: { referenceDocumentNumber: data.referenceDocumentNumber } };
};

/**
 * Method to check if serial number already exist
 * @param { object } req.body
 * @returns { object } data
 */
const serialNumberAlreadyExists = async (req) => {
    const { materialId, serialNumber } = req.body;
    throwIfNot(materialId, statusCodes.BAD_REQUEST, statusMessages.MATERIAL_ID_REQUIRED);
    throwIfNot(serialNumber, statusCodes.BAD_REQUEST, statusMessages.MISSING_SERIAL_NUMBERS);

    const grnTransactionTypeId = "3bf4cfe9-0ba0-4ba5-bd66-bfae7eecfeaf";
    const isSerialNumberAlreadyExists = await stockLedgerService.serialNumberAlreadyExists({ materialId, serialNumber });
    if (!isSerialNumberAlreadyExists) return { count: 0 };

    const serialNumbers = await stockLedgerService.getSerialNumbers({ materialId, serialNumber });
    const ledgerIdsSet = new Set();
    for (const sn of serialNumbers.rows) {
        ledgerIdsSet.add(sn.stockLedgerId);
    }

    const txnCount = await stockLedgerService.getTransactionCount({
        id: Array.from(ledgerIdsSet),
        transactionTypeId: grnTransactionTypeId,
        isCancelled: false,
        requestNumber: null
    });
    if (txnCount > 0) throwIf(isSerialNumberAlreadyExists, statusCodes.DUPLICATE, statusMessages.SERIAL_NUMBER_ALREADY_EXIST);

    const txnCountForCancelled = await stockLedgerService.getTransactionCount({
        id: Array.from(ledgerIdsSet),
        transactionTypeId: grnTransactionTypeId,
        isCancelled: true,
        requestNumber: null
    });
    if (txnCountForCancelled > 0) return { count: 0 };
};

/**
 * Method to update E Way Bill Number & Date by id
 * @param { object } req.body
 * @returns { object } data
 */
const updateEWayBill = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.STOCK_LEDGER_DETAILS_ID_REQUIRED);
    const isStockLedgerDetailsExists = await stockLedgerService.isStockLedgerDetailsAlreadyExists({
        id: req.params.id
    });
    throwIfNot(isStockLedgerDetailsExists, statusCodes.NOT_FOUND, statusMessages.STOCK_LEDGER_DETAILS_NOT_EXISTS);
    await stockLedgerService.updateStockLedgerDetails(req.body, { id: req.params.id });
    return { message: statusMessages.E_WAY_BILL_NUMBER_DATE_UPDATED_SUCCESSFULLY };
};

/**
 * Method to create installed transaction
 * @param { object } req.body
 * @returns { object } data
 */
const checkForInstallation = async (req) => {
    if (
        req.body.projectId
        && req.body.installerOrgId
        && req.body.installerStoreId
        && req.body.materialId
    ) {
        const data = await stockLedgerService.checkForInstallation(req.body);
        return { data };
    } else {
        throw new Error("Missing details for INSTALLATION check.");
    }
};

/**
 * Method to create consumption transaction
 * @param { object } req.body
 * @returns { object } data
 */
const consumptionTransaction = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    throwIfNot(
        req.body.transactionTypeId,
        statusCodes.BAD_REQUEST,
        statusMessages.TRANSACTION_TYPE_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].organizationId,
        statusCodes.BAD_REQUEST,
        statusMessages.ORGANIZATION_ID_NOT_FOUND
    );
    throwIfNot(
        req.body.stock_ledgers[0].storeId,
        statusCodes.BAD_REQUEST,
        statusMessages.STORE_ID_REQUIRED
    );
    const debitBody = structuredClone(req.body);
    const debitRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId: req.body.stock_ledgers[0].organizationId,
        storeId: req.body.stock_ledgers[0].storeId,
        transactionTypeIds: { [Op.contains]: [req.body.transactionTypeId] },
        isActive: "1"
    });
    if (debitRangeData) {
        debitBody.transactionTypeRangeId = debitRangeData.id;
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    }
    let creditBody, creditRangeData;
    if (req?.body?.toTransactionTypeId === "f3848838-6e7c-4240-a4e2-27e084164a17" && req?.body?.toOrganizationId && req?.body?.toStoreId && req?.body?.toStoreLocationId) {
        creditBody = structuredClone(req.body);
        creditRangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
            organizationId: req.body.toOrganizationId,
            storeId: req.body.toStoreId,
            transactionTypeIds: { [Op.contains]: [req.body.toTransactionTypeId] },
            isActive: "1"
        });
        if (debitRangeData && creditRangeData) {
            creditBody.transactionTypeId = req.body.toTransactionTypeId;
            creditBody.transactionTypeRangeId = creditRangeData.id;
        } else {
            throwError(statusCodes.NOT_FOUND, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
        }
    }
    if (req.body && req.body.requestNumber && req.body.stock_ledgers && req.body.stock_ledgers.length > 0) {
        req.body.stock_ledgers.forEach((object) => {
            object.requestNumber = req.body.requestNumber;
            if (object?.serialNumber?.length) {
                object.material_serial_numbers = object.serialNumber.map((serialNumber) => ({
                    materialId: object.materialId,
                    quantity: 1,
                    rate: object.rate,
                    serialNumber,
                    status: "0"
                }));
            }
        });
        const stockLedgerForConsumption = structuredClone(req.body.stock_ledgers);
        const stockLedgerForInstalled = structuredClone(req.body.stock_ledgers);
        const consumptionArr = [];
        const installedArr = [];
        for await (const txn of stockLedgerForConsumption) {
            if (txn.transactionTypeId === "f3848838-6e7c-4240-a4e2-27e084164a17") {
                txn.transactionTypeId = "ef599c14-9e23-447d-9f35-336d69fdfe74";
                txn.requestNumber = req.body.requestNumber;
                txn.quantity = 0 - txn.quantity;
                txn.otherStoreId = req.body.toStoreId;
                txn.otherStoreLocationId = req.body.toStoreLocationId;
                if (txn?.serialNumber?.length) await stockLedgerService.updateMaterialSerialNumberStatus(txn.materialId, txn.serialNumber);
                consumptionArr.push(txn);
            } else {
                txn.quantity = 0 - txn.quantity;
                txn.otherStoreId = txn.storeId;
                txn.otherStoreLocationId = txn.storeLocationId;
                if (txn?.serialNumber?.length) await stockLedgerService.updateMaterialSerialNumberStatus(txn.materialId, txn.serialNumber);
                consumptionArr.push(txn);
            }
        }
        for (const txn of stockLedgerForInstalled) {
            if (txn.transactionTypeId === "f3848838-6e7c-4240-a4e2-27e084164a17") {
                txn.otherStoreId = txn.storeId;
                txn.otherStoreLocationId = txn.storeLocationId;
                txn.transactionTypeId = "f3848838-6e7c-4240-a4e2-27e084164a17";
                txn.organizationId = req.body.toOrganizationId;
                txn.storeId = req.body.toStoreId;
                txn.storeLocationId = req.body.toStoreLocationId;
                txn.quantity = Math.abs(txn.quantity);
                installedArr.push(txn);
            }
        }
        if (debitBody?.stock_ledgers) {
            debitBody.stock_ledgers = [];
            debitBody.stock_ledgers = consumptionArr;
        }
        if (creditBody?.stock_ledgers) {
            creditBody.stock_ledgers = [];
            creditBody.stock_ledgers = installedArr;
        }
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_DETAILS);
    }
    const transactionDataArray = [];
    if (debitBody?.stock_ledgers?.length > 0) {
        transactionDataArray.push({
            body: debitBody,
            rangeData: debitRangeData,
            transactionType: "CONSUMPTION"
        });
    }
    if (creditBody?.stock_ledgers?.length > 0) {
        transactionDataArray.push({
            body: creditBody,
            rangeData: creditRangeData,
            transactionType: "INSTALLED"
        });
    }
    const referenceDocNo = {
        CONSUMPTION: [],
        INSTALLED: []
    };
    for await (const transactionData of transactionDataArray) {
        const referenceDocumentNumber = await stockLedgerService.generateReferenceDocumentNumber(
            transactionData.rangeData
        );
        transactionData.body.referenceDocumentNumber = referenceDocumentNumber;
        transactionData.body.stock_ledgers.forEach((object) => {
            object.referenceDocumentNumber = referenceDocumentNumber;
        });
        const data = await stockLedgerService.createStockLedger(transactionData.body);
        if (transactionData.transactionType === "CONSUMPTION") referenceDocNo.CONSUMPTION.push(data?.dataValues?.referenceDocumentNumber);
        if (transactionData.transactionType === "INSTALLED") referenceDocNo.INSTALLED.push(data?.dataValues?.referenceDocumentNumber);
    }
    await requestApprovalService.updateRequestProcessedStatus("CONSUMPTIONREQUEST", "671306a0-48c5-4e0c-a604-d86624f35d6d", req.body.requestNumber, req.body.stock_ledgers[0].storeId);
    return { message: statusMessages.TRANSACTION_CREATED_SUCCESSFULLY, referenceDocNo };
};

/**
 * Method to get all locations stock in store
 * @param { object } req.body
 * @returns { object } data
 */
const getAllLocationsStockInStore = async (req) => {
    const where = {};
    const locNames = [];
    const { projectId, storeId, storeLocationId, installerId, materialId, supplierId } = req.query;
    
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (storeLocationId) where.storeLocationId = storeLocationId;
    if (installerId) where.installerId = installerId;
    if (materialId) where.materialId = materialId;
    if (supplierId) {
        where["$stock_ledger_detail.supplier_id$"] = supplierId;
        if (!storeLocationId) locNames.push("service center");
    } else if (!storeLocationId) locNames.push("receiving", "brought out", "genus supply");
    
    const data = await stockLedgerService.getAllTransactionsForLoc(where);
    
    const allStoreLocationsStock = [];

    if (data && data.count > 0) {
        const groupObject = data.rows.reduce((group, arr) => {
            const { storeLocationId, organization_store_location: orgStoreLoc, materialId } = arr;
            if (orgStoreLoc.name.toLowerCase().includes(locNames)) {
                group[storeLocationId] = group[storeLocationId] ?? {};
                group[storeLocationId][materialId] = group[storeLocationId][materialId] ?? [];
                group[storeLocationId][materialId].push(arr);
            }
            return group;
        }, {});

        Object.entries(groupObject).forEach(([storeLocationId, outerValue]) => {
            const obj = { storeLocationId: storeLocationId, allMaterialsArr: [] };
            
            Object.entries(outerValue).forEach(([materialId, innerValue]) => {
                obj.storeLocationName = innerValue[0].organization_store_location.name;
                obj.storeLocationCode = innerValue[0].organization_store_location.code;
            
                let quantity = 0;
                let totalValue = 0;
                let materialInStore = {};
                const serialNumberObj = {};
            
                innerValue.forEach((val) => {
                    quantity += val.quantity;
                    totalValue += val.quantity < 0 ? -val.value : val.value;
                    materialInStore = {
                        materialId,
                        material: val.material,
                        uom: val.uom,
                        tax: val.tax,
                        quantity: parseFloat(quantity.toFixed(3)),
                        rate: quantity === 0 ? val.rate : totalValue / quantity,
                        value: quantity === 0 ? 0 : totalValue,
                        ...(installerId && { installer: val.installer })
                    };
                    if (val.material.isSerialNumber) {
                        const filteredSerialNumbers = val.material_serial_numbers.filter((item) => item.status === "1").map((item) => item.serialNumber);
                        if (!serialNumberObj[materialId]) serialNumberObj[materialId] = filteredSerialNumbers;
                        else serialNumberObj[materialId] = [...serialNumberObj[materialId], ...filteredSerialNumbers];
                    }
                });
                materialInStore.serialNumbers = serialNumberObj[materialId];
                const materialStock = JSON.parse(JSON.stringify(materialInStore));
                obj.allMaterialsArr.push(materialStock);
            });
            if (obj.allMaterialsArr.length > 0) allStoreLocationsStock.push(obj);
        });

    }
    
    return { allStoreLocationsStock };
};

module.exports = {
    createStockLedger,
    getStockLedgerDetails,
    getAllStockLedgerDetails,
    getAllStockLedgers,
    getAllStocks,
    getAllStockLedgersWithSerialNumber,
    getTransactionCountByRequestNumber,
    createMinTransaction,
    getAllTransactionData,
    getStockLedgerMaterialList,
    getTxnsByMaterial,
    getAllTxnMaterial,
    getAllStoreLocationTransactionData,
    getStockLedgerLocationList,
    getTxnsByLocationAndMaterial,
    getInstallerStockInStoreLocationWithTransaction,
    getStockLedgerInstallerList,
    getQuantityInStore,
    createCtiTransaction,
    createItiTransaction,
    createStoTransaction,
    getStoRequestDetails,
    getActiveSerialNumbersInStore,
    getSerialNumbers,
    getInstalledSerialNumber,
    createStoGrnTransaction,
    createStcTransaction,
    createPtpTransaction,
    createPtpGrnTransaction,
    createSltslTransaction,
    createMrnTransaction,
    createReturnMrnTransaction,
    serialNumberAlreadyExists,
    updateEWayBill,
    checkForInstallation,
    consumptionTransaction,
    getAllLocationsStockInStore
};
