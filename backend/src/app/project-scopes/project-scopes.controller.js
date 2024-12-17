const { Op } = require("sequelize");
const { throwIf, throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const projectScopeService = require("./project-scopes.service");
const ProjectScopes = require("../../database/operation/project-scopes");
const { processFileTasks } = require("../files/files.service");

/**
 * Method to create project scope
 * @param { object } req.body
 * @returns { object } data
 */
const createProjectScope = async (req) => {
    const { projectId, formId, materialTypeId, orderQuantity } = req.body;
    const isProjectScopeExists = await projectScopeService.isProjectScopeExists({ projectId, formId, materialTypeId, isActive: "1" });
    throwIf(isProjectScopeExists, statusCodes.DUPLICATE, statusMessages.PROJECT_SCOPE_ALREADY_EXIST);
    req.body.totalQuantity = orderQuantity;
    const data = await projectScopeService.createProjectScope(req.body);
    return { data };
};

/**
  * Method to get project scope list by projectId
  * @param { object } req.body
  * @returns { object } data
  */
const getProjectScopeList = async (req) => {
    const where = {};
    const { projectId } = req.query;
    if (projectId) where.projectId = projectId;
    const data = await projectScopeService.getProjectScopeList(where);
    return { data };
};

/**
  * Method to update project scope
  * @param { object } req.body
  * @returns { object } data
  */
const updateProjectScope = async (req) => {
    const { id } = req.params;
    const { projectId, formId, materialTypeId, orderQuantity } = req.body;
    const isProjectScopeIdExists = await projectScopeService.isProjectScopeExists({ id, isActive: "1" });
    throwIfNot(isProjectScopeIdExists, statusCodes.NOT_FOUND, statusMessages.PROJECT_SCOPE_NOT_EXIST);
    const isProjectScopeExists = await projectScopeService.isProjectScopeExists({ projectId, formId, materialTypeId, isActive: "1", id: { [Op.ne]: id } });
    throwIf(isProjectScopeExists, statusCodes.DUPLICATE, statusMessages.PROJECT_SCOPE_ALREADY_EXIST);
    const isProjectScopeExtensionExists = await projectScopeService.isProjectScopeExtensionExists({ projectScopeId: id, isActive: "1" });
    if (isProjectScopeExtensionExists) {
        const extensionSum = await projectScopeService.sumProjectScopeExtension("extensionQuantity", { projectScopeId: id });
        req.body.totalQuantity = parseFloat((orderQuantity + extensionSum).toFixed(3));
    } else {
        req.body.totalQuantity = orderQuantity;
    }
    const satQuantity = await projectScopeService.sumProjectScopeSat("satExecutionQuantity", { projectScopeId: id });
    if (req.body.totalQuantity < satQuantity) throwError(statusCodes.DUPLICATE, statusMessages.TOTAL_QUANTITY_GREATER_THAN_SAT_QUANTITY);
    const data = await projectScopeService.updateProjectScope(req.body, { id });
    return { data };
};

/**
  * Method to delete project scope by id
  * @param { object } req.body
  * @returns { object } data
  */
const deleteProjectScope = async (req) => {
    const { id } = req.params;
    const data = await projectScopeService.deleteProjectScope({ id });
    return { data };
};

/**
 * Method to get project scope history
 * @param {object} req 
 * @returns { object } data
 */
const getProjectScopeHistory = async (req) => {
    const { recordId } = req.params;
    const data = await projectScopeService.getProjectScopeHistory({ recordId });
    return { data };
};

const totalQuantityUpdate = async (id) => {
    const { orderQuantity } = await projectScopeService.getProjectScope({ id });
    const extensionSum = await projectScopeService.sumProjectScopeExtension("extensionQuantity", { projectScopeId: id });
    const totalQuantity = parseFloat((orderQuantity + extensionSum).toFixed(3));
    await projectScopeService.updateProjectScope({ totalQuantity }, { id });
};

const validateTotalQuantity = async (id, extensionQuantity, extensionId) => {
    const { orderQuantity } = await projectScopeService.getProjectScope({ id });
    const extensionSum = await projectScopeService.sumProjectScopeExtension("extensionQuantity", { projectScopeId: id, ...(extensionId && { id: { [Op.ne]: extensionId } }) });
    const totalQuantity = orderQuantity + extensionSum + extensionQuantity;
    const satQuantity = await projectScopeService.sumProjectScopeSat("satExecutionQuantity", { projectScopeId: id });
    return totalQuantity >= satQuantity;
};

/**
 * Method to create project scope extension
 * @param { object } req.body
 * @returns { object } data
 */
const createProjectScopeExtension = async (req) => {
    const { projectScopeId } = req.body;

    if (Array.isArray(req.body.attachments)) {
        const { project: { name: projectName }, form: { name: formName } } = await projectScopeService.getProjectScope({ id: projectScopeId });
        const extensionCount = await projectScopeService.projectScopeExtensionCount({ projectScopeId });

        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `ProjectScopes/${projectName}/${formName}/Extensions/${extensionCount + 1}/Attachments`
        });
        req.body.attachments = processedArray;
    }

    const data = await projectScopeService.createProjectScopeExtension(req.body);
    await totalQuantityUpdate(projectScopeId);
    return { data };
};

/**
  * Method to get project scope extension list by projectId
  * @param { object } req.body
  * @returns { object } data
  */
const getProjectScopeExtensionList = async (req) => {
    const where = {};
    const { projectScopeId } = req.query;
    if (projectScopeId) where.projectScopeId = projectScopeId;
    const data = await projectScopeService.getProjectScopeExtensionList(where);
    return { data };
};

/**
  * Method to update project scope extension
  * @param { object } req.body
  * @returns { object } data
  */
const updateProjectScopeExtension = async (req) => {
    const { id } = req.params;
    const { projectScopeId, extensionQuantity } = req.body;
    const isProjectScopeExtensionExists = await projectScopeService.isProjectScopeExtensionExists({ id, isActive: "1" });
    throwIfNot(isProjectScopeExtensionExists, statusCodes.NOT_FOUND, statusMessages.PROJECT_SCOPE_EXTENSION_NOT_EXIST);
    const validateTotal = await validateTotalQuantity(projectScopeId, extensionQuantity, id);
    throwIfNot(validateTotal, statusCodes.BAD_REQUEST, statusMessages.TOTAL_QUANTITY_GREATER_THAN_SAT_QUANTITY);

    if (Array.isArray(req.body.attachments)) {
        const { project_scope: { project: { name: projectName }, form: { name: formName } }, attachments } = await projectScopeService.getProjectScopeExtension({ id });
        let directory = attachments?.[0]?.split("/").slice(0, -1).join("/");
     
        if (!directory) {
            const { db } = new ProjectScopes();
            const [[{ position }]] = await db.sequelize.selectQuery(`SELECT position FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS position FROM project_scope_extensions where project_scope_id = '${projectScopeId}') AS subquery WHERE id = '${id}'`);
            directory = `ProjectScopes/${projectName}/${formName}/Extensions/${position}/Attachments`;
        }

        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory
        });
        req.body.attachments = processedArray;
    }

    const data = await projectScopeService.updateProjectScopeExtension(req.body, { id });
    await totalQuantityUpdate(projectScopeId);
    return { data };
};

/**
  * Method to delete project scope extension by id
  * @param { object } req.body
  * @returns { object } data
  */
const deleteProjectScopeExtension = async (req) => {
    const { id } = req.params;
    const { projectScopeId } = await projectScopeService.getProjectScopeExtension({ id });
    const validateTotal = await validateTotalQuantity(projectScopeId, 0, id);
    throwIfNot(validateTotal, statusCodes.BAD_REQUEST, statusMessages.TOTAL_QUANTITY_GREATER_THAN_SAT_QUANTITY);
    const data = await projectScopeService.deleteProjectScopeExtension({ id });
    await totalQuantityUpdate(projectScopeId);
    return { data };
};

/**
 * Method to get project scope extension history
 * @param {object} req 
 * @returns { object } data
 */
const getProjectScopeExtensionHistory = async (req) => {
    const { recordId } = req.params;
    const data = await projectScopeService.getProjectScopeExtensionHistory({ recordId });
    return { data };
};

const totalSatUpdate = async (id) => {
    const satQuantity = await projectScopeService.sumProjectScopeSat("satExecutionQuantity", { projectScopeId: id });
    await projectScopeService.updateProjectScope({ satQuantity: satQuantity ? parseFloat(satQuantity.toFixed(3)) : satQuantity }, { id });
};

const validateSatQuantity = async (id, satExecutionQuantity, satId) => {
    const { totalQuantity } = await projectScopeService.getProjectScope({ id });
    const satQuantitySum = await projectScopeService.sumProjectScopeSat("satExecutionQuantity", { projectScopeId: id, ...(satId && { id: { [Op.ne]: satId } }) });
    const newSatQuantitySum = satExecutionQuantity + satQuantitySum;
    return totalQuantity >= newSatQuantitySum;
};

/**
 * Method to create project scope sat
 * @param { object } req.body
 * @returns { object } data
 */
const createProjectScopeSat = async (req) => {
    const { projectScopeId, satExecutionQuantity } = req.body;
    const validateSat = await validateSatQuantity(projectScopeId, satExecutionQuantity, undefined);
    throwIfNot(validateSat, statusCodes.BAD_REQUEST, statusMessages.SAT_QUANTITY_LESS_THAN_TOTAL_QUANTITY);
    const data = await projectScopeService.createProjectScopeSat(req.body);
    await totalSatUpdate(projectScopeId);
    return { data };
};

/**
  * Method to get project scope sat list by projectId
  * @param { object } req.body
  * @returns { object } data
  */
const getProjectScopeSatList = async (req) => {
    const where = {};
    const { projectScopeId } = req.query;
    if (projectScopeId) where.projectScopeId = projectScopeId;
    const data = await projectScopeService.getProjectScopeSatList(where);
    return { data };
};

/**
  * Method to update project scope sat
  * @param { object } req.body
  * @returns { object } data
  */
const updateProjectScopeSat = async (req) => {
    const { id } = req.params;
    const { projectScopeId, satExecutionQuantity } = req.body;
    const isProjectScopeSatExists = await projectScopeService.isProjectScopeSatExists({ id, isActive: "1" });
    throwIfNot(isProjectScopeSatExists, statusCodes.NOT_FOUND, statusMessages.PROJECT_SCOPE_SAT_NOT_EXIST);
    const validateSat = await validateSatQuantity(projectScopeId, satExecutionQuantity, id);
    throwIfNot(validateSat, statusCodes.BAD_REQUEST, statusMessages.SAT_QUANTITY_LESS_THAN_TOTAL_QUANTITY);
    const data = await projectScopeService.updateProjectScopeSat(req.body, { id });
    await totalSatUpdate(projectScopeId);
    return { data };
};

/**
  * Method to delete project scope sat by id
  * @param { object } req.body
  * @returns { object } data
  */
const deleteProjectScopeSat = async (req) => {
    const { id } = req.params;
    const data = await projectScopeService.deleteProjectScopeSat({ id });
    await totalSatUpdate(data[1][0].project_scope_id);
    return { data };
};

/**
 * Method to get project scope sat history
 * @param {object} req 
 * @returns { object } data
 */
const getProjectScopeSatHistory = async (req) => {
    const { recordId } = req.params;
    const data = await projectScopeService.getProjectScopeSatHistory({ recordId });
    return { data };
};

module.exports = {
    createProjectScope,
    getProjectScopeList,
    updateProjectScope,
    deleteProjectScope,
    getProjectScopeHistory,
    createProjectScopeExtension,
    getProjectScopeExtensionList,
    updateProjectScopeExtension,
    deleteProjectScopeExtension,
    getProjectScopeExtensionHistory,
    createProjectScopeSat,
    getProjectScopeSatList,
    updateProjectScopeSat,
    deleteProjectScopeSat,
    getProjectScopeSatHistory
};
