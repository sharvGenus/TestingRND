const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for devolution_materials table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           05 Sep 2024
 * 
 * @class DevolutionMaterials
 */
class DevolutionMaterials extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.DEVOLUTION_MATERIALS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            devolutionId: "devolution_id",
            responseId: "response_id",
            oldSerialNo: "old_serial_no",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at"
        };
        this.fieldsList = Object.keys(this.fields);
    }
}

module.exports = DevolutionMaterials;