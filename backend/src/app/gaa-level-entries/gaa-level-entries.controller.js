const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const gaaLevelEntriesService = require("./gaa-level-entries.service");
const { getUserGovernedLovArray, goverRowForUserAfterCreate } = require("../access-management/access-management.service");
const GaaLevelEntries = require("../../database/operation/gaa-level-entries");

const filterMapping = {
    id: "id",
    name: "name",
    code: "code",
    approvalStatus: "approval_status",
    parentId: "$parent.id$",
    parentName: "$parent.name$",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create gaa level entry
 * @param { object } req.body
 * @returns { object } data
 */
const creategaaLevelEntry = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_GAA_LEVEL_ENTRIES_DETAILS);
    // Check if the name already exists for the given levelId
    const isNameExists = await gaaLevelEntriesService.gaaLevelEntryAlreadyExists({ name: req.body.name, gaaHierarchyId: req.body.gaaHierarchyId, ...(req.body.parentId ? { parentId: req.body.parentId } : {}) });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.GAA_LEVEL_ENTRIES_ALREADY_EXIST);
    // Check if the code already exists for the given levelId
    const isCodeExists = await gaaLevelEntriesService.gaaLevelEntryAlreadyExists({ code: req.body.code, gaaHierarchyId: req.body.gaaHierarchyId, ...(req.body.parentId ? { parentId: req.body.parentId } : {}) });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.GAA_LEVEL_ENTRIES_ALREADY_EXIST);
    const data = await gaaLevelEntriesService.creategaaLevelEntry(req.body);
    // await goverRowForUserAfterCreate(req.user.userId, data.id, "GAA Level");
    return { data };
};

/**
 * Method to update gaa level entry
 * @param { object } req.body
 * @returns { object } data
 */
const updateGaaLevelEntry = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.GAA_LEVEL_ENTRIES_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_GAA_LEVEL_ENTRIES_DETAILS);
    const isGaaLevelEntryExists = await gaaLevelEntriesService.gaaLevelEntryAlreadyExists({ id: req.params.id });
    throwIfNot(isGaaLevelEntryExists, statusCodes.DUPLICATE, statusMessages.GAA_LEVEL_ENTRIES_NOT_EXIST);
    // Check if the name already exists for the given levelId
    const isNameExists = await gaaLevelEntriesService.gaaLevelEntryAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, gaaHierarchyId: req.body.gaaHierarchyId, ...(req.body.parentId ? { parentId: req.body.parentId } : {}) }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.GAA_LEVEL_ENTRIES_ALREADY_EXIST);
    // Check if the code already exists for the given levelId
    const isCodeExists = await gaaLevelEntriesService.gaaLevelEntryAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, gaaHierarchyId: req.body.gaaHierarchyId, ...(req.body.parentId ? { parentId: req.body.parentId } : {}) }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.GAA_LEVEL_ENTRIES_ALREADY_EXIST);
    const data = await gaaLevelEntriesService.updateGaaLevelEntry(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get gaa level entry details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getGaaLevelEntryDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.GAA_LEVEL_ENTRIES_ID_REQUIRED);
    const data = await gaaLevelEntriesService.getGaaLevelEntryByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all gaa level entries
 * @param { object } req.body
 * @returns { object } data
 */
const getAllGaaLevelEntries = async (req) => {
    const data = await gaaLevelEntriesService.getAllGaaLevelEntries();
    return { data };
};

/**
 * Method to get gaa level entry list in dropdown based on gaa hierarchy id
 * @param { object } req.body
 * @returns { object } data
 */
const getAllGaaLevelEntryByDropdown = async (req) => {
    const { searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const condition = {
        [Op.and]: []
    };

    if (searchString && searchString.length > 0) {
        //
        let accessorArray = accessors ? JSON.parse(accessors) : [];
        accessorArray = accessorArray.filter((item) => item !== null);
        const elementsToRemove = ["item => item.isMapped == 0 ? '-' : 'Yes'", "updatedAt", "createdAt"];
        accessorArray = accessorArray.filter((item) => !elementsToRemove.includes(item));
        accessorArray = accessorArray.map((item) => (item.includes(".") ? item : `gaa_level_entries.${item}`));
        // Define an array to hold casting conditions for each column
        const castingConditions = [];

        // Loop through the columns you want to search on
        accessorArray.forEach((column) => {
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

    const lovData = await getUserGovernedLovArray(req.user.userId, "GAA Level");
    let data;
    if (Array.isArray(lovData)) {
        const { db } = new GaaLevelEntries();

        const [gaaData] = await db.sequelize.selectQuery(
            `WITH RECURSIVE gaa_levels AS (
            SELECT 
                g1.id,
                g1.parent_id,
                g1.name,
                g1.gaa_hierarchy_id
            FROM 
                gaa_level_entries g1
            WHERE 
                parent_id IN (:lovData) 
            UNION 
            SELECT 
                gentry.id, 
                gentry.parent_id,
                gentry.name,
                gentry.gaa_hierarchy_id
            FROM 
                gaa_level_entries gentry
                INNER JOIN gaa_levels glevel ON gentry.parent_id = glevel.id
            ) 
            SELECT glevel.id FROM gaa_levels glevel 
            inner join gaa_hierarchies gahier on glevel.gaa_hierarchy_id = gahier.id
            where gahier.level_type = 'gaa'
            order by gahier.rank asc`,
            {
                replacements: { lovData },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        const gaaIds = gaaData.map((row) => row.id);
        const combinedIds = [...gaaIds, ...lovData];
        const uniqueIds = [...new Set(combinedIds)];

        condition[Op.and].push({ id: uniqueIds, gaaHierarchyId: req.params.id });
        // condition[Op.and].push({ id: lovData, gaaHierarchyId: req.params.id });
        data = await gaaLevelEntriesService.getAllGaaLevelEntryByDropdown(condition);
    } else {
        condition[Op.and].push({ gaaHierarchyId: req.params.id });
        data = await gaaLevelEntriesService.getAllGaaLevelEntryByDropdown(condition);
    }
    return { data };
};

/**
 * Method to delete gaa level entry by gaa level entry id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteGaaLevelEntry = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.GAA_LEVEL_ENTRIES_ID_REQUIRED);
    const data = await gaaLevelEntriesService.deleteGaaLevelEntry({ id: req.params.id });
    return { data };
};

const getGaaLevelEntryHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.GAA_LEVEL_ENTRIES_ID_REQUIRED);
    const data = await gaaLevelEntriesService.getGaaLevelEntryHistory({ recordId: req.params.recordId });
    return { data };
};

module.exports = {
    creategaaLevelEntry,
    updateGaaLevelEntry,
    getGaaLevelEntryDetails,
    getAllGaaLevelEntries,
    deleteGaaLevelEntry,
    getAllGaaLevelEntryByDropdown,
    getGaaLevelEntryHistory
};
