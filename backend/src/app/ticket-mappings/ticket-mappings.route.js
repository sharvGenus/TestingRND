const router = require("express").Router();
const ticketMapping = require("./ticket-mappings.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");
const { validateProjectWiseTicketMappingSaveOrUpdate, validateFormWiseTicketMappingSaveOrUpdate } = require("./ticket-mappings.request");

router.post("/form-wise-ticket-mapping/create", ensureAuthentications, validateFormWiseTicketMappingSaveOrUpdate(), handleResponse.bind(this, ticketMapping.createFormWiseTicketMappping));
router.post("/project-wise-ticket-mapping/create", ensureAuthentications, validateProjectWiseTicketMappingSaveOrUpdate(), handleResponse.bind(this, ticketMapping.createProjectWiseTicketMappping));
router.get("/form-wise-ticket-mapping/list", ensureAuthentications, handleResponse.bind(this, ticketMapping.getAllFormWiseTicketMapping));
router.get("/project-wise-ticket-mapping/list", ensureAuthentications, handleResponse.bind(this, ticketMapping.getAllProjectWiseTicketMapping));
router.put("/form-wise-ticket-mapping/update/:id", ensureAuthentications, validateFormWiseTicketMappingSaveOrUpdate(), handleResponse.bind(this, ticketMapping.updateFormWiseTicketMapping));
router.put("/project-wise-ticket-mapping/update/:id", ensureAuthentications, validateProjectWiseTicketMappingSaveOrUpdate(), handleResponse.bind(this, ticketMapping.updateProjectWiseTicketMapping));
router.delete("/form-wise-ticket-mapping/delete/:id", ensureAuthentications, handleResponse.bind(this, ticketMapping.deleteFormWiseTicketMapping));
router.delete("/project-wise-ticket-mapping/delete/:id", ensureAuthentications, handleResponse.bind(this, ticketMapping.deleteProjectWiseTicketMapping));
router.get("/ticket-mapping/get-form-data", ensureAuthentications, handleResponse.bind(this, ticketMapping.getFormData));
router.get("/project-wise-ticket-mapping/history/:recordId", ensureAuthentications, handleResponse.bind(this, ticketMapping.getProjectWiseTicketMappingHistory));
router.get("/form-wise-ticket-mapping/history/:recordId", ensureAuthentications, handleResponse.bind(this, ticketMapping.getFormWiseTicketMappingHistory));
module.exports = router;
