const router = require("express").Router();
const organizations = require("./organizations.controller");
const { validateOrganizationSaveOrUpdate } = require("./organizations.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post(
    "/organization/create",
    ensureAuthentications,
    validateOrganizationSaveOrUpdate(),
    handleResponse.bind(this, organizations.createOrganization)
);
router.put(
    "/organization/update/:id",
    ensureAuthentications,
    validateOrganizationSaveOrUpdate(),
    handleResponse.bind(this, organizations.updateOrganization)
);
router.get(
    "/organization/details/:id",
    ensureAuthentications,
    handleResponse.bind(this, organizations.getOrganizationDetails)
);
router.get(
    "/organization/list/:organizationTypeId",
    ensureAuthentications,
    handleResponse.bind(this, organizations.getAllOrganizations)
);
router.get(
    "/organization-location/list/:organizationTypeId",
    ensureAuthentications,
    handleResponse.bind(this, organizations.getAllOrganizationLocations)
);
router.delete(
    "/organization/delete/:id",
    ensureAuthentications,
    handleResponse.bind(this, organizations.deleteOrganization)
);
router.get(
    "/organization/dropdown/:organizationTypeId",
    ensureAuthentications,
    handleResponse.bind(this, organizations.getAllOrganizationsByDropdown)
);
router.get(
    "/organization-location/dropdown/:organizationTypeId",
    ensureAuthentications,
    handleResponse.bind(
        this,
        organizations.getAllOrganizationLocationsByDropdown
    )
);
router.get(
    "/organization/getAll/list",
    ensureAuthentications,
    handleResponse.bind(this, organizations.getAllOrganizationsList)
);
router.get(
    "/organization-details/:integrationId",
    ensureAuthentications,
    handleResponse.bind(
        this,
        organizations.getOrganizationDetailsByIntegrationId
    )
);
router.get(
    "/organization/history/:recordId",
    ensureAuthentications,
    handleResponse.bind(this, organizations.getOrganizationHistory)
);
router.get(
    "/organization-location-by-parent/list/:organizationTypeId/:parentId",
    ensureAuthentications,
    handleResponse.bind(this, organizations.getAllOrganizationLocationsByParentId)
);
router.get(
    "/organization-list/data",
    ensureAuthentications,
    handleResponse.bind(this, organizations.getOrganizationsByDropdown)
);

module.exports = router;