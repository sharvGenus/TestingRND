const router = require("express").Router();
const billSubmissions = require("./billing-submissions.controller");
const { validateBillingDetailsSave, validateBillingMaterialDetailsArray } = require("./billing-submissions.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/bill-submissions/create", ensureAuthentications, validateBillingDetailsSave(), validateBillingMaterialDetailsArray(), handleResponse.bind(this, billSubmissions.createBillSubmission));
router.get("/bill-submissions/list", ensureAuthentications, handleResponse.bind(this, billSubmissions.getAllBillSubmissions));
router.get("/bill-material-submissions/list", ensureAuthentications, handleResponse.bind(this, billSubmissions.getAllBillMaterialDeatils));
router.get("/bill-submissions/details/:id", ensureAuthentications, handleResponse.bind(this, billSubmissions.getBillSubmissionDetails));
router.put("/bill-submissions/update/:id", ensureAuthentications, validateBillingDetailsSave(), handleResponse.bind(this, billSubmissions.updateBillSubmission));
router.delete("/bill-submissions/delete/:id", ensureAuthentications, handleResponse.bind(this, billSubmissions.deleteBillSubmission));

module.exports = router;
