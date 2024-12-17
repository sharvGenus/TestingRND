const router = require("express").Router();
const countries = require("./countries.controller");
const { validateCountrySaveOrUpdate } = require("./countries.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/country/create", ensureAuthentications, validateCountrySaveOrUpdate(), handleResponse.bind(this, countries.createCountry));
router.get("/country/list", ensureAuthentications, handleResponse.bind(this, countries.getAllCountries));
router.get("/country/details/:id", ensureAuthentications, handleResponse.bind(this, countries.getCountryDetails));
router.get("/country/history/:recordId", ensureAuthentications, handleResponse.bind(this, countries.getCountriesHistory));
router.put("/country/update/:id", ensureAuthentications, validateCountrySaveOrUpdate(), handleResponse.bind(this, countries.updateCountry));
router.delete("/country/delete/:id", ensureAuthentications, handleResponse.bind(this, countries.deleteCountry));
router.get("/country/dropdown", ensureAuthentications, handleResponse.bind(this, countries.getAllCountriesByDropdown));

module.exports = router;
