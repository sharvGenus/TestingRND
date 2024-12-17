const router = require("express").Router();
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");
const { handleResponse } = require("../../utilities/common-utils");
const importFile = require("./import-excel.controller");

router.post("/import-excel/export-schema-file", ensureAuthentications, importFile.exportFormsSchemaFile);
router.post("/import-excel/import-schema-file", ensureAuthentications, handleResponse.bind(this, importFile.importFormResponses));
router.post("/import-excel/import-static-master-schema-file", ensureAuthentications, handleResponse.bind(this, importFile.importStaticMasters)); // export
router.post("/import-excel/import-static-master-schema-file-data", ensureAuthentications, handleResponse.bind(this, importFile.importStaticMastersData)); // Import the Urban and Rural
router.get("/download-rejected-records/:fileName", ensureAuthentications, importFile.downloadRejectedFiles);
router.post("/import-excel/update-bulk-responses", ensureAuthentications, handleResponse.bind(this, importFile.updateFormResponses));

module.exports = router;
