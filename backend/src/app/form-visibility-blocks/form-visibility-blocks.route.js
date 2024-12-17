const router = require("express").Router();
const formVisibilityBlocks = require("./form-visibility-blocks.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/form-visibility-blocks/create", ensureAuthentications, handleResponse.bind(this, formVisibilityBlocks.createFormVisibilityBlocks));
router.get("/form-visibility-blocks/list", ensureAuthentications, handleResponse.bind(this, formVisibilityBlocks.getAllformVisibilityBlocks));
router.get("/form-visibility-blocks/details/:id", ensureAuthentications, handleResponse.bind(this, formVisibilityBlocks.getformVisibilityBlockDetails));
router.put("/form-visibility-blocks/update/:id", ensureAuthentications, handleResponse.bind(this, formVisibilityBlocks.updateformVisibilityBlocks));
router.delete("/form-visibility-blocks/delete/:id", ensureAuthentications, handleResponse.bind(this, formVisibilityBlocks.deleteformVisibilityBlocks));

module.exports = router;
