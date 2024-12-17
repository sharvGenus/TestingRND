const { TokenService } = require("../../services/token.service");
const statusMessages = require("../../config/status-message");
const User = require("../../database/operation/users");
const { throwError, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const Users = require("../../database/operation/users");
const { Encryption } = require("../../services/encryption.service");
const UserSessoins = require("../../database/operation/user-sessions");

/**
 * 
 * @param {*} userData 
 * @returns Object
 */
const issueJwt = function (userData = {}, session = {}) {
    try {
        const tokenizeObj = {
            id: session.id,
            userId: userData.id,
            mobileNumber: userData.mobileNumber,
            email: userData.email,
            time: (new Date()).getTime(),
            status: userData.status
        };
        return TokenService.issueToken(tokenizeObj);

    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TOKEN_NOT_FOUND);
    }
};

const updatePassword = async (userData, where) => {
    try {
        const users = new User();
        const userDetails = {};
        const salt = Encryption.makeUserSalt(16);
        if (userData.newPassword) {
            userDetails.userSalt = salt;
            userDetails.password = Encryption.encryptPassword(userData.newPassword, salt);
        } else if (userData.newMpin) {
            userDetails.mPin = Encryption.encryptPassword(userData.newMpin, salt);
            userDetails.mpinSalt = salt;
            userDetails.imeiNumber = userData.imeiNumber;
            userDetails.imeiNumber2 = userData.imeiNumber;
        }
        const data = await users.update(userDetails, where);
        if (data) return { message: statusMessages.PASSWORD_CHANGED };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.USER_UPDATE_FAILURE, error);
    }
};

const generateAppToken = async (id) => {
    try {
        const users = new Users();
        const token = TokenService.issueToken({ id });
        await users.update({ tempToken: token }, { id });
        return token;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_USER_FAILURE, error);
    }
};

const setPasswrod = async (body) => {
    try {
        const extractToken = TokenService.verifyToken(body.token);
        // throw error if token does not containr users id or it was older then 30 minutes
        throwIfNot(
            !extractToken.id || extractToken.iat * 1000 > Date.now() - 30 * 60 * 1000,
            statusCodes.BAD_REQUEST,
            statusMessages.TOKEN_EXPIRED
        );
        const user = new Users();
        const isUserExists = await user.isAlreadyExists({ id: extractToken.id, tempToken: body.token });
        if (!isUserExists) throwError(statusCodes.NOT_FOUND, statusMessages.USER_NOT_FOUND);
        const userSalt = Encryption.makeUserSalt(16);
        const password = Encryption.encryptPassword(body.password, userSalt);
        await user.update({ tempToken: null, userSalt, password }, { id: extractToken.id });
        return statusMessages.PASSWORD_CHANGED;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.PASSWORD_NOT_CHANGED, error);
    }
};
const issueJwtForMobile = function (userData = {}, session = {}) {
    try {
        const tokenizeObj = {
            id: session.id,
            userId: userData.id,
            mpin: userData.mpin,
            time: (new Date()).getTime(),
            status: userData.status
        };
        return TokenService.issueToken(tokenizeObj);

    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.TOKEN_NOT_FOUND);
    }
};

const isEmailSent = (response, toEmail) => response && response.accepted.includes(toEmail) && response.rejected.length === 0;

const logout = async (sessionId, userId, shouldClearAllSessions) => {
    try {
        const sessions = new UserSessoins();
        let where = {};
        if (shouldClearAllSessions) {
            where = { userId };
        } else {
            where = { id: sessionId, userId };
        }
        await sessions.forceDelete(where);
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.ERROR_LOGOUT, error);
    }
};

module.exports = {
    logout,
    issueJwt,
    updatePassword,
    setPasswrod,
    generateAppToken,
    issueJwtForMobile,
    isEmailSent
};
