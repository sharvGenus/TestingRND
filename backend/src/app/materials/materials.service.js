const { throwError } = require("../../services/throw-error-class");
const Materials = require("../../database/operation/materials");
const MaterialsHistory = require("../../database/operation/materials-history");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");

const getMaterialByCondition = async (where) => {
    try {
        const materials = new Materials();
        const data = await materials.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_FAILURE, error);
    }
};

const createMaterial = async (materialsDetails) => {
    try {
        const materials = new Materials();
        const data = await materials.create(materialsDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_MATERIAL_FAILURE, error);
    }
};

const updateMaterial = async (materialsDetails, where) => {
    try {
        const materials = new Materials();
        const data = await materials.update(materialsDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MATERIAL_UPDATE_FAILURE, error);
    }
};

// NOTE:- sending this raw = true while calling from access management
const getAllMaterial = async (where = {}, raw = false) => {
    try {
        const materials = new Materials();
        const data = await materials.findAndCountAll(where, undefined, true, true, undefined, raw);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_LIST_FAILURE, error);
    }
};

const getAllMaterialsByDropdown = async (where = {}) => {
    try {
        const materials = new Materials();
        const data = await materials.findAll(where, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_PROJECT_SITE_STORE_LIST_FAILURE, error);
    }
};

const deleteMaterial = async (where) => {
    try {
        const materials = new Materials();
        const data = await materials.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_MATERIAL_FAILURE, error);
    }
};

const getMaterialHistory = async (where) => {
    try {
        const historyModelInstance = new MaterialsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MATERIAL_ID_REQUIRED, error);
    }
};

const materialAlreadyExists = async (where) => {
    try {
        const materials = new Materials();
        const data = await materials.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_FAILURE, error);
    }
};

const getAllMaterialsForReport = async (where) => {
    try {
        const materials = new Materials();
        materials.updateRelationForReport();
        const data = await materials.findAndCountAll(where, ["id", "createdAt", "updatedAt"], true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_LIST_FAILURE, error);
    }
};

const getAllMaterialsNoLimit = async (where) => {
    try {
        const materials = new Materials();
        materials.queryObject = {};
        materials.updateRelationForReport();
        const data = await materials.findAndCountAll(where, ["id"], true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_LIST_FAILURE, error);
    }
};

module.exports = {
    getMaterialByCondition,
    createMaterial,
    updateMaterial,
    getAllMaterial,
    deleteMaterial,
    getAllMaterialsByDropdown,
    getMaterialHistory,
    materialAlreadyExists,
    getAllMaterialsForReport,
    getAllMaterialsNoLimit
};
