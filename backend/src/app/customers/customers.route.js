const router = require("express").Router();
const customers = require("./customers.controller");
const { handleResponse } = require("../../utilities/common-utils");
const { validateCustomerSaveOrUpdate } = require("./customer.request");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/customer/create", ensureAuthentications, validateCustomerSaveOrUpdate(), handleResponse.bind(this, customers.createCustomer));
router.put("/customer/update/:id", ensureAuthentications, validateCustomerSaveOrUpdate(), handleResponse.bind(this, customers.updateCustomer));
router.get("/customer/details/:id", ensureAuthentications, handleResponse.bind(this, customers.getCustomerDetails));
router.get("/customer/list", ensureAuthentications, handleResponse.bind(this, customers.getAllCustomers));
router.delete("/customer/delete/:id", ensureAuthentications, handleResponse.bind(this, customers.deleteCustomer));
router.get("/customer/dropdown", ensureAuthentications, handleResponse.bind(this, customers.getAllCustomersByDropdown));

module.exports = router;
