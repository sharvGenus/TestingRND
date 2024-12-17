const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const SmtpConfigurations = require("../../database/operation/smtp-configurations");
const emailTemplateService = require("../email-templates/email-templates.service");
const { sendMail } = require("../../config/email-config");
const { Encryption } = require("../../services/encryption.service");

const smtpConfigurationAlreadyExists = async (where) => {
    try {
        const smtpConfigurations = new SmtpConfigurations();
        const data = await smtpConfigurations.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SMTP_CONFIGURATION_FAILURE, error);
    }
};

const createSmtpConfiguration = async (body) => {
    try {
        const smtpConfigurations = new SmtpConfigurations();
        const data = await smtpConfigurations.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_SMTP_CONFIGURATION_FAILURE, error);
    }
};

const updateSmtpConfiguration = async (body, where) => {
    try {
        const smtpConfigurations = new SmtpConfigurations();
        const data = await smtpConfigurations.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.UPDATE_SMTP_CONFIGURATION_FAILURE, error);
    }
};

const getSmtpConfigurationList = async () => {
    try {
        const smtpConfigurations = new SmtpConfigurations();
        const data = await smtpConfigurations.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SMTP_CONFIGURATION_LIST_FAILURE, error);
    }
};

const deleteSmtpConfiguration = async (where) => {
    try {
        const smtpConfigurations = new SmtpConfigurations();
        const data = await smtpConfigurations.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_SMTP_CONFIGURATION_FAILURE, error);
    }
};

const smtpConfigurationByConditionWithPassword = async (where) => {
    try {
        const smtpConfigurations = new SmtpConfigurations();
        const data = await smtpConfigurations.findOne(where, undefined, true, undefined, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_SMTP_CONFIGURATION_FAILURE, error);
    }
};

const sendEmail = async (transactionTypeId, projectId, data, forApprover = false, attachments = [], approverEmail = undefined) => {
    if (transactionTypeId && projectId) {
        const templateDetails = await emailTemplateService.getEmailTemplateByCondition({
            transactionTypeId: transactionTypeId,
            projectId: projectId,
            forApprover: forApprover,
            isActive: "1"
        });
        if (
            templateDetails
                && templateDetails.displayName
                && templateDetails.from
                && templateDetails.to
                && templateDetails.subject
                && templateDetails.body
        ) {
            const smtpDetails = await smtpConfigurationByConditionWithPassword({ username: templateDetails.from, isActive: "1" });
            if (
                smtpDetails
                    && smtpDetails.server
                    && smtpDetails.port
                    && smtpDetails.encryption
                    && smtpDetails.username
                    && smtpDetails.password
                    && smtpDetails.salt
            ) {
                const regexPattern = /@\[[^\]]+]/g;
                const regexReplace = /^@\[|\]$/g;
                const matchesArr = templateDetails.body.match(regexPattern);
                if (matchesArr && matchesArr.length > 0) {
                    if (data !== null && data !== undefined && (typeof data === "object" && Object.keys(data).length > 0)) {
                        for (const match of matchesArr) {
                            const replacedMatch = match.replace(regexReplace, "");
                            templateDetails.body = templateDetails.body.replace(
                                match,
                                data[replacedMatch]
                                    ? data[replacedMatch]
                                    : match
                            );
                        }
                    }
                }
                const password = Encryption.decryptText(smtpDetails.password, smtpDetails.salt);
                const smtpConfiguration = {
                    server: smtpDetails.server,
                    port: smtpDetails.port,
                    encryption: smtpDetails.encryption,
                    username: smtpDetails.username,
                    password: password
                };
                const emailTemplate = {
                    fromName: templateDetails.displayName,
                    ...(forApprover ? { toEmail: approverEmail } : { toEmail: templateDetails.to }),
                    ...(templateDetails.cc && { ccEmail: templateDetails.cc }),
                    ...(templateDetails.bcc && { bccEmail: templateDetails.bcc }),
                    subject: templateDetails.subject,
                    emailBody: templateDetails.body,
                    ...(templateDetails.isAttchmentAvailable && attachments && attachments.length > 0 && { attachments: attachments })
                };
                sendMail(smtpConfiguration, emailTemplate);
            }
        }
    }
};

const processDate = (_date) => {
    const dateObj = new Date(_date);
    if (!_date || Number.isNaN(dateObj)) {
        throw new Error("Invalid Date");
    }
  
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  
    return { day, month, year, hours, minutes };
};
const formatTimeStamp = (_date) => {
    try {
        const { day, month, year, hours, minutes } = processDate(_date);
        return `${day}-${month}-${year}, ${hours}:${minutes}`;
    } catch (error) {
        return "Invalid Date";
    }
};

const TICKET_DETAIL_FINDER = {
    "ticket number": (data) => `${data?.project_wise_ticket_mapping?.prefix || ""}${data?.ticketNumber}`,
    "ticket status": (data) => `${data?.ticketStatus?.toUpperCase() || "Ticket Status not found"}`,
    "issue name": (data) => data?.issue?.name || "No Issue Name found",
    "sub-issue name": (data) => data?.sub_issue?.name || "No Sub-Issue Name found",
    remarks: (data) => data?.remarks || "No remarks",
    "created on": (data) => `${formatTimeStamp(data?.createdAt || "")}`,
    "created by": (data) => `${data?.created?.name || ""}-${data?.created?.code || ""}`,
    "updated on": (data) => `${formatTimeStamp(data?.updatedAt || "")}`,
    "updated by": (data) => `${data?.updated?.name || ""}-${data?.updated?.code || ""}`,
    "supervisor name": (data) => {
        const { name, code } = data?.supervisor_obj || {};
        return name && code ? `${name}-${code}` : "Not Assigned";
    },
    "ticket priority": (data) => data?.priority || "Not set",
    description: (data) => data?.description || "No Description given",
    "installer name": (data) => {
        const { name, code } = data?.assignee || {};
        return name && code ? `${name}-${code}` : "Not Assigned";
    }
};

const ticketEmailSender = async (ticketDetails, emailTemplate) => {
    const smtpDetails = await smtpConfigurationByConditionWithPassword({ username: emailTemplate.from, isActive: "1" });
    if (!smtpDetails) return;
    const regexPattern = /@\[[^\]]+]/g;
    const regexReplace = /^@\[|\]$/g;
    const matchesArr = emailTemplate.body.match(regexPattern);
    matchesArr?.forEach((match) => {
        const replacedMatch = match.replace(regexReplace, "");
        emailTemplate.body = emailTemplate.body.replace(match, TICKET_DETAIL_FINDER[replacedMatch.toLowerCase()]?.(ticketDetails) || match);
    });
    emailTemplate.body = `
        <!DOCTYPE html><html><head><title>Genus Power</title></head><body><div style='width: 100%; text-align: justify; font-size: 20px; margin-top:20px; margin-bottom: 20px'>
        ${emailTemplate.body?.replace(/(?:\r\n|\r|\n)/g, "<br/>")}
        </div><div style='width: 100%; text-align: center;'><div style='min-width: 300px; margin: auto; text-align: justify; font-size: 16px;' id='emailBody'>
        </div></div></body></html>`;
    const password = Encryption.decryptText(smtpDetails.password, smtpDetails.salt);
    const smtpConfiguration = {
        server: smtpDetails.server,
        port: smtpDetails.port,
        encryption: smtpDetails.encryption,
        username: smtpDetails.username,
        password
    };
    const email = {
        fromName: emailTemplate.displayName,
        toEmail: emailTemplate.to,
        ccEmail: emailTemplate.cc,
        subject: emailTemplate.subject,
        emailBody: emailTemplate.body
    };
    sendMail(smtpConfiguration, email);
};

module.exports = {
    smtpConfigurationAlreadyExists,
    smtpConfigurationByConditionWithPassword,
    createSmtpConfiguration,
    updateSmtpConfiguration,
    getSmtpConfigurationList,
    deleteSmtpConfiguration,
    sendEmail,
    ticketEmailSender
};
