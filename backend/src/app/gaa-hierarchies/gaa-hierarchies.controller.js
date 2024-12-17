/* eslint-disable max-len */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const gaaHierarchyService = require("./gaa-hierarchies.service");
const Forms = require("../../database/operation/forms");
const Gaanetwork = require("../../database/operation/gaa-level-entries");

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
 * Method to create gaaHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const createGaaHierarchy = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_GAA_DETAILS);
    // Check if the name already exists
    const isNameExists = await gaaHierarchyService.gaaHierarchyAlreadyExists({ name: req.body.name, levelType: req.body.levelType, projectId: req.body.projectId });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.GAA_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await gaaHierarchyService.gaaHierarchyAlreadyExists({ code: req.body.code, levelType: req.body.levelType, projectId: req.body.projectId });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.GAA_ALREADY_EXIST);
    const data = await gaaHierarchyService.createGaaHierarchy(req.body);
    return { data };
};

/**
 * Method to update gaaHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const updateGaaHierarchy = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.GAA_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_GAA_DETAILS);
    const isGaaHierarchyExists = await gaaHierarchyService.gaaHierarchyAlreadyExists({ id: req.params.id });
    throwIfNot(isGaaHierarchyExists, statusCodes.DUPLICATE, statusMessages.GAA_NOT_EXIST);
    // Check if the name already exists
    if (req.body.name) {
        const isNameExists = await gaaHierarchyService.gaaHierarchyAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, levelType: req.body.levelType, projectId: req.body.projectId }] });
        throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.GAA_ALREADY_EXIST);
    }
    // Check if the code already exists
    if (req.body.code) {
        const isCodeExists = await gaaHierarchyService.gaaHierarchyAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, levelType: req.body.levelType, projectId: req.body.projectId }] });
        throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.GAA_ALREADY_EXIST);
    }
    const data = await gaaHierarchyService.updateGaaHierarchy(req.body, { id: req.params.id });
    if (req.body?.isMapped === 1) {
        await gaaHierarchyService.updateGaaHierarchy({ isMapped: 0 }, { id: { [Op.ne]: req.params.id }, projectId: req.body.projectId });
    }
    return { data };
};

/**
 * Method to get gaaHierarchy details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getGaaHierarchyDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.GAA_ID_REQUIRED);
    const data = await gaaHierarchyService.getGaaHierarchyByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all gaaHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const getAllGaaHierarchies = async (req) => {
    const { levelType } = req.query;
    const data = await gaaHierarchyService.getAllGaaHierarchies({ levelType });
    return { data };
};

const getGaaHierarchiesHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.GAA_ID_REQUIRED);
    const data = await gaaHierarchyService.getGaaHierarchyHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to delete gaaHierarchy by gaaHierarchy id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteGaaHierarchy = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.GAA_ID_REQUIRED);
    const data = await gaaHierarchyService.deleteGaaHierarchy({ id: req.params.id });
    return { data };
};

/**
 * Method to get all gaaHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const getAllGaaHierarchiesByProjectId = async (req) => {
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
        accessorArray = accessorArray.map((item) => (item.includes(".") ? item : `gaa_hierarchies.${item}`));
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
        const gaaNetwork = new Gaanetwork();
        try {
            const { userId } = req.query;
            let rank = 0;
            const UserData = async () => {
                const userData = await gaaNetwork.db.sequelize.selectQuery(
                    // eslint-disable-next-line quotes
                    `SELECT "user_master_lov_permission"."id", "user_master_lov_permission"."lov_array" AS "lovArray" FROM "user_master_lov_permission" AS "user_master_lov_permission" LEFT OUTER JOIN "users" AS "user" ON "user_master_lov_permission"."user_id" = "user"."id" AND ("user"."deleted_at" IS NULL) WHERE "user_master_lov_permission"."master_id" = 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7' AND "user_master_lov_permission"."user_id" = '${userId}'`
                );
                
                if (userData && userData[0] && userData[0].length > 0) {
                    const lovArray = userData[0][0]?.lovArray;

                    if (lovArray && lovArray.length > 0) {
                        const gaaData = await gaaNetwork.db.sequelize.selectQuery(`SELECT DISTINCT gh.project_id, gh.rank
                            FROM gaa_level_entries gl
                            LEFT JOIN gaa_hierarchies gh ON gl.gaa_hierarchy_id = gh.id
                            LEFT JOIN projects p ON gh.project_id = p.id
                            WHERE gl.id IN ('${lovArray.join("','")}') AND gl.is_active = '1' AND gh.is_active='1' AND gh.level_type='gaa'`);
        
                        if (gaaData && gaaData[0] && gaaData[0].length > 0) {
                            rank = gaaData[0][0]?.rank;
                        }
                    }
                }
            };

            await UserData();
            if (rank > 0) {
                condition[Op.and].push({ rank: { [Op.gte]: rank } });
            } else {
                throwError(statusCodes.INTERNAL_ERROR, statusMessages.USER_AREA_ACCESS("GAA"));
            }

        } catch (error) {
            throwError(statusCodes.INTERNAL_ERROR, error);
        }
    }

    const data = await gaaHierarchyService.getAllGaaHierarchiesByProjectIdForSearch(condition);
    return { data };
};

/**
 * Method to get area-project-level
 * @param { object } req.body
 * @returns { object } data
 */
const getAreaProjectLevelByProjectId = async (req) => {
    const { formId, isAccessForAllResponses, isHeirarchiesOnly } = req.query;
    const onlyReturnWithLevels = isHeirarchiesOnly === "1";
    const { hierarchy, selectedParent } = req.body;
   
    let projectId = formId ? undefined : req.params.id,
        rank = -1,
        gaaColumnData;
    const forms = new Forms();
    const { db } = forms;
    
    if (formId || isAccessForAllResponses) {
        // get project ID from formID
        // Checking if form contains any GAA related columns
        const gaaColumnCountQuery = `
            SELECT fa.properties->>'conditions' as "conditions", column_name
            FROM FORM_ATTRIBUTES AS FA
            INNER JOIN FORMS ON FORMS.ID = FA.FORM_ID
            INNER JOIN ALL_MASTERS_LIST AS AML ON AML.ID = (FA.PROPERTIES ->> 'sourceTable')::UUID
            INNER JOIN ALL_MASTER_COLUMNS AS AMC ON AMC.ID = (FA.PROPERTIES ->> 'sourceColumn')::UUID
            WHERE 
            -- forms.form_type_id: 30ea8a65-ff5b-4bff-b1a1-892204e23669: Installation | O&M, 1d75feca-2e64-4b95-900d-fcd53446ddeb: Survey
                ${isAccessForAllResponses ? "FORMS.FORM_TYPE_ID IN ('30ea8a65-ff5b-4bff-b1a1-892204e23669', '1d75feca-2e64-4b95-900d-fcd53446ddeb')"
        : `FORMS.ID = '${formId}'`}
                AND FA.PROPERTIES ->> 'sourceTable' IN ('f38ec129-0b3f-4e9d-b1b3-cf0ea21688ee', 'efc06b18-43f9-4040-b09c-b15667de74b1')
                AND FA.PROPERTIES ->> 'sourceColumn' IN ('b8c68440-19de-4908-8362-d0d41b0c89a4', '34607538-5f8f-4c59-81d7-d0638613ac45')
                AND (FA.PROPERTIES ->> 'factoryTable' IS NULL OR FA.PROPERTIES ->> 'factoryTable' = '')
                AND FA.IS_ACTIVE = '1';
        `;
        [gaaColumnData] = await forms.db.sequelize.selectQuery(gaaColumnCountQuery);
        if (gaaColumnData?.length == 0) return { data: null };

        if (formId) {
            const { projectId: data } = await forms.findOne({ id: formId }, ["projectId"]);
            projectId = data;
        }
    }

    let gaaLovAccessList = [];
    let accessIds = [];
    let accessRank = 1;
    let hierarchyrank = 1;
    const { isSuperUser, userId } = req.user;
    if (formId || isAccessForAllResponses) {
        // Filtering Data based on access management
        if (!isSuperUser) {
            const gaaLovAccessListQuery = `
                SELECT GH.RANK,
                    GH.LEVEL_TYPE,
                    UMLP.LOV_ARRAY
                FROM GAA_HIERARCHIES AS GH
                INNER JOIN GAA_LEVEL_ENTRIES AS GLE ON GLE.GAA_HIERARCHY_ID = GH.ID
                INNER JOIN USER_MASTER_LOV_PERMISSION AS UMLP ON UMLP.LOV_ARRAY[1] = GLE.ID
                WHERE UMLP.USER_ID = '${userId}'
                    AND UMLP.MASTER_ID = 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7';            
            `;
            const [gaaLovAccessData] = await db.sequelize.selectQuery(gaaLovAccessListQuery);
            gaaLovAccessList = gaaLovAccessData;
            const { rank, lov_array: lovArray = [] } = gaaLovAccessData?.[0] || {};
            let i = rank - 1;
            let query = "SELECT ARRAY_AGG(GLE.ID)";
            while (i > 0) {
                query += ` || ARRAY_AGG(GLE_${i}.id)`;
                i -= 1;
            }
            i = rank - 1;
            query += "  AS \"allIds\" FROM GAA_LEVEL_ENTRIES AS GLE ";
            while (i > 0) {
                const joinCondition = i + 1 === rank ? "GLE" : `GLE_${i + 1}`;
                query += ` LEFT JOIN GAA_LEVEL_ENTRIES AS GLE_${i} ON GLE_${i}.id = ${joinCondition}.parent_id`;
                i -= 1;
            }
            query += " WHERE GLE.ID IN (:lovArray)";
            const [[[{ allIds }]], [[{ rank: hierarchyRankNumber }]]] = await Promise.all([
                db.sequelize.selectQuery(query, { replacements: { lovArray } }),
                hierarchy ? db.sequelize.selectQuery("SELECT RANK FROM GAA_HIERARCHIES WHERE ID = :hierarchy", { replacements: { hierarchy } }) : [[{ rank: 1 }]]
            ]);
            accessIds = allIds;
            accessRank = rank;
            hierarchyrank = hierarchyRankNumber;
        }
    }

    const filterConditions = gaaColumnData?.map((x) => {
        if (x.conditions) {
            const condition = JSON.parse(x.conditions);
            let i = 0;
            while (i < condition.length) {
                const { column, value } = condition?.[i] || {};
                if (["b3bfc8a2-9674-4940-bb43-19b6f600e674", "337b367c-eda3-44ce-8c2a-d04dc03ab3e7"].includes(column)) {
                    return value;
                }
                i += 1;
            }
        }
        return undefined;
    }).filter((x) => x);

    if (filterConditions?.length == 0) return { data: null };

    let data = await gaaHierarchyService.getAreaProjectLevelByProjectId(projectId, onlyReturnWithLevels, hierarchy, selectedParent, hierarchyrank <= accessRank ? accessIds : [], filterConditions);
    data = JSON.parse(JSON.stringify(data));
    
    if (formId || isAccessForAllResponses) {
        // Filtering Data based on access management
        if (!isSuperUser && !onlyReturnWithLevels) {
            const { level_type: levelType } = gaaLovAccessList[0] || {};
            rank = gaaLovAccessList[0]?.rank || -1;
            let { lov_array: lovArray } = gaaLovAccessList[0] || {};
            const initialLovArray = [...lovArray || []];

            if (!rank || rank === -1) {
                // If no rank found, means no access
                data[0].gaaLevels.forEach((level) => {
                    level.gaa_level_entries = [];
                });
                data[1].networkLevels.forEach((level) => {
                    level.gaa_level_entries = [];
                });
            } else {
                // Handling top hierarchy
                if (levelType === "gaa") {
                    for (let i = rank - 1; i >= 0; i--) {
                        const parentIds = new Set();
                        // eslint-disable-next-line no-loop-func
                        data[0].gaaLevels[i].gaa_level_entries = data[0].gaaLevels[i].gaa_level_entries.filter((entry) => {
                            if (lovArray.includes(entry.id)) {
                                parentIds.add(entry.parentId);
                                return true;
                            } else return false;
                        });
                        lovArray = [...parentIds];
                    }
                } else if (levelType === "network") {
                    for (let i = rank - 1; i >= 0; i--) {
                        const parentIds = new Set();
                        // eslint-disable-next-line no-loop-func
                        data[1].networkLevels[i].gaa_level_entries = data[1].networkLevels[i].gaa_level_entries.filter((entry) => {
                            if (lovArray.includes(entry.id)) {
                                parentIds.add(entry.parentId);
                                return true;
                            } else return false;
                        });
                        lovArray = [...parentIds];
                    }
                    let lastMappedColumnIndex = 0;
                    for (let i = data[0].gaaLevels.length - 1; i >= 0; i--) {
                        if (data[0].gaaLevels[i].isMapped == 1) {
                            lastMappedColumnIndex = i;
                            break;
                        }
                    }
                    for (let i = lastMappedColumnIndex; i >= 0; i--) {
                        const parentIds = new Set();
                        // eslint-disable-next-line no-loop-func
                        data[0].gaaLevels[i].gaa_level_entries = data[0].gaaLevels[i].gaa_level_entries.filter((entry) => {
                            if (lovArray.includes(entry.id)) {
                                parentIds.add(entry.parentId);
                                return true;
                            } else return false;
                        });
                        lovArray = [...parentIds];
                    }
                }
    
                // Handling bottom hierarchy
                lovArray = [...initialLovArray];
                const isMappedColumnIds = [];
                if (levelType === "gaa") {
                    for (let i = rank; i < data[0].gaaLevels.length; i++) {
                        const parentIds = [];
                        // eslint-disable-next-line no-loop-func
                        data[0].gaaLevels[i].gaa_level_entries = data[0].gaaLevels[i].gaa_level_entries.filter((entry) => {
                            if (lovArray.includes(entry.parentId)) {
                                parentIds.push(entry.id);
                                return true;
                            } else return false;
                        });
                        lovArray = [...parentIds];
    
                        if (data[0].gaaLevels[i].isMapped == 1) {
                            isMappedColumnIds.push(...data[0].gaaLevels[i].gaa_level_entries.map((entry) => entry.id));
                        }
                    }
    
                    if (!isMappedColumnIds.length) {
                        // Case when access was given below mapped column
                        for (let i = 0; i < rank; i++) {
                            if (data[0].gaaLevels[i].isMapped == 1) {
                                isMappedColumnIds.push(...data[0].gaaLevels[i].gaa_level_entries.map((entry) => entry.id));
                                break;
                            }
                        }
                    }
                    
                    lovArray = isMappedColumnIds;
                    for (let i = 0; i < data[1].networkLevels.length; i++) {
                        const parentIds = [];
                        // eslint-disable-next-line no-loop-func
                        data[1].networkLevels[i].gaa_level_entries = data[1].networkLevels[i].gaa_level_entries.filter((entry) => {
                            if (lovArray.includes(entry.parentId)) {
                                parentIds.push(entry.id);
                                return true;
                            } else return false;
                        });
                        lovArray = [...parentIds];
                    }
    
                } else if (levelType === "network") {
                    for (let i = rank; i < data[1].networkLevels.length; i++) {
                        const parentIds = [];
                        // eslint-disable-next-line no-loop-func
                        data[1].networkLevels[i].gaa_level_entries = data[1].networkLevels[i].gaa_level_entries.filter((entry) => {
                            if (lovArray.includes(entry.parentId)) {
                                parentIds.push(entry.id);
                                return true;
                            } else return false;
                        });
                        lovArray = [...parentIds];
                    }
                }
            }
        }

        // Removing GAA & Network objects that are not present in the form response
        const columnIds = {};
        gaaColumnData.forEach((item) => {
            const conditions = JSON.parse(item.conditions);
            conditions.forEach((condition) => {
                if (condition?.column === "b3bfc8a2-9674-4940-bb43-19b6f600e674" || condition?.column === "337b367c-eda3-44ce-8c2a-d04dc03ab3e7") {
                    columnIds[condition.value] = item?.column_name;
                }
            });
        });
        data.forEach((item) => {
            if (item.gaaLevels) {
                item.gaaLevels.forEach((x) => {
                    x.gaa_level_entries = x.gaa_level_entries.filter((y) => y.id);
                });
                item.gaaLevels = item.gaaLevels.filter((level) => Object.keys(columnIds).includes(level?.id)).map((level) => ({ ...level, columnName: columnIds[level.id] }));
                item.count = item.gaaLevels.length;
            }
            
            if (item.networkLevels) {
                item.networkLevels.forEach((x) => {
                    x.gaa_level_entries = x.gaa_level_entries.filter((y) => y.id);
                });
                item.networkLevels = item.networkLevels.filter((level) => Object.keys(columnIds).includes(level?.id)).map((level) => ({ ...level, columnName: columnIds[level.id] }));
                item.count = item.networkLevels.length;
            }
        });

    }
    // hierarchy && selectedParent
    if (hierarchy && selectedParent) {
        let levelEnteriesForSelectedHierarchy = [];
        data.forEach((x) => {
            Object.entries(x).forEach(([key, value]) => {
                if (value?.[0]?.id === hierarchy) {
                    levelEnteriesForSelectedHierarchy = value[0].gaa_level_entries;
                }
            });
        });
        return { levelEntires: levelEnteriesForSelectedHierarchy };
    } else {
        return { data, accessRank: accessRank };
    }
};

module.exports = {
    createGaaHierarchy,
    updateGaaHierarchy,
    getGaaHierarchiesHistory,
    getGaaHierarchyDetails,
    getAllGaaHierarchies,
    deleteGaaHierarchy,
    getAllGaaHierarchiesByProjectId,
    getAreaProjectLevelByProjectId
};
