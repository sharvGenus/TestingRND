/* eslint-disable max-len */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const urbanHierarchyService = require("./urban-hierarchies.service");
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
 * Method to create urbanHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const createUrbanHierarchy = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_URBAN_DETAILS);
    // Check if the name already exists
    const isNameExists = await urbanHierarchyService.urbanHierarchyAlreadyExists({ name: req.body.name, levelType: req.body.levelType, projectId: req.body.projectId });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.URBAN_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await urbanHierarchyService.urbanHierarchyAlreadyExists({ code: req.body.code, levelType: req.body.levelType, projectId: req.body.projectId });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.URBAN_ALREADY_EXIST);
    const data = await urbanHierarchyService.createUrbanHierarchy(req.body);
    return { data };
};

/**
 * Method to update urbanHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const updateUrbanHierarchy = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.URBAN_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_URBAN_DETAILS);
    const isUrbanHierarchyExists = await urbanHierarchyService.urbanHierarchyAlreadyExists({ id: req.params.id });
    throwIfNot(isUrbanHierarchyExists, statusCodes.DUPLICATE, statusMessages.URBAN_NOT_EXIST);
    // Check if the name already exists
    if (req.body.name) {
        const isNameExists = await urbanHierarchyService.urbanHierarchyAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, levelType: req.body.levelType, projectId: req.body.projectId }] });
        throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.URBAN_ALREADY_EXIST);
    }
    // Check if the code already exists
    if (req.body.code) {
        const isCodeExists = await urbanHierarchyService.urbanHierarchyAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, levelType: req.body.levelType, projectId: req.body.projectId }] });
        throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.URBAN_ALREADY_EXIST);
    }
    const data = await urbanHierarchyService.updateUrbanHierarchy(req.body, { id: req.params.id });
    // await urbanHierarchyService.updateUrbanHierarchy({ isMapped: 0 }, { id: { [Op.ne]: req.params.id }, projectId: req.body.projectId });
    return { data };
};

/**
 * Method to get urbanHierarchy details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getUrbanHierarchyDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.URBAN_ID_REQUIRED);
    const data = await urbanHierarchyService.getUrbanHierarchyByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all urbanHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const getAllUrbanHierarchies = async (req) => {
    const { levelType } = req.query;
    const data = await urbanHierarchyService.getAllUrbanHierarchies({ levelType });
    return { data };
};

const getUrbanHierarchiesHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.URBAN_ID_REQUIRED);
    const data = await urbanHierarchyService.getUrbanHierarchyHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to delete urbanHierarchy by urbanHierarchy id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteUrbanHierarchy = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.URBAN_ID_REQUIRED);
    const data = await urbanHierarchyService.deleteUrbanHierarchy({ id: req.params.id });
    return { data };
};

/**
 * Method to get all urbanHierarchy
 * @param { object } req.body
 * @returns { object } data
 */
const getAllUrbanHierarchiesByProjectId = async (req) => {
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
    condition[Op.and].push({ projectId: req.params.id, levelType: "rural", isMapped: "1" });
    const extraDataResponse = await urbanHierarchyService.getAllUrbanHierarchiesByProjectId(condition);
    condition[Op.and].pop({ projectId: req.params.id, levelType: "rural", isMapped: "1" });
    const extraData = extraDataResponse.rows.length > 0 ? JSON.parse(JSON.stringify(extraDataResponse.rows)) : [];
    if (extraData.length > 0) {
        extraData[0].rank = 0; // Update the rank key only if there is data in extraData
    }
    condition[Op.and].push({ projectId: req.params.id, levelType: req.query.levelType });
    let dataResponse = await urbanHierarchyService.getAllUrbanHierarchiesByProjectId(condition);
    dataResponse = JSON.parse(JSON.stringify(dataResponse.rows));
    const responseData = [...extraData, ...dataResponse];
    return { data: { rows: responseData, count: responseData.length } };
};

module.exports = {
    createUrbanHierarchy,
    updateUrbanHierarchy,
    getUrbanHierarchiesHistory,
    getUrbanHierarchyDetails,
    getAllUrbanHierarchies,
    deleteUrbanHierarchy,
    getAllUrbanHierarchiesByProjectId
};
