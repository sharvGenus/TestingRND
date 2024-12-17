const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const EscalationMatrix = require("../../database/operation/escalation-matrix");
const EscalationLevels = require("../../database/operation/escalation-levels");

const hasExistingRecords = async (where) => {
    const escalationMatrix = new EscalationMatrix();
    const escalationMatrixData = await escalationMatrix.isAlreadyExists(where);
    return escalationMatrixData;
};

const escalationMatrixAlreadyExists = async (where) => {
    try {
        const escalationMatrix = new EscalationMatrix();
        const data = await escalationMatrix.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ESCALATION_MATRIX_FAILURE);
    }
};

const getEscalationMatrixByCondition = async (where) => {
    try {
        const escalationMatrix = new EscalationMatrix();
        const data = await escalationMatrix.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ESCALATION_MATRIX_FAILURE);
    }
};

const createEscalationMatrix = async (escalationMatrixDetails) => {
    try {
        const escalationMatrix = new EscalationMatrix();
        const data = await escalationMatrix.create(escalationMatrixDetails);
        const { levels } = escalationMatrixDetails;
        const { id } = data;
        const escalationLevel = new EscalationLevels();
        await Promise.all(Object.keys(levels).map((key) => escalationLevel.create({ to: levels[key].to, cc: levels[key].cc, escalationId: id, level: +key, time: levels[key].time })));
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_ESCALATION_MATRIX_FAILURE, error);
    }
};

const updateEscalationMatrix = async (escalationMatrixDetails, where) => {
    try {
        const escalationMatrix = new EscalationMatrix();
        const escalationLevels = new EscalationLevels();
        const data = await escalationMatrix.update(escalationMatrixDetails, where);
        const { levels } = escalationMatrixDetails;
        const levelDetails = { newLevels: [], updateLevels: [], deleteLevels: [] };
        levels.forEach((level, index) => {
            if (level.isNew) {
                levelDetails.newLevels.push({ to: level.to, cc: level.cc, time: level.time, level: index, escalationId: escalationMatrixDetails.id });
            } else if (level.isDeleted) {
                levelDetails.deleteLevels.push(level.id);
            } else {
                levelDetails.updateLevels.push({ data: level, where: { id: level.id } });
            }
        });
        await Promise.all([
            levelDetails.deleteLevels.length ? escalationLevels.forceDelete({ id: levelDetails.deleteLevels }) : null,
            levelDetails.newLevels.length ? escalationLevels.bulkCreate(levelDetails.newLevels) : null,
            levelDetails.updateLevels.map((detail) => escalationLevels.update(detail.data, detail.where))
        ]);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ESCALATION_MATRIX_UPDATE_FAILURE, error);
    }
};

const getAllEscalationMatrix = async () => {
    try {
        const escalationMatrix = new EscalationMatrix();
        let escalationMatrixData = await escalationMatrix.findAndCountAll(undefined, undefined, true);
        // Cannot use Promise.all as it will hamper with the escalationLevels table in finding the correct records
        const escalationIds = escalationMatrixData.rows.map((row) => row.id);
        const escalationLevels = new EscalationLevels({ sort: ["level", "asc"] });
        const escalationLevelsData = await escalationLevels.findAll({ escalationId: escalationIds });
        escalationMatrixData = JSON.parse(JSON.stringify(escalationMatrixData));
        escalationMatrixData.rows.forEach((data) => {
            const { id } = data;
            const levels = escalationLevelsData.filter((levelData) => levelData.escalationId === id);
            data.levels = levels;
        });
        return escalationMatrixData;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_ESCALATION_MATRIX_LIST_FAILURE, error);
    }
};

const deleteEscalationMatrix = async (where) => {
    try {
        const escalationMatrix = new EscalationMatrix();
        const escalationLevels = new EscalationLevels();
        await escalationLevels.forceDelete({ escalationId: where.id });
        const data = await escalationMatrix.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_ESCALATION_MATRIX_FAILURE, error);
    }
};

module.exports = {
    escalationMatrixAlreadyExists,
    hasExistingRecords,
    getEscalationMatrixByCondition,
    createEscalationMatrix,
    updateEscalationMatrix,
    getAllEscalationMatrix,
    deleteEscalationMatrix
};
