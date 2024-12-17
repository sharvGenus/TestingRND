const { MATERIAL_QUANTITIES, PROJECTS, USERS, MATERIALS, MASTER_MAKER_LOVS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for material_quantities table
 *
 * Created by               Version                         Date
 * Kaif                     1.0.0                           6 Oct 2023
 *
 * @class materialQuantities
 */
class MaterialQuantities extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = MATERIAL_QUANTITIES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            materialId: "material_id",
            groupedMaterialId: "grouped_material_id",
            uomId: "uom_id",
            quantity: "quantity",
            materialQuantity: "material_quantity",
            integrationId: "integration_id",
            isActive: "is_active",
            remarks: "remarks",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[PROJECTS],
                attributes: ["id", "name", "code"],
                foreignKey: "project_id"
            },
            {
                model: this.db[MATERIALS],
                attributes: ["id", "name", "code"],
                foreignKey: "material_id"
            },
            {
                model: this.db[MATERIALS],
                attributes: ["id", "name", "code"],
                foreignKey: "grouped_material_id",
                as: "groupMaterial"
            },
            {
                model: this.db[MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "uom_id",
                as: "uom"
            },
            {
                model: this.db[USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "created_by",
                as: "created"

            },
            {
                model: this.db[USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "updated_by",
                as: "updated"

            }
        ];
    }
}

module.exports = MaterialQuantities;
