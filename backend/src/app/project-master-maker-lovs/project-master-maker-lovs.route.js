const router = require("express").Router();
const projectMasterMakerLovs = require("./project-master-maker-lovs.controller");
const { validateProjectMasterMakerLovsSaveOrUpdate } = require("./project-master-maker-lovs.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/project-master-maker-lovs/create", ensureAuthentications, validateProjectMasterMakerLovsSaveOrUpdate(), handleResponse.bind(this, projectMasterMakerLovs.createProjectMasterMakerLovs));
router.put("/project-master-maker-lovs/update/:id", ensureAuthentications, validateProjectMasterMakerLovsSaveOrUpdate(), handleResponse.bind(this, projectMasterMakerLovs.updateProjectMasterMakerLovs));
router.get("/project-master-maker-lovs/details/:id", ensureAuthentications, handleResponse.bind(this, projectMasterMakerLovs.getProjectMasterMakerLovsDetails));
router.get("/project-master-maker-lovs/history/:recordId", ensureAuthentications, handleResponse.bind(this, projectMasterMakerLovs.getProjectMasterMakerLovsHistory));
router.get("/project-master-maker-lovs/list", ensureAuthentications, handleResponse.bind(this, projectMasterMakerLovs.getAllProjectMasterMakerLovs));
router.delete("/project-master-maker-lovs/delete/:id", ensureAuthentications, handleResponse.bind(this, projectMasterMakerLovs.deleteProjectMasterMakerLovs));
router.get("/project-master-maker-lovs/master/:id", ensureAuthentications, handleResponse.bind(this, projectMasterMakerLovs.getAllProjectMasterMakerLovsByMasterId));
router.post("/project-master-maker-lovs/import-schema-file", ensureAuthentications, handleResponse.bind(this, projectMasterMakerLovs.importSchemaFile));

module.exports = router;
