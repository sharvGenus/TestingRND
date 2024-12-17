const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const orgStoreLocationService = require("./organization-store-locations.service");
const { getMasterMakerLovByCondition } = require("../master-maker-lovs/master-maker-lovs.service");
const { getUserGovernedLovArray, goverRowForUserAfterCreate } = require("../access-management/access-management.service");
const { processFileTasks } = require("../files/files.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "master_maker_lov.name": "master_maker_lov.name",
    "organization_store.name": "organization_store.name",
    "organization_store_locations.name": "name",
    "organization_store_locations.code": "code",
    "organization_store_locations.is_restricted": "isRestricted",
    "organization_store_locations.remarks": "reamarks",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    storeName: "$organization_store.name$",
    code: "code",
    name: "name",
    integrationId: "integrationId",
    isRestricted: "isRestricted",
    isFaulty: "isFaulty",
    isScrap: "isScrap",
    isInstalled: "isInstalled",
    forInstaller: "forInstaller",
    isOld: "isOld",
    remarks: "remarks",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create organization store location
 * @param { object } req.body
 * @returns { object } data
 */
const createOrganizationStoreLocation = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, createdBy: userId, updatedBy: userId };
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ORGANIZATION_STORE_LOCATION_DETAILS);
    const isOrgStoreLocationExists = await orgStoreLocationService.organizationStoreLocationAlreadyExists({
        code: req.body.code, organizationStoreId: req.body.organizationStoreId
    });
    throwIf(isOrgStoreLocationExists, statusCodes.DUPLICATE, statusMessages.ORGANIZATION_STORE_LOCATION_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Organization Store Locations/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    if (req.body.storePhoto) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.storePhoto,
            directory: `Masters/Organization Store Locations/${req.body.name}/Store Photo`
        });
        req.body.storePhoto = JSON.stringify(processedArray);
    }

    const data = await orgStoreLocationService.createOrganizationStoreLocation(req.body);
    if (req.body.organizationType && data?.id) {
        let masterName;
        const { name } = await getMasterMakerLovByCondition({ id: req.body.organizationType });
        if (name === "COMPANY") masterName = "Company Store Location";
        if (name === "CONTRACTOR") masterName = "Contractor Store Location";
        if (masterName) {
            await goverRowForUserAfterCreate(req.user?.userId, data?.id, masterName);
        }
    }
    return { data };
};

/**
 * Method to update organization store location
 * @param { object } req.body
 * @returns { object } data
 */
const updateOrganizationStoreLocation = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, updatedBy: userId };
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_STORE_LOCATION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ORGANIZATION_STORE_LOCATION_DETAILS);
    const isOrgStoreLocationExists = await orgStoreLocationService.organizationStoreLocationAlreadyExists({
        id: req.params.id
    });
    throwIfNot(isOrgStoreLocationExists, statusCodes.DUPLICATE, statusMessages.ORGANIZATION_STORE_LOCATION_NOT_EXIST);
    const isOrgStoreLocCodeExists = await orgStoreLocationService.organizationStoreLocationAlreadyExists({
        organizationStoreId: req.body.organizationStoreId,
        code: req.body.code,
        id: {
            [Op.ne]: req.params.id
        }
    });
    throwIf(isOrgStoreLocCodeExists, statusCodes.DUPLICATE, statusMessages.ORGANIZATION_STORE_LOCATION_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Organization Store Locations/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    if (req.body.storePhoto) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.storePhoto,
            directory: `Masters/Organization Store Locations/${req.body.name}/Store Photo`
        });
        req.body.storePhoto = JSON.stringify(processedArray);
    }

    const data = await orgStoreLocationService.updateOrganizationStoreLocation(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get organization store location details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getOrganizationStoreLocationDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_STORE_LOCATION_ID_REQUIRED);
    const data = await orgStoreLocationService.getOrganizationStoreLocationByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all organization store locations
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizationStoreLocations = async (req) => {
    let data = {};
    if (req.query && req.query.organizationType) {
        const { searchString, accessors, filterObject } = req.query;
        const filterString = filterObject ? JSON.parse(filterObject) : {};
        const condition = {
            [Op.and]: []
        };

        if (searchString && searchString.length > 0) {
            const accessorArray = accessors ? JSON.parse(accessors) : [];
            const keysInArray = getMappingKeysInArray(accessorArray, mapping);

            const castingConditions = [];

            // Loop through the columns you want to search on
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

        let masterName;
        const { name } = await getMasterMakerLovByCondition({ id: req.query.organizationType });
        if (name === "COMPANY") masterName = "Company Store Location";
        if (name === "CONTRACTOR") masterName = "Contractor Store Location";
        const lovData = await getUserGovernedLovArray(req.user.userId, masterName);
        if (Array.isArray(lovData)) {
            condition[Op.and].push({ organizationType: req.query.organizationType, id: lovData });
            data = await orgStoreLocationService.getAllOrganizationStoreLocations(condition);
        } else {
            condition[Op.and].push({ organizationType: req.query.organizationType });
            data = await orgStoreLocationService.getAllOrganizationStoreLocations(condition);
        }
    } else {
        data = await orgStoreLocationService.getAllOrganizationStoreLocations({});
    }
    return { data };
};

/**
 * Method to get all organization store locations without access
 * @param { object } req.body
 * @returns { object } data
 */
const getOrganizationStoreLocations = async (req) => {
    const where = {};
    if (req.query) {
        if (req.query.organizationType) {
            where.organizationType = req.query.organizationType;
        }
        if (req.query.organizationStoreId) {
            where.organizationStoreId = req.query.organizationStoreId;
        }
    }
    const data = await orgStoreLocationService.getAllOrganizationStoreLocations(where);
    return { data };
};

/**
 * Method to delete organization store location by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteOrganizationStoreLocation = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_STORE_LOCATION_ID_REQUIRED);
    const data = await orgStoreLocationService.deleteOrganizationStoreLocation({ id: req.params.id });
    return { data };
};

/**
 * Method to get organization store location history
 * @param {object} req
 * @returns { object } data
 */

const getOrganizationStoreLocationHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_STORE_LOCATION_ID_REQUIRED);
    const data = await orgStoreLocationService.getOrganizationStoreLocationHistory({ recordId: req.params.recordId });
    return { data };
};

module.exports = {
    createOrganizationStoreLocation,
    updateOrganizationStoreLocation,
    getOrganizationStoreLocationDetails,
    getAllOrganizationStoreLocations,
    getOrganizationStoreLocations,
    deleteOrganizationStoreLocation,
    getOrganizationStoreLocationHistory
};
