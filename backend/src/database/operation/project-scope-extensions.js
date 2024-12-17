const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for project_scope_extensions table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           17 Apr 2024
 * 
 * @class ProjectScopeExtensions
 */
class ProjectScopeExtensions extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.PROJECT_SCOPE_EXTENSIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectScopeId: "project_scope_id",
            extensionQuantity: "extension_quantity",
            extensionStartDate: "extension_start_date",
            extensionMonth: "extension_month",
            extensionEndDate: "extension_end_date",
            documentNumber: "document_number",
            documentDate: "document_date",
            attachments: "attachments",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.PROJECT_SCOPES],
                attributes: ["id"],
                include: [
                    {
                        model: this.db[config.PROJECTS],
                        attributes: ["id", "name", "code", "schemeName", "poWorkOrderNumber", "poStartDate", "closureDate", "poEndDate", "fmsStartDate", "fmsYears", "fmsEndDate"],
                        include: [
                            {
                                model: this.db[config.ORGANIZATIONS],
                                attributes: ["id", "name", "code"],
                                foreignKey: "company_id",
                                as: "company"
                            },
                            {
                                model: this.db[config.ORGANIZATIONS],
                                attributes: ["id", "name", "code"],
                                foreignKey: "customer_id",
                                as: "customer"
                            }
                        ]
                    },
                    {
                        model: this.db[config.FORMS],
                        attributes: ["id", "name"],
                        include: [{
                            model: this.db[config.MASTER_MAKER_LOVS],
                            attributes: ["id", "name"]
                        }]
                    },
                    {
                        model: this.db[config.MASTER_MAKER_LOVS],
                        attributes: ["id", "name"],
                        foreignKey: "material_type_id",
                        as: "material_type"
                    },
                    {
                        model: this.db[config.MASTER_MAKER_LOVS],
                        attributes: ["id", "name"],
                        foreignKey: "uom_id",
                        as: "uom"
                    }
                ]
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "created_by",
                as: "created"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "updated_by",
                as: "updated"
            }
        ];
    }

    /**
     * Returns the sum of records by a specified column.
     */
    async sum(column, where = {}) {
        const sumResult = await this.model.sum(column, {
            where: { ...this.getOverRidesQueries(), ...where, isActive: "1" }
        });
        return sumResult;
    }
}

module.exports = ProjectScopeExtensions;