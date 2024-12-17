/* eslint-disable max-len */
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const customerDepartmentsService = require("./customer-departments.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "customer_departments.name": "name",
    "customer_departments.code": "code",
    "updated.name": "updated.name",
    "created.name": "created.name",
    "organization.name": "organization.name"
};

const filterMapping = {
    orgId: "$organization.name$",
    name: "name",
    code: "code",
    integrationId: "integrationId",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create CustomerDepartments
 * @param { object } req.body
 * @returns { object } data
 */
const createCustomerDepartments = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CUSTOMER_DEPARTMENT_DETAILS);
    // Check if the name already exists
    const isNameExists = await customerDepartmentsService.checkCustomerDepartmentsDataExist({ name: req.body.name, customerId: req.body.customerId });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DEPARTMENT_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await customerDepartmentsService.checkCustomerDepartmentsDataExist({ code: req.body.code, customerId: req.body.customerId });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DEPARTMENT_ALREADY_EXIST);
    const data = await customerDepartmentsService.createCustomerDepartments(req.body);
    return { data };
};

/**
 * Method to update CustomerDepartments
 * @param { object } req.body
 * @returns { object } data
 */
const updateCustomerDepartments = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_DEPARTMENT_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_CUSTOMER_DEPARTMENT_DETAILS);
    const CustomerDepartmentsDetails = await customerDepartmentsService.checkCustomerDepartmentsDataExist({ id: req.params.id });
    throwIfNot(CustomerDepartmentsDetails, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DEPARTMENT_NOT_EXIST);
    // Check if the name already exists
    const isNameExists = await customerDepartmentsService.checkCustomerDepartmentsDataExist({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, customerId: req.body.customerId }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DEPARTMENT_ALREADY_EXIST);
    // Check if the code already exists
    const isCodeExists = await customerDepartmentsService.checkCustomerDepartmentsDataExist({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, customerId: req.body.customerId }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.CUSTOMER_DEPARTMENT_ALREADY_EXIST);
    const data = await customerDepartmentsService.updateCustomerDepartments(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get CustomerDepartments details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getCustomerDepartmentsDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_DEPARTMENT_ID_REQUIRED);
    const data = await customerDepartmentsService.getCustomerDepartmentsByCondition({ id: req.params.id });
    return { data };
};

const getCustomerDepartmentsHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_DEPARTMENT_ID_REQUIRED);
    const data = await customerDepartmentsService.getCustomerDepartmentHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get all CustomerDepartments
 * @param { object } req.body
 * @returns { object } data
 */
const getAllCustomerDepartments = async (req) => {
    const data = await customerDepartmentsService.getAllCustomerDepartments();
    return { data };
};
/** Get customer department by customerId */
const getAllCustomerDepartmentsByCustomerId = async (req) => {
    const { customerId, searchString, accessors, filterObject } = req.query;
    let filterString = filterObject ? JSON.parse(filterObject) : {};
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

    filterString = JSON.parse(filterString);
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

    if (customerId) {
        condition[Op.and].push({ customerId });
    }
    const data = await customerDepartmentsService.getAllCustomerDepartmentsByCustomerId(condition);
    return { data };
};

/**
 * Method to delete CustomerDepartments by CustomerDepartments id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteCustomerDepartments = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.CUSTOMER_DEPARTMENT_ID_REQUIRED);
    const data = await customerDepartmentsService.deleteCustomerDepartments({ id: req.params.id });
    return { data };
};

const getAllCustomerDepartmentByDropdown = async (req) => {
    const data = await customerDepartmentsService.getAllCustomerDepartmentByDropdown({ customerId: req.params.customerId });
    return { data };
};

module.exports = {
    createCustomerDepartments,
    updateCustomerDepartments,
    getCustomerDepartmentsHistory,
    getCustomerDepartmentsDetails,
    getAllCustomerDepartments,
    deleteCustomerDepartments,
    getAllCustomerDepartmentByDropdown,
    getAllCustomerDepartmentsByCustomerId
};
