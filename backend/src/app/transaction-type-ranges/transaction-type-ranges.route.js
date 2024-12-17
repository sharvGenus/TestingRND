const router = require("express").Router();
const transactionTypeRanges = require("./transaction-type-ranges.controller");
const {
    validateTransactionTypeRangeSave,
    validateTransactionTypeRangeArray,
    validateTransactionTypeRangeUpdate,
    validateTransactionTypeIdsArray
} = require("./transaction-type-ranges.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post(
    "/transaction-type-range/create",
    ensureAuthentications,
    validateTransactionTypeRangeSave(),
    validateTransactionTypeRangeArray(),
    handleResponse.bind(this, transactionTypeRanges.createTransactionTypeRange)
);
router.put(
    "/transaction-type-range/update/:id",
    ensureAuthentications,
    validateTransactionTypeRangeUpdate(),
    validateTransactionTypeIdsArray(),
    handleResponse.bind(this, transactionTypeRanges.updateTransactionTypeRange)
);
router.put(
    "/transaction-type-range/activate/:id",
    ensureAuthentications,
    handleResponse.bind(this, transactionTypeRanges.activateTransactionTypeRange)
);
router.get(
    "/transaction-type-range/list",
    ensureAuthentications,
    handleResponse.bind(this, transactionTypeRanges.getTransactionTypeRangeList)
);
router.delete(
    "/transaction-type-range/delete/:id",
    ensureAuthentications,
    handleResponse.bind(this, transactionTypeRanges.deleteTransactionTypeRange)
);

router.get(
    "/transaction-type-range/history/:recordId",
    ensureAuthentications,
    handleResponse.bind(this, transactionTypeRanges.getTransactionTypeRangeHistory)
);

router.get(
    "/active-inactive-transaction-type-range/list",
    ensureAuthentications,
    handleResponse.bind(this, transactionTypeRanges.getActiveInactiveTransactionTypeRangeList)
);

module.exports = router;
