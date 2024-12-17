const router = require("express").Router();
const locationSiteStores = require("./location-site-stores.controller");
const { validateLocationSiteStoresSaveOrUpdate } = require("./location-site-stores.request");
const { handleResponse } = require("../../utilities/common-utils");

router.post("/location-site-stores/create", validateLocationSiteStoresSaveOrUpdate(), handleResponse.bind(this, locationSiteStores.createLocationSiteStores));
router.put("/location-site-stores/update/:id", validateLocationSiteStoresSaveOrUpdate(), handleResponse.bind(this, locationSiteStores.updateLocationSiteStores));
router.get("/location-site-stores/details/:id", handleResponse.bind(this, locationSiteStores.getLocationSiteStoresDetails));
router.get("/location-site-stores/list", handleResponse.bind(this, locationSiteStores.getAllLocationSiteStores));
router.delete("/location-site-stores/delete/:id", handleResponse.bind(this, locationSiteStores.deleteLocationSiteStores));
router.get("/location-site-stores/dropdown", handleResponse.bind(this, locationSiteStores.getAllLocationSiteStoresByDropdown));

module.exports = router;