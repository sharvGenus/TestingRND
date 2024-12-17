const router = require("express").Router();
const purchaseOrders = require("./purchase-orders.controller");
const { validatePurchaseOrderBasicDetailsSave, validatePurchaseOrderArray } = require("./purchase-orders.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/purchase-order/create", ensureAuthentications, validatePurchaseOrderBasicDetailsSave(), validatePurchaseOrderArray(), handleResponse.bind(this, purchaseOrders.createPurchaseOrder));
router.get("/plant-code/list", ensureAuthentications, handleResponse.bind(this, purchaseOrders.getAllPlantCodes));
router.get("/purchase-order/list", ensureAuthentications, handleResponse.bind(this, purchaseOrders.getAllPurchaseOrders));

module.exports = router;