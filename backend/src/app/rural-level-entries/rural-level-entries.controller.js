/* eslint-disable max-len */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ruralLevelEntriesService = require("./rural-level-entries.service");
const { getUserGovernedLovArray } = require("../access-management/access-management.service");
const UrbanLevelEntries = require("../../database/operation/urban-level-entries");

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
 * Method to create ruralLevelEntries
 * @param { object } req.body
 * @returns { object } data
 */
const createRuralLevelEntries = async (req) => {
    console.log("req", req.body);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_RURAL_LEVEL_ENTRIES_DETAILS);
    // Check if the name already exists for the given levelId
    const isNameExists = await ruralLevelEntriesService.ruralLevelEntriesAlreadyExists({ name: req.body.name, urbanHierarchyId: req.body.urbanHierarchyId, ...(req.body.parentId ? { parentId: req.body.parentId } : {}) });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.RURAL_LEVEL_ENTRIES_ALREADY_EXIST);
    // Check if the code already exists for the given levelId
    const isCodeExists = await ruralLevelEntriesService.ruralLevelEntriesAlreadyExists({ code: req.body.code, urbanHierarchyId: req.body.urbanHierarchyId, ...(req.body.parentId ? { parentId: req.body.parentId } : {}) });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.RURAL_LEVEL_ENTRIES_ALREADY_EXIST);
    const data = await ruralLevelEntriesService.createRuralLevelEntries(req.body);
    return { data };
};

/**
 * Method to update ruralLevelEntries
 * @param { object } req.body
 * @returns { object } data
 */
const updateRuralLevelEntries = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.RURAL_LEVEL_ENTRIES_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_RURAL_LEVEL_ENTRIES_DETAILS);
    const isRuralLevelEntriesExists = await ruralLevelEntriesService.ruralLevelEntriesAlreadyExists({ id: req.params.id });
    throwIfNot(isRuralLevelEntriesExists, statusCodes.DUPLICATE, statusMessages.RURAL_LEVEL_ENTRIES_NOT_EXIST);
    // Check if the name already exists for the given levelId
    const isNameExists = await ruralLevelEntriesService.ruralLevelEntriesAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, urbanHierarchyId: req.body.urbanHierarchyId, ...(req.body.parentId ? { parentId: req.body.parentId } : {}) }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.RURAL_LEVEL_ENTRIES_ALREADY_EXIST);
    // Check if the code already exists for the given levelId
    const isCodeExists = await ruralLevelEntriesService.ruralLevelEntriesAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, urbanHierarchyId: req.body.urbanHierarchyId, ...(req.body.parentId ? { parentId: req.body.parentId } : {}) }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.RURAL_LEVEL_ENTRIES_ALREADY_EXIST);
    const data = await ruralLevelEntriesService.updateRuralLevelEntries(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get ruralLevelEntries details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getRuralLevelEntriesDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.RURAL_LEVEL_ENTRIES_ID_REQUIRED);
    const data = await ruralLevelEntriesService.getRuralLevelEntriesByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all ruralLevelEntries
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRuralLevelEntries = async (req) => {
    const data = await ruralLevelEntriesService.getAllRuralLevelEntries();
    return { data };
};

/**
 * Method to get rural level entry list in dropdown based on rural hierarchy id
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRuralLevelEntryByDropdown = async (req) => {
    const { searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const condition = {
        [Op.and]: []
    };

    if (searchString && searchString.length > 0) {
        //
        let accessorArray = accessors ? JSON.parse(accessors) : [];
        accessorArray = accessorArray.filter((item) => item !== null);
        const elementsToRemove = ["updatedAt", "createdAt"];
        accessorArray = accessorArray.filter((item) => !elementsToRemove.includes(item));
        accessorArray = accessorArray.map((item) => (item.includes(".") ? item : `urban_level_entries.${item}`));
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
    const lovData = await getUserGovernedLovArray(req.user.userId, "Urban Level");
    let data;
    if (Array.isArray(lovData)) {
        const { db } = new UrbanLevelEntries();

        const [urbanData] = await db.sequelize.selectQuery(
            `WITH RECURSIVE urban_levels AS (
            SELECT 
                u1.id,
                u1.parent_id,
                u1.name,
                u1.urban_hierarchy_id
            FROM 
                urban_level_entries u1
            WHERE 
                parent_id IN (:lovData) 
            UNION 
            SELECT 
                gentry.id, 
                gentry.parent_id,
                gentry.name,
                gentry.urban_hierarchy_id
            FROM 
                urban_level_entries gentry
                INNER JOIN urban_levels glevel ON gentry.parent_id = glevel.id
            ) 
            SELECT glevel.id FROM urban_levels glevel 
            inner join urban_hierarchies gahier on glevel.urban_hierarchy_id = gahier.id
            order by gahier.rank asc`,
            {
                replacements: { lovData },
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        // where gahier.level_type = 'rural'
        
        const urbanIds = urbanData.map((row) => row.id);
        const combinedIds = [...urbanIds, ...lovData];
        const uniqueIds = [...new Set(combinedIds)];

        condition[Op.and].push({ id: uniqueIds, urbanHierarchyId: req.params.id });
        // condition[Op.and].push({ id: lovData, urbanHierarchyId: req.params.id });
        data = await ruralLevelEntriesService.getAllRuralLevelEntryByDropdown(condition);
    } else {
        condition[Op.and].push({ urbanHierarchyId: req.params.id });
        data = await ruralLevelEntriesService.getAllRuralLevelEntryByDropdown(condition);
    }
    return { data };
};

/**
 * Method to delete ruralLevelEntries by ruralLevelEntries id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteAllRuralLevelEntries = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.RURAL_LEVEL_ENTRIES_ID_REQUIRED);
    const data = await ruralLevelEntriesService.deleteAllRuralLevelEntries({ id: req.params.id });
    return { data };
};

const getRuralLevelEntryHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.RURAL_LEVEL_ENTRIES_ID_REQUIRED);
    const data = await ruralLevelEntriesService.getRuralLevelEntryHistory({ recordId: req.params.recordId });
    return { data };
};

module.exports = {
    createRuralLevelEntries,
    updateRuralLevelEntries,
    getRuralLevelEntriesDetails,
    getAllRuralLevelEntries,
    deleteAllRuralLevelEntries,
    getAllRuralLevelEntryByDropdown,
    getRuralLevelEntryHistory
};
