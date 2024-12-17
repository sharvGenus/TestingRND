/* eslint-disable max-len */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const masterMakerLovsService = require("./master-maker-lovs.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");
const { MASTER_MAKERS } = require("../../config/contants");

const mapping = {
    "master_maker.name": "master_maker.name",
    "master_maker_lovs.name": "name",
    "master_maker_lovs.code": "code",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    masterName: "$master_maker.name$",
    name: "name",
    code: "code",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create master maker LOV
 * @param { object } req.body
 * @returns { object } data
 */
const createMasterMakerLovs = async (req) => {
    const { masterId, name, code } = req.body;
    const isNameExists = await masterMakerLovsService.masterMakerLovsAlreadyExists({ masterId, name: { [Op.iLike]: name } });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.MASTER_MAKER_LOV_ALREADY_EXIST);
    if (code) {
        const isCodeExists = await masterMakerLovsService.masterMakerLovsAlreadyExists({ masterId, code: { [Op.iLike]: code } });
        throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.MASTER_MAKER_LOV_ALREADY_EXIST);
    }
    const data = await masterMakerLovsService.createMasterMakerLov(req.body);
    return { data };
};

/**
 * Method to update master maker LOV
 * @param { object } req.body
 * @returns { object } data
 */
const updateMasterMakerLovs = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_LOV_ID_REQUIRED);
    const isMasterMakerLovsExists = await masterMakerLovsService.masterMakerLovsAlreadyExists({ id });
    throwIfNot(isMasterMakerLovsExists, statusCodes.DUPLICATE, statusMessages.MASTER_MAKER_LOV_NOT_EXIST);
    const { masterId, name, code } = req.body;
    const isNameExists = await masterMakerLovsService.masterMakerLovsAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { masterId, name: { [Op.iLike]: name } }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.MASTER_MAKER_LOV_ALREADY_EXIST);
    if (code) {
        const isCodeExists = await masterMakerLovsService.masterMakerLovsAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { masterId, code: { [Op.iLike]: code } }] });
        throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.MASTER_MAKER_LOV_ALREADY_EXIST);
    }
    const data = await masterMakerLovsService.updateMasterMakerLov(req.body, { id });
    return { data };
};

/**
 * Method to get master maker LOV details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getMasterMakerLovsDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_LOV_ID_REQUIRED);
    const data = await masterMakerLovsService.getMasterMakerLovByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all master maker LOV
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMasterMakerLovs = async (req) => {
    const { forDropdown, masterId, searchString, accessors, filterObject } = req.query;
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

    if (masterId) condition[Op.and].push({ masterId });
    let data;
    if (forDropdown === "1") {
        data = await masterMakerLovsService.getAllMasterMakerLov(condition, ["id", "name", "code"], false);
    } else {
        data = await masterMakerLovsService.getAllMasterMakerLov(condition);
    }
    return { data };
};

/**
 * Method to delete master maker LOV by master maker LOV id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteMasterMakerLovs = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_LOV_ID_REQUIRED);
    const data = await masterMakerLovsService.deleteMasterMakerLov({ id: req.params.id });
    return { data };
};

/**
 * Method to get all UOM LOV
 * @param { object } req.body
 * @returns { object } data
 */
const getAllLovByMasterName = async (req) => {
    throwIfNot(req.params.masterName, statusCodes.BAD_REQUEST, statusMessages.MASTER_NAME_REQUIRED);
    const conditions = {};
    if (Object.prototype.hasOwnProperty.call(MASTER_MAKERS, req.params.masterName)) {
        conditions.id = MASTER_MAKERS[req.params.masterName];
    } else {
        conditions.name = req.params.masterName;
    }
    const data = await masterMakerLovsService.getAllLovByMasterName(conditions);
    return { data };
};

/**
 * Method to get master maker lovs history
 * @param {object} req 
 * @returns { object } data
 */

const getMasterMakerHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.MASTER_MAKER_LOV_ID_REQUIRED);
    const data = await masterMakerLovsService.getMasterMakerLovHistory({ recordId: req.params.recordId });
    return { data };
};

module.exports = {
    createMasterMakerLovs,
    updateMasterMakerLovs,
    getMasterMakerLovsDetails,
    getAllMasterMakerLovs,
    deleteMasterMakerLovs,
    getAllLovByMasterName,
    getMasterMakerHistory
};
