const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const materialQuantitiesService = require("./material-quantities.service");

/**
 * Method to create material quantity
 * @param { object } req.body
 * @returns { object } data
 */
const createMaterialQuantities = async (req) => {
    const { add, update, deleteIds } = req.body;
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_MATERIAL_QUANTITIES_DETAILS);
    let newData, data;
    if (add && Array.isArray(add) && add.length > 0) {
        newData = await materialQuantitiesService.createMaterialQuantities(add);
    }
    if (update && Array.isArray(update) && update.length > 0) {
        newData = await Promise.all(update?.map(async (x) => {
            data = await materialQuantitiesService.updateMaterialQuantities(x, { id: x?.id });
            return data;
        }));
    }
    
    if (deleteIds && Array.isArray(deleteIds) && deleteIds.length > 0) {
        newData = await materialQuantitiesService.deleteMaterialQuantities({ id: deleteIds });
    }
    return { newData };
};

/**
 * Method to get material quantity details by project and material
 * @param { object } req.body
 * @returns { object } data
 */
const getMaterialQuantitiesByProjectAndMaterial = async (req) => {
    const { projectId, materialId } = req.query;
    const data = await materialQuantitiesService.getMaterialQuantitiesByProjectAndMaterial({ projectId, materialId });
    return { data };
};

/**
 * Method to get all material quantity
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMaterialQuantities = async (req) => {
    const data = await materialQuantitiesService.getAllMaterialQuantities();
    return { data };
};

module.exports = {
    createMaterialQuantities,
    getAllMaterialQuantities,
    getMaterialQuantitiesByProjectAndMaterial
};
