const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const billingSubmissionService = require("./billing-submissions.service");
const { generateRandomString } = require("../../utilities/common-utils");
const { processFileTasks } = require("../files/files.service");

/**
 * Method to create Bill Submission
 * @param { object } req.body
 * @returns { object } data
 */
const createBillSubmission = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CITY_DETAILS);
    // const isBillSubmissionExists = await billingSubmissionService.billingDetailsAlreadyExists({ code: req.body.code });
    // throwIf(isBillSubmissionExists, statusCodes.DUPLICATE, statusMessages.CITY_ALREADY_EXIST);

    const billNumber = generateRandomString(10);
    if (!req.body.billNumber) {
        req.body.billNumber = `Bill${billNumber}`;
    }
    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/Organizations/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }
    const data = await billingSubmissionService.createBillingDetails(req.body);
    return { data };
};

/**
 * Method to update Bill Submission
 * @param { object } req.body
 * @returns { object } data
 */
const updateBillSubmission = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CITY_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CITY_DETAILS);
    const isBillSubmissionExists = await billingSubmissionService.billingDetailsAlreadyExists({ id: req.params.id });
    throwIfNot(isBillSubmissionExists, statusCodes.DUPLICATE, statusMessages.CITY_NOT_EXIST);
    const data = await billingSubmissionService.updateBillingDetails(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get Bill Submission details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getBillSubmissionDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CITY_ID_REQUIRED);
    const data = await billingSubmissionService.getBillingDetailByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all Bill Submissions
 * @param { object } req.body
 * @returns { object } data
 */
const getAllBillSubmissions = async (req) => {
    const { projectId } = req.query;
    const data = await billingSubmissionService.getAllBillingDetails({ projectId });
    return { data };
};

/**
 * Method to get all Bill Material Submissions
 * @param { object } req.body
 * @returns { object } data
 */
const getAllBillMaterialDeatils = async (req) => {
    const { billingBasicDetailId } = req.query;
    const data = await billingSubmissionService.getAllBillingMaterialDetails({ billingBasicDetailId });
    return { data };
};

/**
 * Method to delete Bill Submission by Bill Submission id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteBillSubmission = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CITY_ID_REQUIRED);
    const data = await billingSubmissionService.deleteBillingDetail({ id: req.params.id });
    return { data };
};

module.exports = {
    createBillSubmission,
    updateBillSubmission,
    getBillSubmissionDetails,
    getAllBillSubmissions,
    deleteBillSubmission,
    getAllBillMaterialDeatils
};
