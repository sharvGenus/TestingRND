const config = require("../../config/database-schema");
const { TICKETS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for cities table
 *
 * created by               version                         date
 * Ruhana                   1.0.0                           17 Oct 2023
 *
 * updated by               version                         date
 *
 * @class Tickets
 */

class Tickets extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = TICKETS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            ticketSource: 'ticket_source',
            projectId: "project_id",
            responseId: "response_id",
            formId: "form_id",
            ticketNumber: "ticket_number",
            issueId: "issue_id",
            subIssueId: "issue_sub_id",
            assigneeType: "assignee_type",
            assignBy: "assign_by",
            supervisorId: "supervisor_id",
            assigneeId: "assignee_id",
            description: "description",
            ticketStatus: "ticket_status",
            mobileNumber: "mobile_number",
            escalation: "escalation",
            remarks: "remarks",
            attachments: "attachments",
            assigneeRemarks: "assignee_remarks",
            projectWiseMappingId: "project_wise_mapping_id",
            formWiseMappingId: "form_wise_mapping_id",
            priority: "priority",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "created_by",
                as: "created",
                paranoid: false
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "updated_by",
                as: "updated",
                paranoid: false
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "supervisor_id",
                as: "supervisor_obj",
                paranoid: false
            },
            {
                model: this.db[config.FORMS],
                attributes: ["id", "name"],
                foreignKey: "form_id"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "assignee_id",
                as: "assignee",
                paranoid: false
            },
            {
                model: this.db[config.PROJECT_MASTER_MAKERS],
                attributes: ["id", "name"],
                foreignKey: "issue_id",
                as: "issue"
            },
            {
                model: this.db[config.PROJECT_MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "issue_sub_id",
                as: "sub_issue"
            },
            {
                model: this.db[config.PROJECT_WISE_TICKET_MAPPINGS],
                attributes: ["prefix"],
                foreignKey: "projectWiseMappingId"
            }
        ];
    }
}

module.exports = Tickets;
