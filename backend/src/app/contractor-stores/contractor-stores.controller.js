/* eslint-disable max-len */
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const contractorStoresService = require("./contractor-stores.service");

/**
 * Method to create ContractorStores
 * @param { object } req.body
 * @returns { object } data
 */
const createContractorStores = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CONTRACTOR_STORE_DETAILS);
    const ContractorStoresDetails = await contractorStoresService.checkContractorStoresDataExist({ code: req.body.code });
    throwIf(ContractorStoresDetails, statusCodes.DUPLICATE, statusMessages.CONTRACTOR_STORE_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await contractorStoresService.createContractorStores(req.body);
    return { data };
};

/**
 * Method to update ContractorStores
 * @param { object } req.body
 * @returns { object } data
 */
const updateContractorStores = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CONTRACTOR_STORE_DETAILS);
    const ContractorStoresDetails = await contractorStoresService.checkContractorStoresDataExist({ id: req.params.id });
    throwIfNot(ContractorStoresDetails, statusCodes.DUPLICATE, statusMessages.CONTRACTOR_STORE_NOT_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await contractorStoresService.updateContractorStores(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get ContractorStores details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getContractorStoresDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CONTRACTOR_STORE_ID_REQUIRED);
    const data = await contractorStoresService.getContractorStoresByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all ContractorStores
 * @param { object } req.body
 * @returns { object } data
 */
const getAllContractorStores = async (req) => {
    const data = await contractorStoresService.getAllContractorStores();
    return { data };
};

/**
 * Method to delete ContractorStores by ContractorStores id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteContractorStores = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CONTRACTOR_STORE_ID_REQUIRED);
    const data = await contractorStoresService.deleteContractorStores({ id: req.params.id });
    return { data };
};

module.exports = {
    createContractorStores,
    updateContractorStores,
    getContractorStoresDetails,
    getAllContractorStores,
    deleteContractorStores
};
