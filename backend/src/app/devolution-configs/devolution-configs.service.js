const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const DevolutionConfigs = require("../../database/operation/devolution-configs");
const DevolutionMappings = require("../../database/operation/devolution-mappings");

const devolutionConfigAlreadyExists = async (where) => {
    try {
        const devolutionConfigs = new DevolutionConfigs();
        const data = await devolutionConfigs.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_CONFIG_FAILURE, error);
    }
};

const devolutionMappingAlreadyExists = async (where) => {
    try {
        const devolutionMappings = new DevolutionMappings();
        const data = await devolutionMappings.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_MAPPING_FAILURE, error);
    }
};

const createDevolutionConfig = async (body) => {
    try {
        const devolutionConfigs = new DevolutionConfigs();
        const data = await devolutionConfigs.createWithAssociation(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_DEVOLUTION_CONFIG_FAILURE, error);
    }
};

const createDevolutionMapping = async (body) => {
    try {
        const devolutionMappings = new DevolutionMappings();
        const data = await devolutionMappings.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_DEVOLUTION_MAPPING_FAILURE, error);
    }
};

const countDevolutionMapping = async (where) => {
    try {
        const devolutionMappings = new DevolutionMappings();
        const count = await devolutionMappings.count(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_MAPPING_FAILURE, error);
    }
};

const getDevolutionConfigList = async (where, attributes = undefined, isRelated = true) => {
    try {
        const devolutionConfigs = new DevolutionConfigs();
        const data = await devolutionConfigs.findAndCountAll(where, attributes, isRelated, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_CONFIG_FAILURE, error);
    }
};

const getDevolutionConfig = async (where, attributes = undefined, isRelated = false) => {
    try {
        const devolutionConfigs = new DevolutionConfigs();
        const data = await devolutionConfigs.findOne(where, attributes, isRelated);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_MAPPING_FAILURE, error);
    }
};

const getDevolutionMappingList = async (where, attributes = undefined, isRelated = true) => {
    try {
        const devolutionMappings = new DevolutionMappings();
        const data = await devolutionMappings.findAndCountAll(where, attributes, isRelated, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_MAPPING_FAILURE, error);
    }
};

const getAllDevolutionMapping = async (where, attributes = undefined, isRelated = true) => {
    try {
        const devolutionMappings = new DevolutionMappings();
        const data = await devolutionMappings.findAll(where, attributes, isRelated, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_MAPPING_FAILURE, error);
    }
};

const getDevolutionMapping = async (where, attributes = undefined, isRelated = false) => {
    try {
        const devolutionMappings = new DevolutionMappings();
        const data = await devolutionMappings.findOne(where, attributes, isRelated);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DEVOLUTION_MAPPING_FAILURE, error);
    }
};

const updateDevolutionConfig = async (body, where) => {
    try {
        const devolutionConfigs = new DevolutionConfigs();
        const data = await devolutionConfigs.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.UPDATE_DEVOLUTION_CONFIG_FAILURE, error);
    }
};

const updateDevolutionMapping = async (body, where) => {
    try {
        const devolutionMappings = new DevolutionMappings();
        const data = await devolutionMappings.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.UPDATE_DEVOLUTION_MAPPING_FAILURE, error);
    }
};

const deleteDevolutionConfig = async (where) => {
    try {
        const devolutionConfigs = new DevolutionConfigs();
        const data = await devolutionConfigs.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_DEVOLUTION_CONFIG_FAILURE, error);
    }
};

const deleteDevolutionMapping = async (where) => {
    try {
        const devolutionMappings = new DevolutionMappings();
        const data = await devolutionMappings.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_DEVOLUTION_CONFIG_FAILURE, error);
    }
};

module.exports = {
    devolutionConfigAlreadyExists,
    devolutionMappingAlreadyExists,
    createDevolutionConfig,
    createDevolutionMapping,
    countDevolutionMapping,
    getDevolutionConfigList,
    getDevolutionConfig,
    getDevolutionMappingList,
    getAllDevolutionMapping,
    getDevolutionMapping,
    updateDevolutionConfig,
    updateDevolutionMapping,
    deleteDevolutionConfig,
    deleteDevolutionMapping
};
