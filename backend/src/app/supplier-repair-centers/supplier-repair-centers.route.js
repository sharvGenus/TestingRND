const router = require("express").Router();
const supplierRepairCenters = require("./supplier-repair-centers.controller");
const { validateSupplierRepairCentersSaveOrUpdate } = require("./supplier-repair-centers.request");
const { handleResponse } = require("../../utilities/common-utils");

router.post("/supplier-repair-centers/create", validateSupplierRepairCentersSaveOrUpdate(), handleResponse.bind(this, supplierRepairCenters.createSupplierRepairCenters));
router.put("/supplier-repair-centers/:id", validateSupplierRepairCentersSaveOrUpdate(), handleResponse.bind(this, supplierRepairCenters.updateSupplierRepairCenters));
router.get("/supplier-repair-centers/details/:id", handleResponse.bind(this, supplierRepairCenters.getSupplierRepairCentersDetails));
router.get("/supplier-repair-centers/list", handleResponse.bind(this, supplierRepairCenters.getAllSupplierRepairCenters));
router.delete("/supplier-repair-centers/delete/:id", handleResponse.bind(this, supplierRepairCenters.deleteSupplierRepairCenters));

module.exports = router;
