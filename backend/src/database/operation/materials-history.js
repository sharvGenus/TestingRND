const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for materials history table
 *
 * Created by               Version                         Date
 * Kaif                     1.0.0                           27 july 2023
 *
 * @class MaterialsHistory
 */
class MaterialsHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.MATERIALS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            materialTypeId: "material_type_id",
            name: "name",
            code: "code",
            description: "description",
            sapDescription: "sap_description",
            longDescription: "long_description",
            uomId: "uom_id",
            hsnCode: "hsn_code",
            recordId: "record_id",
            isSerialNumber: "is_serial_number",
            attachments: "attachments",
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
                foreignKey: "material_type_id",
                as: "material_type",
                include: [
                    {
                        model: this.db[config.MASTER_MAKERS],
                        attributes: ["id", "name"]
                    }
                ]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "uom_id",
                as: "material_uom",
                include: [
                    {
                        model: this.db[config.MASTER_MAKERS],
                        attributes: ["id", "name"]
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
}

module.exports = MaterialsHistory;
