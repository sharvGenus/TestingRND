const router = require("express").Router();
const customerDepartment = require("./customer-departments.controller");
const { validateCustomerDepartmentsSaveOrUpdate } = require("./customer-departments.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/customer-departments/create", ensureAuthentications, validateCustomerDepartmentsSaveOrUpdate(), handleResponse.bind(this, customerDepartment.createCustomerDepartments));
router.put("/customer-departments/update/:id", ensureAuthentications, validateCustomerDepartmentsSaveOrUpdate(), handleResponse.bind(this, customerDepartment.updateCustomerDepartments));
router.get("/customer-departments/details/:id", ensureAuthentications, handleResponse.bind(this, customerDepartment.getCustomerDepartmentsDetails));
router.get("/customer-departments-history/:recordId", ensureAuthentications, handleResponse.bind(this, customerDepartment.getCustomerDepartmentsHistory));
router.get("/customer-departments/list", ensureAuthentications, handleResponse.bind(this, customerDepartment.getAllCustomerDepartments));
router.get("/customer-departments/list/customer", ensureAuthentications, handleResponse.bind(this, customerDepartment.getAllCustomerDepartmentsByCustomerId));
router.delete("/customer-departments/delete/:id", ensureAuthentications, handleResponse.bind(this, customerDepartment.deleteCustomerDepartments));
router.get("/customer-departments/dropdown/:customerId", ensureAuthentications, handleResponse.bind(this, customerDepartment.getAllCustomerDepartmentByDropdown));

module.exports = router;
