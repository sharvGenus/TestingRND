const router = require("express").Router();
const firmLocations = require("./firm-locations.controller");
const { validateFirmLocationsSaveOrUpdate } = require("./firm-locations.request");
const { handleResponse } = require("../../utilities/common-utils");

router.post("/firm-locations/create", validateFirmLocationsSaveOrUpdate(), handleResponse.bind(this, firmLocations.createFirmLocations));
router.put("/firm-locations/update/:id", validateFirmLocationsSaveOrUpdate(), handleResponse.bind(this, firmLocations.updateFirmLocations));
router.get("/firm-locations/details/:id", handleResponse.bind(this, firmLocations.getFirmLocationsDetails));
router.get("/firm-locations/list", handleResponse.bind(this, firmLocations.getAllFirmLocation));
router.delete("/firm-locations/delete/:id", handleResponse.bind(this, firmLocations.deleteFirmLocations));
router.get("/firm-locations/dropdown", handleResponse.bind(this, firmLocations.getAllFirmLocationsByDropdown));
module.exports = router;