const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for project_scopes table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           16 Apr 2024
 * 
 * @class ProjectScopes
 */
class ProjectScopes extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.PROJECT_SCOPES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            formId: "form_id",
            materialTypeId: "material_type_id",
            uomId: "uom_id",
            orderQuantity: "order_quantity",
            totalQuantity: "total_quantity",
            satQuantity: "sat_quantity",
            installationMonth: "installation_month",
            installationEndDate: "installation_end_date",
            installationMonthIncentive: "installation_month_incentive",
            installationEndDateIncentive: "installation_end_date_incentive",
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
}

module.exports = ProjectScopes;