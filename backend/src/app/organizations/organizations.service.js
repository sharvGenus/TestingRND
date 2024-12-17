const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Organizations = require("../../database/operation/organizations");
const OrganizationsHistory = require("../../database/operation/organizations-history");

const organizationAlreadyExists = async (where) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_FAILURE, error);
    }
};

const getOrganizationByCondition = async (where) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_FAILURE, error);
    }
};

const createOrganization = async (organizationsDetails) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.create(organizationsDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_FIRM_FAILURE, error);
    }
};

const getAllOrganizationsByDropdown = async (where) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.findAll(where, ["name", "id", "code"], true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LIST_FAILURE, error);
    }
};

const updateOrganization = async (organizationsDetails, where) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.update(organizationsDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FIRM_UPDATE_FAILURE, error);
    }
};

const getAllOrganizations = async (where) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LIST_FAILURE, error);
    }
};
const getAllOrganizationsList = async () => {
    try {
        const organizations = new Organizations();
        const data = await organizations.findAndCountAll({}, ["id", "name", "code", "organizationTypeId"], true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LIST_FAILURE, error);
    }
};

const deleteOrganization = async (where) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FIRM_FAILURE, error);
    }
};

const getOrganizationHistory = async (where) => {
    try {
        const historyModelInstance = new OrganizationsHistory();
        const data = await historyModelInstance.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ORGANIZATION_ID_REQUIRED, error);
    }
};

const getAllOrganizationsForAccess = async (where) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.findAndCountAll(where, undefined, true, true, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LIST_FAILURE, error);
    }
};

const getOrganizationById = async (organizationId) => {
    try {
        const organizations = new Organizations();
        const data = await organizations.findOne({ organizationTypeId: organizationId }, ["name"], false, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FIRM_LIST_FAILURE, error);
    }
};

module.exports = {
    organizationAlreadyExists,
    getOrganizationByCondition,
    createOrganization,
    updateOrganization,
    getAllOrganizations,
    deleteOrganization,
    getAllOrganizationsByDropdown,
    getAllOrganizationsList,
    getOrganizationHistory,
    getAllOrganizationsForAccess,
    getOrganizationById
};
