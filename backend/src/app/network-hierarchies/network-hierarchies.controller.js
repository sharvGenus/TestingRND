/* eslint-disable max-len */
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const networkHierarchyService = require("./network-hierarchies.service");
const gaaHierarchyService = require("../gaa-hierarchies/gaa-hierarchies.service");

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
 * Method to create networkHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const createNetworkHierarchy = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_NETWORK_HIERARCHY_DETAILS);
    // Check if the name already exists
    const isNameExists = await networkHierarchyService.networkHierarchyAlreadyExists({ name: req.body.name, levelType: req.body.levelType, projectId: req.body.projectId });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.NETWORK_HIERARCHY_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await networkHierarchyService.networkHierarchyAlreadyExists({ code: req.body.code, levelType: req.body.levelType, projectId: req.body.projectId });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.NETWORK_HIERARCHY_ALREADY_EXIST);
    const data = await networkHierarchyService.createNetworkHierarchy(req.body);
    return { data };
};

/**
 * Method to update networkHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const updateNetworkHierarchy = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.NETWORK_HIERARCHY_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_NETWORK_HIERARCHY_DETAILS);
    const isNetworkHierarchyExists = await networkHierarchyService.networkHierarchyAlreadyExists({ id: req.params.id });
    throwIfNot(isNetworkHierarchyExists, statusCodes.DUPLICATE, statusMessages.NETWORK_HIERARCHY_NOT_EXIST);
    // Check if the name already exists
    const isNameExists = await networkHierarchyService.networkHierarchyAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, levelType: req.body.levelType, projectId: req.body.projectId }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.NETWORK_HIERARCHY_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await networkHierarchyService.networkHierarchyAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, levelType: req.body.levelType, projectId: req.body.projectId }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.NETWORK_HIERARCHY_ALREADY_EXIST);
    const data = await networkHierarchyService.updateNetworkHierarchy(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get networkHierarchy details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getNetworkHierarchyDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.NETWORK_HIERARCHY_ID_REQUIRED);
    const data = await networkHierarchyService.getNetworkHierarchyByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all networkHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const getAllNetworkHierarchy = async (req) => {
    const { levelType } = req.query;
    const data = await networkHierarchyService.getAllNetworkHierarchy({ levelType });
    return { data };
};

const getNetworkHierarchiesHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.NETWORK_HIERARCHY_ID_REQUIRED);
    const data = await networkHierarchyService.getNetworkHierarchyHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to delete networkHierarchy by networkHierarchy id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteNetworkHierarchy = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.NETWORK_HIERARCHY_ID_REQUIRED);
    const data = await networkHierarchyService.deleteNetworkHierarchy({ id: req.params.id });
    return { data };
};

/**
 * Method to get gaa names and Id list based on projectId
 * @param { object } req.body
 * @returns { object } data
 */

const getAllNetworkHierarchyByProjectId = async (req) => {
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
    condition[Op.and].push({ projectId: req.params.id, levelType: "gaa", isMapped: "1" });
    const extraDataResponse = await gaaHierarchyService.getAllGaaHierarchiesByProjectId(condition);
    condition[Op.and].pop({ projectId: req.params.id, levelType: "gaa", isMapped: "1" });
    const extraData = extraDataResponse.rows.length > 0 ? JSON.parse(JSON.stringify(extraDataResponse.rows)) : [];
    if (extraData.length > 0) {
        extraData[0].rank = 0; // Update the rank key only if there is data in extraData
    }
    condition[Op.and].push({ projectId: req.params.id, levelType: req.query.levelType });
    let dataResponse = await networkHierarchyService.getAllNetworkHierarchyByProjectId(condition);
    dataResponse = JSON.parse(JSON.stringify(dataResponse.rows));
    const responseData = [...extraData, ...dataResponse];
    return { data: { rows: responseData, count: responseData.length } };
};

module.exports = {
    createNetworkHierarchy,
    updateNetworkHierarchy,
    getNetworkHierarchyDetails,
    getNetworkHierarchiesHistory,
    getAllNetworkHierarchy,
    deleteNetworkHierarchy,
    getAllNetworkHierarchyByProjectId
};
