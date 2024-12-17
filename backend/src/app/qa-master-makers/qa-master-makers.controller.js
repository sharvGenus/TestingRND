const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const qaMasterMakersService = require("./qa-master-makers.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "qa_master_makers.id": "id",
    "qa_master_makers.name": "name",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    name: "name",
    masterId: "id",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create qa master maker
 * @param { object } req.body
 * @returns { object } data
 */
const createQaMasterMaker = async (req) => {
    req.body.name = req.body.name.toUpperCase();
    const { projectId, meterTypeId, name } = req.body;
    const isQaMasterMakerExists = await qaMasterMakersService.qaMasterMakerAlreadyExists({ projectId, meterTypeId, name });
    throwIf(isQaMasterMakerExists, statusCodes.DUPLICATE, statusMessages.QA_MASTER_MAKER_ALREADY_EXIST);
    const data = await qaMasterMakersService.createQaMasterMaker(req.body);
    return { data };
};

/**
 * Method to get all qa master maker
 * @param { object } req.body
 * @returns { object } data
 */
const getQaMasterMakerList = async (req) => {
    const { projectId, meterTypeId, searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const where = { [Op.and]: [] };

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

    if (filterString && Object.keys(filterString).length > 0) {
        for (const key in filterString) {
            if (filterMapping[key]) {
                const mappedKey = filterMapping[key];
                const filterValue = filterString[key];
    
                // Perform the mapping based on the filterMapping and add to the condition
                const mappedCondition = {
                    [mappedKey]: filterValue
                };
                where[Op.and].push(mappedCondition);
            }
        }
    }

    if (projectId) where[Op.and].push({ projectId });
    if (meterTypeId) where[Op.and].push({ meterTypeId });
    const data = await qaMasterMakersService.getQaMasterMakerList(where);
    return { data };
};

/**
 * Method to update qa master maker
 * @param { object } req.body
 * @returns { object } data
 */
const updateQaMasterMaker = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.QA_MASTER_MAKER_ID_NOT_FOUND);
    const isQaMasterMakerRecordExists = await qaMasterMakersService.qaMasterMakerAlreadyExists({ id });
    throwIfNot(isQaMasterMakerRecordExists, statusCodes.NOT_FOUND, statusMessages.QA_MASTER_MAKER_NOT_EXIST);
    req.body.name = req.body.name.toUpperCase();
    const { projectId, meterTypeId, name } = req.body;
    const isQaMasterMakerExists = await qaMasterMakersService.qaMasterMakerAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { projectId, meterTypeId, name }] });
    throwIf(isQaMasterMakerExists, statusCodes.DUPLICATE, statusMessages.QA_MASTER_MAKER_ALREADY_EXIST);
    const data = await qaMasterMakersService.updateQaMasterMaker(req.body, { id });
    return { data };
};

/**
 * Method to delete qa master maker by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteQaMasterMaker = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.QA_MASTER_MAKER_ID_NOT_FOUND);
    const data = await qaMasterMakersService.deleteQaMasterMaker({ id });
    return { data };
};

/**
 * Method to get qa master maker history
 * @param { object } req.body
 * @returns { object } data
 */
const getQaMasterMakerHistory = async (req) => {
    const { recordId } = req.params;
    throwIfNot(recordId, statusCodes.BAD_REQUEST, statusMessages.QA_MASTER_MAKER_RECORD_ID_NOT_FOUND);
    const data = await qaMasterMakersService.getQaMasterMakerHistory({ recordId });
    return { data };
};

module.exports = {
    createQaMasterMaker,
    getQaMasterMakerList,
    updateQaMasterMaker,
    deleteQaMasterMaker,
    getQaMasterMakerHistory
};
