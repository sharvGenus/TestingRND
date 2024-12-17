const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const firmService = require("./firms.service");

/**
 * Method to create firm
 * @param { object } req.body
 * @returns { object } data
 */
const createFirm = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FIRM_DETAILS);
    const isFirmExists = await firmService.firmAlreadyExists({ code: req.body.code });
    throwIf(isFirmExists, statusCodes.DUPLICATE, statusMessages.FIRM_ALREADY_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await firmService.createFirm(req.body);
    return { data };
};

/**
 * Method to update firm
 * @param { object } req.body
 * @returns { object } data
 */
const updateFirm = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_FIRM_DETAILS);
    const isFirmExists = await firmService.firmAlreadyExists({ id: req.params.id });
    throwIfNot(isFirmExists, statusCodes.DUPLICATE, statusMessages.FIRM_NOT_EXIST);
    if (req.body && req.body.gstNumber) {
        req.body.gstNumber = req.body.gstNumber.toUpperCase();
    }
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await firmService.updateFirm(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get firm details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getFirmDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_ID_REQUIRED);
    const data = await firmService.getFirmByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all firms
 * @param { object } req.body
 * @returns { object } data
 */
const getAllFirms = async (req) => {
    const data = await firmService.getAllFirms();
    return { data };
};

/**
 * Method to get firm list in dropdown based on user access
 * @param { object } req.body
 * @returns { object } data
 */
const getAllFirmsByDropdown = async (req) => {
    const data = await firmService.getAllFirmsByDropdown();
    return { data };
};

/**
 * Method to delete firm by firm id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteFirm = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FIRM_ID_REQUIRED);
    const data = await firmService.deleteFirm({ id: req.params.id });
    return { data };
};

module.exports = {
    createFirm,
    updateFirm,
    getFirmDetails,
    getAllFirms,
    deleteFirm,
    getAllFirmsByDropdown
};
