const router = require("express").Router();
const requestApprovals = require("./request-approvals.controller");
const {
    validateRequestArray,
    validateApproveReject,
    validateApprovedMaterialArray
} = require("./request-approvals.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post(
    "/request/create",
    ensureAuthentications,
    validateRequestArray(),
    handleResponse.bind(this, requestApprovals.createRequest)
);
router.get(
    "/request/details/:id",
    ensureAuthentications,
    handleResponse.bind(this, requestApprovals.getRequestDetails)
);
router.get(
    "/request/list",
    ensureAuthentications,
    handleResponse.bind(this, requestApprovals.getAllRequests)
);
router.post(
    "/cancel-request/create",
    ensureAuthentications,
    validateRequestArray(),
    handleResponse.bind(this, requestApprovals.createCancelRequest)
);
router.get(
    "/request-approver/list",
    ensureAuthentications,
    handleResponse.bind(this, requestApprovals.getAllRequestApprovers)
);
router.post(
    "/approve-reject-request/create",
    ensureAuthentications,
    validateApproveReject(),
    validateApprovedMaterialArray(),
    handleResponse.bind(this, requestApprovals.approveRejectRequest)
);

module.exports = router;
