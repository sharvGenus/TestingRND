const router = require("express").Router();
const ticket = require("./tickets.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");
const { validateTicketSaveOrUpdate, validateTicketMobileUpdate } = require("./tickets.request");

router.post("/ticket/create", ensureAuthentications, validateTicketSaveOrUpdate(), handleResponse.bind(this, ticket.createTicket));
router.get("/ticket/list", ensureAuthentications, handleResponse.bind(this, ticket.getAllTickets));
router.get("/ticket/list/:responseId", ensureAuthentications, handleResponse.bind(this, ticket.getOpenTickets));
router.get("/ticket/count", ensureAuthentications, handleResponse.bind(this, ticket.getAllTicketsCount));
router.get("/ticket/occupied-users", ensureAuthentications, handleResponse.bind(this, ticket.getOccupiedUsers));
router.get("/ticket/get-form-data", ensureAuthentications, handleResponse.bind(this, ticket.getFormData));
router.get("/ticket/get-gaa-data", ensureAuthentications, handleResponse.bind(this, ticket.getGAAData));
router.get("/ticket/details/:id", ensureAuthentications, handleResponse.bind(this, ticket.getTicketDetails));
router.put("/ticket/update/:id", ensureAuthentications, validateTicketSaveOrUpdate(), handleResponse.bind(this, ticket.updateTicket));
router.put("/ticket/update-mobile/:id", ensureAuthentications, validateTicketMobileUpdate(), handleResponse.bind(this, ticket.mobileUpdateTicket));
router.delete("/ticket/delete/:id", ensureAuthentications, handleResponse.bind(this, ticket.deleteTicket));
router.get("/ticket/history/:recordId", ensureAuthentications, handleResponse.bind(this, ticket.getTicketHistory));

router.get("/ticket/supervisor", ensureAuthentications, handleResponse.bind(this, ticket.getSupervisorTickets));
router.get("/ticket/installer-details", ensureAuthentications, handleResponse.bind(this, ticket.getInstallerDetails));
router.put("/ticket/supervisor/update", ensureAuthentications, handleResponse.bind(this, ticket.supervisorTicketUpdate));

router.get("/ticket-dashboard", ensureAuthentications, handleResponse.bind(this, ticket.getTicketDashboard));
router.get("/ticket/source/dropdown", ensureAuthentications, handleResponse.bind(this, ticket.getSourceDropdown));

router.get("/ticket-report/ticket-status", handleResponse.bind(this, ticket.getTicketStatusReport));
router.get("/ticket-report/assign-by", handleResponse.bind(this, ticket.getTicketReport));

module.exports = router;
