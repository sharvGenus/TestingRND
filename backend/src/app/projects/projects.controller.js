const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const projectService = require("./projects.service");
const { getUserGovernedLovArray, goverRowForUserAfterCreate, getRoleGovernedLovArray } = require("../access-management/access-management.service");
const { processFileTasks } = require("../files/files.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "company.name": "company.name",
    "customer.name": "customer.name",
    "projects.name": "name",
    "projects.scheme_name": "schemeName",
    "projects.code": "code",
    "projects.po_work_order_number": "poWorkOrderNumber",
    "projects.fms_years": "fmsYears",
    "projects.e_way_bill_limit": "eWayBillLimit",
    "projects.remarks": "remarks",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    orgId: "$company.name$",
    customerOrgId: "$customer.name$",
    name: "name",
    schemeName: "schemeName",
    code: "code",
    integrationId: "integrationId",
    poNumber: "poWorkOrderNumber",
    fmsYears: "fmsYears",
    eWayLimit: "eWayBillLimit",
    remarks: "remarks",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create project
 * @param { object } req.body
 * @returns { object } data
 */

const createProject = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, createdBy: userId, updatedBy: userId };
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_PROJECT_DETAILS);
    const isProjectExist = await projectService.projectAlreadyExists({
        [Op.or]: [
            { name: req.body.name },
            { code: req.body.code }
        ]
    });
    throwIf(isProjectExist, statusCodes.DUPLICATE, statusMessages.PROJECT_ALREADY_EXIST);

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Project/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    if (req.body.logoOne) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.logoOne,
            directory: "project-logo",
            staticFilename: "logo-one"
        });
        req.body.logoOne = JSON.stringify(processedArray);
    }
    if (req.body.logoTwo) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.logoTwo,
            directory: "project-logo",
            staticFilename: "logo-two"
        });
        req.body.logoTwo = JSON.stringify(processedArray);
    }

    const data = await projectService.createProject(req.body);
    await goverRowForUserAfterCreate(req.user.userId, data.id, "Project");
    return { data };
};

/**
  * Method to update project
  * @param { object } req.body
  * @returns { object } data
  */
const updateProject = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, updatedBy: userId };
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_PROJECT_DETAILS);
    const isProjectExists = await projectService.projectAlreadyExists({ id: req.params.id });
    throwIfNot(isProjectExists, statusCodes.DUPLICATE, statusMessages.PROJECT_NOT_EXIST);

    const isProjectCodeExists = await projectService.projectAlreadyExists({
        code: req.body.code,
        id: {
            [Op.ne]: req.params.id
        }
    });
    throwIf(isProjectCodeExists, statusCodes.DUPLICATE, statusMessages.PROJECT_ALREADY_EXIST);

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Project/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }
    if (req.body.logoOne) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.logoOne,
            directory: "project-logo",
            staticFilename: "logo-one"
        });
        req.body.logoOne = JSON.stringify(processedArray);
    }
    if (req.body.logoTwo) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.logoTwo,
            directory: "project-logo",
            staticFilename: "logo-two"
        });
        req.body.logoTwo = JSON.stringify(processedArray);
    }

    const data = await projectService.updateProject(req.body, { id: req.params.id });
    return { data };
};

/**
  * Method to get project details by id
  * @param { object } req.body
  * @returns { object } data
  */
const getProjectDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_ID_REQUIRED);
    const data = await projectService.getProjectByCondition({ id: req.params.id });
    return { data };
};

const getProjectsHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.PROJECT_ID_REQUIRED);
    const data = await projectService.getProjectHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get all project
 * @param { object } req.body
 * @returns { object } data
 */
const getAllProjects = async (req) => {
    const { searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const lovData = await getUserGovernedLovArray(req.user.userId, "Project");
    let data;

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
    
    if (Array.isArray(lovData)) {
        condition[Op.and].push({ id: lovData });
        data = await projectService.getAllProjects(condition);
    } else {
        data = await projectService.getAllProjects(condition);
    }
    return { data };
};

/**
 * Method to get project list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllProjectByDropdown = async (req) => {
    const lovData = await getUserGovernedLovArray(req.user.userId, "Project");
    let data;
    if (Array.isArray(lovData)) {
        data = await projectService.getAllProjectByDropdown({ id: lovData });
    } else {
        data = await projectService.getAllProjectByDropdown();
    }
    return { data };
};

/**
 * Method to get project list
 * @param { object } req.body
 * @returns { object } data
 */
const getProjectList = async (req) => {
    const data = await projectService.getAllProjectByDropdown();
    return { data };
};

/**
  * Method to delete project by project id
  * @param { object } req.body
  * @returns { object } data
  */
const deleteProject = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_ID_REQUIRED);
    const data = await projectService.deleteProject({ id: req.params.id });
    return { data };
};

const getProjectsForRoleAndUser = async (req) => {
    const { roleId, userId } = req.query;
    let lovData;
    if (userId) lovData = await getUserGovernedLovArray(userId, "Project");
    else if (roleId) lovData = await getRoleGovernedLovArray(roleId, "Project");
    const data = await projectService.getAllProjectByDropdown({ id: lovData });
    return { data };
};

module.exports = {
    createProject,
    updateProject,
    getProjectDetails,
    getProjectsHistory,
    getAllProjects,
    deleteProject,
    getAllProjectByDropdown,
    getProjectsForRoleAndUser,
    getProjectList
};
