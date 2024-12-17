const router = require("express").Router();
const companies = require("./companies.controller");
const { handleResponse } = require("../../utilities/common-utils");
const { validateCompanySaveOrUpdate } = require("./companies.request");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/company/create", ensureAuthentications, validateCompanySaveOrUpdate(), handleResponse.bind(this, companies.createCompany));
router.put("/company/update/:id", ensureAuthentications, validateCompanySaveOrUpdate(), handleResponse.bind(this, companies.updateCompany));
router.get("/company/details/:id", ensureAuthentications, handleResponse.bind(this, companies.getCompanyDetails));
router.get("/company/list", ensureAuthentications, handleResponse.bind(this, companies.getAllCompanies));
router.delete("/company/delete/:id", ensureAuthentications, handleResponse.bind(this, companies.deleteCompany));
router.get("/company/dropdown", ensureAuthentications, handleResponse.bind(this, companies.getAllCompanyByDropdown));

module.exports = router;
