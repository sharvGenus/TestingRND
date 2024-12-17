const router = require("express").Router();
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");
const importFile = require("./import-transactions.controller");

router.post("/export-transaction-schema", ensureAuthentications, importFile.exportTransactionsSchemaFile);
router.post("/import-cti-transaction", ensureAuthentications, handleResponse.bind(this, importFile.importCtiTransactions));
router.post("/import-itc-transaction", ensureAuthentications, handleResponse.bind(this, importFile.importItcTransactions));
router.post("/import-iti-transaction", ensureAuthentications, handleResponse.bind(this, importFile.importItiTransactions));

module.exports = router;
