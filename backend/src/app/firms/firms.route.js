const router = require("express").Router();
const firms = require("./firms.controller");
const { validateFirmSaveOrUpdate } = require("./firms.request");
const { handleResponse } = require("../../utilities/common-utils");

router.post("/firm/create", validateFirmSaveOrUpdate(), handleResponse.bind(this, firms.createFirm));
router.put("/firm/update/:id", validateFirmSaveOrUpdate(), handleResponse.bind(this, firms.updateFirm));
router.get("/firm/details/:id", handleResponse.bind(this, firms.getFirmDetails));
router.get("/firm/list", handleResponse.bind(this, firms.getAllFirms));
router.delete("/firm/delete/:id", handleResponse.bind(this, firms.deleteFirm));
router.get("/firm/dropdown", handleResponse.bind(this, firms.getAllFirmsByDropdown));

module.exports = router;