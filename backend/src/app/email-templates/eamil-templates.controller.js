const { Op } = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const emailTemplateService = require("./email-templates.service");

/**
 * Method to create email Template
 * @param { object } req.body
 * @returns { object } data
 */
const createEmailTemplate = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_EMAIL_TEMPLATE_DETAILS);
    throwIfNot(req.body.body, statusCodes.BAD_REQUEST, statusMessages.BODY_NOT_FOUND);
    const templateDetails = await emailTemplateService.getEmailTemplateByCondition({
        transactionTypeId: req.body.transactionTypeId,
        projectId: req.body.projectId,
        forApprover: req.body.forApprover ? req.body.forApprover : false,
        isActive: "1"
    });
    throwIf(templateDetails, statusCodes.DUPLICATE, statusMessages.EMAIL_TEMPLATE_ALREADY_EXIST);
    const data = await emailTemplateService.createEmailTemplate(req.body);
    return { data };
};

/**
 * Method to update email Template
 * @param { object } req.body
 * @returns { object } data
 */
const updateEmailTemplate = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TEMPLATE_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_EMAIL_TEMPLATE_DETAILS);
    throwIfNot(req.body.body, statusCodes.BAD_REQUEST, statusMessages.BODY_NOT_FOUND);
    const templateDetails = await emailTemplateService.getEmailTemplateByCondition({ id: req.params.id });
    throwIfNot(templateDetails, statusCodes.DUPLICATE, statusMessages.TEMPLATE_NOT_EXIST);
    const data = await emailTemplateService.updateEmailTemplate(req.body, { id: req.params.id });
    return { data };
};

const updateTicketEmailTemplate = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TEMPLATE_ID_REQUIRED);
    throwIfNot(req.body.body, statusCodes.BAD_REQUEST, statusMessages.BODY_NOT_FOUND);
    const { projectId, subIssueIds } = req.body;
    const emailTemplates = await emailTemplateService.getTicketEmailTemplateByCondition({ projectId, id: { [Op.not]: req.params.id } });
    const subIssueIdsSet = new Set(subIssueIds);
    const existingTemplate = emailTemplates.filter((template) => template.subIssueIds.some((id) => subIssueIdsSet.has(id)));
    throwIf(!!existingTemplate.length, statusCodes.DUPLICATE, statusMessages.ONLY_EMAIL_ALREADY_EXIST);
    const data = await emailTemplateService.updateTicketEmailTemplate(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get email template details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getEmailTemplateDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TEMPLATE_ID_REQUIRED);
    const data = await emailTemplateService.getEmailTemplateByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all email templates
 * @param { object } req.body
 * @returns { object } data
 */
const getAllTemplates = async (req) => {
    const data = await emailTemplateService.getAllTemplates();
    return { data };
};

/**
 * Method to delete email templates by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteEmailTemplate = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TEMPLATE_ID_REQUIRED);
    const data = await emailTemplateService.deleteEmailTemplate({ id: req.params.id });
    return { data };
};

const getAllTicketEmailTemplates = async () => {
    const data = await emailTemplateService.getAllTicketEmailTemplates();
    return { data };
};

const deleteTicketEmailTemplate = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.TEMPLATE_ID_REQUIRED);
    const data = await emailTemplateService.deleteTicketEmailTemplate({ id: req.params.id });
    return { data };
};

const createTicketEmailTemplate = async (req) => {
    throwIfNot(req.body.body, statusCodes.BAD_REQUEST, statusMessages.BODY_NOT_FOUND);
    const { projectId, subIssueIds } = req.body;
    const emailTemplates = await emailTemplateService.getTicketEmailTemplateByCondition({ projectId });
    const existingTemplate = emailTemplates.filter((template) => {
        for (const i of subIssueIds) {
            if (template.subIssueIds.includes(i)) return true;
        }
        return false;
    });
    throwIf(!!existingTemplate.length, statusCodes.DUPLICATE, `${statusMessages.EMAIL_TEMPLATE_ALREADY_EXIST} Template Name: ${existingTemplate[0]?.templateName}`);
    const data = await emailTemplateService.createTicketEmailTemplate(req.body);
    return { data };
};

module.exports = {
    createEmailTemplate,
    updateEmailTemplate,
    getEmailTemplateDetails,
    deleteEmailTemplate,
    getAllTemplates,
    getAllTicketEmailTemplates,
    deleteTicketEmailTemplate,
    createTicketEmailTemplate,
    updateTicketEmailTemplate
};
