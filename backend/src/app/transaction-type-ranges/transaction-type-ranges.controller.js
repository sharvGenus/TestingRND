const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIfNot, throwError, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const transactionTypeRangeService = require("./transaction-type-ranges.service");
const stockLedgerService = require("../stock-ledgers/stock-ledgers.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "organization.name": "orgName",
    "organization_store.organization.name": "branchName",
    "organization_store.name": "organization_store.name",
    "transaction_type_ranges.prefix": "prefix",
    "transaction_type_ranges.name": "traxnsName",
    "transaction_type_ranges.start_range": "startRange",
    "transaction_type_ranges.end_range": "endRange",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    orgName: "$organization.name$",
    orgBranchName: "$organization_store.organization.name$",
    storeName: "$organization_store.name$",
    prefix: "prefix",
    name: "name",
    startRange: "startRange",
    endRange: "endRange",
    "updated.name": "$updated.name$",
    "created.name": "$created.name$"
};

/**
 * Method to create transaction type range
 * @param { object } req.body
 * @returns { object } data
 */
const createTransactionTypeRange = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, createdBy: userId, updatedBy: userId };
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    const isTransactionTypeRangeExists = await transactionTypeRangeService.isTransactionTypeRangeExists({
        prefix: req.body.prefix,
        storeId: { [Op.ne]: req.body.storeId }
    });
    throwIf(isTransactionTypeRangeExists, statusCodes.BAD_REQUEST, statusMessages.INVALID_PREFIX);
    const isRangeDataExist = await transactionTypeRangeService.isTransactionTypeRangeExists({
        organizationId: req.body.organizationId,
        storeId: req.body.storeId,
        prefix: { [Op.ne]: req.body.prefix }
    });
    throwIf(isRangeDataExist, statusCodes.BAD_REQUEST, statusMessages.INVALID_PREFIX);
    // const rangeData = await transactionTypeRangeService.getTransactionTypeRangeListByCondition(
    //     {
    //         organizationId: req.body.organizationId,
    //         storeId: req.body.storeId
    //     },
    //     ["name", "transactionTypeIds", "startRange", "endRange", "effectiveDate", "remarks"]
    // );
    // let allRangesInStore = [...req.body.ranges];
    // if (rangeData && rangeData.count > 0) {
    //     allRangesInStore = [...allRangesInStore, ...rangeData.rows];
    // }
    // const isRangeOverlap = await transactionTypeRangeService.isRangeOverlap(allRangesInStore);
    // throwIf(isRangeOverlap, statusCodes.BAD_REQUEST, statusMessages.INVALID_RANGE);
    for (const range of req.body.ranges) {
        range.organizationId = req.body.organizationId;
        range.storeId = req.body.storeId;
        range.prefix = req.body.prefix;
        range.createdBy = req.body.createdBy;
        range.updatedBy = req.body.updatedBy;
        range.isActive = "0";
    }
    const data = await transactionTypeRangeService.bulkCreateTransactionTypeRange(req.body.ranges);
    return { data };
};

/**
 * Method to update transaction type range
 * @param { object } req.body
 * @returns { object } data
 */
const updateTransactionTypeRange = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, updatedBy: userId };
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_TYPE_RANGE_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_TRANSACTION_TYPE_RANGE_DETAILS);
    const isTransactionTypeRangeExists = await transactionTypeRangeService.isTransactionTypeRangeExists({
        id: req.params.id
    });
    throwIfNot(isTransactionTypeRangeExists, statusCodes.NOT_FOUND, statusMessages.TRANSACTION_TYPE_RANGE_NOT_EXIST);
    if (req.body && req.body.endDate) {
        const deactivateData = await transactionTypeRangeService.updateTransactionTypeRange(
            {
                isActive: "0",
                endDate: req.body.endDate,
                updatedBy: userId
            },
            { id: req.params.id }
        );
        return { data: deactivateData };
    }
    const isStockLedgerDetailsAlreadyExists = await stockLedgerService.isStockLedgerDetailsAlreadyExists({
        transactionTypeRangeId: req.params.id
    });
    throwIf(
        isStockLedgerDetailsAlreadyExists,
        statusCodes.DUPLICATE,
        statusMessages.TRANSACTION_TYPE_RANGE_ALREADY_USED
    );
    const isRangeDataExist = await transactionTypeRangeService.isTransactionTypeRangeExists({
        organizationId: req.body.organizationId,
        storeId: req.body.storeId,
        prefix: { [Op.ne]: req.body.prefix }
    });
    throwIf(isRangeDataExist, statusCodes.BAD_REQUEST, statusMessages.INVALID_PREFIX);
    const data = await transactionTypeRangeService.updateTransactionTypeRange(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to activate transaction type range
 * @param { object } req.body
 * @returns { object } data
 */
const activateTransactionTypeRange = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, updatedBy: userId };
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_TYPE_RANGE_ID_REQUIRED);
    const isTransactionTypeRangeExists = await transactionTypeRangeService.isTransactionTypeRangeExists({
        id: req.params.id
    });
    throwIfNot(isTransactionTypeRangeExists, statusCodes.NOT_FOUND, statusMessages.TRANSACTION_TYPE_RANGE_NOT_EXIST);
    const rangeData = await transactionTypeRangeService.getTransactionTypeRangeByCondition({
        id: req.params.id
    });
    if (rangeData) {
        if (rangeData.endDate) {
            throwError(
                statusCodes.BAD_REQUEST,
                statusMessages.TRANSACTION_TYPE_RANGE_ALREADY_DEACTIVATED
            );
        }
        const isActiveRangeDataExist = await transactionTypeRangeService.isTransactionTypeRangeExists({
            organizationId: rangeData.organizationId,
            storeId: rangeData.storeId,
            transactionTypeIds: { [Op.overlap]: rangeData.transactionTypeIds },
            isActive: "1"
        });
        throwIf(
            isActiveRangeDataExist,
            statusCodes.DUPLICATE,
            statusMessages.ACTIVE_TRANSACTION_TYPE_RANGE_ALREADY_EXIST
        );
    }
    const data = await transactionTypeRangeService.updateTransactionTypeRange(
        { isActive: "1", updatedBy: userId },
        { id: req.params.id }
    );
    return { data };
};

/**
 * Method to get transaction type range list
 * @param { object } req.body
 * @returns { object } data
 */
const getTransactionTypeRangeList = async (req) => {
    const { searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const condition = {
        [Op.and]: []
    };

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

        if (searchString.includes("-") && accessors.includes("orgName")) {
            const splitData = searchString.split("-");
            const organizationConditions = {
                [Op.and]: [
                    { "$organization_store.organization.name$": { [Op.iLike]: `%${splitData[0]}%` } },
                    { "$organization_store.organization.code$": { [Op.iLike]: `%${splitData[1]}%` } }
                ]
            };

            castingConditions.push(organizationConditions);
        }

        if (searchString.includes("-") && accessors.includes("branchName")) {
            const splitData = searchString.split("-");
            const organizationConditions = {
                [Op.and]: [
                    { "$organization.name$": { [Op.iLike]: `%${splitData[0]}%` } },
                    { "$organization.code$": { [Op.iLike]: `%${splitData[1]}%` } }
                ]
            };

            castingConditions.push(organizationConditions);
        }

        // Create an OR condition for all columns
        const orConditions = { [Op.or]: castingConditions };
        condition[Op.and].push(orConditions);
    }

    if (filterString && Object.keys(filterString).length > 0) {
        for (const key in filterString) {
            if (filterMapping[key]) {
                const mappedKey = filterMapping[key];
                const filterValue = filterString[key];
    
                // Perform the mapping based on the filterMapping and add to the condition
                const mappedCondition = {
                    [mappedKey]: filterValue
                };
                condition[Op.and].push(mappedCondition);
            }
        }
    }
    const data = await transactionTypeRangeService.getTransactionTypeRangeList(condition);
    return { data };
};

/**
 * Method to delete transaction type range by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteTransactionTypeRange = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_TYPE_RANGE_ID_REQUIRED);
    const data = await transactionTypeRangeService.deleteTransactionTypeRange({ id: req.params.id });
    return { data };
};

/**
 * Method to get transaction type range history
 * @param {object} req 
 * @returns { object } data
 */
const getTransactionTypeRangeHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.TRANSACTION_TYPE_RANGE_ID_REQUIRED);
    const data = await transactionTypeRangeService.getTransactionTypeRangeHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get both active inactive transaction type range list
 * @param { object } req.body
 * @returns { object } data
 */
const getActiveInactiveTransactionTypeRangeList = async (req) => {
    const where = {};
    if (req.query && req.query.organizationId) {
        where.organizationId = req.query.organizationId;
    }
    if (req.query && req.query.storeId) {
        where.storeId = req.query.storeId;
    }
    const data = await transactionTypeRangeService.getTransactionTypeRangeListByCondition(where, undefined);
    return { data };
};

module.exports = {
    createTransactionTypeRange,
    updateTransactionTypeRange,
    activateTransactionTypeRange,
    getTransactionTypeRangeList,
    deleteTransactionTypeRange,
    getTransactionTypeRangeHistory,
    getActiveInactiveTransactionTypeRangeList
};