const router = require("express").Router();
const devolutions = require("./devolutions.controller");
const { validateDevolutionSave, validateDevolutionMaterialSave } = require("./devolutions.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/devolution/create", ensureAuthentications, validateDevolutionSave(), validateDevolutionMaterialSave(), handleResponse.bind(this, devolutions.createDevolution));
router.get("/devolution/list", ensureAuthentications, handleResponse.bind(this, devolutions.getDevolutionList));
router.get("/devolution-details/:id", ensureAuthentications, handleResponse.bind(this, devolutions.getDevolutionDetails));
router.get("/devolution-material/list", ensureAuthentications, handleResponse.bind(this, devolutions.getDevolutionMaterialList));
router.put("/devolution/update/:id", ensureAuthentications, handleResponse.bind(this, devolutions.updateDevolution));
router.put("/devolution-approve-reject/:id", ensureAuthentications, handleResponse.bind(this, devolutions.devolutionApproveReject));
router.post("/devolution-form-data", ensureAuthentications, handleResponse.bind(this, devolutions.getDevolutionFormData));

module.exports = router;
