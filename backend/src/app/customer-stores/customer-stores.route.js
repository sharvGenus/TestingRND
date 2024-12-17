const router = require("express").Router();
const customerStores = require("./customer-stores.controller");
const { validateCustomerStoresSaveOrUpdate } = require("./customer-stores.request");
const { handleResponse } = require("../../utilities/common-utils");

router.post("/customer-stores/create", validateCustomerStoresSaveOrUpdate(), handleResponse.bind(this, customerStores.createCustomerStores));
router.put("/customer-stores/update/:id", validateCustomerStoresSaveOrUpdate(), handleResponse.bind(this, customerStores.updateCustomerStores));
router.get("/customer-stores/details/:id", handleResponse.bind(this, customerStores.getCustomerStoresDetails));
router.get("/customer-stores/list", handleResponse.bind(this, customerStores.getAllCustomerStores));
router.delete("/customer-stores/delete/:id", handleResponse.bind(this, customerStores.deleteCustomerStores));

module.exports = router;