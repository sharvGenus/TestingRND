const router = require("express").Router();
const customerDesignation = require("./customer-designations.controller");
const { validateCustomerDesignationsSaveOrUpdate } = require("./customer-designations.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/customer-designations/create", ensureAuthentications, validateCustomerDesignationsSaveOrUpdate(), handleResponse.bind(this, customerDesignation.createCustomerDesignations));
router.put("/customer-designations/update/:id", ensureAuthentications, validateCustomerDesignationsSaveOrUpdate(), handleResponse.bind(this, customerDesignation.updateCustomerDesignations));
router.get("/customer-designations-history/:recordId", ensureAuthentications, handleResponse.bind(this, customerDesignation.getCustomerDesignationsHistory));
router.get("/customer-designations/details/:id", ensureAuthentications, handleResponse.bind(this, customerDesignation.getCustomerDesignationsDetails));
router.get("/customer-designations/list", ensureAuthentications, handleResponse.bind(this, customerDesignation.getAllCustomerDesignations));
router.get("/customer-designations/list/customer-department", ensureAuthentications, handleResponse.bind(this, customerDesignation.getAllCustomerDesignationsByCustomerDepartmentId));
router.delete("/customer-designations/delete/:id", ensureAuthentications, handleResponse.bind(this, customerDesignation.deleteCustomerDesignations));

module.exports = router;
