const router = require("express").Router();
const forms = require("./forms.controller");
const { validateFormSaveOrUpdate } = require("./forms.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/form/create", ensureAuthentications, validateFormSaveOrUpdate(), handleResponse.bind(this, forms.createForm));
router.post("/form/publish", ensureAuthentications, handleResponse.bind(this, forms.publishForm));
router.get("/form/list", ensureAuthentications, handleResponse.bind(this, forms.getAllForms));
router.get("/form/form-by-project-and-form-type-id/list", ensureAuthentications, handleResponse.bind(this, forms.getAllFormsByProjectIdAndArrayOfFormTypeId));
router.get("/default-attributes/list", ensureAuthentications, handleResponse.bind(this, forms.getAllDefaultAttributes));
router.get("/form/details/:id", ensureAuthentications, handleResponse.bind(this, forms.getFormDetails));
router.put("/form/update", ensureAuthentications, validateFormSaveOrUpdate(), handleResponse.bind(this, forms.updateForm));
router.delete("/form/delete/:id", ensureAuthentications, handleResponse.bind(this, forms.deleteForm));
router.post("/form/submit-response/:id", ensureAuthentications, handleResponse.bind(this, forms.saveFormResponse));
router.put("/form/update-response/:id", ensureAuthentications, handleResponse.bind(this, forms.updateFormResponse));
router.delete("/form/delete-response/:form_id/:response_id", ensureAuthentications, handleResponse.bind(this, forms.softDeleteFormResponse));
router.get("/form/get-form-submissions/:formId", ensureAuthentications, handleResponse.bind(this, forms.getDynamicFormData));
router.post("/form/get-dropdown-field-data", ensureAuthentications, handleResponse.bind(this, forms.getDynamicQueryData));
router.get("/form/get-table-data", ensureAuthentications, handleResponse.bind(this, forms.getDynamicTableData));
router.put("/form/update-data-mapping", ensureAuthentications, handleResponse.bind(this, forms.updateFormDataMapping));
router.get("/form/get-mapped-data", ensureAuthentications, handleResponse.bind(this, forms.getMappedFormData));
router.get("/form/offline-data", ensureAuthentications, handleResponse.bind(this, forms.getOfflineData));
router.get("/form/get-all-type", ensureAuthentications, handleResponse.bind(this, forms.getAllFormsType));
router.get("/form-response-by-id", ensureAuthentications, handleResponse.bind(this, forms.getFormResponseById));
router.get("/form/resurvey-list/:formId", ensureAuthentications, handleResponse.bind(this, forms.getResurveyForms));
router.post("/form/export-form-responses", ensureAuthentications, forms.exportFormResponses);
router.post("/form/form-responses", ensureAuthentications, handleResponse.bind(this, forms.formResponses));
router.post("/form/get-distinct-column", ensureAuthentications, handleResponse.bind(this, forms.getDistinctColumnValue));
router.post("/forms/get-ticket-info", ensureAuthentications, handleResponse.bind(this, forms.getTicketRelatedData));
router.post("/forms/ocr-reader", ensureAuthentications, handleResponse.bind(this, forms.ocrReader));
router.get("/forms/generate-forms-report", ensureAuthentications, handleResponse.bind(this, forms.generateFormsReport));

router.get("/forms/mdm-payload-status/dropdown", ensureAuthentications, handleResponse.bind(this, forms.getMDMPayloadStatusDropdown));

module.exports = router;