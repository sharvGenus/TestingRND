const router = require("express").Router();
const emailTemplates = require("./eamil-templates.controller");
const { validateEmailTemplateSaveOrUpdate, validateTicketEmailTemplateSaveOrUpdate } = require("./email-templates.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/email-template/create", ensureAuthentications, validateEmailTemplateSaveOrUpdate(), handleResponse.bind(this, emailTemplates.createEmailTemplate));
router.put("/email-template/update/:id", ensureAuthentications, validateEmailTemplateSaveOrUpdate(), handleResponse.bind(this, emailTemplates.updateEmailTemplate));
router.get("/email-template/details/:id", ensureAuthentications, handleResponse.bind(this, emailTemplates.getEmailTemplateDetails));
router.get("/email-template/list", ensureAuthentications, handleResponse.bind(this, emailTemplates.getAllTemplates));
router.delete("/email-template/delete/:id", ensureAuthentications, handleResponse.bind(this, emailTemplates.deleteEmailTemplate));

router.get("/ticket/email-template/list", ensureAuthentications, handleResponse.bind(this, emailTemplates.getAllTicketEmailTemplates));
router.post("/ticket/email-template/create", ensureAuthentications, validateTicketEmailTemplateSaveOrUpdate(), handleResponse.bind(this, emailTemplates.createTicketEmailTemplate));
router.put("/ticket/email-template/update/:id", ensureAuthentications, validateTicketEmailTemplateSaveOrUpdate(), handleResponse.bind(this, emailTemplates.updateTicketEmailTemplate));
router.delete("/ticket/email-template/delete/:id", ensureAuthentications, handleResponse.bind(this, emailTemplates.deleteTicketEmailTemplate));

module.exports = router;
