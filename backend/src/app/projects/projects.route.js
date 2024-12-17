const router = require("express").Router();
const projects = require("./projects.controller");
const { handleResponse } = require("../../utilities/common-utils");
const { validateProjectSaveOrUpdate } = require("./projects.request");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/project/create", ensureAuthentications, validateProjectSaveOrUpdate(), handleResponse.bind(this, projects.createProject));
router.put("/project/update/:id", ensureAuthentications, validateProjectSaveOrUpdate(), handleResponse.bind(this, projects.updateProject));
router.get("/project/history/:recordId", ensureAuthentications, handleResponse.bind(this, projects.getProjectsHistory));
router.get("/project/details/:id", ensureAuthentications, handleResponse.bind(this, projects.getProjectDetails));
router.get("/project/list", ensureAuthentications, handleResponse.bind(this, projects.getAllProjects));
router.delete("/project/delete/:id", ensureAuthentications, handleResponse.bind(this, projects.deleteProject));
router.get("/project/dropdown", ensureAuthentications, handleResponse.bind(this, projects.getAllProjectByDropdown));
router.get("/project/governed-for-role-or-user", ensureAuthentications, handleResponse.bind(this, projects.getProjectsForRoleAndUser));
router.get("/all-project/dropdown", ensureAuthentications, handleResponse.bind(this, projects.getProjectList));

module.exports = router;
