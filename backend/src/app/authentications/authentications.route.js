const router = require("express").Router();
const auths = require("./authentications.controller");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/auth/verify-user", handleResponse.bind(this, auths.verifyUser));
router.post("/auth/login-with-otp", handleResponse.bind(this, auths.loginWithOtp));
router.post("/auth/resent-otp", handleResponse.bind(this, auths.resendOTP));
router.get("/auth/google-captcha-keys", handleResponse.bind(this, auths.getGoogleKeys));
router.post("/auth/login", handleResponse.bind(this, auths.login));
router.post("/auth/logout", ensureAuthentications, handleResponse.bind(this, auths.logout));
router.get("/auth/get-user-details", ensureAuthentications, handleResponse.bind(this, auths.getUserDetails));
router.put("/auth/update-password", ensureAuthentications, handleResponse.bind(this, auths.updatePassword));
router.post("/auth/set-password", handleResponse.bind(this, auths.setPasswrod));
router.post("/auth/forgot-password", handleResponse.bind(this, auths.forgotPassword));
router.post("/auth/verify-forgot-password-otp", handleResponse.bind(this, auths.verifyForgotPasswordOtp));
router.get("/auth/login-via-token", ensureAuthentications, auths.loginViaToken);
router.get("/verify-genus-domain", handleResponse.bind(this, auths.verifyDomainRequest));
router.post("/auth/verify-num", handleResponse.bind(this, auths.verifyNum));
router.get("/auth/verify-OTP", ensureAuthentications, handleResponse.bind(this, auths.verifyOTP));
router.put("/auth/admin-update-password", ensureAuthentications, handleResponse.bind(this, auths.updatePasswordByAdmin));
router.get("/auth/send-otp", handleResponse.bind(this, auths.verifyNumAndSendOtp));

module.exports = router;
