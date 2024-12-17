const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const devolutionsService = require("./devolutions.service");
const devolutionConfigsService = require("../devolution-configs/devolution-configs.service");
const { processFileTasks } = require("../files/files.service");
const { getFormByCondition } = require("../forms/forms.service");
const { getUserGovernedLovArray } = require("../access-management/access-management.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "devolutions.devolution_doc_no": "devolutionDocNo",
    "project.name": "project.name",
    "form.name": "form.name",
    "organization.name": "organization.name",
    "organization_store.name": "organization_store.name",
    "created.name": "created.name",
    "updated.name": "updated.name"
};

const filterMapping = {
    devolutionDocNo: "devolutionDocNo",
    projectId: "$project.name$",
    formId: "$form.name$",
    customerId: "$organization.name$",
    customerStoreId: "$organization_store.name$",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create devolution
 * @param { object } req.body
 * @returns { object } data
 */
const createDevolution = async (req) => {
    const { projectId, formId, devolution_materials: devolutionMaterials } = req.body;
    const isDevolutionConfigExists = await devolutionConfigsService.devolutionConfigAlreadyExists({ projectId, formId, isActive: "1" });
    throwIfNot(isDevolutionConfigExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_CONFIG_NOT_EXIST);
    const devolutionConfig = await devolutionConfigsService.getDevolutionConfig({ projectId, formId, isActive: "1" }, ["id", "projectId", "formId", "prefix", "index"]);
    const { id: devolutionConfigId } = devolutionConfig;
    req.body.devolutionConfigId = devolutionConfigId;
    req.body.quantity = devolutionMaterials?.length;
    req.body.devolutionDocNo = await devolutionsService.generateDevolutionDocNo(devolutionConfig);
    const { devolutionDocNo } = await devolutionsService.createDevolution(req.body);
    const devolutionCount = await devolutionsService.countDevolution({ devolutionConfigId });
    if (devolutionCount == 1) {
        await devolutionConfigsService.updateDevolutionConfig({ isLocked: true }, { id: devolutionConfigId });
    }
    return { message: statusMessages.DEVOLUTION_CREATED_SUCCESSFULLY, devolutionDocNo };
};

/**
 * Method to get all devolution
 * @param { object } req.body
 * @returns { object } data
 */
const getDevolutionList = async (req) => {
    const { userId } = req.user;
    const { projectId, formId, gaaHierarchy, customerId, customerStoreId, approvalStatus, searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const where = { [Op.and]: [] };
    let data;
    
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
        const orConditions = { [Op.or]: castingConditions };
        where[Op.and].push(orConditions);
    }

    if (filterString && Object.keys(filterString).length > 0) {
        for (const key in filterString) {
            if (filterMapping[key]) {
                const mappedKey = filterMapping[key];
                const filterValue = filterString[key];
                const mappedCondition = {
                    [mappedKey]: filterValue
                };
                where[Op.and].push(mappedCondition);
            }
        }
    }
    
    if (gaaHierarchy && Object.keys(gaaHierarchy).length) {
        const { count, devolutionIds } = await devolutionsService.getDevolutionIds(req.query);
        req.query.pageNumber = "1";
        data = await devolutionsService.getDevolutionList({ id: devolutionIds }, ["id", "devolutionDocNo", "attachments", "approvalStatus", "approvalDate", "createdAt", "updatedAt"]);
        data.count = count;
    } else {
        if (projectId) {
            where[Op.and].push({ projectId });
        } else {
            const projectLovData = await getUserGovernedLovArray(userId, "Project");
            if (Array.isArray(projectLovData)) {
                where[Op.and].push({ projectId: projectLovData });
            }
        }
        if (formId) {
            where[Op.and].push({ formId });
        } else {
            const lovData = await getUserGovernedLovArray(userId, "Form Configurator");
            if (Array.isArray(lovData)) {
                where[Op.and].push({ formId: lovData });
            }
        }
        if (customerId) where[Op.and].push({ customerId });
        if (customerStoreId) where[Op.and].push({ customerStoreId });
        if (approvalStatus) where[Op.and].push({ approvalStatus });
        data = await devolutionsService.getDevolutionList(where, ["id", "devolutionDocNo", "attachments", "approvalStatus", "approvalDate", "createdAt", "updatedAt"]);
    }

    return { data };
};

/**
 * Method to get devolution details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getDevolutionDetails = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.DEVOLUTION_ID_NOT_FOUND);
    const isDevolutionExists = await devolutionsService.devolutionAlreadyExists({ id });
    throwIfNot(isDevolutionExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_NOT_EXIST);
    const data = await devolutionsService.getDevolution({ id }, ["id", "devolutionDocNo", "quantity", "attachments", "approvalStatus", "approvalDate", "createdAt", "updatedAt"], true);
    return { data };
};

/**
 * Method to get all devolution material
 * @param { object } req.body
 * @returns { object } data
 */
const getDevolutionMaterialList = async (req) => {
    const where = {};
    const { devolutionId } = req.query;
    if (devolutionId) where.devolutionId = devolutionId;
    const data = await devolutionsService.getDevolutionMaterialList(where, ["oldSerialNo"]);
    return { data };
};

/**
 * Method to update devolution
 * @param { object } req.body
 * @returns { object } data
 */
const updateDevolution = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.DEVOLUTION_ID_NOT_FOUND);
    const isDevolutionExists = await devolutionsService.devolutionAlreadyExists({ id });
    throwIfNot(isDevolutionExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_NOT_EXIST);
    const { attachments } = req.body;
    if (Array.isArray(attachments) && attachments.length) {
        const { devolutionDocNo, project: { name: projectName }, form: { name: formName } } = await devolutionsService.getDevolution({ id }, ["devolutionDocNo"], true);
        const processedArray = await processFileTasks({
            reqFiles: attachments,
            directory: `Devolution/${projectName}/${formName}/${devolutionDocNo.replaceAll("/", "_")}/Attachments`
        });
        req.body.attachments = processedArray;
    }
    await devolutionsService.updateDevolution(req.body, { id });
    return { message: statusMessages.DEVOLUTION_UPDATED_SUCCESSFULLY };
};

/**
 * Method to approve or reject devolution
 * @param { object } req.body
 * @returns { object } data
 */
const devolutionApproveReject = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.DEVOLUTION_ID_NOT_FOUND);
    const isDevolutionExists = await devolutionsService.devolutionAlreadyExists({ id });
    throwIfNot(isDevolutionExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_NOT_EXIST);
    const { userId } = req.user;
    const { approvalStatus, approvedResponseIds } = req.body;
    const approvalDate = new Date();
    let message = statusMessages.DEVOLUTION_APPROVED_SUCCESSFULLY;
    if (approvalStatus == "1" && Array.isArray(approvedResponseIds) && approvedResponseIds?.length) {
        await devolutionsService.deleteDevolutionMaterial({ devolutionId: id, responseId: { [Op.notIn]: approvedResponseIds } });
    } else if (approvalStatus == "0") {
        await devolutionsService.deleteDevolutionMaterial({ devolutionId: id });
        message = statusMessages.DEVOLUTION_REJECTED_SUCCESSFULLY;
    }
    const devolutionMaterialCount = await devolutionsService.countDevolutionMaterial({ devolutionId: id, isActive: "1" });
    await devolutionsService.updateDevolution({ quantity: devolutionMaterialCount, approvalStatus, approverId: userId, approvalDate }, { id });
    return { message };
};

const getDevolutionFormData = async (req) => {
    const { projectId, formId, forMaterialPopup } = req.body;
    const isDevolutionConfigExists = await devolutionConfigsService.devolutionConfigAlreadyExists({ projectId, formId, isActive: "1" });
    throwIfNot(isDevolutionConfigExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_CONFIG_NOT_EXIST);
    const { id: devolutionConfigId, old_serial_no: { id: oldSerialNoColId, name: oldSerialNoColName, columnName: oldSerialNoColumn }, old_make: { columnName: oldMakeColumn }, new_serial_no: { columnName: newSerialNoColumn } } = await devolutionConfigsService.getDevolutionConfig({ projectId, formId, isActive: "1" }, ["id"], true);
    const isDevolutionMappingExists = await devolutionConfigsService.devolutionMappingAlreadyExists({ devolutionConfigId, isActive: "1" });
    throwIfNot(isDevolutionMappingExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_MAPPING_NOT_EXIST);
    const devolutionMapping = await devolutionConfigsService.getAllDevolutionMapping({ devolutionConfigId, ...(forMaterialPopup && { formAttributeId: oldSerialNoColId }), isActive: "1" }, ["newName"]);
    
    req.body.oldSerialNoColumn = oldSerialNoColumn;
    req.body.oldMakeColumn = oldMakeColumn;
    req.body.newSerialNoColumn = newSerialNoColumn;

    const formAttributes = ["id", newSerialNoColumn, oldSerialNoColumn, oldMakeColumn];
    const columnMapping = {};
    let oldSerialNo;
    for (const obj of devolutionMapping) {
        const { form_attribute: { name: attributeName, columnName: attributeColumnName }, newName } = obj;
        formAttributes.push(attributeColumnName);
        columnMapping[attributeName] = newName;
        if (attributeColumnName === oldSerialNoColumn) oldSerialNo = newName;
    }
    req.body.formAttributes = [...new Set(formAttributes)];
    if (!(oldSerialNoColName in columnMapping)) {
        columnMapping[oldSerialNoColName] = oldSerialNoColName;
        oldSerialNo = oldSerialNoColName;
    }
    req.body.columnMapping = columnMapping;

    const { tableName, properties: { brandMasterId } } = await getFormByCondition({ id: formId });
    req.body.tableName = tableName;
    req.body.historyTableName = `${tableName}_history`;
    req.body.brandMasterId = brandMasterId;

    const { count, rows } = await devolutionsService.getFormData(req.body);
    const data = { count, rows, oldSerialNo };
    return { data };
};

module.exports = {
    createDevolution,
    getDevolutionList,
    getDevolutionDetails,
    getDevolutionMaterialList,
    updateDevolution,
    devolutionApproveReject,
    getDevolutionFormData
};
