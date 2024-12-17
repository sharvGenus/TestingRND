const router = require("express").Router();
const organizationStores = require("./organization-stores.controller");
const { validateOrganizationStoreSaveOrUpdate } = require("./organization-stores.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/organization-store/create", ensureAuthentications, validateOrganizationStoreSaveOrUpdate(), handleResponse.bind(this, organizationStores.createOrganizationStore));
router.put("/organization-store/update/:id", ensureAuthentications, validateOrganizationStoreSaveOrUpdate(), handleResponse.bind(this, organizationStores.updateOrganizationStore));
router.get("/organization-store/details/:id", ensureAuthentications, handleResponse.bind(this, organizationStores.getOrganizationStoreDetails));
router.get("/organization-store/list", ensureAuthentications, handleResponse.bind(this, organizationStores.getAllOrganizationStores));
router.delete("/organization-store/delete/:id", ensureAuthentications, handleResponse.bind(this, organizationStores.deleteOrganizationStore));
router.get("/organization-store/history/:recordId", ensureAuthentications, handleResponse.bind(this, organizationStores.getOrganizationStoreHistory));
router.get("/organization-store/dropdown/:userId", ensureAuthentications, handleResponse.bind(this, organizationStores.getAllStoresForDropdown));
router.get("/organization-store/data", ensureAuthentications, handleResponse.bind(this, organizationStores.getOrganizationStores));
router.get("/organization-view-store/dropdown", ensureAuthentications, handleResponse.bind(this, organizationStores.getAllViewStoresForDropdown));

module.exports = router;