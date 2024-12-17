const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const companyService = require("./companies.service");

/**
 * Method to create company
 * @param { object } req.body
 * @returns { object } data
 */
const createCompany = async (req) => {

    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_COMPANY_DETAILS);

    const isCompanyExists = await companyService.companyAlreadyExists({ code: req.body.code });
    throwIf(isCompanyExists, statusCodes.DUPLICATE, statusMessages.COMPANY_ALREADY_EXIST);
    const data = await companyService.createCompany(req.body);

    return { data };
};

/**
  * Method to update company
  * @param { object } req.body
  * @returns { object } data
  */
const updateCompany = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.COMPANY_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_COMPANY_DETAILS);
    const isCompanyExists = await companyService.companyAlreadyExists({ id: req.params.id });
    throwIfNot(isCompanyExists, statusCodes.DUPLICATE, statusMessages.COMPANY_NOT_EXIST);
    const data = await companyService.updateCompany(req.body, { id: req.params.id });
    return { data };
};

/**
  * Method to get company details by id
  * @param { object } req.body
  * @returns { object } data
  */
const getCompanyDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.COMPANY_ID_REQUIRED);
    const data = await companyService.getCompanyByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all company
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCompanies = async (req) => {
    const data = await companyService.getAllCompanies();
    return { data };
};

/**
  * Method to delete company by company id
  * @param { object } req.body
  * @returns { object } data
  */
const deleteCompany = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.COMPANY_ID_REQUIRED_ID_REQUIRED);
    const data = await companyService.deleteCompany({ id: req.params.id });
    return { data };
};

const getAllCompanyByDropdown = async (req) => {
  const data = await companyService.getAllCompanyByDropdown();
  return { data };
};

module.exports = {
    createCompany,
    updateCompany,
    getCompanyDetails,
    getAllCompanies,
    deleteCompany,
    getAllCompanyByDropdown
};
