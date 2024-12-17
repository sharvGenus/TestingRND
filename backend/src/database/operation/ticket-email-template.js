const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for Approvers table
 * 
 * Created by               Version                         Date
 * Rakshit Agrawal          1.0.0                           02 Jan 2024
 * 
 * @class TicketEmailTemplates
 */
class TicketEmailTemplates extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.TICKET_EMAIL_TEMPLATES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            issueIds: "issue_ids",
            subIssueIds: "sub_issue_ids",
            from: "from",
            subject: "subject",
            displayName: "display_name",
            templateName: "template_name",
            body: "body",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name", "code"]
            }
        ];
    }
}

module.exports = TicketEmailTemplates;