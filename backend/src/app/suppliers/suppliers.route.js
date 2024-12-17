const router = require("express").Router();
const suppliers = require("./suppliers.controller");
const { validateSuppliersSaveOrUpdate } = require("./suppliers.request");
const { handleResponse } = require("../../utilities/common-utils");

router.post("/suppliers/create", validateSuppliersSaveOrUpdate(), handleResponse.bind(this, suppliers.createSuppliers));
router.put("/suppliers/update/:id", validateSuppliersSaveOrUpdate(), handleResponse.bind(this, suppliers.updateSuppliers));
router.get("/suppliers/details/:id", handleResponse.bind(this, suppliers.getSuppliersDetails));
router.get("/suppliers/list", handleResponse.bind(this, suppliers.getAllSuppliers));
router.delete("/suppliers/delete/:id", handleResponse.bind(this, suppliers.deleteSuppliers));
router.get("/suppliers/dropdown", handleResponse.bind(this, suppliers.getAllSuppliersByDropdown));

module.exports = router;