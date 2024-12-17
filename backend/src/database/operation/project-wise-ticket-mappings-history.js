const config = require("../../config/database-schema");
const { PROJECT_WISE_TICKET_MAPPINGS_HISTORY } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for project-wise-ticket-mappings table
 *
 * created by               version                         date
 * Ruhana                  1.0.0                           30 Oct 2023
 *
 * updated by               version                         date
 *
 * @class Tickets
 */
class projectWiseTicketMappingsHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = PROJECT_WISE_TICKET_MAPPINGS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            issueFields: "issue_fields",
            forms: "forms",
            ticketIndex: "ticket_index",
            prefix: "prefix",
            isActive: "is_active",
            remarks: "remarks",
            recordId: "record_id",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "created_by",
                as: "created"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "updated_by",
                as: "updated"
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name"],
                foreignKey: "project_id"
            },
            {
                model: this.db[config.PROJECT_MASTER_MAKERS],
                attributes: ["id", "name"],
                foreignKey: "status_type_id",
                as: "status_type_obj"
            }
        ];
    }
}

module.exports = projectWiseTicketMappingsHistory;
