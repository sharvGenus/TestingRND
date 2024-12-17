const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for forms table
 *
 * created by               version                         date
 * Harish                    1.0.0                           31 Oct 2023
 *
 * @class FormNotifications
 */
class FormNotifications extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.FORMS_NOTIFICATIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            category: "category",
            isRead: "is_read",
            formId: "form_id",
            responseId: "response_id",
            ticketId: "ticket_id",
            userId: "user_id",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.USERS],
                as: "users",
                attributes: ["id", "name"]
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[config.FORMS],
                attributes: ["id", "name", "formTypeId"]
            },
            {
                model: this.db[config.TICKETS],
                include: [
                    {
                        model: this.db[config.FORM_WISE_TICKET_MAPPINGS],
                        attributes: ["id", "mobileFields", "geoLocationField"]
                    },
                    {
                        model: this.db[config.PROJECT_WISE_TICKET_MAPPINGS],
                        attributes: ["id", "forms", "prefix"]
                    }
                ]
            },
            {
                model: this.db[config.USERS],
                as: "createdByUser",
                attributes: ["id", "name"]
            },
            {
                model: this.db[config.USERS],
                as: "updatedByUser",
                attributes: ["id", "name"]
            }
        ];
    }
}

module.exports = FormNotifications;
