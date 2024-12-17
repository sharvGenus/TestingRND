const router = require("express").Router();
const approvers = require("./approvers-master.controller");
const { validateApproverSaveOrUpdate, validateApproversArray, validateApproverUpdate } = require("./approvers-master.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/approver/create", ensureAuthentications, validateApproverSaveOrUpdate(), validateApproversArray(), handleResponse.bind(this, approvers.createApprover));
router.put("/approver/update/:id", ensureAuthentications, validateApproverUpdate(), handleResponse.bind(this, approvers.updateApprover));
router.get("/approver/list", ensureAuthentications, handleResponse.bind(this, approvers.getAllApprovers));
router.delete("/approver/delete/:id", ensureAuthentications, handleResponse.bind(this, approvers.deleteApprover));
router.get("/approver/list/:projectId/:transactionTypeId/:storeId", ensureAuthentications, handleResponse.bind(this, approvers.getAllApproversByCondition));
router.put("/approver/update", ensureAuthentications, validateApproverSaveOrUpdate(), validateApproversArray(), handleResponse.bind(this, approvers.updateApprovers));
module.exports = router;