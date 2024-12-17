/* eslint-disable max-len */
const { Op } = require("sequelize");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const StockLedgerDetails = require("../../database/operation/stock-ledger-details");
const StockLedgers = require("../../database/operation/stock-ledgers");
const MaterialSerialNumbers = require("../../database/operation/material-serial-numbers");
const projectMasterMakerLovsService = require("../project-master-maker-lovs/project-master-maker-lovs.service");
const transactionTypeRangeService = require("../transaction-type-ranges/transaction-type-ranges.service");
const organizationStoreService = require("../organization-stores/organization-stores.service");
const orgStoreLocationService = require("../organization-store-locations/organization-store-locations.service");
const { generatePaginationParams } = require("../../utilities/common-utils");

/**
 * Method to generate reference document number
 */
const generateReferenceDocumentNumber = async (rangeData) => {
    if (
        rangeData
        && rangeData.transactionTypeIds
        && rangeData.storeId
        && rangeData.prefix
        && rangeData.startRange
        && rangeData.endRange
    ) {
        const lastTransactionData = await getStockLedgerByCondition(
            {
                transactionTypeId: rangeData.transactionTypeIds,
                storeId: rangeData.storeId,
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

/**
 * Method to update material serial number status
 */
const updateMaterialSerialNumberStatus = async (materialId, serialNumber) => {
    try {
        const materialSerialNumbers = new MaterialSerialNumbers();
        await materialSerialNumbers.update(
            { status: "0" },
            { materialId, serialNumber, status: "1" }
        );
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MATERIAL_SERIAL_NUMBER_UPDATE_FAILURE, error);
    }
};

const getTransactionCount = async (where) => {
    try {
        const stockLedgers = new StockLedgers();
        const count = await stockLedgers.count(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_TRANSACTION_COUNT_FAILURE, error);
    }
};

const createStockLedger = async (stockLedgerData) => {
    try {
        const stockLedgerDetails = new StockLedgerDetails();
        const data = await stockLedgerDetails.createWithAssociation(stockLedgerData);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_STOCK_LEDGER_FAILURE, error);
    }
};

const getStockLedgerDetailsByCondition = async (where, paginated) => {
    try {
        const stockLedgerDetails = new StockLedgerDetails();
        const data = await stockLedgerDetails.findOne(where, undefined, true, paginated, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_DETAILS_FAILURE, error);
    }
};

const getStockLedgerByCondition = async (where, paginated) => {
    try {
        const stockLedgers = new StockLedgers();
        const data = await stockLedgers.findOne(where, undefined, true, paginated, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_FAILURE, error);
    }
};

const getStockLedgerDetailIds = async (queryParams, mappingArray = []) => {
    try {
        const { db } = new StockLedgerDetails();
        const { transactionTypeId, referenceDocumentNumber, projectId, storeId, sort, searchString } = queryParams;
        let whereCondition = "";
        let searchConditions = "";

        if (searchString && searchString.length > 0 && mappingArray.length) {
            searchConditions = ` AND (${mappingArray.map((column) => `${column} ILIKE '%${searchString}%'`).join(" OR ")})`;
        }

        const addCondition = (column, value) => {
            if (whereCondition === "") {
                whereCondition += "WHERE ";
            } else {
                whereCondition += " AND ";
            }
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    const formattedValue = value.map((item) => `'${item}'`).join(",");
                    whereCondition += `stock_ledgers.${column} IN (${formattedValue})`;
                } else if (column === "project_id") {
                    whereCondition += "1=0";
                } else if (column === "store_id") {
                    whereCondition += "1=0";
                }
            } else {
                whereCondition += `stock_ledger_details.${column} = '${value}'`;
            }
        };

        if (projectId) addCondition("project_id", projectId);
        if (storeId) addCondition("store_id", storeId);
        if (transactionTypeId) addCondition("transaction_type_id", transactionTypeId);
        if (referenceDocumentNumber) addCondition("reference_document_number", referenceDocumentNumber);

        let orderBy = "ORDER BY MAX(stock_ledger_details.created_at) DESC";
        if (Array.isArray(sort) && sort.length) {
            const [column, direction = "DESC"] = sort;
            let dbColumn;
            switch (column) {
                case "createdAt":
                    dbColumn = "stock_ledger_details.created_at";
                    break;
                case "updatedAt":
                    dbColumn = "stock_ledger_details.updated_at";
                    break;
                default:
                    dbColumn = "stock_ledger_details.created_at";
            }
            orderBy = `ORDER BY MAX(${dbColumn}) ${direction}`;
        }
        const paginations = generatePaginationParams(queryParams);

        const countQuery = `SELECT COUNT(DISTINCT stock_ledger_details.id) FROM stock_ledger_details INNER JOIN stock_ledgers ON stock_ledgers.stock_ledger_detail_id = stock_ledger_details.id ${whereCondition} ${searchConditions}`;
        const [[{ count }]] = await db.sequelize.selectQuery(countQuery);
        const sqlQuery = `SELECT stock_ledger_details.id FROM stock_ledger_details INNER JOIN stock_ledgers ON stock_ledgers.stock_ledger_detail_id = stock_ledger_details.id ${whereCondition} ${searchConditions} GROUP BY stock_ledger_details.id ${orderBy} ${paginations}`;
        const [rows] = await db.sequelize.selectQuery(sqlQuery);
        const stockLedgerDetailIds = rows.map((row) => row.id);
        return { count, stockLedgerDetailIds };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_DETAIL_LIST_FAILURE, error);
    }
};

const getAllStockLedgerDetails = async (where, cWhere) => {
    try {
        const stockLedgerDetails = new StockLedgerDetails(undefined, cWhere);
        const data = await stockLedgerDetails.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_DETAIL_LIST_FAILURE, error);
    }
};

const getAllStockLedgers = async (where) => {
    try {
        const stockLedgers = new StockLedgers();
        const data = await stockLedgers.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getTxnsDetails = async (where, attributes = undefined) => {
    try {
        const stockLedgers = new StockLedgers();
        const data = await stockLedgers.findAndCountAll(where, attributes, false, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getTxnsForStockLedger = async (level, where, attributes = undefined, isRelated = true) => {
    try {
        const stockLedgers = new StockLedgers();
        if (level === "MATERIAL") stockLedgers.updateRelationForStockLedgerMaterial();
        if (level === "LOCATION") stockLedgers.updateRelationForStockLedgerLocation();
        if (level === "INSTALLER") stockLedgers.updateRelationForStockLedgerInstaller();
        if (level === "ALLSTOCKS") stockLedgers.updateRelationForAllStocks();
        const data = await stockLedgers.findAndCountAll(where, attributes, isRelated, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getTxnMaterials = async (where) => {
    try {
        const { projectId, storeId } = where;
        const { db } = new StockLedgers();
        const sql = `SELECT m.id, m.code, m.name, m.hsn_code, m.is_serial_number, uom.id AS uom_id, uom.name AS uom_name FROM materials AS m INNER JOIN master_maker_lovs AS uom ON uom.id = m.uom_id WHERE m.id IN (SELECT DISTINCT material_id FROM stock_ledgers WHERE stock_ledgers.project_id = '${projectId}' AND stock_ledgers.store_id = '${storeId}')`;
        const [rows] = await db.sequelize.selectQuery(sql);
        return rows;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getAllStockLedgersByAssociationFilter = async (where, associationWhere, attributes = undefined) => {
    try {
        const stockLedgers = new StockLedgers();
        const data = await stockLedgers.findAndCountAllByAssociationFilter(
            where,
            associationWhere,
            attributes,
            false,
            true,
            undefined,
            false
        );
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getStoRequestDetails = async (where) => {
    try {
        const stockLedgers = new StockLedgers();
        const data = await stockLedgers.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_REQUEST_LIST_FAILURE, error);
    }
};

const getActiveSerialNumbersInStore = async (where) => {
    try {
        const materialSerialNumbers = new MaterialSerialNumbers();
        const data = await materialSerialNumbers.findAndCountAllByFilter(where, ["id", "serialNumber", "status"], true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_SERIAL_NUMBER_FAILURE, error);
    }
};

const getSerialNumbers = async (where) => {
    try {
        const materialSerialNumbers = new MaterialSerialNumbers();
        const data = await materialSerialNumbers.findAndCountAll(where, ["stockLedgerId", "serialNumber"], true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_SERIAL_NUMBER_FAILURE, error);
    }
};

const isStockLedgerDetailsAlreadyExists = async (where) => {
    try {
        const stockLedgerDetails = new StockLedgerDetails();
        const data = await stockLedgerDetails.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_DETAILS_FAILURE, error);
    }
};

const updateStockLedger = async (body, where) => {
    try {
        const stockLedgers = new StockLedgers();
        const data = await stockLedgers.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.STOCK_LEDGER_UPDATE_FAILURE, error);
    }
};

const serialNumberAlreadyExists = async (where) => {
    try {
        const materialSerialNumbers = new MaterialSerialNumbers();
        const data = await materialSerialNumbers.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_SERIAL_NUMBER_FAILURE, error);
    }
};

const updateStockLedgerDetails = async (body, where) => {
    try {
        const stockLedgerDetails = new StockLedgerDetails();
        const data = await stockLedgerDetails.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.STOCK_LEDGER_DETAILS_UPDATE_FAILURE, error);
    }
};

const getAllStockLedgersWithSerialNumber = async (where) => {
    try {
        const stockLedgers = new StockLedgers();
        stockLedgers.updateRelations();
        const data = await stockLedgers.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getMaterialSerialNumberByCondition = async (where, paginated) => {
    try {
        const materialSerialNumbers = new MaterialSerialNumbers();
        const data = await materialSerialNumbers.findOne(where, undefined, true, paginated);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_SERIAL_NUMBER_FAILURE, error);
    }
};

const checkForInstallation = async (body) => {
    const { projectId, installerOrgId, installerStoreId, materialId, serialNumber = [], isCompany = false, byImport = false } = body;
    const installedTxnTypeId = "f3848838-6e7c-4240-a4e2-27e084164a17";
    const oldmeterTxnTypeId = "cb92ec5a-3f86-48cf-86b8-9359dda410a5";
    const cancelInstalledTxnTypeId = "923fa9a0-5ed5-4bc2-9946-dad0da5f34c4";
    const cancelOldmeterTxnTypeId = "79f09003-a389-4a81-abd8-43b77a5f914b";
    const checkRangeExist = async (organizationId, storeId, transactionTypeIdArr, message) => {
        const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
            organizationId,
            storeId,
            transactionTypeIds: { [Op.overlap]: transactionTypeIdArr },
            isActive: "1"
        });
        if (!rangeData) {
            if (byImport) return `Missing ${message} transaction type range.`;
            else throw new Error(`Missing ${message} transaction type range.`);
        }
        const lastTransactionData = await getStockLedgerByCondition(
            {
                transactionTypeId: rangeData.transactionTypeIds,
                storeId: rangeData.storeId,
                referenceDocumentNumber: {
                    [Op.startsWith]: `${rangeData.prefix}`
                }
            },
            { order: [["createdAt", "DESC"]] }
        );
        if (lastTransactionData && lastTransactionData.referenceDocumentNumber) {
            const referenceDocumentNumberEnd = parseInt(lastTransactionData.referenceDocumentNumber.replace(`${rangeData.prefix}`, "")) + 1;
            if (referenceDocumentNumberEnd > rangeData.endRange) {
                if (byImport) return `${message} transaction type range exceeded.`;
                else throw new Error(`${message} transaction type range exceeded.`);
            }
        }
    };
    const installedCheck = await checkRangeExist(installerOrgId, installerStoreId, [installedTxnTypeId], "INSTALLED");
    if (byImport && installedCheck) return installedCheck;
    const oldmeterCheck = await checkRangeExist(installerOrgId, installerStoreId, [oldmeterTxnTypeId], "OLDMETER");
    if (byImport && oldmeterCheck) return oldmeterCheck;
    const cancelInstalledCheck = await checkRangeExist(installerOrgId, installerStoreId, [cancelInstalledTxnTypeId], "CANCELINSTALLED");
    if (byImport && cancelInstalledCheck) return cancelInstalledCheck;
    const cancelOldmeterCheck = await checkRangeExist(installerOrgId, installerStoreId, [cancelOldmeterTxnTypeId], "CANCELOLDMETER");
    if (byImport && cancelOldmeterCheck) return cancelOldmeterCheck;
    const isOldLocationExist = await orgStoreLocationService.organizationStoreLocationAlreadyExists({ name: { [Op.iLike]: "%old%" }, organizationStoreId: installerStoreId, isActive: "1" });
    if (!isOldLocationExist) {
        if (byImport) return "Missing installer OLD store location.";
        else throw new Error("Missing installer OLD store location.");
    }
    if (isCompany) {
        const isInstalledLocationExist = await orgStoreLocationService.organizationStoreLocationAlreadyExists({ name: { [Op.iLike]: "%installed%" }, organizationStoreId: installerStoreId, isActive: "1" });
        if (!isInstalledLocationExist) {
            if (byImport) return "Missing company INSTALLED store location.";
            else throw new Error("Missing company INSTALLED store location.");
        }
    } else if (serialNumber && Array.isArray(serialNumber) && serialNumber.length > 0) {
        // Get grn transaction type details
        const grnTxnTypeId = "3bf4cfe9-0ba0-4ba5-bd66-bfae7eecfeaf";
        const { db } = new StockLedgers();
        // Get company store
        const serialNumbersString = serialNumber.map((serial) => `'${serial}'`).join(", ");
        const getCompanyStores = await db.sequelize.selectQuery(`SELECT sl.store_id FROM stock_ledgers sl INNER JOIN material_serial_numbers sn ON sl.id = sn.stock_ledger_id WHERE sn.serial_number IN (${serialNumbersString}) AND sn.material_id = '${materialId}' AND sn.status = '0' AND sl.transaction_type_id = '${grnTxnTypeId}' AND sl.project_id = '${projectId}' AND sl.request_number IS NULL AND sl.is_cancelled = false ORDER BY sn.created_at ASC;`);
        if (getCompanyStores?.[0]?.[0] === null || getCompanyStores?.[0]?.[0] === undefined) {
            if (byImport) return "Missing COMPANY STORE.";
            else throw new Error("Missing COMPANY STORE.");
        }
        const uniqueStoreIdsSet = new Set(getCompanyStores?.[0]?.map((store) => store.store_id));
        const uniqueStoreIdsArray = Array.from(uniqueStoreIdsSet);
        for await (const storeId of uniqueStoreIdsArray) {
            const isInstalledLocationExist = await orgStoreLocationService.organizationStoreLocationAlreadyExists({ name: { [Op.iLike]: "%installed%" }, organizationStoreId: storeId, isActive: "1" });
            if (!isInstalledLocationExist) {
                if (byImport) return "Missing company INSTALLED store location.";
                else throw new Error("Missing company INSTALLED store location.");
            }
            // Get company store details
            const companyStoreData = await organizationStoreService.getOrganizationStoreByCondition({ id: storeId });
            if (!companyStoreData) {
                if (byImport) return "Missing COMPANY STORE details.";
                else throw new Error("Missing COMPANY STORE details.");
            }
            const companyId = companyStoreData?.organization?.parentId ?? companyStoreData?.organization?.id;
            const companyInstalledCheck = await checkRangeExist(companyId, storeId, [installedTxnTypeId], "Company INSTALLED");
            if (byImport && companyInstalledCheck) return companyInstalledCheck;
            const companyOldmeterCheck = await checkRangeExist(companyId, storeId, [oldmeterTxnTypeId], "Company OLDMETER");
            if (byImport && companyOldmeterCheck) return companyOldmeterCheck;
            const companyCancelInstalledCheck = await checkRangeExist(companyId, storeId, [cancelInstalledTxnTypeId], "Company CANCELINSTALLED");
            if (byImport && companyCancelInstalledCheck) return companyCancelInstalledCheck;
            const companyCancelOldmeterCheck = await checkRangeExist(companyId, storeId, [cancelOldmeterTxnTypeId], "Company CANCELOLDMETER");
            if (byImport && companyCancelOldmeterCheck) return companyCancelOldmeterCheck;
        }
    }
    return true;
};

const stockLedgerDetailsWithSerialNumber = async (where) => {
    try {
        const stockLedgerDetails = new StockLedgerDetails();
        stockLedgerDetails.updateRelations();
        const data = await stockLedgerDetails.findAndCountAll(where, ["id", "transactionTypeId", "referenceDocumentNumber", "consumerName", "kNumber", "responseId", "serialNumber", "brandMasterId", "projectId", "installerId", "serialNumberId", "capitalize", "brandName", "nonSerializeMaterialId", "quantity"], true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_DETAIL_LIST_FAILURE, error);
    }
};
 
const getReferenceDocumentInfo = async (organizationId, storeId, transactionTypeId) => {
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        organizationId,
        storeId,
        transactionTypeIds: { [Op.contains]: [transactionTypeId] },
        isActive: "1"
    });
    if (rangeData) {
        const referenceDocumentNumber = await generateReferenceDocumentNumber(rangeData);
        return { referenceDocumentNumber, transactionTypeRangeId: rangeData.id };
    } else {
        console.log(statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
        return {};
    }
};

const createInstallationTxnBody = async (payload, organizationId, storeId, storeLocationId, materialObj, quantity, sign, isSerialize, isInstaller = true, status = "0", isOldSerialNumber = false) => {
    const { brandMasterId, responseId, projectId, installerId, consumerName, kNumber, counter, isRequestNumber = false, requestNumber = null } = payload;
    const { transactionTypeId, materialId, uomId, serialNumber, rate, tax, serialNumberId = null, capitalize = null, brandName, nonSerializeMaterialId = null, quantity: payloadQuantity = null, otherStoreId = null, otherStoreLocationId = null, isOldDebit = false, oldInstallerId = null } = materialObj;
    const { referenceDocumentNumber, transactionTypeRangeId } = await getReferenceDocumentInfo(organizationId, storeId, transactionTypeId);
    const materialSerialNumberObj = { materialId, quantity: 1, rate, serialNumber, status };
    if (referenceDocumentNumber && transactionTypeRangeId) {
        const stockLedger = {
            transactionTypeId,
            referenceDocumentNumber,
            ...isRequestNumber && { requestNumber },
            projectId,
            organizationId,
            storeId,
            storeLocationId,
            otherStoreId,
            otherStoreLocationId,
            installerId: isOldDebit ? oldInstallerId : installerId,
            materialId,
            uomId,
            quantity: quantity * sign,
            rate,
            value: quantity * rate,
            tax,
            ...isSerialize && { material_serial_numbers: [materialSerialNumberObj] },
            createdBy: isOldDebit ? oldInstallerId : installerId,
            updatedBy: isOldDebit ? oldInstallerId : installerId
        };
        return { transactionTypeId, referenceDocumentNumber, transactionTypeRangeId, consumerName, kNumber, responseId, ...isOldSerialNumber && { serialNumber }, brandMasterId, projectId, installerId, serialNumberId, capitalize, brandName, nonSerializeMaterialId, quantity: payloadQuantity, counter, createdBy: isOldDebit ? oldInstallerId : installerId, updatedBy: isOldDebit ? oldInstallerId : installerId, stock_ledgers: [stockLedger] };
    }
};

const installationTransaction = async (payload) => {
    const { brandMasterId, projectId, installerId, materialArray } = payload;
    for await (const val of materialArray) {
        const { capitalize = false, serialNumberId = "", nonSerializeMaterialId = "", quantity = "", brandName = null } = val;
        if ((brandName === null || (brandName !== null && brandName.toLowerCase() === "null")) && typeof capitalize === "boolean" && serialNumberId) {
            // Installed transaction type id
            const transactionTypeId = "f3848838-6e7c-4240-a4e2-27e084164a17";
            // Get serial number details
            const serialNumberData = await getMaterialSerialNumberByCondition({ id: serialNumberId }, undefined);
            if (serialNumberData) {
                if (serialNumberData?.status == "1") {
                    const { stockLedgerId, materialId, serialNumber } = serialNumberData;
                    // Get installer transaction details
                    const transactionData = await getStockLedgerByCondition({ id: stockLedgerId }, undefined);
                    if (transactionData) {
                        const { organizationId, storeId, storeLocationId, rate, uomId, tax } = transactionData;
                        const materialObj = { transactionTypeId, materialId, uomId, serialNumber, rate, tax, serialNumberId, capitalize, brandName, otherStoreId: storeId, otherStoreLocationId: storeLocationId };
                        const debitBody = await createInstallationTxnBody(payload, organizationId, storeId, storeLocationId, materialObj, 1, -1, true);
                        // Create Debit Transaction 
                        if (typeof debitBody === "object" && debitBody !== null && Object.keys(debitBody).length > 0) {
                            // Deactivate serial number
                            await updateMaterialSerialNumberStatus(materialId, serialNumber);
                            await createStockLedger(debitBody);
                        }
                        let creditBody;
                        if (capitalize) {
                            const grnTransactionTypeId = "3bf4cfe9-0ba0-4ba5-bd66-bfae7eecfeaf";
                            const { db } = new StockLedgers();
                            // Get company store
                            const getCompanyStore = await db.sequelize.selectQuery(`SELECT sl.store_id FROM stock_ledgers sl JOIN material_serial_numbers sn ON sl.id = sn.stock_ledger_id WHERE sn.serial_number = '${serialNumber}' AND sn.material_id = '${materialId}' AND sn.status = '0' AND sl.transaction_type_id = '${grnTransactionTypeId}' AND sl.project_id = '${projectId}' AND sl.request_number IS NULL AND sl.is_cancelled = false ORDER BY sn.created_at ASC LIMIT 1;`);
                            const companyStoreId = getCompanyStore?.[0]?.[0]?.store_id;
                            if (companyStoreId) {
                                // Get company store details
                                const companyStoreData = await organizationStoreService.getOrganizationStoreByCondition({ id: companyStoreId, isActive: "1" });
                                if (companyStoreData) {
                                    // Get installed store location details
                                    const companyInstalledStoreLocationData = await orgStoreLocationService.getOrgStoreLocationByCondition({ name: { [Op.iLike]: "%installed%" }, organizationStoreId: companyStoreData.id, isActive: "1" }, { order: [["createdAt", "DESC"]] });
                                    if (companyInstalledStoreLocationData) {
                                        const companyId = companyStoreData?.organization?.parentId ?? companyStoreData?.organization?.id;
                                        creditBody = await createInstallationTxnBody(payload, companyId, companyStoreId, companyInstalledStoreLocationData.id, materialObj, 1, 1, true);
                                    } else console.log(statusMessages.MISSING_ORGANIZATION_STORE_LOCATION_DETAILS);
                                } else console.log(statusMessages.MISSING_ORGANIZATION_STORE_DETAILS);
                            } else console.log(statusMessages.MISSING_ORGANIZATION_STORE_DETAILS);
                        }
                        // Create Credit Transaction
                        if (typeof creditBody === "object" && creditBody !== null && Object.keys(creditBody).length > 0 && capitalize) {
                            await createStockLedger(creditBody);
                        }
                    } else console.log(statusMessages.MISSING_INSTALLER_DETAILS);
                } else console.log(statusMessages.SERIAL_NUMBER_ALREADY_PROCESSED);
            } else console.log(statusMessages.SERIAL_NUMBER_NOT_FOUND);
        } else if (nonSerializeMaterialId && parseFloat(quantity) > 0) {
            // Installed transaction type id
            const transactionTypeId = "f3848838-6e7c-4240-a4e2-27e084164a17";
            const getTransactionDetails = await getStockLedgerByCondition({ installerId, materialId: nonSerializeMaterialId, quantity: { [Op.gt]: 0 } }, { order: [["createdAt", "DESC"]] });
            let debitBody;
            if (getTransactionDetails) {
                const { organizationId, storeId, storeLocationId, rate, uomId, tax } = getTransactionDetails;
                const materialObj = { transactionTypeId, materialId: nonSerializeMaterialId, uomId, serialNumber: "", rate, tax, nonSerializeMaterialId, quantity, brandName, otherStoreId: storeId, otherStoreLocationId: storeLocationId };
                debitBody = await createInstallationTxnBody(payload, organizationId, storeId, storeLocationId, materialObj, parseFloat(quantity), -1, false);
            } else console.log(statusMessages.MISSING_INSTALLED_DETAILS);
            // Create Transaction 
            if (typeof debitBody === "object" && debitBody !== null && Object.keys(debitBody).length > 0) {
                await createStockLedger(debitBody);
            }
        } else if (brandName !== null && brandName.toLowerCase() !== "null" && typeof capitalize === "boolean" && serialNumberId && brandMasterId) {
            const serialNumberInUpperCase = serialNumberId.toUpperCase();
            // Old meter flow
            const brandDetails = await projectMasterMakerLovsService.getProjectMasterMakerLovByCondition({ id: brandName });
            if (brandDetails?.name) {
                const isBrandNameExist = await projectMasterMakerLovsService.projectMasterMakerLovsAlreadyExists(
                    {
                        masterId: brandMasterId,
                        name: { [Op.iLike]: brandDetails.name }
                    }
                );
                const oldTransactionTypeId = "cb92ec5a-3f86-48cf-86b8-9359dda410a5";
                const installedTransactionTypeId = "f3848838-6e7c-4240-a4e2-27e084164a17";
                const cancelInstalledTxnTypeId = "923fa9a0-5ed5-4bc2-9946-dad0da5f34c4";
                const cancelOldmeterTxnTypeId = "79f09003-a389-4a81-abd8-43b77a5f914b";
                // Check if serial number exist in system
                const isSerialNumberAlreadyExists = await serialNumberAlreadyExists({ serialNumber: serialNumberInUpperCase });
                if (isSerialNumberAlreadyExists && isBrandNameExist) {
                    // System old meter
                    const { db } = new StockLedgers();
                    let debitBody;
                    if (capitalize) {
                        // Get credit transaction
                        const getCreditTransaction = await db.sequelize.selectQuery(`SELECT sl.organization_id, sl.store_id, sl.store_location_id, sl.material_id, sl.uom_id, sl.rate, sl.tax, sl.other_store_id, sl.other_store_location_id, sl.installer_id FROM stock_ledgers sl INNER JOIN material_serial_numbers msn ON msn.stock_ledger_id = sl.id WHERE msn.serial_number = '${serialNumberInUpperCase}' AND msn.status = '0' AND msn.is_active = '1' AND sl.project_id = '${projectId}' AND sl.transaction_type_id = '${installedTransactionTypeId}' AND sl.quantity = 1 AND sl.is_active = '1' ORDER BY msn.created_at DESC, sl.created_at DESC LIMIT 1;`);
                        const creditTransaction = getCreditTransaction?.[0]?.[0];
                        if (creditTransaction) {
                            const creditMaterialObj = { transactionTypeId: oldTransactionTypeId, materialId: creditTransaction.material_id, uomId: creditTransaction.uom_id, serialNumber: serialNumberInUpperCase, rate: creditTransaction.rate, tax: creditTransaction.tax, serialNumberId, capitalize, brandName, otherStoreId: creditTransaction.other_store_id, otherStoreLocationId: creditTransaction.other_store_location_id, isOldDebit: true, oldInstallerId: creditTransaction.installer_id };
                            debitBody = await createInstallationTxnBody(payload, creditTransaction.organization_id, creditTransaction.store_id, creditTransaction.store_location_id, creditMaterialObj, 1, -1, true);
                        } else console.log("Missing OLD transaction details.");
                    }
                    // Create Debit Transaction
                    if (typeof debitBody === "object" && debitBody !== null && Object.keys(debitBody).length > 0 && capitalize) {
                        await createStockLedger(debitBody);
                    }
                    // Get debit transaction
                    const getDebitTransaction = await db.sequelize.selectQuery(`SELECT sl.organization_id, sl.store_id, sl.material_id, sl.uom_id, sl.rate, sl.tax, sl.other_store_id, sl.other_store_location_id FROM stock_ledgers sl INNER JOIN material_serial_numbers msn ON msn.stock_ledger_id = sl.id WHERE msn.serial_number = '${serialNumberInUpperCase}' AND msn.status = '0' AND msn.is_active = '1' AND sl.project_id = '${projectId}' AND sl.transaction_type_id = '${installedTransactionTypeId}' AND sl.quantity = -1 AND sl.is_active = '1' ORDER BY msn.created_at DESC, sl.created_at DESC LIMIT 1;`);
                    const debitTransaction = getDebitTransaction?.[0]?.[0];
                    let creditBody;
                    if (debitTransaction) {
                        const debitMaterialObj = { transactionTypeId: oldTransactionTypeId, materialId: debitTransaction.material_id, uomId: debitTransaction.uom_id, serialNumber: serialNumberInUpperCase, rate: debitTransaction.rate, tax: debitTransaction.tax, serialNumberId, capitalize, brandName, otherStoreId: debitTransaction.other_store_id, otherStoreLocationId: debitTransaction.other_store_location_id };
                        // Get installer transaction details
                        const installerTxnData = await getStockLedgerByCondition({ projectId, installerId, transactionTypeId: { [Op.notIn]: [installedTransactionTypeId, oldTransactionTypeId, cancelInstalledTxnTypeId, cancelOldmeterTxnTypeId] } }, { order: [["createdAt", "DESC"]] });
                        if (installerTxnData?.organizationId && installerTxnData?.storeId) {
                            // Get installer old store location
                            const instOldStoreLoc = await orgStoreLocationService.getOrgStoreLocationByCondition({ name: { [Op.iLike]: "%old%" }, organizationStoreId: installerTxnData.storeId, isActive: "1" }, { order: [["createdAt", "DESC"]] });
                            if (instOldStoreLoc?.id) {
                                creditBody = await createInstallationTxnBody(payload, installerTxnData.organizationId, installerTxnData.storeId, instOldStoreLoc.id, debitMaterialObj, 1, 1, true, true, "1");
                            } else console.log(statusMessages.MISSING_ORGANIZATION_STORE_LOCATION_DETAILS);
                        } else {
                            // Get installer old store location
                            const installerOldStoreLoc = await orgStoreLocationService.getOrgStoreLocationByCondition({ name: { [Op.iLike]: "%old%" }, organizationStoreId: debitTransaction.store_id, isActive: "1" }, { order: [["createdAt", "DESC"]] });
                            if (installerOldStoreLoc) {
                                creditBody = await createInstallationTxnBody(payload, debitTransaction.organization_id, debitTransaction.store_id, installerOldStoreLoc.id, debitMaterialObj, 1, 1, true, true, "1");
                            } else console.log(statusMessages.MISSING_ORGANIZATION_STORE_LOCATION_DETAILS);
                        }
                    } else console.log("Missing OLD transaction details.");
                    // Create Credit Transaction
                    if (typeof creditBody === "object" && creditBody !== null && Object.keys(creditBody).length > 0) {
                        await createStockLedger(creditBody);
                    }
                } else {
                    // Not in system old meter
                    // Get installer transaction details
                    const transactionData = await getStockLedgerByCondition({ projectId, installerId, transactionTypeId: { [Op.notIn]: [installedTransactionTypeId, oldTransactionTypeId, cancelInstalledTxnTypeId, cancelOldmeterTxnTypeId] } }, { order: [["createdAt", "DESC"]] });
                    let creditBody;
                    if (transactionData) {
                        const { organizationId, storeId } = transactionData;
                        // Get installer old store location
                        const installerOldStoreLoc = await orgStoreLocationService.getOrgStoreLocationByCondition({ name: { [Op.iLike]: "%old%" }, organizationStoreId: storeId, isActive: "1" }, { order: [["createdAt", "DESC"]] });
                        if (installerOldStoreLoc) {
                            const materialObj = { transactionTypeId: oldTransactionTypeId, materialId: "84b473e1-62bb-4afe-af56-1691bdffbc55", uomId: "7a1cf361-7fa3-4ca2-88ea-ee3212818d14", serialNumber: serialNumberInUpperCase, rate: 0, tax: 0, serialNumberId, capitalize, brandName, otherStoreId: storeId, otherStoreLocationId: installerOldStoreLoc.id };
                            creditBody = await createInstallationTxnBody(payload, organizationId, storeId, installerOldStoreLoc.id, materialObj, 1, 1, false, true, "0", true);
                        } else console.log(statusMessages.MISSING_ORGANIZATION_STORE_LOCATION_DETAILS);
                    } else console.log(statusMessages.MISSING_INSTALLER_DETAILS);
                    // Create Transaction
                    if (typeof creditBody === "object" && creditBody !== null && Object.keys(creditBody).length > 0) {
                        await createStockLedger(creditBody);
                    }
                }
            }
        }
    }
    return { message: statusMessages.TRANSACTION_CREATED_SUCCESSFULLY };
};

const updateCancelsInLedger = async (createTransactionData, ledgerId, ledgerDetailId) => {
    await updateStockLedger({ cancelRefDocNo: createTransactionData?.stock_ledgers?.[0]?.referenceDocumentNumber, isCancelled: true }, { id: ledgerId });
    await updateStockLedgerDetails({ cancelRefDocNo: createTransactionData?.referenceDocumentNumber, isCancelled: true }, { id: ledgerDetailId });
};

const createInstallationTxn = async (payload) => {
    if (
        payload.brandMasterId
        && payload.responseId
        && payload.projectId
        && payload.installerId
        && payload.consumerName
        && payload.kNumber
        && payload.counter
        && payload.source
        && Array.isArray(payload.materialArray)
        && payload.materialArray.length > 0
        && payload.materialArray.some(
            (item) => ((("capitalize" in item && typeof item.capitalize === "boolean")
        && "serialNumberId" in item
        && "brandName" in item)
        || ("nonSerializeMaterialId" in item
        && "quantity" in item))
        )
    ) {
        const { brandMasterId, responseId, projectId, installerId, consumerName, kNumber, counter, source, materialArray } = payload;
        const isResponseIdExist = await isStockLedgerDetailsAlreadyExists({ responseId });
        if (!isResponseIdExist || (isResponseIdExist && source === "mobile")) {
            const createInstallationTxn = await installationTransaction(payload);
            return createInstallationTxn;
        } else {
            // Update flow
            const cancelInstalledTransactionTypeId = "923fa9a0-5ed5-4bc2-9946-dad0da5f34c4";
            const cancelOldMeterTransactionTypeId = "79f09003-a389-4a81-abd8-43b77a5f914b";
            const installedTxnBasicData = await stockLedgerDetailsWithSerialNumber({ responseId, transactionTypeId: { [Op.notIn]: [cancelInstalledTransactionTypeId, cancelOldMeterTransactionTypeId] }, counter: counter - 1, isCancelled: false });
            if (installedTxnBasicData.count > 0) {
                const prevData = {
                    brandMasterId,
                    responseId,
                    projectId,
                    installerId: installedTxnBasicData.rows[0].installerId,
                    consumerName: installedTxnBasicData.rows[0].consumerName,
                    kNumber: installedTxnBasicData.rows[0].kNumber,
                    materialArray: []
                };
                const prevMaterialObj = {};
                for (const txn of installedTxnBasicData.rows) {
                    if (txn.serialNumberId && typeof txn.capitalize === "boolean") {
                        const materialObj = {
                            serialNumberId: txn.serialNumberId,
                            capitalize: txn.capitalize,
                            brandName: txn.brandName
                        };
                        if (!prevMaterialObj[JSON.stringify(materialObj)]) {
                            prevData.materialArray.push(materialObj);
                            prevMaterialObj[JSON.stringify(materialObj)] = materialObj;
                        }
                    }
                    if (txn.nonSerializeMaterialId && txn.quantity) {
                        const materialObj = {
                            nonSerializeMaterialId: txn.nonSerializeMaterialId,
                            quantity: txn.quantity,
                            brandName: txn.brandName
                        };
                        if (!prevMaterialObj[JSON.stringify(materialObj)]) {
                            prevData.materialArray.push(materialObj);
                            prevMaterialObj[JSON.stringify(materialObj)] = materialObj;
                        }
                    }
                }
                if (prevData.materialArray.length > 0) {
                    const commonArr = prevData.materialArray.filter((obj1) => materialArray.some((obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)));
                    const updatedArr = materialArray.filter((obj1) => prevData.materialArray.some((obj2) => obj1.nonSerializeMaterialId === obj2.nonSerializeMaterialId && obj1.quantity !== obj2.quantity));
                    const revertArr = prevData.materialArray.filter((obj1) => !commonArr.some((obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)) && !updatedArr.some((obj2) => obj1.nonSerializeMaterialId === obj2.nonSerializeMaterialId));
                    const newArr = materialArray.filter((obj1) => !commonArr.some((obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)) && !updatedArr.some((obj2) => obj1.nonSerializeMaterialId === obj2.nonSerializeMaterialId));
                    // Revert transaction
                    if (revertArr.length > 0) {
                        const revertPayload = { brandMasterId, responseId, projectId, installerId: prevData.installerId, consumerName: prevData.consumerName, kNumber: prevData.kNumber, counter };
                        for await (const mat of revertArr) {
                            const where = {
                                responseId,
                                counter: counter - 1,
                                installerId: prevData.installerId,
                                transactionTypeId: { [Op.notIn]: [cancelInstalledTransactionTypeId, cancelOldMeterTransactionTypeId] },
                                isCancelled: false
                            };
                            if (mat.serialNumberId && typeof mat.capitalize === "boolean") {
                                where.serialNumberId = mat.serialNumberId;
                                where.capitalize = mat.capitalize;
                                where.brandName = mat.brandName;
                                const transactionData = await stockLedgerDetailsWithSerialNumber(where);
                                if (transactionData?.count === 1) {
                                    const { id: ledgerDetailId, serialNumber: oldSerialNumber, serialNumberId, capitalize, brandName } = transactionData.rows[0];
                                    const { id: ledgerId, referenceDocumentNumber, organizationId, storeId, storeLocationId, materialId, uomId, rate, tax, otherStoreId, otherStoreLocationId } = transactionData.rows[0].stock_ledgers[0];
                                    const materialObj = { materialId, uomId, rate, tax, serialNumberId, capitalize, brandName, otherStoreId, otherStoreLocationId };
                                    revertPayload.isRequestNumber = true;
                                    revertPayload.requestNumber = referenceDocumentNumber;
                                    if (oldSerialNumber && oldSerialNumber !== null) {
                                        // Not in system old meter
                                        materialObj.transactionTypeId = cancelOldMeterTransactionTypeId;
                                        materialObj.serialNumber = oldSerialNumber;
                                        const debitBody = await createInstallationTxnBody(revertPayload, organizationId, storeId, storeLocationId, materialObj, 1, -1, false, true, "0", true);
                                        if (typeof debitBody === "object" && debitBody !== null && Object.keys(debitBody).length > 0) {
                                            const createTransactionData = await createStockLedger(debitBody);
                                            if (createTransactionData) {
                                                await updateCancelsInLedger(createTransactionData, ledgerId, ledgerDetailId);
                                            }
                                        }
                                    } else {
                                        const { serialNumber } = transactionData.rows[0].stock_ledgers[0].material_serial_numbers[0];
                                        if (transactionData.rows[0].stock_ledgers[0].quantity < 0) {
                                            materialObj.transactionTypeId = cancelInstalledTransactionTypeId;
                                            materialObj.serialNumber = serialNumber;
                                            const creditBody = await createInstallationTxnBody(revertPayload, organizationId, storeId, storeLocationId, materialObj, 1, 1, true, true, "1");
                                            if (typeof creditBody === "object" && creditBody !== null && Object.keys(creditBody).length > 0) {
                                                const createTransactionData = await createStockLedger(creditBody);
                                                if (createTransactionData) {
                                                    await updateCancelsInLedger(createTransactionData, ledgerId, ledgerDetailId);
                                                }
                                            }
                                        } else {
                                            materialObj.transactionTypeId = cancelOldMeterTransactionTypeId;
                                            materialObj.serialNumber = serialNumber;
                                            const debitBody = await createInstallationTxnBody(revertPayload, organizationId, storeId, storeLocationId, materialObj, 1, 1, true, true, "0");
                                            if (typeof debitBody === "object" && debitBody !== null && Object.keys(debitBody).length > 0) {
                                                await updateMaterialSerialNumberStatus(materialId, serialNumber);
                                                const createTransactionData = await createStockLedger(debitBody);
                                                if (createTransactionData) {
                                                    await updateCancelsInLedger(createTransactionData, ledgerId, ledgerDetailId);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (transactionData?.count === 2) {
                                    const positiveTransaction = transactionData.rows.filter((val) => val.stock_ledgers[0].quantity > 0);
                                    const negativeTransaction = transactionData.rows.filter((val) => val.stock_ledgers[0].quantity < 0);
                                    const createBody = async (txnData, sign, status) => {
                                        revertPayload.isRequestNumber = true;
                                        revertPayload.requestNumber = txnData.stock_ledgers[0].referenceDocumentNumber;
                                        const materialObj = { transactionTypeId: txnData.brandName === null ? cancelInstalledTransactionTypeId : cancelOldMeterTransactionTypeId, materialId: txnData.stock_ledgers[0].materialId, uomId: txnData.stock_ledgers[0].uomId, serialNumber: txnData.stock_ledgers[0].material_serial_numbers[0].serialNumber, rate: txnData.stock_ledgers[0].rate, tax: txnData.stock_ledgers[0].tax, serialNumberId: txnData.serialNumberId, capitalize: txnData.capitalize, brandName: txnData.brandName, otherStoreId: txnData.stock_ledgers[0].otherStoreId, otherStoreLocationId: txnData.stock_ledgers[0].otherStoreLocationId };
                                        const body = await createInstallationTxnBody(revertPayload, txnData.stock_ledgers[0].organizationId, txnData.stock_ledgers[0].storeId, txnData.stock_ledgers[0].storeLocationId, materialObj, 1, sign, true, true, status);
                                        return body;
                                    };
                                    const debitBody = await createBody(positiveTransaction[0], -1, "0");
                                    if (typeof debitBody === "object" && debitBody !== null && Object.keys(debitBody).length > 0) {
                                        if (positiveTransaction[0].stock_ledgers[0].transactionTypeId === "cb92ec5a-3f86-48cf-86b8-9359dda410a5") {
                                            await updateMaterialSerialNumberStatus(positiveTransaction[0].stock_ledgers[0].materialId, positiveTransaction[0].stock_ledgers[0].material_serial_numbers[0].serialNumber);
                                        }
                                        const createDebitTransactionData = await createStockLedger(debitBody);
                                        if (createDebitTransactionData) {
                                            await updateCancelsInLedger(createDebitTransactionData, positiveTransaction[0].stock_ledgers[0].id, positiveTransaction[0].id, installerId);
                                        }
                                    }
                                    const creditBody = await createBody(negativeTransaction[0], 1, negativeTransaction[0].stock_ledgers[0].transactionTypeId === "f3848838-6e7c-4240-a4e2-27e084164a17" ? "1" : "0");
                                    if (typeof creditBody === "object" && creditBody !== null && Object.keys(creditBody).length > 0) {
                                        const createCreditTransactionData = await createStockLedger(creditBody);
                                        if (createCreditTransactionData) {
                                            await updateCancelsInLedger(createCreditTransactionData, negativeTransaction[0].stock_ledgers[0].id, negativeTransaction[0].id, installerId);
                                        }
                                    }
                                }
                            } else if (mat.nonSerializeMaterialId && mat.quantity) {
                                where.nonSerializeMaterialId = mat.nonSerializeMaterialId;
                                where.quantity = mat.quantity;
                                where.brandName = mat.brandName;
                                const transactionData = await stockLedgerDetailsWithSerialNumber(where);
                                if (transactionData?.count === 1) {
                                    const { id: ledgerDetailId, nonSerializeMaterialId, quantity, brandName } = transactionData.rows[0];
                                    const { id: ledgerId, referenceDocumentNumber, organizationId, storeId, storeLocationId, materialId, uomId, rate, tax, otherStoreId, otherStoreLocationId } = transactionData.rows[0].stock_ledgers[0];
                                    const materialObj = { transactionTypeId: cancelInstalledTransactionTypeId, materialId, uomId, serialNumber: "", rate, tax, nonSerializeMaterialId, quantity, brandName, otherStoreId, otherStoreLocationId };
                                    revertPayload.isRequestNumber = true;
                                    revertPayload.requestNumber = referenceDocumentNumber;
                                    const creditBody = await createInstallationTxnBody(revertPayload, organizationId, storeId, storeLocationId, materialObj, parseFloat(quantity), 1, false);
                                    if (typeof creditBody === "object" && creditBody !== null && Object.keys(creditBody).length > 0) {
                                        const createTransactionData = await createStockLedger(creditBody);
                                        if (createTransactionData) {
                                            await updateCancelsInLedger(createTransactionData, ledgerId, ledgerDetailId);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // Update only trannsaction basic details
                    if (commonArr.length > 0) {
                        for await (const mat of commonArr) {
                            const where = {
                                responseId,
                                counter: counter - 1,
                                installerId: prevData.installerId,
                                transactionTypeId: { [Op.notIn]: [cancelInstalledTransactionTypeId, cancelOldMeterTransactionTypeId] },
                                isCancelled: false
                            };
                            if (mat.serialNumberId && typeof mat.capitalize === "boolean") {
                                where.serialNumberId = mat.serialNumberId;
                                where.capitalize = mat.capitalize;
                                where.brandName = mat.brandName;
                            } else if (mat.nonSerializeMaterialId && mat.quantity) {
                                where.nonSerializeMaterialId = mat.nonSerializeMaterialId;
                                where.quantity = mat.quantity;
                                where.brandName = mat.brandName;
                            }
                            if (Object.keys(where).length > 1) {
                                await updateStockLedgerDetails({ consumerName, kNumber, counter }, where);
                            }
                        }
                    }
                    // Update transaction
                    if (updatedArr.length > 0) {
                        for await (const mat of updatedArr) {
                            const where = {
                                responseId,
                                counter: counter - 1,
                                installerId: prevData.installerId,
                                transactionTypeId: { [Op.notIn]: [cancelInstalledTransactionTypeId, cancelOldMeterTransactionTypeId] },
                                isCancelled: false
                            };
                            if (mat.nonSerializeMaterialId && mat.quantity) {
                                where.nonSerializeMaterialId = mat.nonSerializeMaterialId;
                                const transactionData = await getStockLedgerDetailsByCondition(where, undefined);
                                const stockLedger = transactionData?.stock_ledgers?.[0];
                                if (transactionData?.id && stockLedger?.id && stockLedger?.rate) {
                                    await updateStockLedger({ quantity: -parseFloat(mat.quantity), value: stockLedger.rate * parseFloat(mat.quantity) }, { id: stockLedger.id });
                                    const updateStockLedgerDetailsObj = {
                                        ...(consumerName !== prevData.consumerName && { consumerName }),
                                        ...(kNumber !== prevData.kNumber && { kNumber }),
                                        quantity: mat.quantity,
                                        brandName: mat.brandName,
                                        counter
                                    };
                                    await updateStockLedgerDetails(updateStockLedgerDetailsObj, { id: transactionData.id });
                                }
                            }
                        }
                    }
                    // New installation
                    if (newArr.length > 0) {
                        const newData = {
                            brandMasterId,
                            responseId,
                            projectId,
                            installerId: prevData.installerId,
                            consumerName,
                            kNumber,
                            counter,
                            materialArray: newArr
                        };
                        await installationTransaction(newData);
                    }
                    return { message: "Updated Successfully." };
                } else console.log("Missing update transactions details.");
            } else console.log("Missing update transactions.");
        }
    } else {
        throw new Error(statusMessages.MISSING_INSTALLED_DETAILS);
    }
};

const getAllTransactionsForLoc = async (where) => {
    try {
        const stockLedgers = new StockLedgers();
        stockLedgers.updateRelationForLocationStock();
        const data = await stockLedgers.findAndCountAll(where, ["storeLocationId", "materialId", "quantity", "rate", "value", "tax", "createdAt", "updatedAt"], true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

const getTransactionList = async (where, attributes = undefined, isRelated = false) => {
    try {
        const stockLedgers = new StockLedgers();
        const data = await stockLedgers.findAndCountAll(where, attributes, isRelated, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_STOCK_LEDGER_LIST_FAILURE, error);
    }
};

module.exports = {
    generateReferenceDocumentNumber,
    updateMaterialSerialNumberStatus,
    getTransactionCount,
    createStockLedger,
    getStockLedgerDetailsByCondition,
    getStockLedgerByCondition,
    getStockLedgerDetailIds,
    getAllStockLedgerDetails,
    getAllStockLedgers,
    getTxnsDetails,
    getTxnsForStockLedger,
    getTxnMaterials,
    getAllStockLedgersByAssociationFilter,
    getStoRequestDetails,
    getActiveSerialNumbersInStore,
    getSerialNumbers,
    isStockLedgerDetailsAlreadyExists,
    updateStockLedger,
    serialNumberAlreadyExists,
    updateStockLedgerDetails,
    getAllStockLedgersWithSerialNumber,
    getMaterialSerialNumberByCondition,
    checkForInstallation,
    createInstallationTxn,
    getAllTransactionsForLoc,
    getTransactionList
};
