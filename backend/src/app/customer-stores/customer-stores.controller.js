/* eslint-disable max-len */
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const customerStoresService = require("./customer-stores.service");

/**
 * Method to create projectSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const createCustomerStores = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CUSTOMER_STORE_DETAILS);
    const customerStoresDetails = await customerStoresService.checkCustomerStoresDataExist({ code: req.body.code });
    throwIf(customerStoresDetails, statusCodes.DUPLICATE, statusMessages.CUSTOMER_STORE_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await customerStoresService.createCustomerStores(req.body);
    return { data };
};

/**
 * Method to update projectSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const updateCustomerStores = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_STORE_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CUSTOMER_STORE_DETAILS);
    const projectSiteStoresDetails = await customerStoresService.checkCustomerStoresDataExist({ id: req.params.id });
    throwIfNot(projectSiteStoresDetails, statusCodes.DUPLICATE, statusMessages.CUSTOMER_STORE_NOT_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await customerStoresService.updateCustomerStores(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get projectSiteStores details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getCustomerStoresDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_STORE_ID_REQUIRED);
    const data = await customerStoresService.getCustomerStoresByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all projectSiteStores
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCustomerStores = async (req) => {
    const data = await customerStoresService.getAllCustomerStores();
    return { data };
};

/**
 * Method to delete projectSiteStores by projectSiteStores id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteCustomerStores = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_STORE_ID_REQUIRED);
    const data = await customerStoresService.deleteCustomerStores({ id: req.params.id });
    return { data };
};

module.exports = {
    createCustomerStores,
    updateCustomerStores,
    getCustomerStoresDetails,
    getAllCustomerStores,
    deleteCustomerStores
};
