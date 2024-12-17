const router = require("express").Router();
const cities = require("./cities.controller");
const { validateCitySaveOrUpdate } = require("./cities.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/city/create", ensureAuthentications, validateCitySaveOrUpdate(), handleResponse.bind(this, cities.createCity));
router.get("/city/list", ensureAuthentications, handleResponse.bind(this, cities.getAllCities));
router.get("/cities/history/:recordId", ensureAuthentications, handleResponse.bind(this, cities.getCitiesHistory));
router.get("/city/details/:id", ensureAuthentications, handleResponse.bind(this, cities.getCityDetails));
router.put("/city/update/:id", ensureAuthentications, validateCitySaveOrUpdate(), handleResponse.bind(this, cities.updateCity));
router.delete("/city/delete/:id", ensureAuthentications, handleResponse.bind(this, cities.deleteCity));
router.get("/city/dropdown/:stateId", ensureAuthentications, handleResponse.bind(this, cities.getAllCititesByDropdown));

module.exports = router;
