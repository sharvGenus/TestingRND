const router = require("express").Router();
const organizationStoreLocations = require("./organization-store-locations.controller");
const { validateOrganizationStoreLocationSaveOrUpdate } = require("./organization-store-locations.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/organization-store-location/create", ensureAuthentications, validateOrganizationStoreLocationSaveOrUpdate(), handleResponse.bind(this, organizationStoreLocations.createOrganizationStoreLocation));
router.put("/organization-store-location/update/:id", ensureAuthentications, validateOrganizationStoreLocationSaveOrUpdate(), handleResponse.bind(this, organizationStoreLocations.updateOrganizationStoreLocation));
router.get("/organization-store-location/details/:id", ensureAuthentications, handleResponse.bind(this, organizationStoreLocations.getOrganizationStoreLocationDetails));
router.get("/organization-store-location/list", ensureAuthentications, handleResponse.bind(this, organizationStoreLocations.getAllOrganizationStoreLocations));
router.delete("/organization-store-location/delete/:id", ensureAuthentications, handleResponse.bind(this, organizationStoreLocations.deleteOrganizationStoreLocation));
router.get("/organization-store-location/history/:recordId", ensureAuthentications, handleResponse.bind(this, organizationStoreLocations.getOrganizationStoreLocationHistory));
router.get("/organization-store-location-list/data", ensureAuthentications, handleResponse.bind(this, organizationStoreLocations.getOrganizationStoreLocations));

module.exports = router;