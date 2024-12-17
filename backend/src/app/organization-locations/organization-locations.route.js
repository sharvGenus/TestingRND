const router = require("express").Router();
const organizationLocations = require("./organization-locations.controller");
const { validateOrganizationLocationsSaveOrUpdate } = require("./organization-locations.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/organization-locations/create", ensureAuthentications, validateOrganizationLocationsSaveOrUpdate(), handleResponse.bind(this, organizationLocations.createOrganizationLocations));
router.put("/organization-locations/update/:id", ensureAuthentications, validateOrganizationLocationsSaveOrUpdate(), handleResponse.bind(this, organizationLocations.updateOrganizationLocations));
router.get("/organization-locations/details/:id", ensureAuthentications, handleResponse.bind(this, organizationLocations.getOrganizationLocationsDetails));
router.get("/organization-locations/list/:organizationTypeId", ensureAuthentications, handleResponse.bind(this, organizationLocations.getAllOrganizationLocation));
router.delete("/organization-locations/delete/:id", ensureAuthentications, handleResponse.bind(this, organizationLocations.deleteOrganizationLocations));
router.get("/organization-locations/dropdown", ensureAuthentications, handleResponse.bind(this, organizationLocations.getAllOrganiationLocationsByDropdown));
router.get("/organization-location/history/:recordId", ensureAuthentications, handleResponse.bind(this, organizationLocations.getOrganizationLocationsHistory));

module.exports = router;