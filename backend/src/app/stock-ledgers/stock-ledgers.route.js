const router = require("express").Router();
const stockLedgers = require("./stock-ledgers.controller");
const {
    validateStockLedgerDetailsSave,
    validateStockLedgerArray,
    validateMinTransactionDetailsSave,
    validateCtiTransactionDetailsSave,
    validateItiTransactionDetailsSave,
    validatePtpTransactionDetailsSave,
    validateStcTransactionDetailsSave,
    validateStoTransactionDetailsSave,
    validateSltslTransactionDetailsSave,
    validateMrnTransactionDetailsSave,
    validateReturnMrnTransactionDetailsSave,
    validateEWayBillUpdate,
    validateConsumptionTransactionDetailsSave
} = require("./stock-ledgers.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post(
    "/stock-ledger/create",
    ensureAuthentications,
    validateStockLedgerDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createStockLedger)
);
router.get(
    "/stock-ledger-details/:id",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getStockLedgerDetails)
);
router.get(
    "/stock-ledger-detail/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getAllStockLedgerDetails)
);
router.get(
    "/stock-ledger/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getAllStockLedgers)
);
router.get(
    "/all-stock/details",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getAllStocks)
);
router.get(
    "/stock-ledger-with-serial-number/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getAllStockLedgersWithSerialNumber)
);
router.get(
    "/transaction-count-by-request",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getTransactionCountByRequestNumber)
);
router.post(
    "/min-transaction/create",
    ensureAuthentications,
    validateMinTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createMinTransaction)
);
router.post(
    "/cti-transaction/create",
    ensureAuthentications,
    validateCtiTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createCtiTransaction)
);
router.post(
    "/iti-transaction/create",
    ensureAuthentications,
    validateItiTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createItiTransaction)
);
router.get(
    "/transaction/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getAllTransactionData)
);
router.get(
    "/stock-ledger-material/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getStockLedgerMaterialList)
);
router.get(
    "/txn-by-material/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getTxnsByMaterial)
);
router.get(
    "/transaction-material/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getAllTxnMaterial)
);
router.get(
    "/store-location-transaction/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getAllStoreLocationTransactionData)
);
router.get(
    "/stock-ledger-location/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getStockLedgerLocationList)
);
router.get(
    "/txn-by-location-material/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getTxnsByLocationAndMaterial)
);
router.get(
    "/installer-transaction/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getInstallerStockInStoreLocationWithTransaction)
);
router.get(
    "/stock-ledger-installer/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getStockLedgerInstallerList)
);
router.get(
    "/store-quantity/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getQuantityInStore)
);
router.post(
    "/sto-transaction/create",
    ensureAuthentications,
    validateStoTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createStoTransaction)
);
router.get(
    "/sto-request/details",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getStoRequestDetails)
);
router.get(
    "/active-serial-number/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getActiveSerialNumbersInStore)
);
router.get(
    "/serial-number/list",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getSerialNumbers)
);
router.post(
    "/serial-number-exists",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.serialNumberAlreadyExists)
);
router.post(
    "/sto-grn-transaction/create",
    ensureAuthentications,
    validateCtiTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createStoGrnTransaction)
);
router.post(
    "/stc-transaction/create",
    ensureAuthentications,
    validateStcTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createStcTransaction)
);
router.post(
    "/ptp-transaction/create",
    ensureAuthentications,
    validatePtpTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createPtpTransaction)
);
router.post(
    "/ptp-grn-transaction/create",
    ensureAuthentications,
    validatePtpTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createPtpGrnTransaction)
);
router.post(
    "/sltsl-transaction/create",
    ensureAuthentications,
    validateSltslTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createSltslTransaction)
);
router.post(
    "/mrn-transaction/create",
    ensureAuthentications,
    validateMrnTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createMrnTransaction)
);
router.post(
    "/returnmrn-transaction/create",
    ensureAuthentications,
    validateReturnMrnTransactionDetailsSave(),
    validateStockLedgerArray(),
    handleResponse.bind(this, stockLedgers.createReturnMrnTransaction)
);
router.put(
    "/e-way-bill/update/:id",
    ensureAuthentications,
    validateEWayBillUpdate(),
    handleResponse.bind(this, stockLedgers.updateEWayBill)
);
router.post(
    "/installation-check",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.checkForInstallation)
);
router.post(
    "/installed-serial-number",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getInstalledSerialNumber)
);
router.post(
    "/consumption-transaction/create",
    ensureAuthentications,
    validateConsumptionTransactionDetailsSave(),
    handleResponse.bind(this, stockLedgers.consumptionTransaction)
);
router.get(
    "/store-locations-stock",
    ensureAuthentications,
    handleResponse.bind(this, stockLedgers.getAllLocationsStockInStore)
);

module.exports = router;
