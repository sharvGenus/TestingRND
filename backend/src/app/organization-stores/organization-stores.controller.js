const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const organizationStoreService = require("./organization-stores.service");
const { processFileTasks } = require("../files/files.service");
const { getMasterMakerLovByCondition } = require("../master-maker-lovs/master-maker-lovs.service");
const { getUserGovernedLovArray, goverRowForUserAfterCreate, getRoleGovernedLovArray } = require("../access-management/access-management.service");
const { getUserByCondition } = require("../users/users.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");
const { checkIsSuperUser } = require("../authentications/authentications.controller");

const mapping = {
    "organization_stores.name": "name",
    "organization.name": "master_maker_lov.name",
    "organization_stores.code": "code",
    "organization_stores.gst_number": "gstNumber",
    "organization_stores.email": "email",
    "organization_stores.mobile_number": "mobileNumber",
    "organization_stores.telephone": "telephone",
    "organization_stores.address": "address",
    "city.state.country.name": "city.state.country.name",
    "city.state.name": "city.state.name",
    "city.name": "city.name",
    "organization_stores.pincode": "pincode",
    "organization_stores.remarks": "remarks",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    name: "name",
    orgId: "$organization.name$",
    code: "code",
    integrationId: "integrationId",
    gstNumber: "gstNumber",
    email: "email",
    mobileNumber: "mobileNumber",
    telephone: "telephone",
    address: "address",
    countryId: "$city.state.country.name$",
    stateId: "$city.state.name$",
    cityId: "$city.name$",
    pincode: "pincode",
    remarks: "remarks",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create organization store
 * @param { object } req.body
 * @returns { object } data
 */
const createOrganizationStore = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, createdBy: userId, updatedBy: userId };
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ORGANIZATION_STORE_DETAILS);
    const isOrganizationStoreExists = await organizationStoreService.organizationStoreAlreadyExists({
        code: req.body.code
    });
    throwIf(isOrganizationStoreExists, statusCodes.DUPLICATE, statusMessages.ORGANIZATION_STORE_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Organization Stores/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    if (req.body.storePhoto) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.storePhoto,
            directory: `Masters/Organization Stores/${req.body.name}/Attachments`
        });
        req.body.storePhoto = JSON.stringify(processedArray);
    }

    const data = await organizationStoreService.createOrganizationStore(req.body);
    if (req.body.organizationType && data?.id) {
        let masterName;
        const { name } = await getMasterMakerLovByCondition({ id: req.body.organizationType });
        if (name === "SUPPLIER") masterName = "Supplier Repair Center";
        if (name === "COMPANY") masterName = "Company Store";
        if (name === "CONTRACTOR") masterName = "Contractor Store";
        if (name === "CUSTOMER") masterName = "Customer Store";
        if (masterName) {
            await goverRowForUserAfterCreate(req.user?.userId, data?.id, masterName);
        }
    }
    return { data };
};

/**
 * Method to update organization store
 * @param { object } req.body
 * @returns { object } data
 */
const updateOrganizationStore = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, updatedBy: userId };
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_STORE_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ORGANIZATION_STORE_DETAILS);
    const isOrganizationStoreExists = await organizationStoreService.organizationStoreAlreadyExists({
        id: req.params.id
    });
    throwIfNot(isOrganizationStoreExists, statusCodes.DUPLICATE, statusMessages.ORGANIZATION_STORE_NOT_EXIST);
    const isOrgStoreCodeExists = await organizationStoreService.organizationStoreAlreadyExists({
        code: req.body.code,
        id: {
            [Op.ne]: req.params.id
        }
    });
    throwIf(isOrgStoreCodeExists, statusCodes.DUPLICATE, statusMessages.ORGANIZATION_STORE_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Organization Stores/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    if (req.body.storePhoto) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.storePhoto,
            directory: `Masters/Organization Stores/${req.body.name}/Attachments`
        });
        req.body.storePhoto = JSON.stringify(processedArray);
    }

    const data = await organizationStoreService.updateOrganizationStore(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get organization store details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getOrganizationStoreDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_STORE_ID_REQUIRED);
    const data = await organizationStoreService.getOrganizationStoreByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all organization stores
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizationStores = async (req) => {
    let data = {};
    if (req.query && req.query.organizationType) {
        const { searchString, accessors, filterObject } = req.query;
        const filterString = filterObject ? JSON.parse(filterObject) : {};
        const condition = {
            [Op.and]: []
        };

        if (searchString && searchString.length > 0) {
        // 
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
        if (name === "SUPPLIER") masterName = "Supplier Repair Center";
        if (name === "COMPANY") masterName = "Company Store";
        if (name === "CONTRACTOR") masterName = "Contractor Store";
        if (name === "CUSTOMER") masterName = "Customer Store";
        const lovData = await getUserGovernedLovArray(req.user.userId, masterName);
        if (Array.isArray(lovData)) {
            condition[Op.and].push({ id: lovData, organizationType: req.query.organizationType });
            data = await organizationStoreService.getAllOrganizationStores(condition);
        } else {
            condition[Op.and].push({ organizationType: req.query.organizationType });
            data = await organizationStoreService.getAllOrganizationStores(condition);
        }
    } else {
        data = await organizationStoreService.getAllOrganizationStores({});
    }
    return { data };
};

/**
 * Method to get all organization stores without access
 * @param { object } req.body
 * @returns { object } data
 */
const getOrganizationStores = async (req) => {
    const where = {};
    if (req.query) {
        if (req.query.organizationType) {
            where.organizationType = req.query.organizationType;
        }
        if (req.query.organizationId) {
            where.organizationId = req.query.organizationId;
        }
    }
    const data = await organizationStoreService.getAllOrganizationStores(where);
    return { data };
};

/**
 * Method to delete organization store by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteOrganizationStore = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_STORE_ID_REQUIRED);
    const data = await organizationStoreService.deleteOrganizationStore({ id: req.params.id });
    return { data };
};

/**
 * Method to get organization store history
 * @param {object} req
 * @returns { object } data
 */

const getOrganizationStoreHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_STORE_ID_REQUIRED);
    const data = await organizationStoreService.getOrganizationStoreHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get organization store list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllStoresForDropdown = async (req) => {
    const { userId } = req.params;
    const userExists = await getUserByCondition({ id: userId });
    // if true then user else it is a role
    const isUser = !!userExists;
    let lovData;
    if (isUser) {
        const companyStoreLovData = await getUserGovernedLovArray(userId, "Company Store");
        const firmStoreLovData = await getUserGovernedLovArray(userId, "Contractor Store");
        lovData = [...companyStoreLovData, ...firmStoreLovData];
    } else {
        const companyStoreLovData = await getRoleGovernedLovArray(userId, "Company Store");
        const firmStoreLovData = await getRoleGovernedLovArray(userId, "Contractor Store");
        lovData = [...companyStoreLovData, ...firmStoreLovData];
    }

    const data = await organizationStoreService.getAllOrganizationStores({
        id: lovData
    });
    return { data };
};

/**
 * Method to get view store list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllViewStoresForDropdown = async (req) => {
    const { userId, organizationType } = req.query;
    const userExists = await getUserByCondition({ id: userId });
    // if true then user else it is a role
    const isUser = !!userExists;
    const isSuperUser = isUser ? await checkIsSuperUser(userId) : false;
    let lovData;
    if (!isSuperUser) {
        if (isUser) {
            const storeLovData = await getUserGovernedLovArray(userId, "View Stores");
            lovData = [...storeLovData];
        } else {
            const storeLovData = await getRoleGovernedLovArray(userId, "View Stores");
            lovData = [...storeLovData];
        }
    }
    const data = await organizationStoreService.getAllOrganizationStores({
        ...(!isSuperUser && { id: lovData }),
        organizationType
    });
    return { data };
};

module.exports = {
    createOrganizationStore,
    updateOrganizationStore,
    getOrganizationStoreDetails,
    getAllOrganizationStores,
    getOrganizationStores,
    deleteOrganizationStore,
    getOrganizationStoreHistory,
    getAllStoresForDropdown,
    getAllViewStoresForDropdown
};
