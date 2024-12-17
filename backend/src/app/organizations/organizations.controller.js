/* eslint-disable max-len */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const organizationService = require("./organizations.service");
const { getMasterMakerLovByCondition } = require("../master-maker-lovs/master-maker-lovs.service");
const { getUserGovernedLovArray, goverRowForUserAfterCreate } = require("../access-management/access-management.service");
const { processFileTasks } = require("../files/files.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "organizations.name": "name",
    "organizations.code": "code",
    "organizations.gst_number": "gstNumber",
    "organizations.email": "email",
    "organizations.mobile_number": "mobileNumber",
    "organizations.telephone": "telephone",
    "organizations.registered_office_address": "registeredOfficeAddress",
    "register_office_cities.state.country.name": "register_office_cities.state.country.name",
    "register_office_cities.state.name": "register_office_cities.state.name",
    "register_office_cities.name": "register_office_cities.name",
    "cities.state.country.name": "cities.state.country.name",
    "cities.state.name": "cities.state.name",
    "cities.name": "cities.name",
    "organizations.registered_office_pincode": "registeredOfficePinCode",
    "organization_title.name": "organization_title.name",
    "organizations.remarks": "remarks",
    "updated.name": "updated.name",
    "created.name": "created.name",
    "parent.name": "parent.name"
};

const filterMapping = {
    name: "name",
    code: "code",
    integrationId: "integrationId",
    gstNumber: "gstNumber",
    email: "email",
    mobileNumber: "mobileNumber",
    telephone: "telephone",
    registeredOfficeAddress: "registeredOfficeAddress",
    registeredOfficePinCode: "registeredOfficePinCode",
    registeredCountry: "$register_office_cities.state.country.name$",
    registeredState: "$register_office_cities.state.name$",
    registeredCity: "$register_office_cities.state.name$",
    registeredPincode: "pinCode",
    address: "address",
    countryId: "$cities.state.country.name$",
    stateId: "$cities.state.name$",
    cityId: "$cities.name$",
    titleName: "$organization_title.name$",
    authorisedDistributor: "authorisedDistributor",
    firmType: "firmType",
    owner: "owner",
    categoryOfIndustry: "categoryOfIndustry",
    gstStatus: "$gst_status.name$",
    panReference: "panReference",
    remarks: "remarks",
    pincode: "pinCode",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

const stroreFilterMapping = {
    contractorName: "$parent.name$",
    name: "name",
    code: "code",
    integrationId: "integrationId",
    email: "email",
    mobileNumber: "mobileNumber",
    telephone: "telephone",
    gstNumber: "gstNumber",
    address: "address",
    countryId: "$cities.state.country.name$",
    stateId: "$cities.state.name$",
    cityId: "$cities.name$",
    pincode: "pinCode",
    remarks: "remarks",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create organization
 * @param { object } req.body
 * @returns { object } data
 */
const createOrganization = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, createdBy: userId, updatedBy: userId };
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FIRM_DETAILS);
    const isOrganizationExists = await organizationService.organizationAlreadyExists({ code: req.body.code });
    throwIf(isOrganizationExists, statusCodes.DUPLICATE, statusMessages.FIRM_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Organizations/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    if (req.body.logo) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.logo,
            directory: `Masters/Organizations/${req.body.name}/Attachments`
        });
        req.body.logo = JSON.stringify(processedArray);
    }

    const data = await organizationService.createOrganization(req.body);
    let masterName;
    if (req.body.organizationTypeId && data?.id) {
        const { name } = await getMasterMakerLovByCondition({ id: req.body.organizationTypeId });
        if (name === "SUPPLIER") masterName = "Supplier";
        if (name === "COMPANY") masterName = "Company";
        if (name === "CONTRACTOR") masterName = "Contractor";
        if (name === "CUSTOMER") masterName = "Customer";
        if (masterName) {
            await goverRowForUserAfterCreate(req.user?.userId, data?.id, masterName);
        }
    }

    return { data };
};

/**
 * Method to update organization
 * @param { object } req.body
 * @returns { object } data
 */
const updateOrganization = async (req) => {
    const { user: { userId } } = req;
    req.body = { ...req.body, updatedBy: userId };
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FIRM_DETAILS);
    const isOrganizationExists = await organizationService.organizationAlreadyExists({ id: req.params.id });
    throwIfNot(isOrganizationExists, statusCodes.DUPLICATE, statusMessages.FIRM_NOT_EXIST);

    const isOrgCodeExists = await organizationService.organizationAlreadyExists({
        code: req.body.code,
        id: {
            [Op.ne]: req.params.id
        }
    });
    throwIf(isOrgCodeExists, statusCodes.DUPLICATE, statusMessages.FIRM_ALREADY_EXIST);
    
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Organizations/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    if (req.body.logo) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.logo,
            directory: `Masters/Organizations/${req.body.name}/Attachments`
        });
        req.body.logo = JSON.stringify(processedArray);
    }
    const data = await organizationService.updateOrganization(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get organization details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getOrganizationDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_ID_REQUIRED);
    const data = await organizationService.getOrganizationByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all organizations based on organization type
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizations = async (req) => {
    const { organizationTypeId } = req.params;
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
    const { name } = await getMasterMakerLovByCondition({ id: organizationTypeId });
    if (name === "SUPPLIER") masterName = "Supplier";
    if (name === "COMPANY") masterName = "Company";
    if (name === "CONTRACTOR") masterName = "Contractor";
    if (name === "CUSTOMER") masterName = "Customer";
    const lovData = await getUserGovernedLovArray(req.user.userId, masterName);
    let data;
    if (Array.isArray(lovData)) {
        condition[Op.and].push({ organizationTypeId, parentId: null, id: lovData });
        data = await organizationService.getAllOrganizations(condition);
    } else {
        condition[Op.and].push({ organizationTypeId, parentId: null });
        data = await organizationService.getAllOrganizations(condition);
    }
    return { data };
};

/**
 * Method to get all organization locations based on organization type
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizationLocations = async (req) => {
    const { organizationTypeId } = req.params;
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
            if (stroreFilterMapping[key]) {
                const mappedKey = stroreFilterMapping[key];
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
    const { name } = await getMasterMakerLovByCondition({ id: organizationTypeId });
    if (name === "SUPPLIER") masterName = "Supplier";
    if (name === "COMPANY") masterName = "Company";
    if (name === "CONTRACTOR") masterName = "Contractor";
    if (name === "CUSTOMER") masterName = "Customer";
    const lovData = await getUserGovernedLovArray(req.user.userId, masterName);
    let data;
    if (Array.isArray(lovData)) {
        condition[Op.and].push({ organizationTypeId, parentId: { [Op.ne]: null }, id: lovData });
        data = await organizationService.getAllOrganizations(condition);
    } else {
        condition[Op.and].push({ organizationTypeId, parentId: { [Op.ne]: null } });
        data = await organizationService.getAllOrganizations(condition);
    }
    return { data };
};

/**
 * Method to get all organizations
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizationsList = async () => {
    const data = await organizationService.getAllOrganizationsList();
    return { data };
};

/**
 * Method to get organization list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizationsByDropdown = async (req) => {
    const { organizationTypeId } = req.params;
    const { hasAccess } = req.query;
    const showAllOrg = hasAccess === 'true'
    let masterName;
    if (req.query.multiId) {
        const splitIds = organizationTypeId.split(",");
        const data = await organizationService.getAllOrganizations({ organizationTypeId: splitIds, parentId: null });
        return { data };
    }
    const where = { organizationTypeId, parentId: null };
    if(!showAllOrg) {
        const { name } = await getMasterMakerLovByCondition({ id: organizationTypeId });
        if (name === "SUPPLIER") masterName = "Supplier";
        if (name === "COMPANY") masterName = "Company";
        if (name === "CONTRACTOR") masterName = "Contractor";
        if (name === "CUSTOMER") masterName = "Customer";
        const lovData = await getUserGovernedLovArray(req.user.userId, masterName);
        if (Array.isArray(lovData)) {
            where.id = lovData
        }    
    }
    const data = await organizationService.getAllOrganizationsByDropdown(where);
    return { data };
};

/**
 * Method to get organization list in dropdown without access
 * @param { object } req.body
 * @returns { object } data
 */
const getOrganizationsByDropdown = async (req) => {
    const where = {};
    if (req.query) {
        if (req.query.organizationTypeId) {
            where.organizationTypeId = req.query.organizationTypeId;
        }
        if (req.query.parentId) {
            where.parentId = req.query.parentId;
        } else {
            where.parentId = null;
        }
    }
    const data = await organizationService.getAllOrganizations(where);
    return { data };
};

/**
 * Method to get organization locations list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizationLocationsByDropdown = async (req) => {
    const { organizationTypeId } = req.params;
    let masterName;
    const { name } = await getMasterMakerLovByCondition({ id: organizationTypeId });
    if (name === "SUPPLIER") masterName = "Supplier";
    if (name === "COMPANY") masterName = "Company";
    if (name === "CONTRACTOR") masterName = "Contractor";
    if (name === "CUSTOMER") masterName = "Customer";
    const lovData = await getUserGovernedLovArray(req.user.userId, masterName);
    let data;
    if (Array.isArray(lovData)) {
        data = await organizationService.getAllOrganizationsByDropdown({ organizationTypeId, parentId: { [Op.ne]: null }, id: lovData });
    } else {
        data = await organizationService.getAllOrganizationsByDropdown({ organizationTypeId, parentId: { [Op.ne]: null } });
    }
    return { data };
};

/**
 * Method to delete organization by organization id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteOrganization = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_ID_REQUIRED);
    const data = await organizationService.deleteOrganization({ id: req.params.id });
    return { data };
};

/**
 * Method to get organization details by integration id
 * @param { object } req.body
 * @returns { object } data
 */
const getOrganizationDetailsByIntegrationId = async (req) => {
    throwIfNot(req.params.integrationId, statusCodes.BAD_REQUEST, statusMessages.INTEGRATION_ID_REQUIRED);
    const data = await organizationService.getOrganizationByCondition({ integrationId: req.params.integrationId });
    return { data };
};

/**
 * Method to get organization history
 * @param {object} req
 * @returns { object } data
 */

const getOrganizationHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.ORGANIZATION_ID_REQUIRED);
    const data = await organizationService.getOrganizationHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get all organization locations based on parentId
 * @param { object } req.body
 * @returns { object } data
 */
const getAllOrganizationLocationsByParentId = async (req) => {
    const { organizationTypeId, parentId } = req.params;
    const { hasAccess } = req.query;
    const showAllOrg = hasAccess === 'true'
    let masterName;
    const where ={ organizationTypeId, parentId }
    if(!showAllOrg) {
        const { name } = await getMasterMakerLovByCondition({ id: organizationTypeId });
        if (name === "SUPPLIER") masterName = "Supplier";
        if (name === "COMPANY") masterName = "Company";
        if (name === "CONTRACTOR") masterName = "Contractor";
        if (name === "CUSTOMER") masterName = "Customer";
        const lovData = await getUserGovernedLovArray(req.user.userId, masterName);
        if (Array.isArray(lovData)) {
            where.id = lovData
        }    
    }
    const data = await organizationService.getAllOrganizations(where);
    return { data };
};

module.exports = {
    createOrganization,
    updateOrganization,
    getOrganizationDetails,
    getAllOrganizations,
    getAllOrganizationLocations,
    deleteOrganization,
    getAllOrganizationsByDropdown,
    getOrganizationsByDropdown,
    getAllOrganizationLocationsByDropdown,
    getAllOrganizationsList,
    getOrganizationDetailsByIntegrationId,
    getOrganizationHistory,
    getAllOrganizationLocationsByParentId
};
