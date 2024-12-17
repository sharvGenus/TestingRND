const router = require("express").Router();
const projectSiteStores = require("./project-site-stores.controller");
const { validateProjectSiteStoresSaveOrUpdate } = require("./project-site-stores.request");
const { handleResponse } = require("../../utilities/common-utils");

router.post("/project-site-stores/create", validateProjectSiteStoresSaveOrUpdate(), handleResponse.bind(this, projectSiteStores.createProjectSiteStores));
router.put("/project-site-stores/update/:id", validateProjectSiteStoresSaveOrUpdate(), handleResponse.bind(this, projectSiteStores.updateProjectSiteStores));
router.get("/project-site-stores/details/:id", handleResponse.bind(this, projectSiteStores.getProjectSiteStoresDetails));
router.get("/project-site-stores/list", handleResponse.bind(this, projectSiteStores.getAllProjectSiteStores));
router.delete("/project-site-stores/delete/:id", handleResponse.bind(this, projectSiteStores.deleteProjectSiteStores));
router.get("/project-site-stores/dropdown", handleResponse.bind(this, projectSiteStores.getAllProjectSiteStoresByDropdown));

module.exports = router;