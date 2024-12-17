const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const Company = require("../../database/operation/companies");

const companyAlreadyExists = async (where) => {
    try {
        const companies = new Company();
        const data = await companies.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_COMPANY_FAILURE);
    }
};

const getCompanyByCondition = async (where) => {
    try {
        const companies = new Company();
        const data = await companies.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_COMPANY_FAILURE);
    }
};

const createCompany = async (companyDetails) => {
    try {
        const companies = new Company();
        const data = await companies.create(companyDetails);

        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_COMPANY_FAILURE);
    }
};

const updateCompany = async (companyDetails, where) => {
    try {
        const companies = new Company();
        const data = await companies.update(companyDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.COMPANY_UPDATE_FAILURE);
    }
};

const getAllCompanies = async () => {
    try {
        const companies = new Company();
        const data = await companies.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_COMPANY_LIST_FAILURE);
    }
};

const deleteCompany = async (where) => {
    try {
        const companies = new Company();
        const data = await companies.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_COMPANY_FAILURE);
    }
};

const getAllCompanyByDropdown = async () => {
    try {
        const companies = new Company();
        const data = await companies.findAll({}, ["name", "id"], false, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_COMPANY_LIST_FAILURE);
    }
};

module.exports = {
    companyAlreadyExists,
    getCompanyByCondition,
    createCompany,
    updateCompany,
    getAllCompanies,
    deleteCompany,
    getAllCompanyByDropdown
};
