/* eslint-disable max-len */
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const UrbanLevelEntries = require("../../database/operation/urban-level-entries");
const UrbanLevelEntriesHistory = require("../../database/operation/urban-level-entries-history");

const ruralLevelEntriesAlreadyExists = async (where) => {
    try {
        const ruralLevelEntries = new UrbanLevelEntries();
        const data = await ruralLevelEntries.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_RURAL_LEVEL_ENTRIES_FAILURE);
    }
};

const getRuralLevelEntriesByCondition = async (where) => {
    try {
        const ruralLevelEntries = new UrbanLevelEntries();
        const data = await ruralLevelEntries.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_RURAL_LEVEL_ENTRIES_FAILURE);
    }
};

const createRuralLevelEntries = async (ruralLevelEntriesDetails) => {
    try {
        const ruralLevelEntries = new UrbanLevelEntries();
        const data = await ruralLevelEntries.create(ruralLevelEntriesDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_RURAL_LEVEL_ENTRIES_FAILURE);
    }
};

// NOTE:- sending this raw = true while calling from access management
const getAllRuralLevelEntryByDropdown = async (where, raw = false) => {
    try {
        const ruralLevelEntries = new UrbanLevelEntries();
        const data = await ruralLevelEntries.findAndCountAll(where, undefined, true, true, undefined, raw);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_RURAL_LEVEL_ENTRIES_LIST_FAILURE);
    }
};

const updateRuralLevelEntries = async (ruralLevelEntriesDetails, where) => {
    try {
        const ruralLevelEntries = new UrbanLevelEntries();
        const data = await ruralLevelEntries.update(ruralLevelEntriesDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.RURAL_LEVEL_ENTRIES_UPDATE_FAILURE);
    }
};

const getAllRuralLevelEntries = async () => {
    try {
        const ruralLevelEntries = new UrbanLevelEntries();
        const data = await ruralLevelEntries.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_RURAL_LEVEL_ENTRIES_LIST_FAILURE);
    }
};

const deleteAllRuralLevelEntries = async (where) => {
    try {
        const ruralLevelEntries = new UrbanLevelEntries();
        const data = await ruralLevelEntries.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_RURAL_LEVEL_ENTRIES_FAILURE);
    }
};

const getRuralLevelEntryHistory = async (where) => {
    try {
        const historyModelInstance = new UrbanLevelEntriesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.RURAL_LEVEL_ENTRIES_ID_REQUIRED);
    }
};

module.exports = {
    ruralLevelEntriesAlreadyExists,
    getRuralLevelEntriesByCondition,
    createRuralLevelEntries,
    updateRuralLevelEntries,
    getAllRuralLevelEntries,
    deleteAllRuralLevelEntries,
    getAllRuralLevelEntryByDropdown,
    getRuralLevelEntryHistory
};
