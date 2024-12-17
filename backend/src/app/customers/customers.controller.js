const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const customerService = require("./customers.service");

/**
 * Method to create customer
 * @param { object } req.body
 * @returns { object } data
 */
const createCustomer = async (req) => {

    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CUSTOMER_DETAILS);

    const isCustomerExists = await customerService.customerAlreadyExists({ code: req.body.code });
    throwIf(isCustomerExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_ALREADY_EXIST);
    const data = await customerService.createCustomer(req.body);

    return { data };
};

/**
  * Method to update customer
  * @param { object } req.body
  * @returns { object } data
  */
const updateCustomer = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CUSTOMER_DETAILS);
    const isCustomerExists = await customerService.customerAlreadyExists({ id: req.params.id });
    throwIfNot(isCustomerExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_NOT_EXIST);
    const data = await customerService.updateCustomer(req.body, { id: req.params.id });
    return { data };
};

/**
  * Method to get customer details by id
  * @param { object } req.body
  * @returns { object } data
  */
const getCustomerDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_ID_REQUIRED);
    const data = await customerService.getCustomerByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all customer
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCustomers = async (req) => {
    const data = await customerService.getAllCustomers();
    return { data };
};

/**
 * Method to get customer list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCustomersByDropdown = async (req) => {
    const data = await customerService.getAllCustomersByDropdown();
    return { data };
};

/**
  * Method to delete customer by customer id
  * @param { object } req.body
  * @returns { object } data
  */
const deleteCustomer = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_ID_REQUIRED);
    const data = await customerService.deleteCustomer({ id: req.params.id });
    return { data };
};

module.exports = {
    createCustomer,
    updateCustomer,
    getCustomerDetails,
    getAllCustomers,
    deleteCustomer,
    getAllCustomersByDropdown
};
