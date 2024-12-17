const router = require("express").Router();
const receipts = require("./receipts.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.get(
    "/grn-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getGrnReceipt)
);
router.get(
    "/mrf-receipt",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getMrfReceipt)
);
router.get(
    "/min-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getMinReceipt)
);
router.get(
    "/mrr-receipt",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getMrrReceipt)
);
router.get(
    "/mrn-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getMrnReceipt)
);
router.get(
    "/return-mrn-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getReturnMrnReceipt)
);
router.get(
    "/ltl-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getLtlReceipt)
);
router.get(
    "/stsrc-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getStsrcReceipt)
);
router.get(
    "/srcts-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getSrctsReceipt)
);
router.get(
    "/stc-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getStcReceipt)
);
router.get(
    "/cts-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getCtsReceipt)
);
router.get(
    "/str-receipt",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getStrReceipt)
);
router.get(
    "/sto-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getStoReceipt)
);
router.get(
    "/sto-grn-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getStoGrnReceipt)
);
router.get(
    "/ptp-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getPtpReceipt)
);
router.get(
    "/ptp-grn-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getPtpGrnReceipt)
);
router.get(
    "/consumption-request-receipt",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getConsumptionRequestReceipt)
);
router.get(
    "/consumption-receipt/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getConsumptionReceipt)
);
router.get(
    "/devolution-view/:id",
    ensureAuthentications,
    handleResponse.bind(this, receipts.getDevolutionView)
);

module.exports = router;
