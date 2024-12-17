/* eslint-disable max-len */
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { throwIf, throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ruralHierarchyService = require("./rural-hierarchies.service");
const urbanHierarchyService = require("../urban-hierarchies/urban-hierarchies.service");
const Urbannetwork = require("../../database/operation/urban-level-entries");

const filterMapping = {
    name: "name",
    code: "code",
    rank: "rank",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$",
    remarks: "remarks",
    id: "id"
};

/**
 * Method to create ruralHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const createRuralHierarchy = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_RURAL_DETAILS);
    // Check if the name already exists
    const isNameExists = await ruralHierarchyService.ruralHierarchyAlreadyExists({ name: req.body.name, levelType: req.body.levelType, projectId: req.body.projectId });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.RURAL_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await ruralHierarchyService.ruralHierarchyAlreadyExists({ code: req.body.code, levelType: req.body.levelType, projectId: req.body.projectId });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.RURAL_ALREADY_EXIST);
    const data = await ruralHierarchyService.createRuralHierarchy(req.body);
    return { data };
};

/**
 * Method to update ruralHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const updateRuralHierarchy = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.RURAL_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_RURAL_DETAILS);
    const isRuralHierarchyExists = await ruralHierarchyService.ruralHierarchyAlreadyExists({ id: req.params.id });
    throwIfNot(isRuralHierarchyExists, statusCodes.DUPLICATE, statusMessages.RURAL_NOT_EXIST);
    // Check if the name already exists
    if (req.body.name) {
        const isNameExists = await ruralHierarchyService.ruralHierarchyAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, levelType: req.body.levelType, projectId: req.body.projectId }] });
        throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.RURAL_ALREADY_EXIST);
    }
    // Check if the code already exists
    if (req.body.code) {
        const isCodeExists = await ruralHierarchyService.ruralHierarchyAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, levelType: req.body.levelType, projectId: req.body.projectId }] });
        throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.RURAL_ALREADY_EXIST);
    }
    const data = await ruralHierarchyService.updateRuralHierarchy(req.body, { id: req.params.id });
    if (req.body?.isMapped === 1) {
        await ruralHierarchyService.updateRuralHierarchy({ isMapped: 0 }, { id: { [Op.ne]: req.params.id }, projectId: req.body.projectId });
    }
    return { data };
};

/**
 * Method to get ruralHierarchy details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getRuralHierarchyDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.RURAL_ID_REQUIRED);
    const data = await ruralHierarchyService.getRuralHierarchyByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all ruralHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRuralHierarchy = async (req) => {
    const { levelType } = req.query;
    const data = await ruralHierarchyService.getAllRuralHierarchy({ levelType });
    return { data };
};

const getRuralHierarchiesHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.RURAL_ID_REQUIRED);
    const data = await ruralHierarchyService.getRuralHierarchyHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to delete ruralHierarchy by ruralHierarchy id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteRuralHierarchy = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.RURAL_ID_REQUIRED);
    const data = await ruralHierarchyService.deleteRuralHierarchy({ id: req.params.id });
    return { data };
};

/**
 * Method to get urban names and Id list based on projectId
 * @param { object } req.body
 * @returns { object } data
 */

const getAllRuralHierarchyByProjectId = async (req) => {
    const { accessors, searchString, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};

    const condition = {
        [Op.and]: []
    };

    if (searchString && searchString.length > 0) {
        // 
        let accessorArray = accessors ? JSON.parse(accessors) : [];
        accessorArray = accessorArray.filter((item) => item !== null);
        const elementsToRemove = ["updatedAt", "createdAt", "isMapped"];
        accessorArray = accessorArray.filter((item) => !elementsToRemove.includes(item));
        accessorArray = accessorArray.map((item) => (item.includes(".") ? item : `urban_hierarchies.${item}`));
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

    if (req.params.id && req.query.levelType) {
        condition[Op.and].push({ projectId: req.params.id, levelType: req.query.levelType });
    }

    if (req.query.userId) {
        const urbanNetwork = new Urbannetwork();
        try {
            const { userId } = req.query;
            let rank = 0;
            const UserData = async () => {
                const userData = await urbanNetwork.db.sequelize.selectQuery(
                    // eslint-disable-next-line quotes
                    `SELECT "user_master_lov_permission"."id", "user_master_lov_permission"."lov_array" AS "lovArray" FROM "user_master_lov_permission" AS "user_master_lov_permission" LEFT OUTER JOIN "users" AS "user" ON "user_master_lov_permission"."user_id" = "user"."id" AND ("user"."deleted_at" IS NULL) WHERE "user_master_lov_permission"."master_id" = 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7' AND "user_master_lov_permission"."user_id" = '${userId}'`
                );
                
                if (userData && userData[0] && userData[0].length > 0) {
                    const lovArray = userData[0][0]?.lovArray;

                    if (lovArray && lovArray.length > 0) {
                        const urbanData = await urbanNetwork.db.sequelize.selectQuery(`SELECT DISTINCT gh.project_id, gh.rank
                            FROM urban_level_entries gl
                            LEFT JOIN urban_hierarchies gh ON gl.urban_hierarchy_id = gh.id
                            LEFT JOIN projects p ON gh.project_id = p.id
                            WHERE gl.id IN ('${lovArray.join("','")}') AND gl.is_active = '1' AND gh.is_active='1' AND gh.level_type='urban'`);
        
                        if (urbanData && urbanData[0] && urbanData[0].length > 0) {
                            rank = urbanData[0][0]?.rank;
                        }
                    }
                }
            };

            await UserData();
            if (rank > 0) {
                condition[Op.and].push({ rank: { [Op.gte]: rank } });
            } else {
                throwError(statusCodes.INTERNAL_ERROR, statusMessages.USER_AREA_ACCESS("URBAN"));
            }

        } catch (error) {
            throwError(statusCodes.INTERNAL_ERROR, error);
        }
    }

    const data = await ruralHierarchyService.getAllRuralHierarchiesByProjectIdForSearch(condition);
    return { data };
};

module.exports = {
    createRuralHierarchy,
    updateRuralHierarchy,
    getRuralHierarchyDetails,
    getRuralHierarchiesHistory,
    getAllRuralHierarchy,
    deleteRuralHierarchy,
    getAllRuralHierarchyByProjectId
};
