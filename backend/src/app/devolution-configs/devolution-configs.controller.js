const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const devolutionConfigsService = require("./devolution-configs.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const configMapping = {
    "project.name": "project.name",
    "form.name": "form.name",
    "devolution_configs.prefix": "prefix",
    "devolution_configs.index": "index",
    "old_serial_no.name": "old_serial_no.name",
    "old_make.name": "old_make.name",
    "new_serial_no.name": "new_serial_no.name",
    "new_make.name": "new_make.name",
    "created.name": "created.name",
    "updated.name": "updated.name"
};

/**
 * Method to create devolution config
 * @param { object } req.body
 * @returns { object } data
 */
const createDevolutionConfig = async (req) => {
    const { projectId, formId } = req.body;
    const isDevolutionConfigExists = await devolutionConfigsService.devolutionConfigAlreadyExists({ projectId, formId, isActive: "1" });
    throwIf(isDevolutionConfigExists, statusCodes.DUPLICATE, statusMessages.DEVOLUTION_CONFIG_ALREADY_EXIST);
    await devolutionConfigsService.createDevolutionConfig(req.body);
    return { message: statusMessages.DEVOLUTION_CONFIG_CREATED_SUCCESSFULLY };
};

/**
 * Method to create devolution mapping
 * @param { object } req.body
 * @returns { object } data
 */
const createDevolutionMapping = async (req) => {
    const { devolutionConfigId, formAttributeId, newName } = req.body;
    const isDevolutionMappingExists = await devolutionConfigsService.devolutionMappingAlreadyExists({ devolutionConfigId, formAttributeId, isActive: "1" });
    throwIf(isDevolutionMappingExists, statusCodes.DUPLICATE, statusMessages.DEVOLUTION_MAPPING_ALREADY_EXIST);
    const isNewNameExists = await devolutionConfigsService.devolutionMappingAlreadyExists({ devolutionConfigId, newName: { [Op.iLike]: newName }, isActive: "1" });
    throwIf(isNewNameExists, statusCodes.DUPLICATE, statusMessages.DEVOLUTION_MAPPING_ALREADY_EXIST);
    await devolutionConfigsService.createDevolutionMapping(req.body);
    return { message: statusMessages.DEVOLUTION_MAPPING_CREATED_SUCCESSFULLY };
};

/**
 * Method to get all devolution config
 * @param { object } req.body
 * @returns { object } data
 */
const getDevolutionConfigList = async (req) => {
    const { projectId, formId, searchString, accessors } = req.query;
    const where = { [Op.and]: [] };

    if (searchString && searchString.length > 0) {
        const accessorArray = accessors ? JSON.parse(accessors) : [];
        const keysInArray = getMappingKeysInArray(accessorArray, configMapping);
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

    if (projectId) where[Op.and].push({ projectId });
    if (formId) where[Op.and].push({ formId });
    const data = await devolutionConfigsService.getDevolutionConfigList(where, ["id", "prefix", "index", "isLocked", "createdAt", "updatedAt"]);
    return { data };
};

/**
 * Method to get all devolution mapping
 * @param { object } req.body
 * @returns { object } data
 */
const getDevolutionMappingList = async (req) => {
    const where = {};
    const { devolutionConfigId } = req.query;
    if (devolutionConfigId) where.devolutionConfigId = devolutionConfigId;
    const data = await devolutionConfigsService.getDevolutionMappingList(where, ["id", "newName", "updatedAt"]);
    return { data };
};

/**
 * Method to update devolution config
 * @param { object } req.body
 * @returns { object } data
 */
const updateDevolutionConfig = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.DEVOLUTION_CONFIG_ID_NOT_FOUND);
    const isDevolutionConfigExists = await devolutionConfigsService.devolutionConfigAlreadyExists({ id });
    throwIfNot(isDevolutionConfigExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_CONFIG_NOT_EXIST);
    // const isDevolutionConfigLocked = await devolutionConfigsService.devolutionConfigAlreadyExists({ id, isLocked: true });
    // throwIf(isDevolutionConfigLocked, statusCodes.BAD_REQUEST, statusMessages.UPDATE_NOT_ALLOWED);
    const { projectId, formId } = req.body;
    const isFormIdExists = await devolutionConfigsService.devolutionConfigAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { projectId, formId, isActive: "1" }] });
    throwIf(isFormIdExists, statusCodes.DUPLICATE, statusMessages.DEVOLUTION_CONFIG_ALREADY_EXIST);
    await devolutionConfigsService.updateDevolutionConfig(req.body, { id });
    return { message: statusMessages.DEVOLUTION_CONFIG_UPDATED_SUCCESSFULLY };
};

/**
 * Method to update devolution mapping
 * @param { object } req.body
 * @returns { object } data
 */
const updateDevolutionMapping = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.DEVOLUTION_MAPPING_ID_NOT_FOUND);
    const isDevolutionMappingExists = await devolutionConfigsService.devolutionMappingAlreadyExists({ id });
    throwIfNot(isDevolutionMappingExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_MAPPING_NOT_EXIST);
    const { devolutionConfigId, formAttributeId, newName } = req.body;
    const isFormAttributeIdExists = await devolutionConfigsService.devolutionMappingAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { devolutionConfigId, formAttributeId, isActive: "1" }] });
    throwIf(isFormAttributeIdExists, statusCodes.DUPLICATE, statusMessages.DEVOLUTION_MAPPING_ALREADY_EXIST);
    const isNewNameExists = await devolutionConfigsService.devolutionMappingAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { devolutionConfigId, newName: { [Op.iLike]: newName }, isActive: "1" }] });
    throwIf(isNewNameExists, statusCodes.DUPLICATE, statusMessages.DEVOLUTION_MAPPING_ALREADY_EXIST);
    await devolutionConfigsService.updateDevolutionMapping(req.body, { id });
    return { message: statusMessages.DEVOLUTION_MAPPING_UPDATED_SUCCESSFULLY };
};

/**
 * Method to delete devolution config by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteDevolutionConfig = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.DEVOLUTION_CONFIG_ID_NOT_FOUND);
    const isDevolutionConfigExists = await devolutionConfigsService.devolutionConfigAlreadyExists({ id });
    throwIfNot(isDevolutionConfigExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_CONFIG_NOT_EXIST);
    const isDevolutionConfigLocked = await devolutionConfigsService.devolutionConfigAlreadyExists({ id, isLocked: true });
    throwIf(isDevolutionConfigLocked, statusCodes.BAD_REQUEST, statusMessages.DEVOLUTION_CONFIG_DELETE_NOT_ALLOWED);
    await devolutionConfigsService.deleteDevolutionMapping({ devolutionConfigId: id });
    await devolutionConfigsService.deleteDevolutionConfig({ id });
    return { message: statusMessages.DEVOLUTION_CONFIG_DELETED_SUCCESSFULLY };
};

/**
 * Method to delete devolution mapping by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteDevolutionMapping = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.DEVOLUTION_MAPPING_ID_NOT_FOUND);
    const isDevolutionMappingExists = await devolutionConfigsService.devolutionMappingAlreadyExists({ id });
    throwIfNot(isDevolutionMappingExists, statusCodes.NOT_FOUND, statusMessages.DEVOLUTION_MAPPING_NOT_EXIST);
    const { devolutionConfigId } = await devolutionConfigsService.getDevolutionMapping({ id }, ["devolutionConfigId"]);
    const countDevolutionMapping = await devolutionConfigsService.countDevolutionMapping({ devolutionConfigId, isActive: "1" });
    if (countDevolutionMapping == 1) throwError(statusCodes.BAD_REQUEST, statusMessages.DELETE_NOT_ALLOWED);
    await devolutionConfigsService.deleteDevolutionMapping({ id });
    return { message: statusMessages.DEVOLUTION_MAPPING_DELETED_SUCCESSFULLY };
};

module.exports = {
    createDevolutionConfig,
    createDevolutionMapping,
    getDevolutionConfigList,
    getDevolutionMappingList,
    updateDevolutionConfig,
    updateDevolutionMapping,
    deleteDevolutionConfig,
    deleteDevolutionMapping
};
