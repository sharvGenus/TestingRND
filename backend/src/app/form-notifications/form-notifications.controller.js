const statusCodes = require("../../config/status-codes");
const statusMessage = require("../../config/status-message");
const FormNotifications = require("../../database/operation/form-notification");
const { throwIfNot } = require("../../services/throw-error-class");

exports.getNotifcationList = async (req) => {
    const { userId, isSuperUser } = req.user;
    if (isSuperUser) {
        return { data: { rows: [], count: 0, unreadCount: 0 } };
    }
    const condition = { userId };
    const formNotifications = new FormNotifications();
    if (!formNotifications.queryObject?.order) {
        formNotifications.queryObject.order = [["createdAt", "DESC"]];
    }
    const [data, unreadCount] = await Promise.all([
        formNotifications.findAndCountAll(condition, undefined, true),
        formNotifications.count({ ...condition, isRead: false })
    ]);
    data.unreadCount = unreadCount || 0;
    return { data };
};

exports.getNotificationById = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessage.NOTIFICATION_ID_REQUIRED);
    const formNotifications = new FormNotifications();
    const data = await formNotifications.findOne({ id });
    return { data };
};

exports.updateNotification = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessage.NOTIFICATION_ID_REQUIRED);
    const formNotifications = new FormNotifications();
    await formNotifications.update(req.body, { id });
    return { message: statusMessage.NOTIFICATION_UPDATED };
};

exports.updateBulkNotification = async (req) => {
    const { userId } = req.user;
    const formNotifications = new FormNotifications();
    await formNotifications.update({ isRead: true }, { userId });
    return { message: statusMessage.NOTIFICATION_UPDATED };
};

exports.deleteNotification = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessage.NOTIFICATION_ID_REQUIRED);
    const formNotifications = new FormNotifications();
    await formNotifications.delete({ id });
    return { message: statusMessage.NOTIFICATION_DELETED };
};