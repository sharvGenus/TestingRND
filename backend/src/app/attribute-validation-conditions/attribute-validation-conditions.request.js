const { ATTRIBUTE_VALIDATION_CONDITION_OPERATOR_KEY_NOT_FOUND } = require("../../config/status-message");
const { validateIfEmpty } = require("../../utilities/request-validation");

const validateAttributeValidationConditionSaveOrUpdate = () => [
    validateIfEmpty(
        "operatorKey",
        ATTRIBUTE_VALIDATION_CONDITION_OPERATOR_KEY_NOT_FOUND
    )
];

module.exports = {
    validateAttributeValidationConditionSaveOrUpdate
};
