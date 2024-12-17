const { Op } = require("sequelize");
const { throwIfNot, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const smtpConfigurationService = require("./smtp-configurations.service");
const { Encryption } = require("../../services/encryption.service");

/**
 * Method to create SMTP configuration
 * @param { object } req.body
 * @returns { object } data
 */
const createSmtpConfiguration = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_SMTP_CONFIGURATION_DETAILS);
    const isSmtpConfigurationExists = await smtpConfigurationService.smtpConfigurationAlreadyExists({
        username: req.body.username,
        isActive: "1"
    });
    throwIf(isSmtpConfigurationExists, statusCodes.DUPLICATE, statusMessages.SMTP_CONFIGURATION_ALREADY_EXIST);
    req.body.server = req.body.server.toLowerCase();
    req.body.encryption = req.body.encryption.toUpperCase();
    req.body.username = req.body.username.toLowerCase();
    const key = Encryption.makeUserSalt(32);
    const password = Encryption.encryptText(req.body.password, key);
    req.body.password = password;
    req.body.salt = key;
    await smtpConfigurationService.createSmtpConfiguration(req.body);
    return { message: statusMessages.SMTP_CONFIGURATION_CREATED };
};

/**
 * Method to update SMTP configuration by id
 * @param { object } req.body
 * @returns { object } data
 */
const updateSmtpConfiguration = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SMTP_CONFIGURATION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_SMTP_CONFIGURATION_DETAILS);
    const isSmtpConfigurationExists = await smtpConfigurationService.smtpConfigurationAlreadyExists({
        id: req.params.id
    });
    throwIfNot(isSmtpConfigurationExists, statusCodes.DUPLICATE, statusMessages.SMTP_CONFIGURATION_NOT_EXIST);
    const isUsernameExists = await smtpConfigurationService.smtpConfigurationAlreadyExists({
        username: req.body.username,
        id: {
            [Op.ne]: req.params.id
        }
    });
    throwIf(isUsernameExists, statusCodes.DUPLICATE, statusMessages.SMTP_CONFIGURATION_USERNAME_ALREADY_EXIST);
    req.body.server = req.body.server.toLowerCase();
    req.body.encryption = req.body.encryption.toUpperCase();
    req.body.username = req.body.username.toLowerCase();
    const key = Encryption.makeUserSalt(32);
    const password = Encryption.encryptText(req.body.password, key);
    req.body.password = password;
    req.body.salt = key;
    await smtpConfigurationService.updateSmtpConfiguration(req.body, { id: req.params.id });
    return { message: statusMessages.SMTP_CONFIGURATION_UPDATED };
};

/**
 * Method to get SMTP configuration list
 * @param { object } req.body
 * @returns { object } data
 */
const getSmtpConfigurationList = async (req) => {
    const data = await smtpConfigurationService.getSmtpConfigurationList();
    return { data };
};

/**
 * Method to delete SMTP configuration by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteSmtpConfiguration = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.SMTP_CONFIGURATION_ID_REQUIRED);
    await smtpConfigurationService.deleteSmtpConfiguration({ id: req.params.id });
    return { message: statusMessages.SMTP_CONFIGURATION_DELETED };
};

module.exports = {
    createSmtpConfiguration,
    updateSmtpConfiguration,
    getSmtpConfigurationList,
    deleteSmtpConfiguration
};