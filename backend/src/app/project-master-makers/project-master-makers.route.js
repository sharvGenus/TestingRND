const router = require("express").Router();
const projectMasterMakers = require("./project-master-makers.controller");
const { validateProjectMasterMakerSaveOrUpdate } = require("./project-master-makers.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/project-master-maker/create", ensureAuthentications, validateProjectMasterMakerSaveOrUpdate(), handleResponse.bind(this, projectMasterMakers.createProjectMasterMaker));
router.put("/project-master-maker/update/:id", ensureAuthentications, validateProjectMasterMakerSaveOrUpdate(), handleResponse.bind(this, projectMasterMakers.updateProjectMasterMaker));
router.get("/project-master-maker/details/:id", ensureAuthentications, handleResponse.bind(this, projectMasterMakers.getProjectMasterMakerDetails));
router.get("/project-master-maker/history/:recordId", ensureAuthentications, handleResponse.bind(this, projectMasterMakers.getProjectMasterMakersHistory));
router.get("/project-master-maker/list", ensureAuthentications, handleResponse.bind(this, projectMasterMakers.getAllProjectMasterMakers));
router.delete("/project-master-maker/delete/:id", ensureAuthentications, handleResponse.bind(this, projectMasterMakers.deleteProjectMasterMaker));
router.get("/project-master-maker/project/:id", ensureAuthentications, handleResponse.bind(this, projectMasterMakers.getAllProjectMasterMakersByProjectId));
module.exports = router;
