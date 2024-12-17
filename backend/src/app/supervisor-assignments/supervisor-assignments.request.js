const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateSupervisorAssignmentsSaveOrUpdate = () => [
    requestValidation.validateIfEmpty("userId", statusMessage.USER_ID_NOT_FOUND)
];

module.exports = { validateSupervisorAssignmentsSaveOrUpdate };
