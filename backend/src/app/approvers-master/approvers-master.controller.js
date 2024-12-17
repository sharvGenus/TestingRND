/* eslint-disable max-len */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const approverService = require("./approvers-master.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");

const mapping = {
    "project.name": "project.name",
    "transaction_type.name": "transaction_type.name",
    "organization.name": "organization.name",
    "organization_store.name": "organization_store.name",
    "user.name": "user.name",
    "approver.email": "email",
    "approver.mobile_number": "mobileNumber"
};

const filterMapping = {
    projectName: "$project.name$",
    transactionType: "$transaction_type.name$",
    orgName: "$organization.name$",
    orgStoreName: "$organization_store.name$",
    name: "$user.name$",
    email: "email",
    mobileNumber: "mobileNumber"
};

/**
 * Method to create approver
 * @param { object } req.body
 * @returns { object } data
 */
const createApprover = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_APPROVER_DETAILS);
    throwIfNot(req.body.approvers, statusCodes.BAD_REQUEST, statusMessages.MISSING_APPROVER_DETAILS);
    const approvers = req.body?.approvers;
    for await (const approver of approvers) {
        const isApproverExists = await approverService.approverExists({ projectId: req.body.projectId,
            transactionTypeId: req.body.transactionTypeId,
            storeId: req.body.storeId,
            isActive: "1",
            email: approver.email });
        throwIf(isApproverExists, statusCodes.DUPLICATE, statusMessages.APPROVER_ALREADY_EXIST);
        approver.projectId = req.body.projectId;
        approver.transactionTypeId = req.body.transactionTypeId;
        approver.organizationTypeId = req.body.organizationTypeId;
        approver.organizationNameId = req.body.organizationNameId;
        approver.storeId = req.body.storeId;
        if (approver.email) {
            approver.email = approver.email.toLowerCase();
        }
        await approverService.createApprover(approver);
    }
    return { message: statusMessages.APPROVERS_CREATED };
};

/**
 * Method to update Approver
 * @param { object } req.body
 * @returns { object } data
 */
const updateApprover = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_APPROVER_DETAILS);
    const isApproverExists = await approverService.approverAlreadyExists({ id: req.params.id });
    throwIfNot(isApproverExists, statusCodes.DUPLICATE, statusMessages.APPROVER_NOT_EXIST);
    if (req.body && req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const data = await approverService.updateApprover(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get all approvers
 * @param { object } req.body
 * @returns { object } data
 */
const getAllApprovers = async (req) => {
    const { searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};

    const condition = {
        [Op.and]: []
    };

    if (searchString && searchString.length > 0) {
        const accessorArray = accessors ? JSON.parse(accessors) : [];
        const keysInArray = getMappingKeysInArray(accessorArray, mapping);
        const castingConditions = [];
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
    const data = await approverService.getAllApprovers(condition);
    return { data };
};

/**
 * Method to delete approver by approver id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteApprover = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.APPROVER_ID_REQUIRED);
    const data = await approverService.deleteApprover({ id: req.params.id });
    const [, [deleteData]] = data;
    const value = await approverService.getAllApproversByCondition({
        projectId: deleteData.projectId,
        transactionTypeId: deleteData.transactionTypeId,
        storeId: deleteData.storeId,
        isActive: "1",
        rank: {
            [Op.gt]: deleteData.rank
        }
    });
    const updateRank = await Promise.all(value.rows.map(async (x) => {
        const updateRankValue = await approverService.updateApprover({ ...x, rank: x.rank - 1 }, { id: x.id });
        return updateRankValue;
    }));
    return { data, updateRank };
};

/**
 * Method to get all Approvers
 * @param { object } req.body
 * @returns { object } data
 */
const getAllApproversByCondition = async (req) => {
    const { transactionTypeId, projectId, storeId } = req.params;
    const where = { transactionTypeId, projectId };
    if (storeId && storeId !== "null") {
        where.storeId = storeId;
    }
    const data = await approverService.getAllApproversByCondition(where);
    return { data };
};

/**
 * Method to update approvers
 * @param { object } req.body
 * @returns { object } data
 */
const updateApprovers = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_APPROVER_DETAILS);
    throwIfNot(req.body.approvers, statusCodes.BAD_REQUEST, statusMessages.MISSING_APPROVER_DETAILS);
    const approvers = req.body?.approvers;
    let result;
    for await (const approver of approvers) {
        const isApproverExists = await approverService.approverAlreadyExists({ id: approver.id });
        throwIfNot(isApproverExists, statusCodes.DUPLICATE, statusMessages.APPROVER_NOT_EXIST);
        approver.projectId = req.body.projectId;
        approver.transactionTypeId = req.body.transactionTypeId;
        approver.storeId = req.body.storeId;
        approver.organizationTypeId = req.body.organizationTypeId;
        approver.organizationNameId = req.body.organizationNameId;
        if (approver.email) {
            approver.email = approver.email.toLowerCase();
        }
        result = await approverService.updateApprover(approver, { id: approver.id });
    }
    return result;
};

module.exports = {
    createApprover,
    getAllApprovers,
    updateApprover,
    deleteApprover,
    getAllApproversByCondition,
    updateApprovers
};
