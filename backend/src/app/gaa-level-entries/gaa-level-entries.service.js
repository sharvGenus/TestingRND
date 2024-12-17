const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const GaaLevelEntries = require("../../database/operation/gaa-level-entries");
const GaaLevelEntriesHistory = require("../../database/operation/gaa-level-entries-history");

const gaaLevelEntryAlreadyExists = async (where) => {
    try {
        const gaaLevelEntries = new GaaLevelEntries();
        const data = await gaaLevelEntries.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LEVEL_ENTRIES_FAILURE, error);
    }
};

const getGaaLevelEntryByCondition = async (where) => {
    try {
        const gaaLevelEntries = new GaaLevelEntries();
        const data = await gaaLevelEntries.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LEVEL_ENTRIES_FAILURE, error);
    }
};

const creategaaLevelEntry = async (gaaLevelEntryDetails) => {
    try {
        const gaaLevelEntries = new GaaLevelEntries();
        const data = await gaaLevelEntries.create(gaaLevelEntryDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_GAA_LEVEL_ENTRIES_FAILURE, error);
    }
};

// NOTE:- sending this raw = true while calling from access management
const getAllGaaLevelEntryByDropdown = async (where, attributes = undefined, isRelation = true, raw = false) => {
    try {
        const gaaLevelEntries = new GaaLevelEntries();
        const data = await gaaLevelEntries.findAndCountAll(where, attributes, isRelation, true, undefined, raw);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LEVEL_ENTRIES_LIST_FAILURE, error);
    }
};

const updateGaaLevelEntry = async (gaaLevelEntryDetails, where) => {
    try {
        const gaaLevelEntries = new GaaLevelEntries();
        const data = await gaaLevelEntries.update(gaaLevelEntryDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.GAA_LEVEL_ENTRIES_UPDATE_FAILURE, error);
    }
};

const getAllGaaLevelEntries = async () => {
    try {
        const gaaLevelEntries = new GaaLevelEntries();
        const data = await gaaLevelEntries.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LEVEL_ENTRIES_LIST_FAILURE, error);
    }
};

const deleteGaaLevelEntry = async (where) => {
    try {
        const gaaLevelEntries = new GaaLevelEntries();
        const data = await gaaLevelEntries.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_GAA_LEVEL_ENTRIES_FAILURE, error);
    }
};
const getGaaLevelEntryHistory = async (where) => {
    try {
        const historyModelInstance = new GaaLevelEntriesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.GAA_LEVEL_ENTRIES_ID_REQUIRED, error);
    }
};

const getHierarchicalData = async (where) => {
    const { rows } = await getAllGaaLevelEntryByDropdown(where, ["id", "name"], false, true);

    const hierarchicalDataPromises = rows?.map(async (obj) => {
        await appendChildData(obj);
        return obj;
    });

    const hierarchicalData = await Promise.all(hierarchicalDataPromises);
    return hierarchicalData;
};

const appendChildData = async (parentObj) => {
    const { id: parentId } = parentObj;
    const childResult = await getAllGaaLevelEntryByDropdown({ parentId }, ["id", "name"], false, true);

    if (childResult.rows.length > 0) {
        const childDataPromises = childResult.rows.map(async (childObj) => {
            await appendChildData(childObj);
            return childObj;
        });

        parentObj.child = await Promise.all(childDataPromises);
    }
};

const getHierarchyDataForUser = async (data, userId) => {
    const { gaaLevelEntryId, gaaHierarchyId } = data;
    const hierarchy = await buildHierarchy(gaaLevelEntryId, []);

    const hierarchyEntry = {
        gaaHierarchyId: gaaHierarchyId ?? null,
        levelEntries: gaaLevelEntryId ?? null
    };

    const newData = {
        ...data,
        hierarchy: hierarchy?.length > 0
            ? [...hierarchy.reverse(), hierarchyEntry]
            : [hierarchyEntry]
    };

    return { newData };
};

const buildHierarchy = async (parentId, hierarchy) => {
    
    const levelEntries = await getAllGaaLevelEntryByDropdown(
        { id: parentId },
        ["gaaHierarchyId", "parentId"],
        false,
        true
    );
    if (levelEntries.rows.length > 0 && levelEntries.rows[0].parentId) {
        const parentIds = levelEntries?.rows?.map((entry) => entry.parentId);
        hierarchy.push({
            gaaHierarchyId: levelEntries.rows[0].gaaHierarchyId,
            levelEntries: Array.from(new Set(parentIds))
        });

        const lastParentId = parentIds[parentIds.length - 1];
        if (lastParentId !== null) {
            const data = Array.from(new Set(parentIds));
            await buildHierarchy(data, hierarchy);
        }
        return hierarchy;
    }
};

module.exports = {
    gaaLevelEntryAlreadyExists,
    getGaaLevelEntryByCondition,
    creategaaLevelEntry,
    updateGaaLevelEntry,
    getAllGaaLevelEntries,
    deleteGaaLevelEntry,
    getAllGaaLevelEntryByDropdown,
    getGaaLevelEntryHistory,
    getHierarchicalData,
    getHierarchyDataForUser
};
