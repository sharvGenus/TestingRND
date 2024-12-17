const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const countryService = require("./countries.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "countries.name": "name",
    "countries.code": "code",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    name: "name",
    code: "code",
    integrationId: "integrationId",
    remarks: "remarks",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create country
 * @param { object } req.body
 * @returns { object } da
 * ta
 */
const createCountry = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_COUNTRY_DETAILS);
    // Check if the name already exists
    const isNameExists = await countryService.CountryAlreadyExists({ name: req.body.name });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.COUNTRY_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await countryService.CountryAlreadyExists({ code: req.body.code });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.COUNTRY_ALREADY_EXIST);
    const data = await countryService.createCountry(req.body);
    return { data };
};

/**
 * Method to update country
 * @param { object } req.body
 * @returns { object } data
 */
const updateCountry = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.COUNTRY_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_COUNTRY_DETAILS);
    const isCountryIdExists = await countryService.CountryAlreadyExists({ id: req.params.id });
    throwIfNot(isCountryIdExists, statusCodes.DUPLICATE, statusMessages.COUNTRY_NOT_EXIST);
    // Check if the name already exists
    const isNameExists = await countryService.CountryAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.COUNTRY_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await countryService.CountryAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.COUNTRY_ALREADY_EXIST);
    const data = await countryService.updateCountry(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get country details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getCountryDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.COUNTRY_ID_REQUIRED);
    const data = await countryService.getCountryByCondition({ id: req.params.id });
    return { data };
};

const getCountriesHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.COUNTRY_ID_REQUIRED);
    const data = await countryService.getCountriesHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get country list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCountriesByDropdown = async (req) => {
    const data = await countryService.getAllCountriesByDropdown();
    return { data };
};

/**
 * Method to get all countries
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCountries = async (req) => {
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
    const data = await countryService.getAllCountries(condition);
    return { data };
};

/**
 * Method to delete country by country id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteCountry = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.COUNTRY_ID_REQUIRED);
    const data = await countryService.deleteCountry({ id: req.params.id });
    return { data };
};

module.exports = {
    createCountry,
    updateCountry,
    getCountryDetails,
    getAllCountries,
    deleteCountry,
    getAllCountriesByDropdown,
    getCountriesHistory
};
