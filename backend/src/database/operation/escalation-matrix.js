const config = require("../../config/database-schema");
const { ESCALATION_MATRIX } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for cities table
 *
 * created by               version                         date
 * Ruhana                   1.0.0                           14 Nov 2023
 *
 * updated by               version                         date
 *
 * @class Escalation Matrix
 */

class EscalationMatrix extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ESCALATION_MATRIX;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            emailTemplateId: "email_template_id",
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
                attributes: ["id", "name"],
                foreignKey: "created_by",
                as: "created"
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name"],
                foreignKey: "project_id"
            },
            {
                model: this.db[config.TICKET_EMAIL_TEMPLATES],
                attributes: ["id", "templateName", "subIssueIds"],
                foreignKey: "email_template_id"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "updated_by",
                as: "updated"
            }
        ];
    }
}

module.exports = EscalationMatrix;
