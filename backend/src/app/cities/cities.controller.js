const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const cityService = require("./cities.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "state.country.name": "state.country.name",
    "state.name": "state.name",
    "cities.name": "name",
    "cities.code": "code",
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
    countryId: "$state.country.name$",
    stateId: "$state.name$"
};

/**
 * Method to create city
 * @param { object } req.body
 * @returns { object } data
 */
const createCity = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CITY_DETAILS);
    // Check if the name already exists
    const isNameExists = await cityService.cityAlreadyExists({ name: req.body.name, stateId: req.body.stateId });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.CITY_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await cityService.cityAlreadyExists({ code: req.body.code, stateId: req.body.stateId });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.CITY_ALREADY_EXIST);
    const data = await cityService.createCity(req.body);
    return { data };
};

/**
 * Method to update city
 * @param { object } req.body
 * @returns { object } data
 */
const updateCity = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CITY_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CITY_DETAILS);
    // Check if the name already exists
    const isNameExists = await cityService.cityAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, stateId: req.body.stateId }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.CITY_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await cityService.cityAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, stateId: req.body.stateId }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.CITY_ALREADY_EXIST);
    const data = await cityService.updateCity(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get city details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getCityDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CITY_ID_REQUIRED);
    const data = await cityService.getCityByCondition({ id: req.params.id });
    return { data };
};

const getCitiesHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.CITY_ID_REQUIRED);
    const data = await cityService.getCityHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get city list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCititesByDropdown = async (req) => {
    const data = await cityService.getAllCitiesByDropdown({ stateId: req.params.stateId });
    return { data };
};

/**
 * Method to get all states
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCities = async (req) => {
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
    const data = await cityService.getAllCities(condition);
    return { data };
};

/**
 * Method to delete state by state id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteCity = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CITY_ID_REQUIRED);
    const data = await cityService.deleteCity({ id: req.params.id });
    return { data };
};

module.exports = {
    createCity,
    getCitiesHistory,
    updateCity,
    getCityDetails,
    getAllCities,
    deleteCity,
    getAllCititesByDropdown
};
