const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for devolution_mappings table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           29 Aug 2024
 * 
 * @class DevolutionMappings
 */
class DevolutionMappings extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.DEVOLUTION_MAPPINGS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            devolutionConfigId: "devolution_config_id",
            formAttributeId: "form_attribute_id",
            newName: "new_name",
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
                model: this.db[config.FORM_ATTRIBUTES],
                attributes: ["id", "name", "columnName"]
            }
        ];
    }
}

module.exports = DevolutionMappings;