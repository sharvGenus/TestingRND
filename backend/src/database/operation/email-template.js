const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for Approvers table
 * 
 * Created by               Version                         Date
 * Shefali Jain                      1.0.0                           14 July 2023
 * 
 * @class EmailTemplates
 */
class EmailTemplates extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.EMAIL_TEMPLATES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            transactionTypeId: "transaction_type_id",
            projectId: "project_id",
            organizationId: "organization_id",
            forApprover: "for_approver",
            from: "from",
            to: "to",
            cc: "cc",
            bcc: "bcc",
            subject: "subject",
            displayName: "display_name",
            templateName: "template_name",
            body: "body",
            isAttchmentAvailable: "is_attachment_available",
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
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "transaction_type_id",
                as: "transaction_type"
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code", "organizationTypeId"],
                include: [{
                    model: this.db[config.MASTER_MAKER_LOVS],
                    attributes: ["id", "name"],
                    foreignKey: "organization_type_id",
                    as: "organization_type"
                }]
            }
        ];
    }
}

module.exports = EmailTemplates;