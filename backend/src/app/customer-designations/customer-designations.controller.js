/* eslint-disable max-len */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const customerDesignationsService = require("./customer-designations.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "customer_designations.name": "name",
    "customer_designations.code": "code",
    "updated.name": "updated.name",
    "created.name": "created.name",
    "customer_department.organization.name": "customer_department.organization.name",
    "customer_department.name": "customer_department.name"
};

const filterMapping = {
    name: "name",
    code: "code",
    integrationId: "integrationId",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create CustomerDesignations
 * @param { object } req.body
 * @returns { object } data
 */
const createCustomerDesignations = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CUSTOMER_DESIGNATION_DETAILS);
    // Check if the name already exists
    const isNameExists = await customerDesignationsService.checkCustomerDesignationsDataExist({ name: req.body.name, customerDepartmentId: req.body.customerDepartmentId });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DESIGNATION_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await customerDesignationsService.checkCustomerDesignationsDataExist({ code: req.body.code, customerDepartmentId: req.body.customerDepartmentId });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DESIGNATION_ALREADY_EXIST);
    const data = await customerDesignationsService.createCustomerDesignations(req.body);
    return { data };
};

/**
 * Method to update CustomerDesignations
 * @param { object } req.body
 * @returns { object } data
 */
const updateCustomerDesignations = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_DESIGNATION_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CUSTOMER_DESIGNATION_DETAILS);
    const CustomerDesignationsDetails = await customerDesignationsService.checkCustomerDesignationsDataExist({ id: req.params.id });
    throwIfNot(CustomerDesignationsDetails, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DEPARTMENT_NOT_EXIST);
    // Check if the name already exists
    const isNameExists = await customerDesignationsService.checkCustomerDesignationsDataExist({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, customerDepartmentId: req.body.customerDepartmentId }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DESIGNATION_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await customerDesignationsService.checkCustomerDesignationsDataExist({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, customerDepartmentId: req.body.customerDepartmentId }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DESIGNATION_ALREADY_EXIST);
    const data = await customerDesignationsService.updateCustomerDesignations(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get CustomerDesignations details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getCustomerDesignationsDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_DESIGNATION_ID_REQUIRED);
    const data = await customerDesignationsService.getCustomerDesignationsByCondition({ id: req.params.id });
    return { data };
};

const getCustomerDesignationsHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_DESIGNATION_ID_REQUIRED);
    const data = await customerDesignationsService.getCustomerDesignationHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get all CustomerDesignations
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCustomerDesignations = async (req) => {
    const data = await customerDesignationsService.getAllCustomerDesignations();
    return { data };
};

/** Get customer designation by customerDepartmentId */
const getAllCustomerDesignationsByCustomerDepartmentId = async (req) => {
    const { customerDepartmentId, searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const condition = {
        [Op.and]: []
    };

    if (searchString && searchString.length > 0) {
        const accessorArray = accessors ? JSON.parse(accessors) : [];
        const keysInArray = getMappingKeysInArray(accessorArray, mapping);

        const castingConditions = [];

        // Loop through the columns you want to search on
        keysInArray.forEach((column) => {
            castingConditions.push([
                sequelize.where(
                    sequelize.cast(sequelize.col(column), "varchar"),
                    { [Op.iLike]: `%${searchString}%` }
                )
            ]);
        });

        // Create an OR condition for all columns
        const orConditions = { [Op.or]: castingConditions };
        condition[Op.and].push(orConditions);
    }

    if (filterString && Object.keys(filterString).length > 0) {
        for (const key in filterString) {
            if (filterMapping[key]) {
                const mappedKey = filterMapping[key];
                const filterValue = filterString[key];
                // Perform the mapping based on the filterMapping and add to the condition
                const mappedCondition = {
                    [mappedKey]: filterValue
                };
                condition[Op.and].push(mappedCondition);
            }
        }
    }

    if (customerDepartmentId) {
        condition[Op.and].push({ customerDepartmentId });
    }
    const data = await customerDesignationsService.getAllCustomerDesignationsByCustomerDepartmentId(condition);
    return { data };
};

/**
 * Method to delete CustomerDesignations by CustomerDesignations id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteCustomerDesignations = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_DEPARTMENT_ID_REQUIRED);
    const data = await customerDesignationsService.deleteCustomerDesignations({ id: req.params.id });
    return { data };
};

module.exports = {
    createCustomerDesignations,
    getCustomerDesignationsHistory,
    updateCustomerDesignations,
    getCustomerDesignationsDetails,
    getAllCustomerDesignations,
    deleteCustomerDesignations,
    getAllCustomerDesignationsByCustomerDepartmentId
};
