const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for project_scope_sats table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           17 Apr 2024
 * 
 * @class ProjectScopeSats
 */
class ProjectScopeSats extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.PROJECT_SCOPE_SATS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectScopeId: "project_scope_id",
            satExecutionQuantity: "sat_execution_quantity",
            satExecutionDate: "sat_execution_date",
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

module.exports = ProjectScopeSats;