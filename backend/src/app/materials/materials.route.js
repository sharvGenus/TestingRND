const router = require("express").Router();
const materials = require("./materials.controller");
const { validateMaterialsSaveOrUpdate } = require("./materials.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/material/create", ensureAuthentications, validateMaterialsSaveOrUpdate(), handleResponse.bind(this, materials.createMaterial));
router.put("/material/update/:id", ensureAuthentications, validateMaterialsSaveOrUpdate(), handleResponse.bind(this, materials.updateMaterial));
router.get("/material/details/:id", ensureAuthentications, handleResponse.bind(this, materials.getMaterialDetails));
router.get("/material/list", ensureAuthentications, handleResponse.bind(this, materials.getAllMaterial));
router.delete("/material/delete/:id", ensureAuthentications, handleResponse.bind(this, materials.deleteMaterial));
router.get("/material/dropdown", ensureAuthentications, handleResponse.bind(this, materials.getAllMaterialsByDropdown));
router.get("/material-details/:integrationId", ensureAuthentications, handleResponse.bind(this, materials.getMaterialDetailsByIntegrationId));
router.get("/material/history/:recordId", ensureAuthentications, handleResponse.bind(this, materials.getMaterialsHistory));

module.exports = router;
