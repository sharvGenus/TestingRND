const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const allMasterColumnsListService = require("./all-master-columns-list.service");
const { getAllMastersListByCondition } = require("../all-masters-list/all-masters-list.service");
 
/**
 * Method to create all masters list
 * @param { object } req.body
 * @returns { object } data
 */
const createAllMasterColumnsList = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ALL_MASTER_COLUMNS_LIST_DETAILS);
    const isAllMasterColumnsListExists = await allMasterColumnsListService
        .allMasterColumnsListAlreadyExists({ name: req.body.name });
    throwIf(isAllMasterColumnsListExists, statusCodes.DUPLICATE, statusMessages.ALL_MASTER_COLUMNS_LIST_ALREADY_EXIST);
    const data = await allMasterColumnsListService.createAllMasterColumnsList(req.body);
    return { data };
};

/**
 * Method to update all masters list
 * @param { object } req.body
 * @returns { object } data
 */
const updateAllMasterColumnsList = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ALL_MASTER_COLUMN_LIST_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ALL_MASTER_COLUMNS_LIST_DETAILS);
    const isAllMasterColumnsListExists = await allMasterColumnsListService
        .allMasterColumnsListAlreadyExists({ id: req.params.id });
    throwIfNot(isAllMasterColumnsListExists, statusCodes.DUPLICATE, statusMessages.ALL_MASTER_COLUMNS_LIST_NOT_EXIST);
    const data = await allMasterColumnsListService.updateAllMasterColumnsList(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get all masters list details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMasterColumnsListDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ALL_MASTER_COLUMN_LIST_ID_REQUIRED);
    const data = await allMasterColumnsListService.getAllMasterColumnsListByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all masters list by masterId
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMasterColumnsListByMasterId = async (req) => {
    const { masterId } = req.params;
    const data = await allMasterColumnsListService.getAllMasterColumnsListByMasterId(
        { masterId }
    );
    return { data };
};

/**
 * Method to delete all masters list by all masters list id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteAllMasterColumnsList = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ALL_MASTER_COLUMN_LIST_ID_REQUIRED);
    const data = await allMasterColumnsListService.deleteAllMasterColumnsList({ id: req.params.id });
    return { data };
};

module.exports = {
    createAllMasterColumnsList,
    updateAllMasterColumnsList,
    getAllMasterColumnsListDetails,
    deleteAllMasterColumnsList,
    getAllMasterColumnsListByMasterId
};
