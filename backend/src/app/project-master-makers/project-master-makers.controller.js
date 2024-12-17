const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const projectMasterMakersService = require("./project-master-makers.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "project_master_makers.id": "id",
    "project_master_makers.name": "name",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    name: "name",
    masterId: "id",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create master maker
 * @param { object } req.body
 * @returns { object } data
 */
const createProjectMasterMaker = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_PROJECT_MASTER_MAKER_DETAILS);
    if (req.body && req.body.name) {
        req.body.name = req.body.name.toUpperCase();
    }
    const isProjectMasterMakerExists = await
    projectMasterMakersService.projectMasterMakerAlreadyExists({ name: req.body.name, projectId: req.body.projectId });
    throwIf(isProjectMasterMakerExists, statusCodes.DUPLICATE, statusMessages.MASTER_PROJECT_MAKER_ALREADY_EXIST);
    const data = await projectMasterMakersService.createProjectMasterMaker(req.body);
    return { data };
};

/**
 * Method to update master maker
 * @param { object } req.body
 * @returns { object } data
 */
const updateProjectMasterMaker = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MASTER_MAKER_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_PROJECT_MASTER_MAKER_DETAILS);
    const isProjectMasterMakerExists = await
    projectMasterMakersService.projectMasterMakerAlreadyExists({ id: req.params.id });
    throwIfNot(isProjectMasterMakerExists, statusCodes.DUPLICATE, statusMessages.PROJECT_MASTER_MAKER_NOT_EXIST);
    if (req.body && req.body.name) {
        req.body.name = req.body.name.toUpperCase();
    }
    const isProjectMasterMakerExistsWithProject = await
    projectMasterMakersService.projectMasterMakerAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, projectId: req.body.projectId }] });
    throwIf(isProjectMasterMakerExistsWithProject, statusCodes.DUPLICATE, statusMessages.MASTER_PROJECT_MAKER_ALREADY_EXIST);
    const data = await projectMasterMakersService.updateProjectMasterMaker(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get master maker details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getProjectMasterMakerDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MASTER_MAKER_ID_REQUIRED);
    const data = await projectMasterMakersService.getProjectMasterMakerByCondition({ id: req.params.id });
    return { data };
};

const getProjectMasterMakersHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MASTER_MAKER_ID_REQUIRED);
    const data = await projectMasterMakersService.getProjectMasterMakerHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get all master maker
 * @param { object } req.body
 * @returns { object } data
 */
const getAllProjectMasterMakers = async (req) => {
    const data = await projectMasterMakersService.getAllProjectMasterMakers();
    return { data };
};

/**
 * Method to get all master maker based on project
 * @param { object } req.body
 * @returns { object } data
 */
const getAllProjectMasterMakersByProjectId = async (req) => {
    const { searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const condition = {
        [Op.and]: []
    };

    if (searchString && searchString.length > 0) {
        const accessorArray = accessors ? JSON.parse(accessors) : [];
        const keysInArray = getMappingKeysInArray(accessorArray, mapping);
        const castingConditions = [];
        keysInArray.forEach((column) => {
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

    if (req.params.id) {
        condition[Op.and].push({ projectId: req.params.id });
    }
    const data = await projectMasterMakersService.getAllProjectMasterMakersByProjectId(condition);
    return { data };
};

/**
 * Method to delete master maker by master maker id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteProjectMasterMaker = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MASTER_MAKER_ID_REQUIRED);
    const data = await projectMasterMakersService.deleteProjectMasterMaker({ id: req.params.id });
    return { data };
};

module.exports = {
    createProjectMasterMaker,
    updateProjectMasterMaker,
    getProjectMasterMakerDetails,
    getProjectMasterMakersHistory,
    getAllProjectMasterMakers,
    deleteProjectMasterMaker,
    getAllProjectMasterMakersByProjectId
};
