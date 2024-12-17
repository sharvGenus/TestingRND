const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const BillingBasicDetails = require("../../database/operation/billing-basic-details");
const BillingMaterialDetails = require("../../database/operation/billing-material-details");

const billingDetailsAlreadyExists = async (where) => {
    try {
        const billingBasicDetails = new BillingBasicDetails();
        const data = await billingBasicDetails.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.MISSING_CITY_DETAILS, error);
    }
};

const createBillingDetails = async (payLoad) => {
    try {
        const billingBasicDetails = new BillingBasicDetails();
        const data = await billingBasicDetails.createWithAssociation(payLoad);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CITY_ALREADY_EXIST, error);
    }
};
const updateBillingDetails = async (payload, where) => {
    try {
        const billingBasicDetails = new BillingBasicDetails();
        const data = await billingBasicDetails.update(payload, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CITY_UPDATE_FAILURE, error);
    }
};
const getBillingDetailByCondition = async (where) => {
    try {
        const billingBasicDetails = new BillingBasicDetails();
        const data = await billingBasicDetails.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CITY_FAILURE, error);
    }
};

const getAllBillingDetails = async (where = {}) => {
    try {
        const billingBasicDetails = new BillingBasicDetails();
        const data = await billingBasicDetails.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CITY_LIST_FAILURE, error);
    }
};

const getAllBillingMaterialDetails = async (where = {}) => {
    try {
        const billingBasicDetails = new BillingMaterialDetails();
        const data = await billingBasicDetails.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CITY_LIST_FAILURE, error);
    }
};

const deleteBillingDetail = async (where) => {
    try {
        const billingBasicDetails = new BillingBasicDetails();
        const data = await billingBasicDetails.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_CITY_FAILURE, error);
    }
};
module.exports = {
    billingDetailsAlreadyExists,
    createBillingDetails,
    updateBillingDetails,
    getBillingDetailByCondition,
    getAllBillingDetails,
    deleteBillingDetail,
    getAllBillingMaterialDetails
};
