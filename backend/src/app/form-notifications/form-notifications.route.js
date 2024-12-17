const router = require("express").Router();
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");
const { handleResponse } = require("../../utilities/common-utils");
const ctrlr = require("./form-notifications.controller");

router.get("/form-notifications/list", ensureAuthentications, handleResponse.bind(null, ctrlr.getNotifcationList));
router.get("/form-notifications/notification/:id", ensureAuthentications, handleResponse.bind(null, ctrlr.getNotificationById));
router.put("/form-notifications/update/:id", ensureAuthentications, handleResponse.bind(null, ctrlr.updateNotification));
router.put("/form-notifications/update", ensureAuthentications, handleResponse.bind(null, ctrlr.updateBulkNotification));
router.delete("/form-notifications/delete/:id", ensureAuthentications, handleResponse.bind(null, ctrlr.deleteNotification));

module.exports = router;