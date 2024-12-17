/* eslint-disable max-len */
require("dotenv").config();
const path = require("path");
const fs = require("node:fs");
const { default: axios } = require("axios");
const { Op, BaseError } = require("sequelize");

const { throwIfNot, throwError, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const userService = require("../users/users.service");
const Projects = require("../../database/operation/projects");
const authService = require("./authentications.service");
const UserSessoins = require("../../database/operation/user-sessions");
const { Encryption } = require("../../services/encryption.service");
const { TokenService } = require("../../services/token.service");
const { BadRequestError } = require("../../services/error-class");
const { getAllProjectMasterMakerLovsByMasterId } = require("../project-master-maker-lovs/project-master-maker-lovs.service");
const { getProjectMasterMakerByCondition } = require("../project-master-makers/project-master-makers.service");
const { sendMail } = require("../../config/email-config");
const {
    smtpConfigurationByConditionWithPassword
} = require("../smtp-configurations/smtp-configurations.service");
const { getWorkAreaAssignment } = require("../work-area-assignment/work-area-assignment.service");
const SupervisorAssignments = require("../../database/operation/supervisor-assignments");
const Users = require("../../database/operation/users");
const FormAttribute = require("../../database/operation/form-attributes");

const SENDER_FOR_RESET_PASSWORD = "it.support@genus.in";

/**
 * Method to get all states
 * @param { object } req.body
 * @returns { object } data
 */

const getGoogleKeys = async (req) => {
    const data = {
        secretKey: process.env.GOOGLE_CAPTCHA_SECRET_KEY,
        siteKey: process.env.GOOGLE_CAPTCHA_SITE_KEY
    };
    return { data };
};

const getSuperUserId = () => {
    const data = process.env.IS_SUPERUSER_ID || "577b8900-b333-42d0-b7fb-347abc3f0b5c";
    return data;
};

// these are super user role details
const getSuperUserDetails = () => {
    const data = { id: "a89c1591-ed87-40e5-b89b-e409d647e3e5", name: "SuperUser" };
    return data;
};

const checkIsSuperUser = async (userId) => {
    let getUser = await userService.getUserByCondition({ id: userId });
    getUser = JSON.parse(JSON.stringify(getUser));
    const superUser = getSuperUserDetails();
    if (getUser?.role?.name === superUser.name && getUser?.role?.id === superUser.id) return true;
    return false;
};

const verifyForgotPasswordOtp = async (req) => {
    const { otp: fpOtp, secretToken } = req.body;
    const tokenData = TokenService.verifyToken(secretToken);
    const otpValidity = 10 * 60000;
    if (tokenData.fpIat + otpValidity > Date.now()) {
        if (fpOtp === tokenData.fpOtp) {
            const userDetails = await userService.getUserByCondition(
                { id: tokenData.id },
                false
            );
            const tempToken = await authService.generateAppToken(
                userDetails.id
            );

            // return a valid token usable for reset password
            return { data: { token: tempToken } };
        }
        throw new BadRequestError("Invalid OTP");
    }
    throw new BadRequestError("OTP Expired");
};

const getEmailTemplate = () => {
    const templatePath = path.join(
        global.rootDir,
        "/src/config/templates/email-forgot-password-otp-template.txt"
    );
    const emailTemplate = fs.readFileSync(templatePath, "utf-8");

    return emailTemplate;
};

const forgotPassword = async (req) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const { secret: googleCaptchaToken, username } = req.body;

    throwIfNot(googleCaptchaToken, statusCodes.BAD_REQUEST, statusMessages.SECRET_IS_MISSING);

    let whereCondition = {};
    if (emailRegex.test(username)) {
        whereCondition = {
            email: username
        };
    } else if (mobileRegex.test(username)) {
        whereCondition = {
            mobileNumber: username
        };
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_DETAILS);
    }

    const userDetails = await userService.getUserByCondition(
        whereCondition,
        false
    );
    throwIfNot(
        userDetails,
        statusCodes.NOT_FOUND,
        statusMessages.USER_NOT_FOUND
    );

    const token = await sendOtpAndGetToken(
        userDetails.id,
        userDetails.email,
        "email"
    );

    return { data: { token } };
};

function generateOTP(length = 4) {
    const randomNumber = +Math.random().toFixed(length - 1);
    if ([0, 1].includes(randomNumber)) return generateOTP(length);
    const min = 10 ** (length - 1);
    const range = min * 9;
    const otp = Math.floor(min + randomNumber * range);
    return otp.toString();
}

const sendOtpAndGetToken = async (id, numberOrEmail, type, hashCode = "") => {
    const isEmail = type === "email";
    let otp, templatePath, template, config, data, status, emailTemplate, smtpDetails, password, smtpConfiguration, emailOptions, mailResp, isSent;

    // Generate OTP
    if (isEmail) {
        // Generate 6 digit OTP
        otp = generateOTP(6);
    } else if (["9999999999", "7777777777"].includes(numberOrEmail)) {
        otp = "1234";
    } else {
        // Generate a 4 digit OTP
        otp = generateOTP();
    }
    console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [authentications.controller.js] | [#149] | [otp] | `, otp);
    // Issue token
    let tokenData;

    if (isEmail) {
        tokenData = { id, email: numberOrEmail, fpIat: Date.now(), fpOtp: otp };
    } else {
        tokenData = { id, number: numberOrEmail, iat: Date.now(), otp };
    }

    const token = TokenService.issueToken(tokenData);

    if (isEmail) {
        // Email OTP
        emailTemplate = getEmailTemplate();
        const emailBody = emailTemplate.replace("{{OTP}}", otp);

        throwIfNot(SENDER_FOR_RESET_PASSWORD, statusCodes.INTERNAL_ERROR, statusMessages.RESET_PASSWORD_NOT_CONFIGURED);

        // SMTP Configuration
        smtpDetails = await smtpConfigurationByConditionWithPassword({
            username: SENDER_FOR_RESET_PASSWORD,
            isActive: "1"
        });
        throwIfNot(
            smtpDetails
            && ["server", "port", "encryption", "username", "password", "salt"].every(
                (key) => smtpDetails[key]
            ),
            statusCodes.INTERNAL_ERROR,
            statusMessages.RESET_PASSWORD_NOT_CONFIGURED
        );

        password = Encryption.decryptText(smtpDetails.password, smtpDetails.salt);
        smtpConfiguration = { server: smtpDetails.server, port: smtpDetails.port, encryption: smtpDetails.encryption, username: smtpDetails.username, password };

        emailOptions = { fromName: "Genus WFM", toEmail: numberOrEmail, subject: "Genus WFM - Password Reset", emailBody };
        mailResp = await sendMail(smtpConfiguration, emailOptions);
        isSent = authService.isEmailSent(mailResp, numberOrEmail);
        throwIfNot(isSent, statusCodes.INTERNAL_ERROR, statusMessages.COULD_NOT_SEND_OTP);

    } else {
        // SMS OTP
        templatePath = path.join(global.rootDir, "src", "config", "templates", "sms-template.txt");
        template = fs.readFileSync(templatePath, "utf-8").replace("{{OTP}}", otp).replace("{{HASHCODE}}", hashCode);

        if (process.env.NODE_ENV === "development" || ["9999999999", "7777777777"].includes(numberOrEmail)) {
            return token;
        }

        config = {
            method: "get",
            maxBodyLength: Infinity,
            url: process.env.SMS_ENDPOINT.replace("{{TOKEN}}", process.env.SMS_TOKEN)
                .replace("{{MOBILE_NUMNER}}", numberOrEmail)
                .replace("{{TEXT_MESSAGE}}", template),
            headers: {}
        };

        ({ data, status } = await axios.request(config));
        if (data.errorDescription !== "Message submitted successfully" || status !== 200) {
            throw new BadRequestError();
        }
    }

    return token;
};

const resendOTP = async (req) => {
    const data = { success: true };
    const { secretToken, isEmail } = req.body;
    throwIfNot(secretToken, statusCodes.BAD_REQUEST, "Secret Token not found in body");
    const tokenData = TokenService.verifyToken(secretToken);
    
    if (isEmail) {
        data.token = await sendOtpAndGetToken(tokenData.id, tokenData.email, "email");
    } else {
        data.token = await sendOtpAndGetToken(tokenData.id, tokenData.number);
    }

    return { data };
};

const verifyUser = async (req) => {
    const { secret: googleCaptchaToken, username, isMobileLogin, hashCode, appVersion, deviceId } = req.body;
    if (!isMobileLogin) {
        throwIfNot(googleCaptchaToken, statusCodes.BAD_REQUEST, statusMessages.SECRET_IS_MISSING);
        // const formData = new FormData();
        // formData.append("response", googleCaptchaToken);
        // formData.append("secret", process.env.GOOGLE_CAPTCHA_SECRET_KEY);
        // const requestOptions = {
        //     url: "https://www.google.com/recaptcha/api/siteverify",
        //     method: "POST",
        //     data: formData
        // };
        // verify google captcha
        // commented code due to facing error while verifying
        // const { data } = await axios(requestOptions);
        // throwIfNot(data, statusCodes.BAD_REQUEST, statusMessages.INVALID_SECRET);
        // throwIfNot(data.success, statusCodes.BAD_REQUEST, statusMessages.INVALID_SECRET);
    }
    // check validate email or wmobileNumber exist in body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const whereCondition = { isActive: "1" };
    if (emailRegex.test(username)) {
        whereCondition.email = { [Op.iLike]: username };
    } else if (mobileRegex.test(username)) {
        whereCondition.mobileNumber = username;
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_DETAILS);
    }
    const data = { success: true };

    const isExists = await userService.getUserByCondition(whereCondition, false, true);
    throwIfNot(isExists, statusCodes.NOT_FOUND, statusMessages.USER_NOT_EXIST);

    const userDetails = await userService.getUserByCondition(
        { ...whereCondition, isLocked: false },
        false,
        true
    );

    throwIf(!userDetails, statusCodes.NOT_FOUND, statusMessages.USER_LOCKED);
    
    if (!userDetails?.password && !isMobileLogin) {
        userDetails.tempToken = await authService.generateAppToken(userDetails.id);
    } else if (isMobileLogin) {
        if ((userDetails.dataValues.deviceId && (userDetails.dataValues.deviceId === deviceId)) || (!userDetails.dataValues.deviceId)) {
            data.token = await sendOtpAndGetToken(userDetails.id, userDetails.mobileNumber, "sms", hashCode);
        } else if (userDetails.dataValues.deviceId && (userDetails.dataValues.deviceId != deviceId)) {
            throwError(statusCodes.FORBIDDEN, statusMessages.DEVICE_NOT_REGISTERED);
        }
        
    }
    if (isMobileLogin) {
        const userDetails1 = { appVersion: appVersion };
        const { db } = new Users();
        const sql = `SELECT lov_array
            FROM public.user_master_lov_permission 
            INNER JOIN public.all_masters_list ON user_master_lov_permission.master_id = all_masters_list.id
            WHERE user_master_lov_permission.user_id = '${userDetails.id}' 
            AND all_masters_list.visible_name = 'Project'`;
        const [queryData] = await db.sequelize.selectQuery(sql);

        // console.log("queryData ==", queryData[0].lov_array[0]);
        if (queryData.length > 0) {
            const enabledDeviceIdData = await getProjectMasterMakerByCondition({
                project_id: queryData[0].lov_array[0],
                name: "ENABLE DEVICE ID",
                isActive: "1"
            });

            // return res.send({userDetails, enabledDeviceIdData});
            if (enabledDeviceIdData) {
                const enabledDeviceIdDataLov = await getAllProjectMasterMakerLovsByMasterId({ master_id: enabledDeviceIdData.id });
                if (enabledDeviceIdDataLov?.rows[0]?.name?.toLowerCase() === "true") {
                    const userDeviceDetails = await userService.getUserByCondition(
                        { deviceId: deviceId },
                        false,
                        false
                    );
                    if (userDeviceDetails === null && (userDetails.deviceId === "" || userDetails.deviceId === null)) {
                        userDetails1.deviceId = deviceId;
                    } else if (userDeviceDetails?.deviceId !== userDetails.deviceId) {
                        throwError(
                            statusCodes.FORBIDDEN,
                            statusMessages.DEVICE_LINK_WITH_ANOTHER_USER
                        );
                    }
                }
            }
        }
        
        // const enabledDeviceIdData = await getProjectMasterMakerByCondition({ name: "ENABLED DEVICE ID" });
        // if (enabledDeviceIdData) {
        //     const enabledDeviceIdDataLov = await getAllProjectMasterMakerLovsByMasterId({ master_id: enabledDeviceIdData.id });
        //     if (enabledDeviceIdDataLov?.rows[0]?.name?.toLowerCase() === "true") {
        //         userDetails1.deviceId = deviceId;
        //     }
        // } else if (!userDetails.dataValues.deviceId) userDetails1.deviceId = deviceId;

        const where = { mobileNumber: username };
        await userService.updateUser(userDetails1, where);
        
        return {
            data: {
                ...data,
                isFirstLogin: !userDetails?.mpin
            }
        };
    } else {
        return {
            data: {
                ...data,
                email: userDetails?.email,
                isFirstLogin: !userDetails?.password,
                ...(!userDetails.password && { token: userDetails.tempToken })
            }
        };
    }
};

const loginWithOtp = async (req) => {
    const { secretToken, otp } = req.body;
    const tokenData = TokenService.verifyToken(secretToken);
    const thrityMinutes = 10 * 60 * 1000;
    if ((tokenData.iat + thrityMinutes) > Date.now()) {
        if (otp === tokenData.otp) {
            const userDetails = await userService.getUserByCondition({ id: tokenData.id }, false, true);
            return doLogin(req, {}, userDetails, true);
        }
        throw new BadRequestError("Invalid OTP");
    }
    throw new BadRequestError("OTP Expired");
};

async function doLogin(req, res, userDetails, mobileLogin) {
    const userSessions = new UserSessoins();
    const projects = new Projects();
    const supervisorAssignments = new SupervisorAssignments();

    const [userSession, workAreaData, projectLogos, supervisorAssignmentData] = await Promise.all([
        userSessions.create({ userId: userDetails.id, loggedInUsingOTP: mobileLogin, userAgent: req.headers["user-agent"], lastActiveAt: Date.now() }),
        getWorkAreaAssignment({ userId: userDetails.id }),
        projects.findOne({ isActive: "1" }, ["logoOne", "logoTwo"]),
        supervisorAssignments.findOne({ userId: userDetails?.id, isActive: "1" }, undefined, true),
        userService.updateLastLogin({ id: userDetails.id }, mobileLogin ? "Mobile" : "Web")
    ]);
    const token = authService.issueJwt({ ...JSON.parse(JSON.stringify(userDetails)), supervisor: supervisorAssignmentData?.supervisor, areaAllocation: { level: workAreaData?.data[0]?.gaa_hierarchy?.name, entry: workAreaData?.data[0]?.gaaLevelEntryNames } }, userSession, projectLogos);
    const response = {
        message: statusMessages.LOGIN_SUCCESS,
        logos: projectLogos,
        user: { ...JSON.parse(JSON.stringify(userDetails)), supervisor: supervisorAssignmentData?.supervisor, areaAllocation: { level: workAreaData?.data[0]?.gaa_hierarchy?.name, entry: workAreaData?.data[0]?.gaaLevelEntryNames } }
    };
    if (mobileLogin) {
        const offlineModeData = await getProjectMasterMakerByCondition({ name: "OFFLINE MODE" });
        if (offlineModeData) {
            const offlineModeDataLov = await getAllProjectMasterMakerLovsByMasterId({ master_id: offlineModeData.dataValues.id });
            if (offlineModeDataLov.count) response.offline_mode = offlineModeDataLov.rows[0].dataValues.name;
        }

        response.token = token;
    } else {
        res.cookie("auth_token", `${token}`, { maxAge: 1800000 });
    }
    return response;
}

const login = async function (req, res) {
    const { username, password, mPin, userId, tempLogin, number } = req.body;
    let compareKey = "password";
    let saltKey = "userSalt";
    let whereCondition = {};
    if ((mPin || tempLogin) && (userId || number)) {
        whereCondition = { ...whereCondition, ...userId && { id: userId }, ...number && { mobileNumber: number } };
        compareKey = tempLogin ? "password" : "mPin";
        saltKey = tempLogin ? "userSalt" : "mpinSalt";
    } else if (username && password) {
        // check validate email or wmobileNumber exist in body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;
        if (emailRegex.test(username)) {
            whereCondition = {
                email: { [Op.iLike]: username }
            };
        } else if (mobileRegex.test(username)) {
            whereCondition = {
                mobileNumber: username
            };
        } else {
            throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_DETAILS);
        }
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_DETAILS);
    }
    const isExists = await userService.getUserByCondition(whereCondition, false, true);
    throwIfNot(isExists, statusCodes.NOT_FOUND, statusMessages.USER_NOT_EXIST);

    const userDetails = await userService.getUserByCondition(
        { ...whereCondition, isLocked: false },
        false,
        true
    );
    throwIf(!userDetails, statusCodes.NOT_FOUND, statusMessages.USER_LOCKED);

    const inputPassword = Encryption.encryptPassword(req.body[compareKey] || "", userDetails[saltKey] || "");
    if (inputPassword === userDetails[compareKey]) {
        return doLogin(req, res, userDetails, false);
    }
    throwError(statusCodes.BAD_REQUEST, statusMessages.INVALID_PASSWORD);
};

/**
  * Method to update password
  * @param { object } req.body
  * @returns { object } data
  */
const updatePassword = async (req, res) => {
    const { newPassword, currentPassword } = req.body;
    throwIfNot(newPassword, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_DETAILS);

    const { userId } = req.user;

    const isUserExists = await userService.userAlreadyExists({ id: userId });
    throwIfNot(isUserExists, statusCodes.NOT_FOUND, statusMessages.USER_NOT_EXIST);

    const userDetails = await userService.getUserByCondition({ id: userId }, false, true);

    const inputPassword = Encryption.encryptPassword(currentPassword || "", userDetails.userSalt || "");
    throwIfNot(inputPassword === userDetails.password, statusCodes.BAD_REQUEST, statusMessages.CURRENT_PASSWORD_INCORRECT);

    const data = await authService.updatePassword({ newPassword: newPassword }, { id: userId });

    await authService.logout(req.user.id, req.user.userId, true);
    res.clearCookie("auth_token");

    return { data };
};

const updatePasswordByAdmin = async (req, res) => {
    const { newPassword, userId } = req.body;
    throwIfNot(newPassword, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_DETAILS);
    const isUserExists = await userService.userAlreadyExists({ id: userId });
    throwIfNot(isUserExists, statusCodes.NOT_FOUND, statusMessages.USER_NOT_EXIST);
    const data = await authService.updatePassword({ newPassword }, { id: userId });
    return { data };
};

/**
  * Method to update password
  * @param { object } req.body
  * @returns { object } data
  */
const setPasswrod = async (req) => {
    throwIfNot(req.body.token, statusCodes.BAD_REQUEST, statusMessages.TOKEN_NOT_FOUND);
    throwIfNot(req.body.password, statusCodes.BAD_REQUEST, statusMessages.MISSING_USER_DETAILS);
    const message = await authService.setPasswrod(req.body);
    return { message };
};

const getUserDetails = async (req) => {
    const projects = new Projects();
    const [userDetails, projectLogos] = await Promise.all([userService.getUserByCondition({ id: req.user.userId }),
        projects.findOne({ isActive: "1" }, ["logoOne", "logoTwo"])
    ]);
    return { data: userDetails, logos: projectLogos };
};

const logout = async (req, res) => {
    try {
        await authService.logout(req.user.id, req.user.userId);
        res.clearCookie("auth_token");
        return { message: statusMessages.LOGOUT_SUCCESS };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ERROR_LOGOUT, error);
    }
};

const loginViaToken = async (req, res) => {
    const { redirect_to: redirectTo } = req.query;

    throwIfNot(redirectTo, statusCodes.BAD_REQUEST, statusMessages.PLEASE_SEND_REDIRECT_URL);

    const authHeader = req.headers.authorization;
    throwIfNot(authHeader && authHeader.startsWith("Bearer "), statusCodes.UNAUTHORIZED, statusMessages.INVALID_AUTHORIZATION);
    const token = authHeader.substring(7, authHeader.length);

    const tokenData = TokenService.verifyToken(token);
    const userDetails = await userService.getUserByCondition({ id: tokenData.userId }, false, true);
    throwIfNot(userDetails, statusCodes.NOT_FOUND, statusMessages.USER_NOT_FOUND);

    await doLogin(req, res, userDetails, false);
    res.redirect(redirectTo);
};

const verifyNum = async (req) => {
    // eslint-disable-next-line prefer-const
    let { mobileNum, hashCode, id } = req.body;

    if (!hashCode) hashCode = " ";

    if (!mobileNum) {
        throwIfNot(mobileNum, statusCodes.BAD_REQUEST, statusMessages.MOBILE_NUMBER_REQUIRED);
    }
    if (!id) {
        throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.USER_ID_REQUIRED);
    }

    const otp = generateOTP();

    const templatePath = path.join(global.rootDir, "src", "config", "templates", "sms-template.txt");
    const template = fs.readFileSync(templatePath, "utf-8").replace("{{OTP}}", otp).replace("{{HASHCODE}}", hashCode);

    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.SMS_ENDPOINT.replace("{{TOKEN}}", process.env.SMS_TOKEN)
            .replace("{{MOBILE_NUMNER}}", mobileNum)
            .replace("{{TEXT_MESSAGE}}", template),
        headers: {}
    };

    const { data, status } = await axios.request(config);

    const strConact = `${mobileNum}nn${otp}`;

    const encodedString = Buffer.from(strConact).toString("base64");

    const userDetails = { verifyOtp: encodedString };
    const where = { id: id };
    await userService.updateUser(userDetails, where);
    if (data.errorDescription !== "Message submitted successfully" || status !== 200) {
        throw new BadRequestError();
    }
};

const verifyOTP = async (req) => {
    const { mobileNum, id, otp } = req.query;

    if (!mobileNum) {
        throwIfNot(req.query.mobileNum, statusCodes.BAD_REQUEST, statusMessages.MOBILE_NUMBER_REQUIRED);
    }

    const data = await userService.getUserById(id);
    const decodedString = Buffer.from(data.dataValues.verifyOtp, "base64").toString("utf-8");

    const splitVal = decodedString.split("nn");

    if (mobileNum == splitVal[0]) {
        if (splitVal[1] == otp) {
            return { message: "OTP verified" };
        } else {
            throwError(statusCodes.BAD_REQUEST, "OTP mismatched");
        }
    } else {
        throwError(statusCodes.BAD_REQUEST, "Mobile number mismatched");
    }
};

const verifyDomainRequest = async () => ({ message: statusMessages.DOMAIN_VERIFIED });

const verifyNumAndSendOtp = async (req) => {
    const { mobileNum, formAtrId } = req.query;

    if (!mobileNum) {
        throwIfNot(req.query.mobileNum, statusCodes.BAD_REQUEST, statusMessages.MOBILE_NUMBER_REQUIRED);
    }
    
    const formAttribute = new FormAttribute();
    const data = await formAttribute.findOne({ id: formAtrId, isActive: "1" }, ["id", "properties"]);
    
    if (!data) {
        throwIfNot(formAtrId, statusCodes.BAD_REQUEST, statusMessages.FORMATTRIBUTES_FAILURE);
    }
    
    if (data) {
        const { dataValues: { properties } } = data;
        const otp = generateOTP();

        // Used to create the payload with maindatory changes
        const payload = properties?.payload;
        payload[properties?.receiverKey] = mobileNum;
        payload[properties?.messageKey] = payload[properties?.messageKey].replace("<OTP>", otp);

        // Create config for send into the SMS api
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: properties?.endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: payload
        };

        console.log("config", config);
        try {
            const { data: resData, status } = await axios.request(config);
            if (status === 200) {
                return { otp, response: resData };
            } else {
                throw new BadRequestError("Error From Discom API");
            }
        } catch (error) {
            if (error.response.status > 200 && error.response.status < 510) {
                throw new BadRequestError("Error From Discom API");
            }
            throw new BaseError();

        }
    }
};

module.exports = {
    verifyNum,
    verifyOTP,
    getGoogleKeys,
    login,
    updatePassword,
    verifyUser,
    loginWithOtp,
    setPasswrod,
    getUserDetails,
    forgotPassword,
    logout,
    resendOTP,
    getSuperUserId,
    checkIsSuperUser,
    getSuperUserDetails,
    verifyForgotPasswordOtp,
    loginViaToken,
    verifyDomainRequest,
    updatePasswordByAdmin,
    verifyNumAndSendOtp
};
