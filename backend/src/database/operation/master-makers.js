const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for master maker table
 *
 * Created by               Version                         Date
 * Ruhana                   1.0.0                           29 May 2023
 *
 * @class MasterMaker
 */
class MasterMakers extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.MASTER_MAKERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
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

module.exports = MasterMakers;
