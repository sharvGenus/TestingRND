require("dotenv").config();
const { set } = require("express-http-context");
const statusCodes = require("../config/status-codes");
const statusMessage = require("../config/status-message");
const UserSessoins = require("../database/operation/user-sessions");
const Users = require("../database/operation/users");
const logger = require("../logger/logger");
const { TokenService } = require("../services/token.service");

function sendUnauthorizedResponse(_res, code, message) {
    _res.clearCookie("auth_token");
    _res.status(code).send({ message });
}

module.exports = async (_req, _res, _next) => {
    try {
        const isMobileRequest = _req.headers["x-mobile-application"] === "1";
        if (isMobileRequest) _res.clearCookie();

        if (!_req.cookies?.auth_token && !_req?.headers?.authorization) {
            return sendUnauthorizedResponse(_res, statusCodes.UNAUTHORIZED, statusMessage.NO_AUTHORIZATION_HEADER);
        }
        // Read token from request cookies
        let token = _req.cookies?.auth_token;
        const tokenInCookies = !!token;
        if (!token) {
            // if not found in cookie then Read Token from Request header and check for Bearer token
            const tokenInfo = _req?.headers?.authorization?.split(" ");
            token = (tokenInfo?.length && (/^Bearer$/i.test(tokenInfo[0]))) ? tokenInfo[1] : "";
            if (!token) {
                return sendUnauthorizedResponse(_res, statusCodes.UNAUTHORIZED, statusMessage.NO_AUTHORIZATION_HEADER);
            }
        }

        // Decode the token and check for valid data
        const tokenData = TokenService.verifyToken(token);
        if (!tokenData?.id) {
            return sendUnauthorizedResponse(_res, statusCodes.UNAUTHORIZED, statusMessage.SESSION_EXPIRED);
        }

        // Get User information from the 
        const users = new Users();
        const userSessions = new UserSessoins();

        const [userData, userSession] = await Promise.all([
            users.findOneWithCache({ id: tokenData.userId }, undefined, false, undefined, true),
            userSessions.findOne({ userId: tokenData.userId, id: tokenData.id }, undefined, undefined, undefined, true)
        ]);
        const isSuperUser = userData.roleId === "a89c1591-ed87-40e5-b89b-e409d647e3e5";
        if (!userData?.isActive || !userSession) {
            return sendUnauthorizedResponse(_res, statusCodes.UNAUTHORIZED, statusMessage.SESSION_EXPIRED);
        }

        if (!tokenData?.iat) {
            return sendUnauthorizedResponse(_res, statusCodes.UNAUTHORIZED, statusMessage.SESSION_EXPIRED);
        }

        const totalSessionActiveTime = new Date().getTime() - new Date(userSession.lastActiveAt).getTime();
        const defaultSessionTimeout = 12 * 60 * 60 * 1000;
        if (totalSessionActiveTime > defaultSessionTimeout) {
            // delete all obsolete sessions from user sessions tables
            await userSessions.forceDelete({ id: userSession.id });
            return sendUnauthorizedResponse(_res, statusCodes.UNAUTHORIZED, statusMessage.SESSION_EXPIRED);
        }
        // update last active time once in every minutes
        if (totalSessionActiveTime > 60 * 1000) {
            await userSessions.update({ ...userSession, lastActiveAt: Date.now() }, { id: userSession.id });
            if (tokenInCookies) _res.cookie("auth_token", `${token}`, { maxAge: 7200000 });
        }

        _req.token = token;
        _req.tokenData = tokenData;
        _req.user = {
            id: tokenData.id,
            userId: userData.id,
            status: userData.isActive,
            email: userData.email,
            organizationId: userData.oraganizationId,
            organizationTypeId: userData.oraganizationType,
            isSuperUser,
            isMobileRequest,
            role: userData.role
        };
        set("requestUser", _req.user);
        return _next();
    } catch (error) {
        logger.info(error);
        sendUnauthorizedResponse(_res, statusCodes.INTERNAL_ERROR, statusMessage.INTERNAL_SERVER_ERROR);
    }
};
