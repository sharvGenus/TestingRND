const { Op } = require("sequelize");
const { throwIfNot, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const escalationMatrix = require("./escalation-matrix.service");

/**
 * Method to create escalation matrix
 * @param { object } req.body
 * @returns { object } data
 */
const createEscalationMatrix = async (req) => {
    throwIfNot(req.body.levels, statusCodes.BAD_REQUEST, statusMessages.ESCALATION_LEVEL_REQUIRED);
    const { projectId, emailTemplateId } = req.body;
    const existingRecordCheck = await escalationMatrix.hasExistingRecords({ projectId, emailTemplateId });
    throwIf(existingRecordCheck, statusCodes.DUPLICATE, statusMessages.ESCALATION_MATRIX_ALREADY_EXIST);
    const data = await escalationMatrix.createEscalationMatrix(req.body);
    return { data };
};

/**
  * Method to update escalation matrix
  * @param { object } req.body
  * @returns { object } data
  */
const updateEscalationMatrix = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ESCALATION_MATRIX_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ESCALATION_MATRIX_DETAILS);
    const { projectId, emailTemplateId } = req.body;
    const isEscalationMatrixExits = await escalationMatrix.hasExistingRecords({ id: { [Op.not]: req.params.id }, projectId, emailTemplateId });
    throwIf(isEscalationMatrixExits, statusCodes.DUPLICATE, statusMessages.ESCALATION_MATRIX_ALREADY_EXIST);
    const data = await escalationMatrix.updateEscalationMatrix(req.body, { id: req.params.id });
    return { data };
};

/**
  * Method to get escalation matrix details by id
  * @param { object } req.body
  * @returns { object } data
  */
const getEscalationMatrixDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ESCALATION_MATRIX_ID_REQUIRED);
    const data = await escalationMatrix.getEscalationMatrixDetails({ id: req.params.id });
    return { data };
};

/**
 * Method to get all escalation matrix
 * @param { object } req.body
 * @returns { object } data
 */
const getAllEscalationMatrix = async () => {
    const data = await escalationMatrix.getAllEscalationMatrix();
    return { data };
};

/**
  * Method to delete escalation matrix by escalation matrix id
  * @param { object } req.body
  * @returns { object } data
  */
const deleteEscalationMatrix = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ESCALATION_MATRIX_ID_REQUIRED);
    const data = await escalationMatrix.deleteEscalationMatrix({ id: req.params.id });
    return { data };
};

module.exports = {
    createEscalationMatrix,
    updateEscalationMatrix,
    getEscalationMatrixDetails,
    getAllEscalationMatrix,
    deleteEscalationMatrix
};
