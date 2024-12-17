/* eslint-disable max-len */
const { Op } = require("sequelize");
const { throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const { getUserByCondition, getAllUsers } = require("../users/users.service");
const {
    getUserDefinedMastersList, getAllMastersListByCondition
} = require("../all-masters-list/all-masters-list.service");
const accessService = require("./access-management.service");
const {
    deleteExistingUserMasterPermissions,
    getUserMasterPermissionByCondition
} = require("../user-master-permissions/user-master-permissions.service");
const {
    deleteExistingUserColumnsPermissions,
    createUserMasterColumnPermission
} = require("../user-master-column-permission/user-master-column-permission.service");
const {
    getMasterTableName
} = require("../all-masters-list/all-masters-list.service");
const { getAllProjects } = require("../projects/projects.service");
const { getAllMaterial } = require("../materials/materials.service");
const { getAllOrganizationsForAccess } = require("../organizations/organizations.service");
const { getAccessedOrganizationStoreLocations, getAllOrganizationStoreLocations } = require("../organization-store-locations/organization-store-locations.service");
const { getAllAccessedOrganizationStores } = require("../organization-stores/organization-stores.service");
const { getHierarchicalData } = require("../gaa-level-entries/gaa-level-entries.service");
const { getAllFormIds, getChildDataOfFormTypes } = require("../forms/forms.service");
const { getActiveInactiveRecords } = require("../form-attributes/form-attributes.service");
const { getGaaForAccess } = require("../gaa-hierarchies/gaa-hierarchies.service");
const { getRoleIds } = require("../roles/roles.service");
const { getAllLovByMasterName, getMasterMakerLovByCondition } = require("../master-maker-lovs/master-maker-lovs.service");
const { deleteExistingRoleMasterPermissions } = require("../role-master-permissions/role-master-permissions.service");
const Forms = require("../../database/operation/forms");
const { MASTER_MAKERS } = require("../../config/contants");

const tableName = {
    projects: "projects",
    materials: "materials",
    networkLevel: "network_hierarchies",
    gaaLevel: "gaa_hierarchies",
    form: "Form Configurator",
    formResponses: "Form Responses",
    reports: "Reports"
};

const organization = ["Supplier", "Contractor", "Company", "Customer", "Firm Location", "Company Location"]; // organizationTypeId
const organizationStore = ["Company Store", "Contractor Store", "Customer Store", "Supplier Repair Center"]; // organizationType
const organizationStoreLocation = ["Contractor Store Location", "Company Store Location"]; // organizationType

/**
 * Method to create all masters list
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMastersByUserId = async (req) => {
    const { userId: id } = req.params;
    const userExists = await getUserByCondition({ id });
    // if true then user else it is a role
    const isUser = !!userExists;
    const getUserDefinedMaster = await getUserDefinedMastersList({ parentId: null, id: { [Op.notIn]: ["2bfda55d-d007-4c75-b696-5ee05ef1ec66", "63dfdba2-8bbc-40ea-a934-f38e44d0d2ca", "02cc1fdc-0c8b-4cf9-9977-34fed65601e7", "a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb"] } }, ["id", "name", "visibleName", "rank", "parentId", "grandParentId", "masterRoute"]);
    const objectsWithChild = await Promise.all(getUserDefinedMaster.map(accessService.getUserDefinedMasterWithChild));
    const allData = await Promise.all(objectsWithChild.map(accessService.getUserDefinedMasterWithSubChild));
    const data = await accessService.getGovernedData(id, allData, isUser);
    return { data };
};

const governUserMenus = async (req) => {
    const { userId, menuArray, roleId } = req.body;
    if (roleId && roleId !== null) {
        await deleteExistingRoleMasterPermissions({ roleId });
        if (menuArray) {
            await accessService.saveRoleMenus(roleId, menuArray);
        }
        await accessService.updateUsersPermissionAsPerRole(roleId, menuArray);
    } else if (userId && userId !== null) {
        await deleteExistingUserMasterPermissions({ userId });
        if (menuArray) {
            await accessService.saveUserMenus(userId, menuArray);
        }
    }
    
    return { message: statusMessages.MENUS_GOVERNED_SUCCESS };
};

const governUserRows = async (req) => {
    const { roleId, userId, masterId } = req.body;

    if (roleId && roleId !== null) {
        const data = await accessService.governRoleRows(req.body);
        if (data?.isLocation) {
            await accessService.governLocationsForUsers(req.body);
        } else {
            await accessService.goverUserRowsAsPerRole(roleId, masterId);
        }
    } else if (userId && userId !== null) {
        await accessService.governUserRows(req.body);
    }

    return { message: statusMessages.LOV_GOVERNED_SUCCESS };
};

const governUserColumns = async (req) => {
    const { userId: id, masterId, columnsArray } = req.body;
    const userExists = await getUserByCondition({ id });
    throwIfNot(
        userExists,
        statusCodes.NOT_FOUND,
        statusMessages.USER_NOT_EXIST
    );
    const checkIfUserHasMasterAccess = await getUserMasterPermissionByCondition(
        { userId: id, masterId: masterId }
    );
    throwIfNot(
        checkIfUserHasMasterAccess,
        statusCodes.UNAUTHORIZED,
        statusMessages.NO_MASTER_PERMISSION_TO_GOVERN_COLUMNS
    );
    await deleteExistingUserColumnsPermissions({ userId: id, masterId: masterId });
    if (columnsArray && columnsArray.length > 0) {
        await createUserMasterColumnPermission(req.body);
    }
    return { message: statusMessages.COLUMNS_GOVERNED_SUCCESS };
};

// get lovs data for the access management table
const getAllLov = async (req) => {
    const { userId: id, masterId, organizationTypeId, organizationType } = req.params;
    const userExists = await getUserByCondition({ id });
    // if true then user else it is a role
    const isUser = !!userExists;

    const masterTableInfo = await getMasterTableName({ id: masterId });
    let lovData, data;
    if (masterTableInfo) {
        const { name, visibleName } = masterTableInfo;
        if (masterId === "a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb") {
            const { rows } = await getAllAccessedOrganizationStores({ organizationType });
            lovData = rows;
        } else if (organizationTypeId && organization.includes(visibleName)) {
            const { rows } = await getAllOrganizationsForAccess({ organizationTypeId });
            lovData = rows;
        } else if (organizationType && organizationStoreLocation.includes(visibleName)) {
            const { rows } = await getAccessedOrganizationStoreLocations({ organizationType });
            lovData = rows;
        } else if (organizationType && organizationStore.includes(visibleName)) {
            const { rows } = await getAllAccessedOrganizationStores({ organizationType });
            lovData = rows;
        } else if (name !== null && name === tableName.projects) {
            const { rows } = await getAllProjects({}, true);
            lovData = rows;
        } else if (name !== null && name === tableName.materials) {
            const { rows } = await getAllMaterial(true);
            lovData = rows;
        } else if (name !== null && name === tableName.gaaLevel) {
            const projectId = organizationTypeId;
            const data = await getGaaForAccess({ projectId, rank: "1", levelType: "gaa" }, true);
            const map = data.flatMap((obj) => obj.id);
            lovData = await getHierarchicalData({ gaaHierarchyId: map });
        } else if ((name === null && visibleName === tableName.form) || (masterId === "65b01aaf-46ab-468c-b6bd-4fa72a2f089a" && visibleName === tableName.formResponses) || (masterId === "8b682419-3d70-4c52-b229-c82b5559aec8" && visibleName === tableName.reports)) {
            const formHierarchyData = await getAllLovByMasterName({ id: MASTER_MAKERS.FORM_TYPES }, false, true);
            const projectId = organizationTypeId;
            const childData = await getChildDataOfFormTypes(formHierarchyData, projectId);
            lovData = childData;
        }
        data = await accessService.getGovernedLovsData(id, masterId, lovData, isUser);
    } else {
        let { rows } = await getAllOrganizationStoreLocations({ organizationType: organizationTypeId, organizationStoreId: masterId });
        rows = JSON.parse(JSON.stringify(rows));
        const { name } = await getMasterMakerLovByCondition({ id: organizationTypeId });
        let masterName;
        if (name === "COMPANY") masterName = "Company Store Location";
        if (name === "CONTRACTOR") masterName = "Contractor Store Location";
        const { id: master } = await getAllMastersListByCondition({ visibleName: masterName });
        lovData = rows;
        data = await accessService.getGovernedLovsData(id, master, lovData, isUser);
    }
    return { data, count: data?.length };
};

// ============================ Column level Access =============================== //

const createDefaultPermissionPayloads = async (roleId, formId, formAttributeArray) => {
    const data = await accessService.createColumnDefaultPermission(roleId, formId);
    
    return formAttributeArray?.map((columnId) => ({
        roleId,
        formId,
        columnId: columnId.id,
        roleDefaultPermissionId: data.id
    }));
};

const createUserDefaultPermissionPayload = async (roleId, userId, formId, formAttributeArray) => {
    const data = await accessService.createUserColumnDefaultPermission({ roleId, userId, formId });
    const object = JSON.parse(JSON.stringify(data));
    const { id: userDefaultPermissionId, view, add, update } = object;
    return formAttributeArray?.map((columnId) => ({
        roleId,
        userId,
        formId,
        columnId: columnId.id,
        userDefaultPermissionId,
        view,
        add,
        update
    }));
};

// when role is created then all the permissions for the role for particular form will be false always 
const giveFormDefaultPermissionsAfterRoleCreate = async (roleData) => {
    const { id: roleId, projectId } = roleData;
    const findAllForms = await getAllFormIds({ projectId, isPublished: true });
    if (findAllForms && findAllForms?.length > 0) {
        await Promise.all(findAllForms.map(async ({ id }) => {
            const formAttributeArray = await getActiveInactiveRecords({ formId: id }, undefined, true);
            const defaultPermissionPayloads = await createDefaultPermissionPayloads(roleId, id, formAttributeArray.rows);
            await accessService.createColumnWisePermissions(defaultPermissionPayloads);
        }));
    }
};

// when form is created all the permissions of the users and the roles will be false always
const giveDefautltPermissionsAfterFormCreated = async (data) => {
    const { id: formId, projectId } = data;
    const getAllRoles = await getRoleIds({ projectId });
    const formAttributeArray = await getActiveInactiveRecords({ formId }, undefined, true);
    if (getAllRoles && getAllRoles?.length > 0) {
        await Promise.all(getAllRoles?.map(async ({ id }) => {
            const defaultPermissionPayloads = await createDefaultPermissionPayloads(id, formId, formAttributeArray.rows);
            await accessService.createColumnWisePermissions(defaultPermissionPayloads);
            const { rows } = await getAllUsers({ roleId: id }, false);
            if (rows && rows?.length > 0) {
                await Promise.all(
                    rows.map(async (obj) => {
                        const userDefaultPermissionPayload = await createUserDefaultPermissionPayload(id, obj.id, formId, formAttributeArray.rows);
                        await accessService.createUserColumnWisePermissions(userDefaultPermissionPayload);
                    })
                );
            }
        }));
    }
    
};

const addNewColumnDefaultPermissions = async (formData, columnData) => {
    const { id: formId, projectId } = formData;
    const getAllRoles = await getRoleIds({ projectId });
    if (getAllRoles && getAllRoles?.length > 0) {
        await Promise.all(getAllRoles.map(async ({ id }) => {
            const getDefaultPermission = await accessService.getDefaultPermission(formId, id, columnData);
            if (getDefaultPermission && getDefaultPermission?.length > 0) {
                await accessService.createColumnWisePermissions(getDefaultPermission);
            }
            const { rows } = await getAllUsers({ roleId: id }, false); // changed true to false;
            if (rows && rows?.length > 0) {
                await Promise.all(
                    rows.map(async (obj) => {
                        const userDefaultPermissionPayload = await accessService.getUserDefaultPermission(id, obj.id, formId, columnData);
                        if (userDefaultPermissionPayload && userDefaultPermissionPayload?.length > 0) {
                            await accessService.createUserColumnWisePermissions(userDefaultPermissionPayload);
                        }
                    })
                );
            }
        }));
    }
};

const getFormWithRoles = async (req) => {
    const { formId } = req.query;
    const data = await accessService.getAllRoleDefaultPermissions(formId);
    return { data };
};

// when clicked on any role
const getFormWithUsersByRole = async (req) => {
    const { formId, roleId } = req.query;
    const data = await accessService.getAllUserDefaultPermissions({ formId, roleId });
    return { data };
};

// updating the permissions when clicked
const updateRoleColumnPermissions = async (req) => {
    const { formId, roleId, notColumnId, isL1L2, addColumnId, ...restData } = req.body;
    if (!isL1L2) accessService.updateRoleDefaultPermissions(restData, { roleId, formId });
    accessService.updateRoleColumnWisePermissions(restData, {
        formId,
        roleId,
        columnId: {
            [Op.notIn]: notColumnId || [],
            [Op.in]: addColumnId || []
        }
    });
    if (!isL1L2) accessService.updateUserDefaultPermissions(restData, { roleId, formId });
    accessService.updateUserColumnWisePermissions(restData, {
        formId,
        roleId,
        columnId: {
            [Op.notIn]: notColumnId || [],
            [Op.in]: addColumnId || []
        }
    });
};

const updateRoleColumnWisePermissions = async (req) => {
    const { formId, roleId, columnId, ...restData } = req.body;
    accessService.updateRoleColumnWisePermissions(restData, { formId, roleId, columnId });
    accessService.updateUserColumnWisePermissions(restData, { formId, roleId, columnId });
};

const updateUserColumnPermissions = async (req) => {
    const { formId, roleId, userId, isL1L2, notColumnId, addColumnId, ...restData } = req.body;
    if (!isL1L2) accessService.updateUserDefaultPermissions(restData, { roleId, formId, userId });
    accessService.updateUserColumnWisePermissions(restData, {
        formId,
        roleId,
        userId,
        columnId: {
            [Op.notIn]: notColumnId || [],
            [Op.in]: addColumnId || []
        }
    });
};

const updateUserColumnWisePermissions = async (req) => {
    const { formId, roleId, columnId, userId, ...restData } = req.body;
    accessService.updateUserColumnWisePermissions(restData, { formId, roleId, columnId, userId });
};

// ================ sending users with accessed forms for work area allocation ==================== //
const getUsersWithFormAccess = async (req) => {
    const { organizationId } = req.query;
    const condition = {};
    if (organizationId) condition.oraganizationId = organizationId;
    const data = await getAllUsers(condition, false);
    const getAccessedFormData = await getFormData(JSON.parse(JSON.stringify(data))?.rows);
    return { data: JSON.parse(JSON.stringify(getAccessedFormData)), count: JSON.parse(JSON.stringify(getAccessedFormData))?.length };
};

const getFormData = async (data) => {
    const promises = data.map(async (obj) => {
        const formsInstance = new Forms();
        const projectLovData = await accessService.getUserGovernedLovArray(obj?.id, "Project");
        const lovData = await accessService.getUserGovernedLovArray(obj?.id, "Form Configurator");
        if (lovData === true || projectLovData === true) return {};
        const formData = await formsInstance.findAll({ id: lovData, projectId: projectLovData }, ["id", "name"], false, true, undefined, true);
        const forms = formData.length > 0 ? formData.flatMap((x) => x?.name) : [];
        return { ...obj, forms };
    });

    const results = await Promise.all(promises);
    const filteredResults = results.filter((result) => Object.keys(result).length > 0);

    return filteredResults;
};

const getProjectWiseForms = async (req) => {
    const { rows } = await getAllProjects({}, true, ["id", "name"], false);
    const formHierarchyData = await getAllLovByMasterName({ id: MASTER_MAKERS.FORM_TYPES }, false, true);
    const data = await Promise.all(rows?.map(async (obj) => {
        const childData = await getChildDataOfFormTypes(formHierarchyData, obj.id);
        if (childData.length > 0) {
            return { ...obj, child: childData };
        }
        return null;
    }));
    
    const filteredData = data.filter((obj) => obj !== null);

    return { data: filteredData };
};

module.exports = {
    getAllMastersByUserId,
    governUserMenus,
    governUserRows,
    governUserColumns,
    getAllLov,
    giveFormDefaultPermissionsAfterRoleCreate,
    giveDefautltPermissionsAfterFormCreated,
    addNewColumnDefaultPermissions,
    getUsersWithFormAccess,
    getFormWithRoles,
    updateRoleColumnPermissions,
    updateRoleColumnWisePermissions,
    updateUserColumnPermissions,
    updateUserColumnWisePermissions,
    getFormWithUsersByRole,
    getProjectWiseForms
};