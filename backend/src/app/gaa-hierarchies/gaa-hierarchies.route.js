const router = require("express").Router();
const gaaHierarchies = require("./gaa-hierarchies.controller");
const { validateGaaHierarchySaveOrUpdate } = require("./gaa-hierarchies.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/gaa-hierarchies/create", ensureAuthentications, validateGaaHierarchySaveOrUpdate(), handleResponse.bind(this, gaaHierarchies.createGaaHierarchy));
router.put("/gaa-hierarchies/update/:id", ensureAuthentications, handleResponse.bind(this, gaaHierarchies.updateGaaHierarchy));
router.get("/gaa-hierarchies/details/:id", ensureAuthentications, handleResponse.bind(this, gaaHierarchies.getGaaHierarchyDetails));
router.get("/gaa-hierarchies/history/:recordId", ensureAuthentications, handleResponse.bind(this, gaaHierarchies.getGaaHierarchiesHistory));
router.get("/gaa-hierarchies/list", ensureAuthentications, handleResponse.bind(this, gaaHierarchies.getAllGaaHierarchies));
router.delete("/gaa-hierarchies/delete/:id", ensureAuthentications, handleResponse.bind(this, gaaHierarchies.deleteGaaHierarchy));
router.get("/gaa-hierarchies/project/:id", ensureAuthentications, handleResponse.bind(this, gaaHierarchies.getAllGaaHierarchiesByProjectId));
router.get("/gaa-hierarchies/area-project-level/project/:id", ensureAuthentications, handleResponse.bind(this, gaaHierarchies.getAreaProjectLevelByProjectId));
router.post("/gaa-hierarchies/area-project-level/project/:id", ensureAuthentications, handleResponse.bind(this, gaaHierarchies.getAreaProjectLevelByProjectId));

module.exports = router;
