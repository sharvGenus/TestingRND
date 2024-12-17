/* eslint-disable max-len */
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const GaaLevelEntries = require("../../database/operation/gaa-level-entries");
const GaaLevelEntriesHistory = require("../../database/operation/gaa-level-entries-history");

const networkLevelEntriesAlreadyExists = async (where) => {
    try {
        const networkLevelEntries = new GaaLevelEntries();
        const data = await networkLevelEntries.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_LEVEL_ENTRIES_FAILURE);
    }
};

const getNetworkLevelEntriesByCondition = async (where) => {
    try {
        const networkLevelEntries = new GaaLevelEntries();
        const data = await networkLevelEntries.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_LEVEL_ENTRIES_FAILURE);
    }
};

const createNetworkLevelEntries = async (networkLevelEntriesDetails) => {
    try {
        const networkLevelEntries = new GaaLevelEntries();
        const data = await networkLevelEntries.create(networkLevelEntriesDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_NETWORK_LEVEL_ENTRIES_FAILURE);
    }
};

// NOTE:- sending this raw = true while calling from access management
const getAllNetworkLevelEntryByDropdown = async (where, raw = false) => {
    try {
        const networkLevelEntries = new GaaLevelEntries();
        const data = await networkLevelEntries.findAndCountAll(where, undefined, true, true, undefined, raw);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_LEVEL_ENTRIES_LIST_FAILURE);
    }
};

const updateNetworkLevelEntries = async (networkLevelEntriesDetails, where) => {
    try {
        const networkLevelEntries = new GaaLevelEntries();
        const data = await networkLevelEntries.update(networkLevelEntriesDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.NETWORK_LEVEL_ENTRIES_UPDATE_FAILURE);
    }
};

const getAllNetworkLevelEntries = async () => {
    try {
        const networkLevelEntries = new GaaLevelEntries();
        const data = await networkLevelEntries.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_NETWORK_LEVEL_ENTRIES_LIST_FAILURE);
    }
};

const deleteAllNetworkLevelEntries = async (where) => {
    try {
        const networkLevelEntries = new GaaLevelEntries();
        const data = await networkLevelEntries.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_NETWORK_LEVEL_ENTRIES_FAILURE);
    }
};

const getNetworkLevelEntryHistory = async (where) => {
    try {
        const historyModelInstance = new GaaLevelEntriesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.NETWORK_LEVEL_ENTRIES_ID_REQUIRED);
    }
};

module.exports = {
    networkLevelEntriesAlreadyExists,
    getNetworkLevelEntriesByCondition,
    createNetworkLevelEntries,
    updateNetworkLevelEntries,
    getAllNetworkLevelEntries,
    deleteAllNetworkLevelEntries,
    getAllNetworkLevelEntryByDropdown,
    getNetworkLevelEntryHistory
};
