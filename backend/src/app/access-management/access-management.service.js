/* eslint-disable max-len */
const { Op } = require("sequelize");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const { getUserDefinedMastersList, getMasterTableName } = require("../all-masters-list/all-masters-list.service");
const { addKeyValuePairToObject } = require("../../utilities/common-utils");
const { getAllUserMasterPermissionByUserId, deleteExistingUserMasterPermissions } = require("../user-master-permissions/user-master-permissions.service");
const UserMasterPermissions = require("../../database/operation/user-master-permissions");
const { getUserMasterLovPermission, saveUserRows, deleteExistingUserLovPermissions, convertHierarchicalData } = require("../user-master-lov-permission/user-master-lov-permission.service");
const { getAllMastersListByCondition } = require("../all-masters-list/all-masters-list.service");
const RoleColumnDefaultPermissions = require("../../database/operation/role-column-default-permissions");
const RoleColumnWisePermissions = require("../../database/operation/role-column-wise-permissions");
const UserColumnDefaultPermissions = require("../../database/operation/user-column-default-permissions");
const UserColumnWisePermissions = require("../../database/operation/user-column-wise-permissions");
const { getOrganizationByPK, getAllAccessedOrganizationStores } = require("../organization-stores/organization-stores.service");
const { getByOrganisationStoreId } = require("../organization-store-locations/organization-store-locations.service");
const { createRoleMenuPermissions, getAllMasterPermissinsByRoleId, deleteExistingRoleMasterPermissions } = require("../role-master-permissions/role-master-permissions.service");
const { getUserByRoleId, updateUser } = require("../users/users.service");
const { createRolesMasterLovPermission, deleteRolesMasterLovPermission, getLovArrayOfMasterOfRole } = require("../role-master-lov-permissions/role-master-lov-permissions.service");
const { getAllFormIds } = require("../forms/forms.service");
const { checkIsSuperUser } = require("../authentications/authentications.controller");
const { getMasterMakerLovByCondition, getAllLovByMasterName } = require("../master-maker-lovs/master-maker-lovs.service");
const { MASTER_MAKERS } = require("../../config/contants");
const { getAllTicketsByCondition } = require("../tickets/tickets.service");
const { getAllProjectWiseTicketMapppingByCondition } = require("../ticket-mappings/ticket-mappings.service");

const getUserDefinedMasterWithSubChild = async (object) => {
    const { child } = object;
    const opNotIn = ["61d59298-6e39-4d67-8ab0-1ad08e9389c3", "404be7eb-f5a2-4859-90a8-e95bb13f7f36", "da20e568-7290-4f92-bd55-67333a9d86ff"];
    const selectedCols = ["id", "name", "visibleName", "rank", "parentId", "grandParentId", "masterRoute"];
    if (child.length > 0) {
        const data = await Promise.all(
            child.map(async (obj) => {
                const { id: parentId } = obj;
                const grandParentId = object.id;
                let subChildData = await getUserDefinedMastersList(
                    { grandParentId: grandParentId, parentId: parentId, id: { [Op.notIn]: opNotIn } },
                    selectedCols
                );

                subChildData = await Promise.all(subChildData.map(async (subChild) => {
                    const grandChildData = await getUserDefinedMastersList(
                        { grandParentId: parentId, parentId: subChild.id, id: { [Op.notIn]: opNotIn } },
                        selectedCols
                    );

                    return {
                        ...subChild,
                        subChild: grandChildData
                    };
                }));
                return { ...obj, child: subChildData };
            })
        );
        return { ...object, child: data };
    } else {
        return object;
    }
};

const getUserDefinedMasterWithChild = async (obj) => {
    const { id } = obj;
    const array = await getUserDefinedMastersList({ parentId: id }, ["id", "name", "visibleName", "rank", "parentId", "grandParentId", "masterRoute"]);
    return { ...obj, child: array };
};

const saveUserMenus = async (userId, menuData) => {
    try {
        const userMasterPermissions = new UserMasterPermissions();
        const requiredObject = addKeyValuePairToObject(menuData, "userId", userId);
        const data = await userMasterPermissions.bulkCreate(requiredObject);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_GOVERN_MENUS, error);
    }
};

const saveRoleMenus = async (roleId, menuData) => {
    try {
        const requiredObject = addKeyValuePairToObject(menuData, "roleId", roleId);
        const data = await createRoleMenuPermissions(requiredObject);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_GOVERN_MENUS, error);
    }
};

const getGovernedData = async (userId, data, isUser) => {
    let governedData;
    const isSuperUser = isUser ? await checkIsSuperUser(userId) : false;
    if (isSuperUser && isUser) {
        governedData = addIsAccessFlag(data, true);
        return governedData;
    }

    let getMenuPermissions;
    if (isUser) {
        getMenuPermissions = await getAllUserMasterPermissionByUserId({ userId });
    } else {
        // here userId is roleId , keeping one api for all work
        getMenuPermissions = await getAllMasterPermissinsByRoleId(userId);
    }

    if (getMenuPermissions.length > 0) {
        const masterIdArray = getMenuPermissions.map((obj) => obj.masterId);
        governedData = addPermissionAccessFlag(data, masterIdArray);
        return governedData;
    } else {
        governedData = addIsAccessFlag(data, false);
        return governedData;
    }
};

const getGovernedLovsData = async (userId, masterId, data, isUser) => {
    let governedData, getLovPermissionData;
    if (isUser) {
        getLovPermissionData = await getUserMasterLovPermission({ userId, masterId });
    } else {
        // here userId is roleId , keeping one api for all work
        getLovPermissionData = await getLovArrayOfMasterOfRole({ roleId: userId, masterId });
    }

    if (getLovPermissionData && getLovPermissionData.length > 0) {
        let lovIdArray = getLovPermissionData.flatMap((obj) => obj.lovArray);
        const rawData = JSON.parse(JSON.stringify(data));
        lovIdArray = Array.from(new Set(lovIdArray));
        governedData = addPermissionAccessFlag(rawData, lovIdArray);
        return governedData;
    }
    governedData = addIsAccessFlag(data, false);
    return governedData;

};

const governLocations = async (data) => {
    const { masterId: master, userId, lovArray, roleId } = data;
    const getAllStores = await getByOrganisationStoreId(master);
    const allLocations = getAllStores.map((obj) => obj.id);
    const { organizationType } = await getOrganizationByPK({ id: master });
    const { name } = await getMasterMakerLovByCondition({ id: organizationType });
    let masterName;
    if (name === "COMPANY") masterName = "Company Store Location";
    if (name === "CONTRACTOR") masterName = "Contractor Store Location";
    const { id: masterId } = await getAllMastersListByCondition({ visibleName: masterName });
    let getLovPermissionData;
    if (userId && userId !== null) {
        getLovPermissionData = await getUserMasterLovPermission({ userId, masterId });
    } else if (roleId && roleId !== null) {
        getLovPermissionData = await getLovArrayOfMasterOfRole({ roleId, masterId });
    }
    let lovIdArray = getLovPermissionData.flatMap((obj) => obj.lovArray);
    lovIdArray = lovIdArray.length > 0 ? Array.from(new Set(lovIdArray)) : [];
    const filteredLovIdArray = lovIdArray.filter((lovId) => !allLocations.includes(lovId));

    const mergedArray = filteredLovIdArray.concat(lovArray);

    if (userId && userId !== null) {
        await deleteExistingUserLovPermissions({ userId, masterId });
        await saveUserRows({ userId, masterId, lovArray: mergedArray });
    } else if (roleId && roleId !== null) {
        await deleteRolesMasterLovPermission({ roleId, masterId });
        await createRolesMasterLovPermission({ roleId, masterId, lovArray: mergedArray });
    }
};

const addPermissionAccessFlag = (data, accessArray) => {
    const accessSet = new Set(accessArray);
    const traverseData = (item) => {
        item.isAccess = accessSet.has(item.id);
        if (item.child && item.child.length > 0) {
            item.child.forEach(traverseData);
        }

        if (item.subChild && item.subChild.length > 0) {
            item.subChild.forEach(traverseData);
        }
    };
    data.forEach(traverseData);
    return data;
};

const addIsAccessFlag = (data, isAccess) => {
    if (!Array.isArray(data)) {
        return;
    }
    data.forEach((item) => {
        item.isAccess = isAccess;
        if (item.child && item.child.length > 0) {
            addIsAccessFlag(item.child, isAccess);
        }
        if (item.subChild && item.subChild.length > 0) {
            addIsAccessFlag(item.subChild, isAccess);
        }
    });
    return data;
};

const getUserGovernedLovArray = async (userId, masterName, isTickets = false) => {
    const isSuperUser = await checkIsSuperUser(userId);
    if (isSuperUser) {
        return true;
    }
    const { id } = await getAllMastersListByCondition({ visibleName: masterName,
        ...(masterName === "Form Responses" && { parentId: null, grandParentId: null }) });
    const getLovPermissionData = await getUserMasterLovPermission({ userId, masterId: id });
    let lovIdArray = getLovPermissionData.flatMap((obj) => obj.lovArray);
    lovIdArray = lovIdArray.length > 0 ? Array.from(new Set(lovIdArray)) : [];

    if (isTickets) {
        const getTickets = await getAllTicketsByCondition({ assigneeId: userId });
        const projectWiseMapping = [...new Set(getTickets?.map((x) => x.projectWiseMappingId))];
        const mappingData = await getAllProjectWiseTicketMapppingByCondition({ id: projectWiseMapping });
        const column = masterName === "Project" ? "projectId" : "forms";
        const array = mappingData?.map((obj) => obj[column]).flat();
        // removed set from here ....
        lovIdArray = array.length > 0 ? lovIdArray.concat(array) : lovIdArray;
    }
    return lovIdArray;
};

const getRoleGovernedLovArray = async (userId, masterName) => {
    const { id } = await getAllMastersListByCondition({ visibleName: masterName });
    const getLovPermissionData = await getLovArrayOfMasterOfRole({ roleId: userId, masterId: id });
    let lovIdArray = getLovPermissionData.flatMap((obj) => obj.lovArray);
    lovIdArray = lovIdArray.length > 0 ? Array.from(new Set(lovIdArray)) : [];
    return lovIdArray;
};

const goverRowForUserAfterCreate = async (userId, lovId, masterName) => {
    const isSuperUser = await checkIsSuperUser(userId);
    if (isSuperUser) {
        return true;
    }
    const { id } = await getAllMastersListByCondition({ visibleName: masterName });
    const getLovPermissionData = await getUserMasterLovPermission({ userId, masterId: id });
    let lovIdArray = getLovPermissionData.flatMap((obj) => obj.lovArray);
    lovIdArray = lovIdArray.length > 0 ? Array.from(new Set(lovIdArray)) : [];
    lovIdArray.push(lovId);
    const payload = {
        userId,
        masterId: id,
        lovArray: lovIdArray
    };
    await deleteExistingUserLovPermissions({ userId, masterId: id });
    await saveUserRows(payload);
};

const deleteGovernedLovAfterLovDelete = async (lovId, masterName) => {
    const { id } = await getAllMastersListByCondition({ visibleName: masterName });
    const getGovernedUsers = await getUserMasterLovPermission({ masterId: id });
    await Promise.all(
        getGovernedUsers?.map(async (obj) => {
            const { userId, masterId, lovArray } = obj;
            const newArray = lovArray.filter((item) => item !== lovId);
            const payload = {
                userId,
                masterId,
                lovArray: newArray
            };
            await deleteExistingUserLovPermissions({ userId, masterId: id });
            await saveUserRows(payload);
        })
    );
};

const createColumnDefaultPermission = async (roleId, formId) => {
    try {
        const roleColumnDefaultPermissions = new RoleColumnDefaultPermissions();
        const data = await roleColumnDefaultPermissions.create({ roleId, formId });
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ROLE_COLUMN_DEFAULT_PERMISSION_CREATE, error);
    }
};

const updateRoleDefaultPermissions = async (payload, where) => {
    try {
        const roleColumnDefaultPermissions = new RoleColumnDefaultPermissions();
        const data = await roleColumnDefaultPermissions.update(payload, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ROLE_COLUMN_DEFAULT_PERMISSION_UPDATE, error);
    }
};

const updateUserDefaultPermissions = async (payload, where) => {
    try {
        const userColumnDefaultPermissions = new UserColumnDefaultPermissions();
        const data = await userColumnDefaultPermissions.update(payload, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_COLUMN_DEFAULT_PERMISSION_UPDATE, error);
    }
};

const createUserColumnDefaultPermission = async (payload) => {
    try {
        const userColumnDefaultPermissions = new UserColumnDefaultPermissions();
        const data = await userColumnDefaultPermissions.create(payload);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_COLUMN_DEFAULT_PERMISSION_CREATE, error);
    }
};

const getAllRoleDefaultPermissions = async (formId) => {
    try {
        const roleColumnDefaultPermissions = new RoleColumnDefaultPermissions();
        const data = await roleColumnDefaultPermissions.findAll({ formId }, ["id", "view", "add", "update", "deleteRecord"], true, true, { order: [[roleColumnDefaultPermissions.db.sequelize.col("role_column_wise_permissions.form_attribute.rank"), "ASC"], [roleColumnDefaultPermissions.db.sequelize.col("role_column_wise_permissions.form_attribute.name"), "ASC"], ["createdAt", "DESC"]] }, false, true, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ROLE_COLUMN_DEFAULT_PERMISSION_FETCH, error);
    }
};

const deleteRoleColumnDefaultPermissions = async (where) => {
    try {
        const roleColumnDefaultPermissions = new RoleColumnDefaultPermissions();
        const data = await roleColumnDefaultPermissions.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ROLE_COLUMN_DEFAULT_PERMISSION_DELETE, error);
    }
};

const getAllUserDefaultPermissions = async (where) => {
    try {
        const userColumnDefaultPermissions = new UserColumnDefaultPermissions();
        const data = await userColumnDefaultPermissions.findAll(where, ["id", "view", "add", "update", "deleteRecord"], true, true, { order: [[userColumnDefaultPermissions.db.sequelize.col("user_column_wise_permissions.form_attribute.rank"), "ASC"], [userColumnDefaultPermissions.db.sequelize.col("user_column_wise_permissions.form_attribute.name"), "ASC"], ["createdAt", "DESC"]] }, false, true, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_COLUMN_DEFAULT_PERMISSION_FETCH, error);
    }
};

const deleteUserColumnDefaultPermissions = async (where) => {
    try {
        const userColumnDefaultPermissions = new UserColumnDefaultPermissions();
        const data = await userColumnDefaultPermissions.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_COLUMN_DEFAULT_PERMISSION_DELETE, error);
    }
};

const deleteUserColumnWisePermissions = async (where) => {
    try {
        const userColumnWisePermission = new UserColumnWisePermissions();
        const data = await userColumnWisePermission.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_COLUMN_WISE_PERMISSION_DELETE, error);
    }
};

const createColumnWisePermissions = async (payload) => {
    try {
        const roleColumnWisePermissions = new RoleColumnWisePermissions();
        const data = await roleColumnWisePermissions.bulkCreate(payload);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ROLE_COLUMN_WISE_PERMISSION_CREATE, error);
    }
};

const getUserColumnWisePermissions = async (formId, userId, isSuperUser) => {
    const userColumnWisePermission = new UserColumnWisePermissions();
    let data = [];
    if (!isSuperUser) {
        data = await userColumnWisePermission.findAll({ formId, userId, [Op.or]: [{ view: true }, { update: true }] }, ["columnId"], false, false, undefined, true);
        const columns = data.map((obj) => obj.columnId);
        return columns;
    }
    return true;
};

const deleteRoleColumnWisePermissions = async (where) => {
    try {
        const roleColumnWisePermissions = new RoleColumnWisePermissions();
        const data = await roleColumnWisePermissions.forceDelete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ROLE_COLUMN_WISE_PERMISSION_DELETE, error);
    }
};

const updateRoleColumnWisePermissions = async (payload, where) => {
    try {
        const roleColumnWisePermissions = new RoleColumnWisePermissions();
        const data = await roleColumnWisePermissions.update(payload, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_ROLE_COLUMN_WISE_PERMISSION_UPDATE, error);
    }
};

const updateUserColumnWisePermissions = async (payload, where) => {
    try {
        const userColumnWisePermissions = new UserColumnWisePermissions();
        const data = await userColumnWisePermissions.update(payload, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_COLUMN_WISE_PERMISSION_UPDATE, error);
    }
};

const createUserColumnWisePermissions = async (payload) => {
    try {
        const userColumnWisePermissions = new UserColumnWisePermissions();
        const data = await userColumnWisePermissions.bulkCreate(payload);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FAILED_USER_COLUMN_WISE_PERMISSION_CREATE, error);
    }
};

const updateDeletedColumnEntry = async (data) => {
    const roleColumnWisePermissions = new RoleColumnWisePermissions();
    await Promise.all(data.map(async (x) => {
        if (x.isActive == "0") {
            await roleColumnWisePermissions.forceDelete({ id: x.id });
        }
    }));
};

const updateUsersPermissionAsPerRole = async (roleId, menuArray) => {
    const findUser = await getUserByRoleId(roleId);
    if (findUser && findUser.length > 0) {
        await Promise.all(
            findUser.map(async ({ id }) => {
                await deleteExistingUserMasterPermissions({ userId: id });
                await saveUserMenus(id, menuArray);
            })
        );
    }
};

const governPermissions = async (roleId, userId) => {
    // governing side bar menus
    await governDeafaultMenus(roleId, userId);
    // governing rows of the roles
    await governDefaultRows(roleId, userId);
    // govern default form permissions
    await governDefaultFormPermissions(roleId, userId);
};

const governDeafaultMenus = async (roleId, userId) => {
    const getGovernedMenus = await getAllMasterPermissinsByRoleId(roleId);
    await deleteExistingUserMasterPermissions({ userId });
    if (getGovernedMenus && getGovernedMenus.length > 0) {
        await saveUserMenus(userId, getGovernedMenus);
    }
};

const governDefaultRows = async (roleId, userId) => {
    const getGovernedLov = await getLovArrayOfMasterOfRole({ roleId });
    if (getGovernedLov.length === 0) {
        await deleteExistingUserLovPermissions({ userId, masterId: { [Op.notIn]: ["d4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7", "85f62a22-57e2-4443-bdaa-800ddf95d460"] } });
    }
    await Promise.all(
        getGovernedLov?.map(async (obj) => {
            const { masterId, lovArray } = obj;
            await deleteExistingUserLovPermissions({ userId, masterId });
            await saveUserRows({ userId, masterId, lovArray });
        })
    );
};

const governDefaultFormPermissions = async (roleId, userId) => {
    try {
        const roleColumnDefaultPermissions = new RoleColumnDefaultPermissions();
        const roleColumnWisePermissions = new RoleColumnWisePermissions();
        // one role can have multiple forms so findAll
        const roleDefaultPermission = await roleColumnDefaultPermissions.findAll({ roleId }, undefined, false, false, undefined, true);
        if (roleDefaultPermission && roleDefaultPermission.length > 0) {
            await Promise.all(
                roleDefaultPermission.map(async (obj) => {
                    const defaultPaylod = {
                        roleId, userId, formId: obj.formId, view: obj.view, add: obj.add, update: obj.update, deleteRecord: obj.deleteRecord
                    };
                    let data = await createUserColumnDefaultPermission(defaultPaylod);
                    data = JSON.parse(JSON.stringify(data));
                    const roleColumnWisePermission = await roleColumnWisePermissions.findAll({ roleId, formId: obj.formId }, undefined, false, false, undefined, true);
                    if (roleColumnWisePermission && roleColumnWisePermission.length > 0) {
                        const payloadArray = roleColumnWisePermission.map((x) => ({
                            view: x.view,
                            add: x.add,
                            update: x.update,
                            userDefaultPermissionId: data.id,
                            userId,
                            roleId,
                            formId: data.formId,
                            columnId: x.columnId
                        }));
                        await createUserColumnWisePermissions(payloadArray);
                    }
                })
            );
        }
    } catch (error) {
        console.error(error);
    }
};

const governUserRows = async (requestData) => {
    const { masterId, lovArray, userId, storeOrgTypeId } = requestData;
    const masterTableInfo = await getMasterTableName({ id: masterId });
    if (masterTableInfo) {
        const { name, visibleName } = masterTableInfo;

        if (lovArray && visibleName !== "Form Configurator" && visibleName !== "Form Responses" && visibleName !== "Reports" && visibleName !== "View Stores") {
            if (name === "gaa_hierarchies") {
                await convertHierarchicalData(requestData);
            } else {
                await deleteExistingUserLovPermissions({ userId, masterId });
                await saveUserRows(requestData);
            }
        } else if (visibleName === "Form Configurator" || visibleName === "Form Responses" || visibleName === "Reports") {
            let formTypes = await getAllLovByMasterName({ id: MASTER_MAKERS.FORM_TYPES }, false, true);
            formTypes = formTypes?.map((obj) => obj.id);
            const lovIds = lovArray.map((obj) => obj.id);
            let allForms = await getAllFormIds({ projectId: requestData.projectId });
            allForms = allForms?.length > 0 ? allForms?.flatMap((x) => x.id) : [];
            const getLovPermissionData = await getUserMasterLovPermission({ userId, masterId });
            let lovIdArray = getLovPermissionData.length > 0 ? getLovPermissionData.flatMap((obj) => obj.lovArray) : [];
            lovIdArray = lovIdArray.length > 0 ? Array.from(new Set(lovIdArray)) : [];
            const filteredLovIdArray = lovIdArray?.filter((lovId) => !allForms?.includes(lovId));

            let mergedArray = filteredLovIdArray.concat(lovIds);
            mergedArray = mergedArray.filter((elem) => !formTypes.includes(elem));
            requestData.lovArray = mergedArray;
            await deleteExistingUserLovPermissions({ userId, masterId });
            await saveUserRows(requestData);
        } else if (visibleName === "View Stores") {
            const getLovPermissionData = await getUserMasterLovPermission({ userId, masterId });
            const lovIdArray = getLovPermissionData.length > 0 ? getLovPermissionData.flatMap((obj) => obj.lovArray) : [];
            const { rows } = await getAllAccessedOrganizationStores({ organizationType: storeOrgTypeId });
            const allIds = rows.map((val) => val.id);
            const leftLovIds = lovIdArray.filter((lovId) => !allIds.includes(lovId));
            const lovIdAry = leftLovIds.concat(lovArray);
            requestData.lovArray = lovIdAry;
            await deleteExistingUserLovPermissions({ userId, masterId });
            await saveUserRows(requestData);
        }
    } else {
        await governLocations(requestData);
    }

    return { message: statusMessages.LOV_GOVERNED_SUCCESS };
};

const governRoleRows = async (requestData, isRole) => {
    const { masterId, lovArray, roleId, storeOrgTypeId } = requestData;
    const masterTableInfo = await getMasterTableName({ id: masterId });
    let isLocation = false;
    if (masterTableInfo) {
        const { name, visibleName } = masterTableInfo;
        if (lovArray && visibleName !== "Form Configurator" && visibleName !== "Form Responses" && visibleName !== "Reports" && visibleName !== "View Stores") {
            if (name === "gaa_hierarchies") {
                await convertHierarchicalData(requestData);
            } else {
                await deleteRolesMasterLovPermission({ roleId, masterId });
                await createRolesMasterLovPermission(requestData);
            }
        } else if (visibleName === "Form Configurator" || visibleName === "Form Responses" || visibleName === "Reports") {
            let formTypes = await getAllLovByMasterName({ id: MASTER_MAKERS.FORM_TYPES }, false, true);
            formTypes = formTypes?.map((obj) => obj.id);
            const lovIds = lovArray?.map((obj) => obj.id);
            let allForms = await getAllFormIds({ projectId: requestData.projectId });
            allForms = allForms?.length > 0 ? allForms?.flatMap((x) => x.id) : [];
            const getLovPermissionData = await getLovArrayOfMasterOfRole({ roleId, masterId });
            let lovIdArray = getLovPermissionData.length > 0 ? getLovPermissionData.flatMap((obj) => obj.lovArray) : [];
            lovIdArray = lovIdArray.length > 0 ? Array.from(new Set(lovIdArray)) : [];
            const filteredLovIdArray = lovIdArray?.filter((lovId) => !allForms?.includes(lovId));

            let mergedArray = filteredLovIdArray.concat(lovIds);
            mergedArray = mergedArray.filter((elem) => !formTypes.includes(elem));
            requestData.lovArray = mergedArray;
            await deleteRolesMasterLovPermission({ roleId, masterId });
            await createRolesMasterLovPermission(requestData);
        } else if (visibleName === "View Stores") {
            const getLovPermissionData = await getLovArrayOfMasterOfRole({ roleId, masterId });
            const lovIdArray = getLovPermissionData.length > 0 ? getLovPermissionData.flatMap((obj) => obj.lovArray) : [];
            const { rows } = await getAllAccessedOrganizationStores({ organizationType: storeOrgTypeId });
            const allIds = rows.map((val) => val.id);
            const leftLovIds = lovIdArray.filter((lovId) => !allIds.includes(lovId));
            const lovIdAry = leftLovIds.concat(lovArray);
            requestData.lovArray = lovIdAry;
            await deleteRolesMasterLovPermission({ roleId, masterId });
            await createRolesMasterLovPermission(requestData);
        }
    } else {
        isLocation = true;
        await governLocations(requestData);
    }
    return { isLocation };
};

const goverUserRowsAsPerRole = async (roleId, masterId) => {
    const findUser = await getUserByRoleId(roleId);
    const data = await getLovArrayOfMasterOfRole({ roleId, masterId });
    const lovArray = data?.length > 0 ? data.flatMap((x) => x.lovArray) : [];
    if (findUser && findUser.length > 0) {
        findUser.forEach(async ({ id }) => {
            await deleteExistingUserLovPermissions({ userId: id, masterId });
            await saveUserRows({ userId: id, masterId, lovArray: [...lovArray] });
        });
    }
};

const governLocationsForUsers = async (requestedData) => {
    const { masterId: master, roleId } = requestedData;
    const { organizationType } = await getOrganizationByPK({ id: master });
    const { name } = await getMasterMakerLovByCondition({ id: organizationType });
    let masterName;
    if (name === "COMPANY") masterName = "Company Store Location";
    if (name === "CONTRACTOR") masterName = "Contractor Store Location";
    const { id: masterId } = await getAllMastersListByCondition({ visibleName: masterName });
    await goverUserRowsAsPerRole(roleId, masterId);
};

const getDefaultPermission = async (formId, roleId, columnData) => {
    const roleColumnDefaultPermissions = new RoleColumnDefaultPermissions();
    let data = await roleColumnDefaultPermissions.findOne({ roleId, formId });
    data = data ? JSON.parse(JSON.stringify(data)) : {};
    const column = JSON.parse(JSON.stringify(columnData));
    const extraL1s = ["is_resurvey", "resurveyor_org_type", "resurveyor_org_id", "resurvey_by"];
    const excludedColumnIds = column.filter((vl) => vl?.columnName?.startsWith("l_a")
                || extraL1s.includes(vl?.columnName)
                || vl?.columnName?.startsWith("l_b")).map((x) => x.id);
    if (Object.keys(data).length > 0) {
        return Promise.all(
            column?.map((columnId) => ({
                roleId,
                formId,
                columnId: columnId.id,
                roleDefaultPermissionId: data.id,
                view: excludedColumnIds.includes(columnId.id) ? false : data.view,
                add: excludedColumnIds.includes(columnId.id) ? false : data.add,
                update: excludedColumnIds.includes(columnId.id) ? false : data.update
            }))
        );
    }
    return [];
};

const getUserDefaultPermission = async (roleId, userId, formId, columnData) => {
    const userColumnDefaultPermissions = new UserColumnDefaultPermissions();
    let data = await userColumnDefaultPermissions.findOne({ userId, formId });
    data = data ? JSON.parse(JSON.stringify(data)) : {};
    const column = JSON.parse(JSON.stringify(columnData));
    const extraL1s = ["is_resurvey", "resurveyor_org_type", "resurveyor_org_id", "resurvey_by"];
    const excludedColumnIds = column.filter((vl) => vl?.columnName?.startsWith("l_a")
                || extraL1s.includes(vl?.columnName)
                || vl?.columnName?.startsWith("l_b")).map((x) => x.id);
    if (Object.keys(data).length > 0) {
        return Promise.all(
            column?.map((columnId) => ({
                roleId,
                userId,
                formId,
                columnId: columnId.id,
                userDefaultPermissionId: data.id,
                view: excludedColumnIds.includes(columnId.id) ? false : data.view,
                add: excludedColumnIds.includes(columnId.id) ? false : data.add,
                update: excludedColumnIds.includes(columnId.id) ? false : data.update
            }))
        );
    }
    return [];
};

const deletePermissions = async (condition) => {
    const userLovCondition = {
        ...condition,
        masterId: { [Op.notIn]: ["d4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7", "85f62a22-57e2-4443-bdaa-800ddf95d460"] }
    };
    // deleted menus
    await deleteExistingUserMasterPermissions(condition);
    // deleted lov permissions
    await deleteExistingUserLovPermissions(userLovCondition);
    // deleted form columnwise permissiong
    await deleteUserColumnWisePermissions(condition);
    // deleted form defult permissions
    await deleteUserColumnDefaultPermissions(condition);
};

const getColumnPermissionsData = async (formAttt, userId, formId, isSuperUser) => {
    const attributeData = JSON.parse(JSON.stringify(formAttt));
    const userColumnWisePermissions = new UserColumnWisePermissions();
    let object = {};
    if (isSuperUser) {
        attributeData.forEach((x) => {
            x.view = isSuperUser;
            x.update = isSuperUser;
        });
        object = attributeData;
    } else {
        const columnIds = attributeData?.map((obj) => obj.id);
        const columnIdObject = attributeData.reduce((pre, cur) => {
            pre[cur.id] = cur;
            return pre;
        }, {});
        let permissions = await userColumnWisePermissions.findAll({ userId, formId, columnId: columnIds }, ["columnId", "add", "update", "view", "deleteRecord"], false, undefined, true);
        permissions = JSON.parse(JSON.stringify(permissions));
        permissions.forEach(({ columnId, ...rest }) => {
            columnIdObject[columnId] = { ...columnIdObject[columnId], ...rest };
        });
        object = Object.values(columnIdObject);
    }
    return { object };
};

const deleteRolesPermissions = async (roleId) => {
    const findUser = await getUserByRoleId(roleId);
    if (findUser && findUser.length > 0) {
        findUser.forEach(async ({ id }) => {
            await updateUser({ roleId: null }, { id });
            await deleteExistingUserMasterPermissions({ userId: id });
            // deleted lov permissions
            await deleteExistingUserLovPermissions({ userId: id });
            // deleted form columnwise permissions
            await deleteUserColumnWisePermissions({ userId: id, roleId });
            // deleted form defult permissions
            await deleteUserColumnDefaultPermissions({ userId: id, roleId });
        });
    }
    await deleteRoleColumnWisePermissions({ roleId });
    await deleteUserColumnWisePermissions({ roleId });
    await deleteRoleColumnDefaultPermissions({ roleId });
    await deleteUserColumnDefaultPermissions({ roleId });
    await deleteExistingRoleMasterPermissions({ roleId });
    await deleteRolesMasterLovPermission({ roleId });
};

const getUserLovAccess = async (userId, types, isTicket) => Promise.all(types.map((type) => getUserGovernedLovArray(userId, type, isTicket)));

module.exports = {
    getUserDefinedMasterWithSubChild,
    getUserDefinedMasterWithChild,
    saveUserMenus,
    addPermissionAccessFlag,
    getGovernedData,
    getGovernedLovsData,
    getUserGovernedLovArray,
    goverRowForUserAfterCreate,
    createColumnDefaultPermission,
    createColumnWisePermissions,
    governLocations,
    saveRoleMenus,
    updateUsersPermissionAsPerRole,
    governPermissions,
    governUserRows,
    governRoleRows,
    goverUserRowsAsPerRole,
    updateDeletedColumnEntry,
    getDefaultPermission,
    getAllRoleDefaultPermissions,
    createUserColumnDefaultPermission,
    createUserColumnWisePermissions,
    getUserDefaultPermission,
    updateRoleDefaultPermissions,
    updateRoleColumnWisePermissions,
    updateUserDefaultPermissions,
    updateUserColumnWisePermissions,
    deleteGovernedLovAfterLovDelete,
    getAllUserDefaultPermissions,
    getRoleGovernedLovArray,
    governLocationsForUsers,
    getColumnPermissionsData,
    deleteRoleColumnDefaultPermissions,
    deleteUserColumnDefaultPermissions,
    deleteRoleColumnWisePermissions,
    deleteUserColumnWisePermissions,
    deletePermissions,
    deleteRolesPermissions,
    getUserColumnWisePermissions,
    getUserLovAccess
};
