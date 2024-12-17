const { Op, Sequelize } = require("sequelize");
const { throwIf, throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const userService = require("./users.service");
const { exportToExcel, getReccurssiveObjectKeys } = require("../../utilities/common-utils");
const { governPermissions, deletePermissions } = require("../access-management/access-management.service");
// const { getSuperUserDetails } = require("../authentications/authentications.controller");
const Users = require("../../database/operation/users");
const { processFileTasks } = require("../files/files.service");

const filterMapping = {
    oraganizationTypeId: "$master_maker_lov.name$",
    oraganizationId: "$organization.name$",
    name: "name",
    code: "code",
    email: "email",
    mobileNumber: "mobileNumber",
    address: "address",
    countryId: "$city.state.country.name$",
    stateId: "$city.state.name$",
    cityId: "$city.name$",
    pincode: "pinCode",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$",
    appVersion: "app_version",
    wfmCode: "wfm_code",
    source: "source"
};

/**
 * Method to create user
 * @param { object } req.body
 * @returns { object } data
 */
const createUser = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_DETAILS);

    const isMobileNumberExists = await userService.userAlreadyExists({ mobileNumber: req.body.mobileNumber, isLocked: false, isActive: "1" });
    throwIf(isMobileNumberExists, statusCodes.DUPLICATE, statusMessages.MOBILE_NUMBER_ALREADY_EXIST);

    if (req.body.email) {
        const isEmailExists = await userService.userAlreadyExists({ email: { [Op.iLike]: req.body.email }, isLocked: false, isActive: "1" });
        throwIf(isEmailExists, statusCodes.DUPLICATE, statusMessages.EMAIL_ALREADY_EXIST);
    }

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/User/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    const totalUsers = await userService.countUsers();
    req.body.wfmCode = totalUsers + 11111;

    const data = await userService.createUser(req.body);
    return { data };
};

/**
 * Method to update user
 * @param { object } req.body
 * @returns { object } data
 */
const updateUser = async (req) => {
    const userId = req.params.id;
    const userDetails = req.body;
    // Check if email and mobile number already exist in the database
    if (userDetails.email) {
        // eslint-disable-next-line max-len
        const existingUserByEmail = await userService.userAlreadyExists({ [Op.and]: [{ email: { [Op.iLike]: userDetails.email } }, { id: { [Op.ne]: userId } }], isLocked: false, isActive: "1" });
        if (existingUserByEmail) {
            throwError(statusCodes.DUPLICATE, statusMessages.EMAIL_ALREADY_EXIST);
        }
    }

    if (userDetails.mobileNumber) {
        // eslint-disable-next-line max-len
        const existingUserByMobile = await userService.userAlreadyExists({ [Op.and]: [{ mobileNumber: userDetails.mobileNumber }, { id: { [Op.ne]: userId } }], isLocked: false, isActive: "1" });
        if (existingUserByMobile) {
            throwError(statusCodes.DUPLICATE, statusMessages.MOBILE_NUMBER_ALREADY_EXIST);
        }
    }

    if (req.body.attachments) {
        const processedArray = await processFileTasks({
            reqFiles: req.body.attachments,
            directory: `Masters/User/${req.body.name}/Attachments`
        });
        req.body.attachments = JSON.stringify(processedArray);
    }

    // Continue with the update if email and mobile are unique
    const userAlreadyExists = await userService.getUserByCondition({ id: userId }, undefined, undefined, false);
    throwIfNot(userAlreadyExists, statusCodes.NOT_FOUND, statusMessages.USER_NOT_EXIST);
    
    // if (userDetails.isLocked) {
    //     console.log("going in true");
    //     throwIfNot(false, statusCodes.HTTP_UNPROCESSABLE_ENTITY, statusMessages.USER_UNLOCK);
    // }
    // userDetails.isLocked = false;

    if (userDetails.isLocked !== userAlreadyExists.isLocked) {
        userDetails.status = userDetails.isLocked ? "cf9510a5-42a4-4931-8a40-a4876c8a49e5" : "2cce2d81-018c-4024-a54f-438600cd5513"
    }
    delete userDetails.wfmCode;
    delete userDetails.wfm_code;
    const data = await userService.updateUser(userDetails, { id: userId });
    return { data };
};

/**
 * Method to get user details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getUserDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.USER_ID_REQUIRED);
    const data = await userService.getUserByCondition({ id: req.params.id });
    return { data };
};

const getUsersHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.USER_ID_REQUIRED);
    const data = await userService.getUserHistory({ recordId: req.params.recordId });
    return { data };
};

/** Get user by organization id or role id if not providing any of them then return users list data */
const getAllUsers = async (req) => {
    const { db } = new Users();
    const { roleId, lockType, organizationId: oraganizationId, organisationBranchId, supervision, projectId, searchString, accessors, filterObject, hasAccess } = req.query;
    const { isSuperUser } = req.user;
    const showAllUsers = isSuperUser || hasAccess === "true";
    const filterString = filterObject ? JSON.parse(filterObject) : {};

    const condition = {
        [Op.and]: []
    };

    if (lockType !== undefined) {
        condition[Op.and].push({ isLocked: lockType != 1 });
    }

    if (searchString && searchString.length > 0) {
        let accessorArray = accessors ? JSON.parse(accessors) : [];
        const elementsToRemove = ["id", "oraganizationType", "oraganizationId", "dateOfOnboarding", "isActive", "createdAt", "updatedAt"];
        accessorArray = accessorArray.filter((item) => !elementsToRemove.includes(item));
        const headers = Object.fromEntries(accessorArray.map((accessor) => [accessor.includes(".") ? `$${accessor}$` : accessor, ""]));
        const orConditions = Object.keys(headers).map((header) => {
            if (header === "wfmCode") {
                return Sequelize.where(Sequelize.cast(Sequelize.col("users.wfm_code"), "TEXT"), { [Op.iLike]: `%${searchString}%` });
            } else {
                return { [header]: { [Op.iLike]: `%${searchString}%` } };
            }
        });
        // "organisationBranch"."name"
        if (searchString.includes("-") && accessors.includes("organization.name")) {
            const splitData = searchString.split("-");
            const organizationConditions = {
                [Op.and]: [
                    { "$organization.name$": { [Op.iLike]: `%${splitData[0]}%` } },
                    { "$organization.code$": { [Op.iLike]: `%${splitData[1]}%` } }
                ]
            };

            orConditions.push(organizationConditions);
        }

        if (searchString.includes("-") && accessors.includes("organisationBranch.name")) {
            const splitData = searchString.split("-");
            const organizationConditions = {
                [Op.and]: [
                    { "$organisationBranch.name$": { [Op.iLike]: `%${splitData[0]}%` } },
                    { "$organisationBranch.code$": { [Op.iLike]: `%${splitData[1]}%` } }
                ]
            };

            orConditions.push(organizationConditions);
        }

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

    if (oraganizationId) {
        condition[Op.and].push({ oraganizationId });
    } else if (organisationBranchId) {
        condition[Op.and].push({ organisationBranchId });
    }

    if (roleId) {
        condition[Op.and].push({ roleId });
    }

    if (supervision === "false") {
        condition[Op.and].push({ supervisorId: null });
    }

    if (supervision === "true") {
        condition[Op.and].push({ supervisorId: { [Op.not]: null } });
    }

    if (!oraganizationId && !organisationBranchId && !showAllUsers) {
        const { oraganizationId: orgId } = await userService.getUserById(req.user.userId);
        condition[Op.and].push({ oraganizationId: orgId });
    }
    1;
    if (projectId) {
        const query = `SELECT user_id FROM user_master_lov_permission WHERE lov_array && ARRAY['${Array.isArray(projectId) ? projectId.join("', '") : projectId}']::UUID[] AND master_id = '434473cb-b66d-4462-8eb1-6c47389695e7'`;
        const projectData = await db.sequelize.selectQuery(query);
        const usersOfProjects = projectData[0]?.map((obj) => obj.user_id) || [];
        condition[Op.and].push({ id: usersOfProjects });
    }

    const data = await userService.getUsersByOrganizationAndRole(condition);
    return { data };
};

/**
 * Method to delete user by user id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteUser = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.USER_ID_REQUIRED);
    const data = await userService.deleteUserWithStatusUpdate({ status: req.params.status }, { id: req.params.id });
    return { data };
};

/**
 * Method to check user exits
 * @param { object } req.body
 * @returns { object } data
 */
const checkUserExist = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_DETAILS);
    const { value } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    if (emailRegex.test(value)) {
        const data = await userService.checkUserExist({ email: { [Op.iLike]: value } }, "email");
        throwIfNot(data.isDataAvailable, statusCodes.NOT_FOUND, statusMessages.MISSING_USER_DETAILS);
        delete data.isDataAvailable;
        return { data };
    } else if (mobileRegex.test(value)) {
        const data = await userService.checkUserExist({ mobileNumber: value }, "mobileNumber");
        throwIfNot(data.isDataAvailable, statusCodes.NOT_FOUND, statusMessages.MISSING_USER_DETAILS);
        delete data.isDataAvailable;
        return { data };
    } else {
        throwError(statusCodes.NOT_FOUND, statusMessages.INVALID_DETAILS);
    }
};

const getAllSupervisors = async (req) => {
    const { db } = new Users();
    const { projectId, organizationId } = req.query;
    const getSuperUsersId = await userService.getAllSuperUsersId({ supervisorId: { [Op.not]: null } }, ["supervisorId"], false);
    let arrayOfIds = getSuperUsersId.map((obj) => obj.supervisorId);
    const condition = {};
    if (projectId) {
        const convertedString = projectId.map((item) => `'${item}'`).join(",");
        const query = `SELECT user_id FROM user_master_lov_permission WHERE lov_array && ARRAY[${convertedString}]::UUID[] AND master_id = '434473cb-b66d-4462-8eb1-6c47389695e7'`;
        const projectData = await db.sequelize.selectQuery(query);
        let usersOfProjects = [];
        if (projectData[0] && projectData[0]?.length > 0) {
            usersOfProjects = projectData[0].map((obj) => obj.user_id);
        }
        arrayOfIds = arrayOfIds.filter((elem) => usersOfProjects.includes(elem));
        condition.id = arrayOfIds;
    }
    if (organizationId) {
        if (Array.isArray(organizationId)) {
            condition.oraganizationId = { [Op.in]: organizationId };
        } else {
            condition.oraganizationId = organizationId;
        }
    }
    const data = await userService.getAllUsers(condition);
    return { data };
};

const getUsersByStorePermissions = async (req) => {
    const { db } = new Users();
    // const { projectStoreId, contractorStoreId } = req.query;
    const { contractorStoreId } = req.query;
    // const projectSiteQuery = `SELECT user_id, lov_array FROM user_master_lov_permission WHERE lov_array && ARRAY['${projectStoreId}']::UUID[] AND master_id = 'c5fe7300-7256-4738-b84b-3bcd3dbb9a65'`;

    const contractorSiteQuery = `SELECT user_id, lov_array FROM user_master_lov_permission WHERE lov_array && ARRAY['${contractorStoreId}']::UUID[] AND master_id = '62568519-0974-459f-9a65-c3df82950433'`;

    // const companyData = await db.sequelize.selectQuery(projectSiteQuery);
    const contractorData = await db.sequelize.selectQuery(contractorSiteQuery);
    // let usersOfCompany = [];
    let usersOfContractor = [];
    // if (companyData[0] && companyData[0]?.length > 0) {
    //     usersOfCompany = companyData[0].map((obj) => obj.user_id);
    // }

    if (contractorData[0] && contractorData[0]?.length > 0) {
        usersOfContractor = contractorData[0].map((obj) => obj.user_id);
    }
    // const users = [...usersOfCompany, ...usersOfContractor];
    const users = [...usersOfContractor];
    const userId = Array.from(new Set(users));
    const data = await userService.getAllUsers({ id: userId, oraganizationType: "decb6c57-6d85-4f83-9cc2-50e0630003df" }, true, ["id", "name", "authorizedUser", "code"], true);
    return { data };
};

const exportUsers = async (req, res) => {
    // const { filterQuery } = req.query;
    const condition = {};
    const { isSuperUser } = req.user;
    if (!isSuperUser) {
        const { oraganizationId: orgId } = await userService.getUserById(req.user.userId);
        condition.oraganizationId = orgId;
    }

    const { rows } = await userService.getAllUsers(condition, true);
    const { requiredObject } = req.body;
    const excelData = rows.map((row) => {
        const newRow = {};
        for (const [key, value] of Object.entries(requiredObject)) {
            if (key.includes(".") && Object.hasOwnProperty.call(row, key.split(".")[0])) {
                newRow[value] = getReccurssiveObjectKeys(row, key);
            } else if (Object.hasOwnProperty.call(row, key)) {
                newRow[value] = row[key];
            }
        }
        return newRow;
    });

    const headers = Object.values(requiredObject);
    return exportToExcel(headers, excelData, res);
};

const updateUsersRoles = async (req) => {
    const { userId, roleId, organizationId: oraganizationId, organizationTypeId: oraganizationType } = req.body;
    const { rows } = await userService.getAllUsers({ roleId, oraganizationId, oraganizationType }, true, ["id"], false);
    const existingUsersWithRole = rows?.map((obj) => obj.id);
    const newUserIds = userId?.filter((item) => !existingUsersWithRole?.includes(item));
    if (newUserIds.length > 0) {
        const updatePromises = newUserIds.map(async (elem) => {
            await userService.updateUser({ roleId }, { id: elem });
            await deletePermissions({ userId: elem });
            await governPermissions(roleId, elem);
        });
        await Promise.all(updatePromises);
    }

    const removedUser = existingUsersWithRole?.filter((item) => !userId.includes(item));
    if (removedUser.length > 0) {
        const updateNull = removedUser.map(async (elem) => {
            await userService.updateUser({ roleId: null }, { id: elem });
            await deletePermissions({ userId: elem });
        });
        await Promise.all(updateNull);
    }

    return { message: statusMessages.ROLE_ADDED_SUCCESS };
};

const toggleLock = async (req) => {
    const { id } = req.params;
    const data = await userService.toggleLock(id);
    return data;
};

module.exports = {
    createUser,
    updateUser,
    getUserDetails,
    getUsersHistory,
    getAllUsers,
    deleteUser,
    checkUserExist,
    getAllSupervisors,
    exportUsers,
    getUsersByStorePermissions,
    updateUsersRoles,
    toggleLock
};
