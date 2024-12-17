const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const stateService = require("./states.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "country.name": "$country.name$",
    "states.name": "name",
    "states.code": "code",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    name: "name",
    code: "code",
    integrationId: "integrationId",
    remarks: "remarks",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$",
    countryId: "$country.name$"
};

/**
 * Method to create state
 * @param { object } req.body
 * @returns { object } data
 */
const createState = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_STATE_DETAILS);
    // Check if the name already exists
    const isNameExists = await stateService.StateAlreadyExists({ name: req.body.name });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.STATE_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await stateService.StateAlreadyExists({ code: req.body.code });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.STATE_ALREADY_EXIST);
    const data = await stateService.createState(req.body);
    return { data };
};

/**
 * Method to update state
 * @param { object } req.body
 * @returns { object } data
 */
const updateState = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.STATE_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_STATE_DETAILS);
    // Check if the name already exists
    const isNameExists = await stateService.StateAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.STATE_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await stateService.StateAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.STATE_ALREADY_EXIST);
    const data = await stateService.updateState(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get State list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllStatesByDropdown = async (req) => {
    const data = await stateService.getAllStatesByDropdown({ countryId: req.params.countryId });
    return { data };
};

/**
 * Method to get state details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getStateDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.STATE_ID_REQUIRED);
    const data = await stateService.getStateByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all states
 * @param { object } req.body
 * @returns { object } data
 */
const getAllStates = async (req) => {
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
    const data = await stateService.getAllStates(condition);
    return { data };
};
/**
 * Method to get all states history
 * @param { object } req.body
 * @returns { object } data
 */
const getStateHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.STATE_ID_REQUIRED);
    const data = await stateService.getStateHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to delete state by state id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteState = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.STATE_ID_REQUIRED);
    const data = await stateService.deleteState({ id: req.params.id });
    return { data };
};

module.exports = {
    createState,
    updateState,
    getStateDetails,
    getAllStates,
    deleteState,
    getAllStatesByDropdown,
    getStateHistory
};
