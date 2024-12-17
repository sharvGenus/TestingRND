const { body } = require("express-validator");
const statusMessage = require("../../config/status-message");
const requestValidation = require("../../utilities/request-validation");

const validateApproverSaveOrUpdate = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "organizationNameId",
        statusMessage.ORGANIZATION_ID_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "organizationTypeId",
        statusMessage.ORGANIZATION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "storeId",
        statusMessage.STORE_ID_REQUIRED
    )
];

const validateApproversArray = () => [
    body("approvers")
        .isArray()
        .withMessage("Invalid data format. Expected an array.")
        .custom((value) => {
            for (const obj of value) {
                if (!obj.userId
          || !obj.email
          || !obj.mobileNumber
                ) {
                    throw new Error("Invalid data format.");
                }
            }
            return true;
        })
];

const validateApproverUpdate = () => [
    requestValidation.validateIfEmpty(
        "transactionTypeId",
        statusMessage.TRANSACTION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "projectId",
        statusMessage.PROJECT_ID_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "organizationNameId",
        statusMessage.ORGANIZATION_NAME_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "organizationTypeId",
        statusMessage.ORGANIZATION_TYPE_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "userId",
        statusMessage.USER_NAME_NOT_FOUND,
        statusMessage.USER_NAME_LENGTH
    ),
    requestValidation.validateIfEmailId("email"),
    requestValidation.validateIfEmpty(
        "mobileNumber",
        statusMessage.MOBILE_NUMBER_REQUIRED
    ),
    requestValidation.validateIfEmpty(
        "effectiveFrom",
        statusMessage.EFFECTIVE_FROM_NOT_FOUND
    ),
    requestValidation.validateIfEmpty(
        "storeId",
        statusMessage.STORE_ID_REQUIRED
    )
];

module.exports = {
    validateApproverSaveOrUpdate,
    validateApproversArray,
    validateApproverUpdate
};
