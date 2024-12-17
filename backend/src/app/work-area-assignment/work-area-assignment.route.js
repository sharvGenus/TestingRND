const router = require("express").Router();
const workAreaAssignment = require("./work-area-assignment.controller");
const { validateWorkAreaAssignmentSaveOrUpdate } = require("./work-area-assignment.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/work-area-assignment/create", ensureAuthentications, handleResponse.bind(this, workAreaAssignment.createWorkAreaAssignment));
router.put("/work-area-assignment/update/:id", ensureAuthentications, validateWorkAreaAssignmentSaveOrUpdate(), handleResponse.bind(this, workAreaAssignment.updateWorkAreaAssignment));
router.delete("/work-area-assignment/delete/:id", ensureAuthentications, handleResponse.bind(this, workAreaAssignment.deleteWorkAreaAssignment));
router.get("/work-area-assignment-by-userId/details/:id", ensureAuthentications, handleResponse.bind(this, workAreaAssignment.getWorkAreaAssignmentByUserId));
router.get("/work-area-assignment/list", ensureAuthentications, handleResponse.bind(this, workAreaAssignment.getAllWorkAreaAssignment));
router.get("/work-area-assignment/history/:recordId", ensureAuthentications, handleResponse.bind(this, workAreaAssignment.getlWorkAreaAssignmentHistory));
router.get("/get-work-area-by-userId", ensureAuthentications, handleResponse.bind(this, workAreaAssignment.getUserWorkAreaHierarchyData));

module.exports = router;
