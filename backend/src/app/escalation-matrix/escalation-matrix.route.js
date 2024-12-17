const router = require("express").Router();
const escalationMatrix = require("./escalation-matrix.controller");
const { handleResponse } = require("../../utilities/common-utils");
const { validateEscalationCreateOrUpdate } = require("./escalation-matrix.request");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/escalation-matrix/create", ensureAuthentications, validateEscalationCreateOrUpdate(), handleResponse.bind(this, escalationMatrix.createEscalationMatrix));
router.put("/escalation-matrix/update/:id", ensureAuthentications, validateEscalationCreateOrUpdate(), handleResponse.bind(this, escalationMatrix.updateEscalationMatrix));
router.get("/escalation-matrix/details/:id", ensureAuthentications, handleResponse.bind(this, escalationMatrix.getEscalationMatrixDetails));
router.get("/escalation-matrix/list", ensureAuthentications, handleResponse.bind(this, escalationMatrix.getAllEscalationMatrix));
router.delete("/escalation-matrix/delete/:id", ensureAuthentications, handleResponse.bind(this, escalationMatrix.deleteEscalationMatrix));

module.exports = router;
