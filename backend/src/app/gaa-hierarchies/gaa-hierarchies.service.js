const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const GaaHierarchies = require("../../database/operation/gaa-hierarchies");
const GaaHierarchiesHistory = require("../../database/operation/gaa-hierarchies-history");

const gaaHierarchyAlreadyExists = async (where) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        const data = await gaaHierarchy.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_FAILURE, error);
    }
};

const getGaaHierarchyByCondition = async (where) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        const data = await gaaHierarchy.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_FAILURE, error);
    }
};

const createGaaHierarchy = async (gaaHierarchyDetails) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        const data = await gaaHierarchy.create(gaaHierarchyDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_GAA_FAILURE, error);
    }
};

const updateGaaHierarchy = async (gaaHierarchyDetails, where) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        const data = await gaaHierarchy.update(gaaHierarchyDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.GAA_UPDATE_FAILURE, error);
    }
};

const getAllGaaHierarchies = async (where = {}, order = undefined) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        const data = await gaaHierarchy.findAndCountAll(where, undefined, true, true, order, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LIST_FAILURE, error);
    }
};
const getGaaHierarchyHistory = async (where) => {
    try {
        const historyModelInstance = new GaaHierarchiesHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.GAA_ID_REQUIRED, error);
    }
};

const deleteGaaHierarchy = async (where) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        const data = await gaaHierarchy.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_GAA_FAILURE, error);
    }
};

const getAllGaaHierarchiesByProjectId = async (where) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        gaaHierarchy.updateRelations();
        const data = await gaaHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LIST_FAILURE, error);
    }
};

const getAllGaaHierarchiesByProjectIdForSearch = async (where) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        gaaHierarchy.updateRelations();
        const data = await gaaHierarchy.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LIST_FAILURE, error);
    }
};

const getAreaProjectLevelByProjectId = async (projectId, isGaaFiteres, selectedHierirachy, selectedParent, accessIds, hierarchiesInForm = []) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        let allGaaHierarchies = [];
        if (isGaaFiteres) {
            const joinCondition = selectedHierirachy ? "" : " AND GAA_HIERARCHIES_WITH_RANK.\"row_number\" = 1";
            const hierarchyCondtion = selectedHierirachy ? ` AND "id" = '${selectedHierirachy}'` : "";
            const isSelectedParent = selectedParent ? ` AND "gaa_level_entries"."parent_id" = '${selectedParent}'` : "";
            const levelEntriesIdsCondition = accessIds.length > 0 ? ` AND (  "gaa_level_entries"."id" IN ('${accessIds.join("', '")}') OR GAA_HIERARCHIES_WITH_RANK."levelType" = 'network')` : "";
            const hierarchiesCondition = hierarchiesInForm.length > 0 ? ` AND ("gaa_hierarchies"."id" IN ('${hierarchiesInForm.join("', '")}')) ` : "";
            const query = `
                WITH GAA_HIERARCHIES_WITH_RANK AS (
                    SELECT
                        "gaa_hierarchies"."id",
                        "gaa_hierarchies"."name",
                        "gaa_hierarchies"."code",
                        "gaa_hierarchies"."rank",
                        "gaa_hierarchies"."is_mapped" AS "isMapped",
                        "gaa_hierarchies"."level_type" AS "levelType",
                        ROW_NUMBER() OVER (
                            PARTITION BY "level_type"
                            ORDER BY
                                "level_type" ASC,
                                "rank" ASC
                        ) AS "row_number"
                    FROM 
                        "gaa_hierarchies"
                    WHERE
                    (
                        "gaa_hierarchies"."deleted_at" IS NULL
                        AND (
                            "gaa_hierarchies"."is_active" = '1'
                            AND "gaa_hierarchies"."project_id" = :projectId
                        )
                        ${hierarchiesCondition}
                        ${hierarchyCondtion}
                    )
                    ORDER BY
                        "level_type" ASC,
                        "rank" ASC
                )
                SELECT
                    GAA_HIERARCHIES_WITH_RANK."id",
                    GAA_HIERARCHIES_WITH_RANK."name",
                    GAA_HIERARCHIES_WITH_RANK."code",
                    GAA_HIERARCHIES_WITH_RANK."rank",
                    GAA_HIERARCHIES_WITH_RANK."isMapped",
                    GAA_HIERARCHIES_WITH_RANK."levelType",
                    ARRAY_AGG(
                        JSON_BUILD_OBJECT(
                            'id',
                            "gaa_level_entries"."id",
                            'name',
                            "gaa_level_entries"."name",
                            'code',
                            "gaa_level_entries"."code",
                            'parentId',
                            "gaa_level_entries"."parent_id"
                        )
                    ) AS "gaa_level_entries"
                FROM
                    GAA_HIERARCHIES_WITH_RANK
                    LEFT OUTER JOIN "gaa_level_entries" AS "gaa_level_entries" ON GAA_HIERARCHIES_WITH_RANK."id" = "gaa_level_entries"."gaa_hierarchy_id"
                    ${joinCondition} ${levelEntriesIdsCondition} ${isSelectedParent} AND gaa_level_entries.is_active = '1'
                GROUP BY
                    GAA_HIERARCHIES_WITH_RANK."id",
                    GAA_HIERARCHIES_WITH_RANK."name",
                    GAA_HIERARCHIES_WITH_RANK."code",
                    GAA_HIERARCHIES_WITH_RANK."rank",
                    GAA_HIERARCHIES_WITH_RANK."isMapped",
                    GAA_HIERARCHIES_WITH_RANK."levelType"
                ORDER BY
	                GAA_HIERARCHIES_WITH_RANK."rank" ASC;
            `;
            const [gaaHierarchiesData] = await gaaHierarchy.db.sequelize.query(query, { replacements: { projectId } });
            allGaaHierarchies = gaaHierarchiesData;
        } else {
            allGaaHierarchies = await gaaHierarchy.findAll({ projectId }, ["id", "name", "code", "rank", "isMapped", "levelType"], true, true, undefined, false);
            allGaaHierarchies = JSON.parse(JSON.stringify(allGaaHierarchies));
        }
        const gaaLevels = allGaaHierarchies.filter(({ levelType }) => levelType === "gaa");
        const networkLevels = allGaaHierarchies.filter(({ levelType }) => levelType === "network");
        return [{ gaaLevels }, { networkLevels }];
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LIST_FAILURE, error);
    }
};

const getGaaForAccess = async (where) => {
    try {
        const gaaHierarchy = new GaaHierarchies();
        const data = await gaaHierarchy.findAll(where, undefined, false, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_GAA_LIST_FAILURE, error);
    }
};

module.exports = {
    gaaHierarchyAlreadyExists,
    getGaaHierarchyByCondition,
    createGaaHierarchy,
    getGaaHierarchyHistory,
    updateGaaHierarchy,
    getAllGaaHierarchies,
    deleteGaaHierarchy,
    getAllGaaHierarchiesByProjectId,
    getAreaProjectLevelByProjectId,
    getGaaForAccess,
    getAllGaaHierarchiesByProjectIdForSearch
};
