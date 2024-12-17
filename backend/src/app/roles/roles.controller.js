const { Op } = require("sequelize");
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const roleService = require("./roles.service");
const { giveFormDefaultPermissionsAfterRoleCreate } = require("../access-management/access-management.controller");
// const { deleteRolesPermissions } = require("../access-management/access-management.service");
const filterMapping = {
    name: "name",
    description: "description",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create roles
 * @param { object } req.body
 * @returns { object } data
 */
const createRole = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ROLE_DETAILS);
    const isRoleExists = await roleService.RoleAlreadyExists({ name: req.body.name, projectId: req.body.projectId });
    throwIf(isRoleExists, statusCodes.DUPLICATE, statusMessages.ROLE_ALREADY_EXIST);
    const data = await roleService.createRole(req.body);
    await giveFormDefaultPermissionsAfterRoleCreate(data);
    return { data };
};

/**
 * Method to update roles
 * @param { object } req.body
 * @returns { object } data
 */

const updateRole = async (req) => {
    const roleId = req.params.id;
    const roleDetails = req.body;
    /** Check if role already exists for the specified projectId */
    // eslint-disable-next-line max-len
    const isRoleExists = await roleService.RoleAlreadyExists({ [Op.and]: [{ [Op.and]: [{ name: roleDetails.name }, { projectId: roleDetails.projectId }] }, { id: { [Op.ne]: roleId } }] });
    throwIf(isRoleExists, statusCodes.DUPLICATE, statusMessages.ROLE_ALREADY_EXIST);
    /** Continue with the update if role does not exist */
    const data = await roleService.updateRole(roleDetails, { id: roleId });
    return { data };
};

/**
 * Method to get roles details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getRoleDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ROLE_ID_REQUIRED);
    const data = await roleService.getRoleByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all roles
 * @param { object } req.body
 * @returns { object } data
 */
const getAllRoles = async (req) => {
    const { projectId } = req.query;
    const condition = {};
    if (projectId) condition.projectId = projectId;
    const data = await roleService.getAllRoles(condition);
    return { data };
};

const getRolesHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.ROLE_ID_REQUIRED);
    const data = await roleService.getRoleHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to delete roles by roles id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteRole = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ROLE_ID_REQUIRED);
    // await deleteRolesPermissions(req.params.id);
    const data = await roleService.deleteRole({ id: req.params.id });
    return { data };
};

const getAllRoleByDropdown = async (req) => {
    const { accessors, searchString, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};

    const condition = {
        [Op.and]: []
    };

    if (searchString && searchString.length > 0) {
        let accessorArray = accessors ? JSON.parse(accessors) : [];
        const elementsToRemove = ["createdAt", "updatedAt"];
        accessorArray = accessorArray.filter((item) => !elementsToRemove.includes(item));
        const headers = Object.fromEntries(accessorArray.map((accessor) => [accessor.includes(".") ? `$${accessor}$` : accessor, ""]));
        const orConditions = Object.keys(headers).map((header) => ({ [header]: { [Op.iLike]: `%${searchString}%` } }));
        condition[Op.and].push({ [Op.or]: orConditions });
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

    if (req.params.id) {
        condition[Op.and].push({ projectId: req.params.id });
    }
    const data = await roleService.getAllRoleByDropdown(condition);
    return { data };
};

module.exports = {
    createRole,
    updateRole,
    getRoleDetails,
    getRolesHistory,
    getAllRoles,
    deleteRole,
    getAllRoleByDropdown
};
