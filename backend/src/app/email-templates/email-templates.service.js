const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const EmailTemplates = require("../../database/operation/email-template");
const TicketEmailTemplates = require("../../database/operation/ticket-email-template");

const getEmailTemplateByCondition = async (where) => {
    try {
        const emailTemplates = new EmailTemplates();
        const data = await emailTemplates.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_EMAIL_TEMPLATE_FAILURE, error);
    }
};

const getTicketEmailTemplateByCondition = async (where) => {
    try {
        const ticketEmailTemplates = new TicketEmailTemplates();
        const data = await ticketEmailTemplates.findAll(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_EMAIL_TEMPLATE_FAILURE, error);
    }
};

const getAllTicketEmailTemplates = async () => {
    try {
        const ticketEmailTemplates = new TicketEmailTemplates();
        const data = await ticketEmailTemplates.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_EMAIL_TEMPLATE_FAILURE, error);
    }
};

const createEmailTemplate = async (templateDetails) => {
    try {
        const emailTemplates = new EmailTemplates();
        const data = await emailTemplates.create(templateDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_TEMPLATE_FAILURE, error);
    }
};

const createTicketEmailTemplate = async (templateDetails) => {
    try {
        const ticketEmailTemplates = new TicketEmailTemplates();
        const data = await ticketEmailTemplates.create(templateDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_TEMPLATE_FAILURE, error);
    }
};

const updateEmailTemplate = async (templateDetails, where) => {
    try {
        const emailTemplates = new EmailTemplates();
        const data = await emailTemplates.update(templateDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TEMPLATE_UPDATE_FAILURE, error);
    }
};

const updateTicketEmailTemplate = async (templateDetails, where) => {
    try {
        const ticketEmailTemplates = new TicketEmailTemplates();
        const data = await ticketEmailTemplates.update(templateDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TEMPLATE_UPDATE_FAILURE, error);
    }
};

const getAllTemplates = async () => {
    try {
        const emailTemplates = new EmailTemplates();
        const data = await emailTemplates.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_EMAIL_TEMPLATE_FAILURE, error);
    }
};

const deleteEmailTemplate = async (where) => {
    try {
        const emailTemplates = new EmailTemplates();
        const data = await emailTemplates.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_TEMPLATE_FAILURE, error);
    }
};

const deleteTicketEmailTemplate = async (where) => {
    try {
        const ticketEmailTemplates = new TicketEmailTemplates();
        const data = await ticketEmailTemplates.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_TEMPLATE_FAILURE, error);
    }
};

module.exports = {
    getEmailTemplateByCondition,
    getTicketEmailTemplateByCondition,
    createEmailTemplate,
    createTicketEmailTemplate,
    updateEmailTemplate,
    getAllTemplates,
    deleteEmailTemplate,
    getAllTicketEmailTemplates,
    deleteTicketEmailTemplate,
    updateTicketEmailTemplate
};
