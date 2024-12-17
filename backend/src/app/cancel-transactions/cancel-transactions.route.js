const router = require("express").Router();
const cancelTransactions = require("./cancel-transactions.controller");
const { validateStockLedgerArray } = require("../stock-ledgers/stock-ledgers.request");
const { validateCancelGrnTransaction, validateCancelMinTransaction, validateCancelLtlTransaction, validateCancelStcTransaction, validateCancelStoTransaction, validateCancelStoGrnTransaction, validateCancelMrnTransaction, validateCancelReturnMrnTransaction, validateStockLedgerArr } = require("./cancel-transactions.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/cancel-grn-transaction/create", ensureAuthentications, validateCancelGrnTransaction(), validateStockLedgerArray(), handleResponse.bind(this, cancelTransactions.createCancelGrnTransaction));
router.post("/cancel-min-transaction/create", ensureAuthentications, validateCancelMinTransaction(), validateStockLedgerArr("min_stock_ledgers"), validateStockLedgerArr("grn_stock_ledgers"), handleResponse.bind(this, cancelTransactions.createCancelMinTransaction));
router.post("/cancel-ltl-transaction/create", ensureAuthentications, validateCancelLtlTransaction(), validateStockLedgerArr("stock_ledgers"), handleResponse.bind(this, cancelTransactions.createCancelLtlTransaction));
router.post("/cancel-stc-transaction/create", ensureAuthentications, validateCancelStcTransaction(), validateStockLedgerArr("debit_stock_ledgers"), validateStockLedgerArr("credit_stock_ledgers"), handleResponse.bind(this, cancelTransactions.createCancelStcTransaction));
router.post("/cancel-sto-transaction/create", ensureAuthentications, validateCancelStoTransaction(), validateStockLedgerArr("stock_ledgers"), handleResponse.bind(this, cancelTransactions.createCancelStoTransaction));
router.post("/cancel-sto-grn-transaction/create", ensureAuthentications, validateCancelStoGrnTransaction(), validateStockLedgerArr("stock_ledgers"), handleResponse.bind(this, cancelTransactions.createCancelStoGrnTransaction));
router.post("/cancel-mrn-transaction/create", ensureAuthentications, validateCancelMrnTransaction(), validateStockLedgerArr("stock_ledgers"), handleResponse.bind(this, cancelTransactions.cancelMrnTransaction));
router.post("/cancel-returnmrn-transaction/create", ensureAuthentications, validateCancelReturnMrnTransaction(), validateStockLedgerArr("mrn_stock_ledgers"), validateStockLedgerArr("returnmrn_stock_ledgers"), handleResponse.bind(this, cancelTransactions.cancelReturnMrnTransaction));

module.exports = router;