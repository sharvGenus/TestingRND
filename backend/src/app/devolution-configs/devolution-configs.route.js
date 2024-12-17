const router = require("express").Router();
const devolutionConfigs = require("./devolution-configs.controller");
const { validateDevolutionConfigSaveOrUpdate, validateDevolutionMappingSave, validateDevolutionMappingSaveOrUpdate } = require("./devolution-configs.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/devolution-config/create", ensureAuthentications, validateDevolutionConfigSaveOrUpdate(), validateDevolutionMappingSave(), handleResponse.bind(this, devolutionConfigs.createDevolutionConfig));
router.post("/devolution-mapping/create", ensureAuthentications, validateDevolutionMappingSaveOrUpdate(), handleResponse.bind(this, devolutionConfigs.createDevolutionMapping));
router.get("/devolution-config/list", ensureAuthentications, handleResponse.bind(this, devolutionConfigs.getDevolutionConfigList));
router.get("/devolution-mapping/list", ensureAuthentications, handleResponse.bind(this, devolutionConfigs.getDevolutionMappingList));
router.put("/devolution-config/update/:id", ensureAuthentications, validateDevolutionConfigSaveOrUpdate(), handleResponse.bind(this, devolutionConfigs.updateDevolutionConfig));
router.put("/devolution-mapping/update/:id", ensureAuthentications, validateDevolutionMappingSaveOrUpdate(), handleResponse.bind(this, devolutionConfigs.updateDevolutionMapping));
router.delete("/devolution-config/delete/:id", ensureAuthentications, handleResponse.bind(this, devolutionConfigs.deleteDevolutionConfig));
router.delete("/devolution-mapping/delete/:id", ensureAuthentications, handleResponse.bind(this, devolutionConfigs.deleteDevolutionMapping));

module.exports = router;
