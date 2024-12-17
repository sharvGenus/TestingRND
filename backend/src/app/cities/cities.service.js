const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Cities = require("../../database/operation/cities");
const CitiesHistory = require("../../database/operation/cities-history");

const cityAlreadyExists = async (where) => {
    try {
        const cities = new Cities();
        const data = await cities.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_CITY_DETAILS, error);
    }
};

const createCity = async (cityDetails) => {
    try {
        const cities = new Cities();
        const data = await cities.create(cityDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CITY_ALREADY_EXIST, error);
    }
};
const updateCity = async (cityDetails, where) => {
    try {
        const cities = new Cities();
        const data = await cities.update(cityDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CITY_UPDATE_FAILURE, error);
    }
};
const getCityByCondition = async (where) => {
    try {
        const cities = new Cities();
        const data = await cities.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CITY_FAILURE, error);
    }
};
const getAllCitiesByDropdown = async (where) => {
    try {

        const cities = new Cities();
        const data = await cities.findAll(where, ["id", "name"], false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CITY_LIST_FAILURE, error);
    }
};
const getAllCities = async (where = {}) => {
    try {
        const cities = new Cities();
        const data = await cities.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CITY_LIST_FAILURE, error);
    }
};
const getCityHistory = async (where) => {
    try {
        const historyModelInstance = new CitiesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CITY_ID_REQUIRED, error);
    }
};
const deleteCity = async (where) => {
    try {
        const cities = new Cities();
        const data = await cities.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_CITY_FAILURE, error);
    }
};
module.exports = {
    cityAlreadyExists,
    createCity,
    getCityHistory,
    updateCity,
    getCityByCondition,
    getAllCities,
    deleteCity,
    getAllCitiesByDropdown
};
