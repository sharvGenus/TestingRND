const { throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const userMasterLovPermissionService = require("./user-master-lov-permission.service");
const UserMasterLovPermission = require("../../database/operation/user-master-lov-permissions");
const Gaanetwork = require("../../database/operation/gaa-level-entries");
// const { getAllGaaLevelEntryByDropdown } = require("../gaa-level-entries/gaa-level-entries.service");
/**
* Method to create user master lov permission
* @param { object } req.body
* @returns { object } data
*/
const createUserMasterLovPermission = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_MASTER_LOV_PERMISSION_DETAILS);
    const data = await userMasterLovPermissionService.createUserMasterLovPermission(req.body);
    return { data };
};
 
/**
* Method to update user master lov permission
* @param { object } req.body
* @returns { object } data
*/
const updateUserMasterLovPermission = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_MASTER_LOV_PERMISSION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_MASTER_LOV_PERMISSION_DETAILS);
    const isUserColumnPerExists = await userMasterLovPermissionService.isUserMasterLovPermExists({ id });
    throwIfNot(isUserColumnPerExists, statusCodes.DUPLICATE, statusMessages.USER_MASTER_LOV_PERMISSION_NOT_EXIST);
    const data = await userMasterLovPermissionService.updateUserMasterLovPermission(req.body, { id });
    return { data };
};
 
const getUserForGaaNetwork = async (req) => {
    const userMasterLovPermission = new UserMasterLovPermission();
    const gaaNetwork = new Gaanetwork();
    const where = { master_id: "d4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7",
        "$user.organization_type$": req.query.orgType,
        "$user.organization_id$": req.query.orgId };
    
    try {
        const data1 = await userMasterLovPermission.findAllNew(where, [["updated_at", "DESC"]]); // got level from here
        const processData = async () => {
            await Promise.all(data1.rows.map(async (ele) => {
                const setArray = Array.from(new Set(ele.lovArray));
                if (setArray.length) {
                    const [levelProject, results1] = await Promise.all([
                        gaaNetwork.db.sequelize.selectQuery(`SELECT DISTINCT gh.project_id, p.name AS project_name, gh.id, gh.name, gh.level_type
                            FROM gaa_level_entries gl
                            LEFT JOIN gaa_hierarchies gh ON gl.gaa_hierarchy_id = gh.id
                            LEFT JOIN projects p ON gh.project_id = p.id
                            WHERE gl.id IN ('${setArray.join("','")}') AND gl.is_active = '1' AND gh.is_active='1'`),
                        gaaNetwork.db.sequelize.selectQuery(`SELECT name FROM gaa_level_entries WHERE is_active = '1' AND id IN ('${setArray.join("','")}')`)
                    ]);
 
                    ele.lovArray = results1[0].map((row) => row.name);
                    ele.dataValues.hierarchyType = levelProject[0][0].level_type;
                    ele.dataValues.projectId = levelProject[0][0].project_id;
                    ele.dataValues.projectName = levelProject[0][0].project_name;
                    ele.dataValues.levelName = levelProject[0][0].name;
                    ele.dataValues.gaa_hierarchy_id = levelProject[0][0].id;
                }
            }));
        };
 
        await processData();
 
        const data = { data: data1.rows,
            count: data1.count };
        return { data };
    } catch (e) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_FETCH,
            e
        );
        console.log("Error :::: ", e);
    }
};
 
const getGaaNetworkUserId = async (req) => {
    const userMasterLovPermission = new UserMasterLovPermission();
    const gaaNetwork = new Gaanetwork();
    const where = { master_id: "d4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7",
        $user_id$: req.query.userId };
 
    try {
        const data1 = await userMasterLovPermission.findAllNew(where);
 
        const processData = async () => {
            await Promise.all(data1.rows.map(async (ele) => {
                const setArray = Array.from(new Set(ele.lovArray));
                let [topLevelData] = await gaaNetwork.db.sequelize.selectQuery(`WITH ranked_data AS (
                    SELECT
                        gl.id as gl_id, gh.rank,
                        MIN(gh.rank) OVER () AS min_rank
                    FROM
                        public.gaa_level_entries gl
                    INNER JOIN gaa_hierarchies gh ON gl.gaa_hierarchy_id = gh.id
                    WHERE gl.id IN ('${setArray.join("','")}')
                    AND gh.level_type = 'gaa'
                )
                SELECT gl_id FROM ranked_data WHERE rank = min_rank ORDER BY rank ASC`);

                topLevelData = topLevelData.map((val) => val.gl_id);
 
                const [levelProject, hierarchyIds] = await Promise.all([
                    gaaNetwork.db.sequelize.selectQuery(`SELECT DISTINCT gh.project_id,p.name AS project_name, gh.id, gh.name, gh.is_mapped, gh.rank, gh.level_type
                        FROM gaa_level_entries gl
                        LEFT JOIN gaa_hierarchies gh ON gl.gaa_hierarchy_id = gh.id
                        LEFT JOIN projects p ON gh.project_id = p.id
                        WHERE gl.id IN ('${topLevelData.join("','")}') AND gl.is_active = '1' AND gh.is_active='1'`),
                    getAboveLevels(topLevelData, true)
                ]);
 
                const flatArr = hierarchyIds.flat();
 
                const results = await gaaNetwork.db.sequelize.selectQuery(`SELECT gl.id AS child, gh.id AS parent, gh.name
                FROM gaa_level_entries gl
                LEFT JOIN gaa_hierarchies gh ON gl.gaa_hierarchy_id = gh.id
                WHERE gl.id IN ('${flatArr.join("','")}') AND gl.is_active = '1' AND gh.is_active='1' 
                ORDER BY gh.level_type, gh.rank`);

                const hierarchy = results.flatMap((group) => {
                    if (Array.isArray(group)) {
                        return Object.values(group.reduce((acc, { child, parent, name }) => {
                            if (!acc[parent]) {
                                acc[parent] = { gaaName: name, gaaHierarchyId: parent, levelEntries: [] };
                            }
                            acc[parent].levelEntries.push(child);
                            return acc;
                        }, {}));
                    }
                    return [];
                });
 
                ele.dataValues.hierarchy = hierarchy;
 
                ele.dataValues.hierarchyType = levelProject[0][0].level_type;
                ele.dataValues.projectId = levelProject[0][0].project_id;
                ele.dataValues.projectName = levelProject[0][0].project_name;
                ele.dataValues.levelName = levelProject[0][0].name;
                ele.dataValues.levelRank = levelProject[0][0].rank;
                ele.dataValues.gaa_hierarchy_id = levelProject[0][0].id;
            }));
        };
        await processData();
        const data = { data: data1.rows[0] };
        return data;
 
    } catch (e) {
        throwError(
            statusCodes.INTERNAL_ERROR,
            statusMessages.FAILED_USER_MASTER_LOV_PERMISSION_FETCH,
            e
        );
        console.log("Error :::: ", e);
    }
};
 
const arrSample = [];
async function getAboveLevels(arr, flag) {
    if (flag) arrSample.length = 0;
    if (arrSample.length == 0) arrSample.push(arr);
 
    return new Promise((resolve, reject) => {
        const gaaNetwork = new Gaanetwork();
        gaaNetwork.db.sequelize.selectQuery(`SELECT DISTINCT parent_id FROM gaa_level_entries WHERE id in ('${arr.join("','")}') AND is_active = '1'`)
            .then((parentId) => {
                const parentIds = parentId[0].map((obj) => obj.parent_id);
 
                if (parentIds[0] != null) {
                    arrSample.push(parentIds);
                    resolve(getAboveLevels(parentIds));
                } else {
                    resolve(arrSample);
                }
            }).catch(reject);
    });
 
}
 
/**
* Method to get user master lov permission details by userId
* @param { object } req.body
* @returns { object } data
*/
const getUserMasterLovPermissionByUserId = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_ID_REQUIRED);
    const data = await userMasterLovPermissionService.getUserMasterLovPermissionByUserId({ userId: id });
    return { data };
};
 
/**
* Method to get user master lov permission details
* @param { object } req.body
* @returns { object } data
*/
const getUserMasterLovPermission = async (req) => {
    const data = await userMasterLovPermissionService.getUserMasterLovPermission();
    return { data };
};
 
/**
* Method to delete user master lov permission by id
* @param { object } req.body
* @returns { object } data
*/
const deleteUserMasterLovPermission = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_MASTER_LOV_PERMISSION_ID_REQUIRED);
    const data = await userMasterLovPermissionService.deleteUserMasterLovPermission({ id });
    return { data };
};
 
module.exports = {
    createUserMasterLovPermission,
    updateUserMasterLovPermission,
    deleteUserMasterLovPermission,
    getUserMasterLovPermissionByUserId,
    getUserMasterLovPermission,
    getUserForGaaNetwork,
    getGaaNetworkUserId
};