const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateAllMasterColumnsListSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "name",
        statusMessage.ALL_MASTER_COLUMNS_NAME_NOT_FOUND,
        statusMessage.ALL_MASTER_COLUMNS_NAME_LENGTH
    )
];

module.exports = {
    validateAllMasterColumnsListSaveOrUpdate
};
