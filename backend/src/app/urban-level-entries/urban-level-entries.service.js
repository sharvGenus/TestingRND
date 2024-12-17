const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const UrbanLevelEntries = require("../../database/operation/urban-level-entries");
const UrbanLevelEntriesHistory = require("../../database/operation/urban-level-entries-history");

const urbanLevelEntryAlreadyExists = async (where) => {
    try {
        const urbanLevelEntries = new UrbanLevelEntries();
        const data = await urbanLevelEntries.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LEVEL_ENTRIES_FAILURE, error);
    }
};

const getUrbanLevelEntryByCondition = async (where) => {
    try {
        const urbanLevelEntries = new UrbanLevelEntries();
        const data = await urbanLevelEntries.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LEVEL_ENTRIES_FAILURE, error);
    }
};

const createurbanLevelEntry = async (urbanLevelEntryDetails) => {
    try {
        const urbanLevelEntries = new UrbanLevelEntries();
        const data = await urbanLevelEntries.create(urbanLevelEntryDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_URBAN_LEVEL_ENTRIES_FAILURE, error);
    }
};

// NOTE:- sending this raw = true while calling from access management
const getAllUrbanLevelEntryByDropdown = async (where, attributes = undefined, isRelation = true, raw = false) => {
    try {
        const urbanLevelEntries = new UrbanLevelEntries();
        const data = await urbanLevelEntries.findAndCountAll(where, attributes, isRelation, true, undefined, raw);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LEVEL_ENTRIES_LIST_FAILURE, error);
    }
};

const updateUrbanLevelEntry = async (urbanLevelEntryDetails, where) => {
    try {
        const urbanLevelEntries = new UrbanLevelEntries();
        const data = await urbanLevelEntries.update(urbanLevelEntryDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.URBAN_LEVEL_ENTRIES_UPDATE_FAILURE, error);
    }
};

const getAllUrbanLevelEntries = async () => {
    try {
        const urbanLevelEntries = new UrbanLevelEntries();
        const data = await urbanLevelEntries.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_URBAN_LEVEL_ENTRIES_LIST_FAILURE, error);
    }
};

const deleteUrbanLevelEntry = async (where) => {
    try {
        const urbanLevelEntries = new UrbanLevelEntries();
        const data = await urbanLevelEntries.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_URBAN_LEVEL_ENTRIES_FAILURE, error);
    }
};
const getUrbanLevelEntryHistory = async (where) => {
    try {
        const historyModelInstance = new UrbanLevelEntriesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.URBAN_LEVEL_ENTRIES_ID_REQUIRED, error);
    }
};

const getHierarchicalData = async (where) => {
    const { rows } = await getAllUrbanLevelEntryByDropdown(where, ["id", "name"], false, true);

    const hierarchicalDataPromises = rows?.map(async (obj) => {
        await appendChildData(obj);
        return obj;
    });

    const hierarchicalData = await Promise.all(hierarchicalDataPromises);
    return hierarchicalData;
};

const appendChildData = async (parentObj) => {
    const { id: parentId } = parentObj;
    const childResult = await getAllUrbanLevelEntryByDropdown({ parentId }, ["id", "name"], false, true);

    if (childResult.rows.length > 0) {
        const childDataPromises = childResult.rows.map(async (childObj) => {
            await appendChildData(childObj);
            return childObj;
        });

        parentObj.child = await Promise.all(childDataPromises);
    }
};

const getHierarchyDataForUser = async (data, userId) => {
    const { urbanLevelEntryId, urbanHierarchyId } = data;
    const hierarchy = await buildHierarchy(urbanLevelEntryId, []);

    const hierarchyEntry = {
        urbanHierarchyId: urbanHierarchyId ?? null,
        levelEntries: urbanLevelEntryId ?? null
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
    
    const levelEntries = await getAllUrbanLevelEntryByDropdown(
        { id: parentId },
        ["urbanHierarchyId", "parentId"],
        false,
        true
    );
    if (levelEntries.rows.length > 0 && levelEntries.rows[0].parentId) {
        const parentIds = levelEntries?.rows?.map((entry) => entry.parentId);
        hierarchy.push({
            urbanHierarchyId: levelEntries.rows[0].urbanHierarchyId,
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
    urbanLevelEntryAlreadyExists,
    getUrbanLevelEntryByCondition,
    createurbanLevelEntry,
    updateUrbanLevelEntry,
    getAllUrbanLevelEntries,
    deleteUrbanLevelEntry,
    getAllUrbanLevelEntryByDropdown,
    getUrbanLevelEntryHistory,
    getHierarchicalData,
    getHierarchyDataForUser
};
