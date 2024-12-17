const router = require("express").Router();
const materialQuantities = require("./material-quantities.controller");
// const { validateMaterialQuantitiesSaveOrUpdate } = require("./material-quantities.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/material-quantity/create", ensureAuthentications, handleResponse.bind(this, materialQuantities.createMaterialQuantities));
router.get("/material-quantity/list", ensureAuthentications, handleResponse.bind(this, materialQuantities.getAllMaterialQuantities));
router.get("/material-quantity/project-and-material/list", ensureAuthentications, handleResponse.bind(this, materialQuantities.getMaterialQuantitiesByProjectAndMaterial));

module.exports = router;
