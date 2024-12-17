const { ATTRIBUTE_VISIBILITY_CONDITION_OPERATOR_KEY_NOT_FOUND } = require("../../config/status-message");
const { validateIfEmpty } = require("../../utilities/request-validation");

const validateAttributeVisibilityConditionSaveOrUpdate = () => [
    validateIfEmpty(
        "operatorKey",
        ATTRIBUTE_VISIBILITY_CONDITION_OPERATOR_KEY_NOT_FOUND
    )
];

module.exports = {
    validateAttributeVisibilityConditionSaveOrUpdate
};
