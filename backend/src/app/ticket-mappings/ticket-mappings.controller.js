const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ticketMapppingService = require("./ticket-mappings.service");
const { getFormByCondition } = require("../forms/forms.service");

/**
 * Method to create form wise ticket mapping
 * @param { object } req.body
 * @returns { object } data
 */
const createFormWiseTicketMappping = async (req) => {
    const isFormWiseTicketMapppingExists = await ticketMapppingService.formWiseTicketMapppingAlreadyExists({ formId: req.body.formId });
    throwIf(isFormWiseTicketMapppingExists, statusCodes.DUPLICATE, statusMessages.FORM_WISE_TICKET_MAPPINGS_ALREADY_EXIST);
    const data = await ticketMapppingService.createFormWiseTicketMappping(req.body);
    return { data };
};

/**
 * Method to create project wise ticket mapping
 * @param { object } req.body
 * @returns { object } data
 */
const createProjectWiseTicketMappping = async (req) => {
    const isProjectWiseTicketMapppingExists = await ticketMapppingService.projectWiseTicketMapppingAlreadyExists({ projectId: req.body.projectId });
    throwIf(isProjectWiseTicketMapppingExists, statusCodes.DUPLICATE, statusMessages.PROJECT_WISE_TICKET_MAPPINGS_ALREADY_EXIST);
    const data = await ticketMapppingService.createProjectWiseTicketMappping(req.body);
    return { data };
};

/**
 * Method to update
 * @param { object } req.body
 * @returns { object } data
 */
const updateFormWiseTicketMapping = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORM_WISE_TICKET_MAPPINGS_ID_REQUIRED);
    const isFormWiseTicketMapppingExists = await ticketMapppingService.formWiseTicketMapppingAlreadyExists({ id: req.params.id });
    throwIfNot(isFormWiseTicketMapppingExists, statusCodes.DUPLICATE, statusMessages.FORM_WISE_TICKET_MAPPINGS_NOT_EXIST);
    const data = await ticketMapppingService.updateFormWiseTicketMappping(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to update
 * @param { object } req.body
 * @returns { object } data
 */
const updateProjectWiseTicketMapping = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_WISE_TICKET_MAPPINGS_ID_REQUIRED);
    const isProjectWiseTicketMapppingExists = await ticketMapppingService.projectWiseTicketMapppingAlreadyExists({ id: req.params.id });
    throwIfNot(isProjectWiseTicketMapppingExists, statusCodes.DUPLICATE, statusMessages.PROJECT_WISE_TICKET_MAPPINGS_NOT_EXIST);
    const data = await ticketMapppingService.updateProjectWiseTicketMappping(req.body, { id: req.params.id });
    return { data };
};

/** Method to get list of formWiseTicketMapping */
const getAllFormWiseTicketMapping = async (req) => {
    const data = await ticketMapppingService.getAllFormWiseTicketMappping();
    return { data };
};

/** Method to get list of projectiseTicketMapping */
const getAllProjectWiseTicketMapping = async (req) => {
    const { projectId } = req.query;
    const data = await ticketMapppingService.getAllProjectWiseTicketMappping(projectId ? { projectId } : {});
    return { data };
};
/**
 * Method to delete Project wise Ticket mapping by ID
 * @param { object } req.body
 * @returns { object } data
 */
const deleteProjectWiseTicketMapping = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_WISE_TICKET_MAPPING_ID_REQUIRED);
    const data = await ticketMapppingService.deleteProjectWiseTicketMapping({ id: req.params.id });
    return { data };
};

/**
 * Method to delete Form wise Ticket mapping by ID
 * @param { object } req.body
 * @returns { object } data
 */
const deleteFormWiseTicketMapping = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.FORM_WISE_TICKET_MAPPING_ID_REQUIRED);
    const data = await ticketMapppingService.deleteFormWiseTicketMapping({ id: req.params.id });
    return { data };
};

const getProjectWiseTicketMappingHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.PROJECT_WISE_TICKET_MAPPING_ID_REQUIRED);
    const data = await ticketMapppingService.getProjectWiseTicketMappingHistory({ recordId: req.params.recordId });
    return { data };
};
const getFormWiseTicketMappingHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.FORM_WISE_TICKET_MAPPING_ID_REQUIRED);
    const data = await ticketMapppingService.getFormWiseTicketMappingHistory({ recordId: req.params.recordId });
    return { data };
};

const getFormData = async (req) => {
    const { formId } = req.query;
    const { tableName } = await getFormByCondition({ id: formId });
    const data = await ticketMapppingService.getFormData(req.query, tableName, true, true);
    return { data };
};

module.exports = {
    createFormWiseTicketMappping,
    createProjectWiseTicketMappping,
    updateFormWiseTicketMapping,
    updateProjectWiseTicketMapping,
    deleteFormWiseTicketMapping,
    deleteProjectWiseTicketMapping,
    getAllFormWiseTicketMapping,
    getAllProjectWiseTicketMapping,
    getFormData,
    getProjectWiseTicketMappingHistory,
    getFormWiseTicketMappingHistory
};
