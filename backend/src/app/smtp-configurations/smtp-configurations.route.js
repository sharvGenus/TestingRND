const router = require("express").Router();
const smtpConfigurations = require("./smtp-configurations.controller");
const { validateSmtpConfigurationSaveOrUpdate } = require("./smtp-configurations.request");
const { handleResponse } = require("../../utilities/common-utils");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");

router.post("/smtp-configuration/create", ensureAuthentications, validateSmtpConfigurationSaveOrUpdate(), handleResponse.bind(this, smtpConfigurations.createSmtpConfiguration));
router.put("/smtp-configuration/update/:id", ensureAuthentications, validateSmtpConfigurationSaveOrUpdate(), handleResponse.bind(this, smtpConfigurations.updateSmtpConfiguration));
router.get("/smtp-configuration/list", ensureAuthentications, handleResponse.bind(this, smtpConfigurations.getSmtpConfigurationList));
router.delete("/smtp-configuration/delete/:id", ensureAuthentications, handleResponse.bind(this, smtpConfigurations.deleteSmtpConfiguration));

module.exports = router;