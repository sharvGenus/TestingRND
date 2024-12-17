const router = require("express").Router();
const supervisorAssignments = require("./supervisor-assignments.controller");
const { validateSupervisorAssignmentsSaveOrUpdate } = require("./supervisor-assignments.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/supervisor-assignments/create", ensureAuthentications, handleResponse.bind(this, supervisorAssignments.createSupervisorAssignments));
router.put("/supervisor-assignments/update/:id", ensureAuthentications, handleResponse.bind(this, supervisorAssignments.updateSupervisorAssignments));
router.get("/supervisor-assignments/details/:id", ensureAuthentications, handleResponse.bind(this, supervisorAssignments.getSupervisorAssignmentsDetails));
router.get("/supervisor-assignments/list", ensureAuthentications, handleResponse.bind(this, supervisorAssignments.getAllSupervisorAssignments));
router.get("/supervisor-assignments/history/:recordId", ensureAuthentications, handleResponse.bind(this, supervisorAssignments.getSupervisorAssignmentsHistory));
router.delete("/supervisor-assignments/delete/:id", ensureAuthentications, handleResponse.bind(this, supervisorAssignments.deleteSupervisorAssignments));
router.get("/supervisor-assignments/dropdown", ensureAuthentications, handleResponse.bind(this, supervisorAssignments.getAllSupervisorAssignmentsByDropdown));

module.exports = router;
