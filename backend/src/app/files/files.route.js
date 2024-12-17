const router = require("express").Router();
const files = require("./files.controller");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.get("/files/*", ensureAuthentications, files.fetchFile);
router.get("/attachments/*", files.fetchAttachments);

module.exports = router;
