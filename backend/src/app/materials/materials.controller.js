const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const materialService = require("./materials.service");
const { getUserGovernedLovArray, goverRowForUserAfterCreate } = require("../access-management/access-management.service");
const { processFileTasks } = require("../files/files.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "material_type.name": "material_type.name",
    "materials.name": "name",
    "materials.code": "code",
    "materials.description": "description",
    "materials.long_description": "longDescription",
    "material_uom.name": "material_uom.name",
    "materials.hsn_code": "hsnCode",
    "materials.is_serial_number": "isSerialNumberText",
    "materials.remarks": "remarks",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    materialType: "$material_type.name$",
    name: "name",
    code: "code",
    integrationId: "integrationId",
    description: "description",
    longDescription: "longDescription",
    uom: "$material_uom.name$",
    hsnCode: "hsnCode",
    isSerialised: "isSerialNumberText",
    remarks: "remarks",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create materials
 * @param { object } req.body
 * @returns { object } data
 */
const createMaterial = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, createdBy: userId, updatedBy: userId };
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_MATERIAL_DETAILS);
    const materialDetails = await materialService.getMaterialByCondition({ code: req.body.code });
    throwIf(materialDetails, statusCodes.DUPLICATE, statusMessages.MATERIAL_ALREADY_EXIST);

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Materials/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    const data = await materialService.createMaterial(req.body);

    await goverRowForUserAfterCreate(req.user.userId, data.id, "Material");
    return { data };
};

/**
 * Method to update material
 * @param { object } req.body
 * @returns { object } data
 */
const updateMaterial = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, updatedBy: userId };
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.MATERIAL_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_MATERIAL_DETAILS);
    const materialDetails = await materialService.getMaterialByCondition({ id: req.params.id });
    throwIfNot(materialDetails, statusCodes.DUPLICATE, statusMessages.MATERIAL_NOT_EXIST);

    const isMaterialCodeExists = await materialService.materialAlreadyExists({
        code : req.body.code,
        id: {
            [Op.ne]: req.params.id
        }
    });
    throwIf(isMaterialCodeExists, statusCodes.DUPLICATE, statusMessages.MATERIAL_ALREADY_EXIST);

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Materials/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    const data = await materialService.updateMaterial(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get material details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getMaterialDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.MATERIAL_ID_REQUIRED);
    const data = await materialService.getMaterialByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all materials
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMaterial = async (req) => {
    const { searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const lovData = await getUserGovernedLovArray(req.user.userId, "Material");
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
        data = await materialService.getAllMaterial(condition);
    } else {
        data = await materialService.getAllMaterial(condition);
    }
    return { data };
};

/**
 * Method to get material list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMaterialsByDropdown = async (req) => {
    const lovData = await getUserGovernedLovArray(req.user.userId, "Material");
    let data;
    if (Array.isArray(lovData)) {
        data = await materialService.getAllMaterialsByDropdown({ id: lovData });
    } else {
        data = await materialService.getAllMaterialsByDropdown();
    }
    return { data };
};

/**
 * Method to delete materials by materials id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteMaterial = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.MATERIAL_ID_REQUIRED);
    const data = await materialService.deleteMaterial({ id: req.params.id });
    return { data };
};

/**
 * Method to get material history
 * @param {object} req
 * @returns { object } data
 */

const getMaterialsHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.MATERIAL_ID_REQUIRED);
    const data = await materialService.getMaterialHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get material details by integration id
 * @param { object } req.body
 * @returns { object } data
 */
const getMaterialDetailsByIntegrationId = async (req) => {
    throwIfNot(req.params.integrationId, statusCodes.BAD_REQUEST, statusMessages.INTEGRATION_ID_REQUIRED);
    const data = await materialService.getMaterialByCondition({ integrationId: req.params.integrationId });
    return { data };
};

module.exports = {
    createMaterial,
    updateMaterial,
    getMaterialDetails,
    deleteMaterial,
    getAllMaterial,
    getAllMaterialsByDropdown,
    getMaterialDetailsByIntegrationId,
    getMaterialsHistory
};
