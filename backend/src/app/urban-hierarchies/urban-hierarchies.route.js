const router = require("express").Router();
const urbanHierarchies = require("./urban-hierarchies.controller");
const { validateUrbanHierarchySaveOrUpdate } = require("./urban-hierarchies.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/urban-hierarchies/create", ensureAuthentications, validateUrbanHierarchySaveOrUpdate(), handleResponse.bind(this, urbanHierarchies.createUrbanHierarchy));
router.put("/urban-hierarchies/update/:id", ensureAuthentications, validateUrbanHierarchySaveOrUpdate(), handleResponse.bind(this, urbanHierarchies.updateUrbanHierarchy));

router.get("/urban-hierarchies/details/:id", ensureAuthentications, handleResponse.bind(this, urbanHierarchies.getUrbanHierarchyDetails));
router.get("/urban-hierarchies/history/:recordId", ensureAuthentications, handleResponse.bind(this, urbanHierarchies.getUrbanHierarchiesHistory));
router.get("/urban-hierarchies/list", ensureAuthentications, handleResponse.bind(this, urbanHierarchies.getAllUrbanHierarchies));
router.delete("/urban-hierarchies/delete/:id", ensureAuthentications, handleResponse.bind(this, urbanHierarchies.deleteUrbanHierarchy));
router.get("/urban-hierarchies/project/:id", ensureAuthentications, handleResponse.bind(this, urbanHierarchies.getAllUrbanHierarchiesByProjectId));

module.exports = router;
