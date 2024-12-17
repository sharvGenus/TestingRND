const router = require("express").Router();
const ruralHierarchies = require("./rural-hierarchies.controller");
const { validateRuralHierarchySaveOrUpdate } = require("./rural-hierarchies.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/rural-hierarchies/create", ensureAuthentications, validateRuralHierarchySaveOrUpdate(), handleResponse.bind(this, ruralHierarchies.createRuralHierarchy));
router.put("/rural-hierarchies/update/:id", ensureAuthentications, handleResponse.bind(this, ruralHierarchies.updateRuralHierarchy));
router.get("/rural-hierarchies/details/:id", ensureAuthentications, handleResponse.bind(this, ruralHierarchies.getRuralHierarchyDetails));
router.get("/rural-hierarchies/history/:recordId", ensureAuthentications, handleResponse.bind(this, ruralHierarchies.getRuralHierarchiesHistory));
router.get("/rural-hierarchies/list", ensureAuthentications, handleResponse.bind(this, ruralHierarchies.getAllRuralHierarchy));
router.delete("/rural-hierarchies/delete/:id", ensureAuthentications, handleResponse.bind(this, ruralHierarchies.deleteRuralHierarchy));
router.get("/rural-hierarchies/project/:id", ensureAuthentications, handleResponse.bind(this, ruralHierarchies.getAllRuralHierarchyByProjectId));

module.exports = router;
