const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const MaterialQuantities = require("../../database/operation/material-quantities");

const materialQuantitiesAlreadyExists = async (where) => {
    try {
        const materialQuantities = new MaterialQuantities();
        const data = await materialQuantities.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_QUANTITIES_FAILURE, error);
    }
};

const getMaterialQuantitiesByProjectAndMaterial = async (where) => {
    try {
        const materialQuantities = new MaterialQuantities();
        const data = await materialQuantities.findAll(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_QUANTITIES_FAILURE, error);
    }
};

const createMaterialQuantities = async (materialQuantitiesDetails) => {
    try {
        const materialQuantities = new MaterialQuantities();
        const data = await materialQuantities.bulkCreate(materialQuantitiesDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_MATERIAL_QUANTITIES_FAILURE, error);
    }
};

const updateMaterialQuantities = async (materialQuantitiesDetails, where) => {
    try {
        const materialQuantities = new MaterialQuantities();
        const data = await materialQuantities.update(materialQuantitiesDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MATERIAL_QUANTITIES_UPDATE_FAILURE, error);
    }
};

const getAllMaterialQuantities = async () => {
    try {
        const materialQuantities = new MaterialQuantities();
        const data = await materialQuantities.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_MATERIAL_QUANTITIES_LIST_FAILURE, error);
    }
};

const deleteMaterialQuantities = async (where) => {
    try {
        const materialQuantities = new MaterialQuantities();
        const data = await materialQuantities.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_MATERIAL_QUANTITIES_FAILURE, error);
    }
};

module.exports = {
    materialQuantitiesAlreadyExists,
    createMaterialQuantities,
    updateMaterialQuantities,
    getAllMaterialQuantities,
    deleteMaterialQuantities,
    getMaterialQuantitiesByProjectAndMaterial
};
