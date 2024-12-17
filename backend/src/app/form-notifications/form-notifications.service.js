const FormNotifications = require("../../database/operation/form-notification");

/**
 * Function to create new notification whenever a form has assigned for resurvey
 * @param {UUID} userId ID of users to notify
 * @param {UUID} projectId project ID
 * @param {UUID} formId forms ID
 * @param {UUID} responseId ID of particular response
 * @param {UUID} loggedInUser id of logged in user
 */
exports.createNewResurveyAssignedNotification = async (userId, projectId, formId, responseId, loggedInUser) => {
    const formNotifications = new FormNotifications();
    await formNotifications.createOrUpdate({ responseId, category: "resurvey" }, { userId, projectId, formId, loggedInUser, responseId, category: "resurvey", isRead: false });
};

/**
 * Function to create new notification whenever a ticket has been assigned for helpdesk and ticket assignment
 * @param {UUID} userId ID of users to notify
 * @param {UUID} projectId project ID
 * @param {UUID} formId forms ID
 * @param {UUID} responseId ID of particular response
 * @param {UUID} loggedInUser id of logged in user
 * @param {UUID} ticketId id of ticket in user
 * @param {UUID} oldUser id of user to whome ticket was assigned in past
 */
exports.createNewTicketAssignedNotification = async (userId, projectId, formId, responseId, loggedInUser, ticketId, oldUser = null) => {
    const formNotifications = new FormNotifications();
    await formNotifications.createOrUpdate({ ticketId, userId: oldUser, category: "handt" }, { userId, projectId, formId, loggedInUser, responseId, category: "handt", isRead: false, ticketId });
};

/**
 * Function to delete notifications, one notification will either have responseId or ticketId
 * @param {UUID} responseId 
 * @param {STRING} category 
 * @param {UUID} ticketId 
 */
exports.deleteNotificationByResponseId = async (responseId = null, category = "resurvey", ticketId = null) => {
    const formNotifications = new FormNotifications();
    const condition = { category, ticketId, responseId };
    return formNotifications.forceDelete(condition, undefined, true);
};