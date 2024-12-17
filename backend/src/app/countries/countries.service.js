const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Countries = require("../../database/operation/countries");
const CountriesHistory = require("../../database/operation/countries-history");

const CountryAlreadyExists = async (where) => {
    try {
        const firms = new Countries();
        const data = await firms.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_COUNTRY_DETAILS, error);
    }
};

const createCountry = async (countryDetails) => {
    try {
        const countries = new Countries();
        const data = await countries.create(countryDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_COUNTRY_FAILURE, error);
    }
};
const getAllCountries = async (where = {}) => {
    try {
        const countries = new Countries();
        const data = await countries.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_COUNTRY_LIST_FAILURE, error);
    }
};
const getCountriesHistory = async (where) => {
    try {
        const historyModelInstance = new CountriesHistory();
        const data = await historyModelInstance.findAndCountAll(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.COUNTRY_ID_REQUIRED, error);
    }
};
const getCountryByCondition = async (where) => {
    try {
        const countries = new Countries();
        const data = await countries.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.COUNTRY_FAILURE, error);
    }
};
const updateCountry = async (countryDetails, where) => {
    try {
        const countries = new Countries();
        const data = await countries.update(countryDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.COUNTRY_UPDATE_FAILURE, error);
    }
};
const getAllCountriesByDropdown = async () => {
    try {
        const countries = new Countries();
        const data = await countries.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_COUNTRY_LIST_FAILURE, error);
    }
};
const deleteCountry = async (where) => {
    try {
        const countries = new Countries();
        const data = await countries.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_COUNTRY_FAILURE, error);
    }
};
module.exports = {
    CountryAlreadyExists,
    createCountry,
    getCountriesHistory,
    getAllCountries,
    getCountryByCondition,
    updateCountry,
    deleteCountry,
    getAllCountriesByDropdown
};
