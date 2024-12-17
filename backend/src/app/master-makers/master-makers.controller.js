const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const masterMakersService = require("./master-makers.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");
const { MASTER_MAKERS } = require("../../config/contants");

const mapping = {
    "master_makers.name": "name",
    "master_makers.remarks": "remarks",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    name: "name",
    remarks: "remarks",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

/**
 * Method to create master maker
 * @param { object } req.body
 * @returns { object } data
 */
const createMasterMaker = async (req) => {
    req.body.name = req.body.name.toUpperCase();
    const { name } = req.body;
    const isMasterMakerExists = await masterMakersService.masterMakerAlreadyExists({ name });
    throwIf(isMasterMakerExists, statusCodes.DUPLICATE, statusMessages.MASTER_MAKER_ALREADY_EXIST);
    const data = await masterMakersService.createMasterMaker(req.body);
    return { data };
};

/**
 * Method to update master maker
 * @param { object } req.body
 * @returns { object } data
 */
const updateMasterMaker = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_ID_NOT_FOUND);
    const isMasterMakerRecordExists = await masterMakersService.masterMakerAlreadyExists({ id });
    throwIfNot(isMasterMakerRecordExists, statusCodes.NOT_FOUND, statusMessages.MASTER_MAKER_NOT_EXIST);
    req.body.name = req.body.name.toUpperCase();
    const { name } = req.body;
    const isMasterMakerExists = await masterMakersService.masterMakerAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { name }] });
    throwIf(isMasterMakerExists, statusCodes.DUPLICATE, statusMessages.MASTER_MAKER_ALREADY_EXIST);
    const data = await masterMakersService.updateMasterMaker(req.body, { id });
    return { data };
};

/**
 * Method to get master maker details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getMasterMakerDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_ID_REQUIRED);
    const data = await masterMakersService.getMasterMakerByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all master maker
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMasterMakers = async (req) => {
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
    const data = await masterMakersService.getAllMasterMaker(condition);
    return { data };
};

/**
 * Method to delete master maker by master maker id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteMasterMaker = async (req) => {
    throwIf(Object.values(MASTER_MAKERS).includes(req.params.id), statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_NOT_ALLOWED_TO_DELETE);
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_ID_REQUIRED);
    const data = await masterMakersService.deleteMasterMaker({ id: req.params.id });
    return { data };
};

/**
 * Method to get master maker history
 * @param {object} req 
 * @returns { object } data
 */

const getMasterMakerHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_ID_REQUIRED);
    const data = await masterMakersService.getMasterMakerHistory({ recordId: req.params.recordId });
    return { data };
};

module.exports = {
    createMasterMaker,
    updateMasterMaker,
    getMasterMakerDetails,
    getAllMasterMakers,
    deleteMasterMaker,
    getMasterMakerHistory
};
