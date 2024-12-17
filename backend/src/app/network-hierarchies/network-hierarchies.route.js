const router = require("express").Router();
const networkHierarchies = require("./network-hierarchies.controller");
const { validateNetworkHierarchySaveOrUpdate } = require("./network-hierarchies.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/network-hierarchies/create", ensureAuthentications, validateNetworkHierarchySaveOrUpdate(), handleResponse.bind(this, networkHierarchies.createNetworkHierarchy));
router.put("/network-hierarchies/update/:id", ensureAuthentications, validateNetworkHierarchySaveOrUpdate(), handleResponse.bind(this, networkHierarchies.updateNetworkHierarchy));
router.get("/network-hierarchies/details/:id", ensureAuthentications, handleResponse.bind(this, networkHierarchies.getNetworkHierarchyDetails));
router.get("/network-hierarchies/history/:recordId", ensureAuthentications, handleResponse.bind(this, networkHierarchies.getNetworkHierarchiesHistory));
router.get("/network-hierarchies/list", ensureAuthentications, handleResponse.bind(this, networkHierarchies.getAllNetworkHierarchy));
router.delete("/network-hierarchies/delete/:id", ensureAuthentications, handleResponse.bind(this, networkHierarchies.deleteNetworkHierarchy));
router.get("/network-hierarchies/project/:id", ensureAuthentications, handleResponse.bind(this, networkHierarchies.getAllNetworkHierarchyByProjectId));

module.exports = router;
