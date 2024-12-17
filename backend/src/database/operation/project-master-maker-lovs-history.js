const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for master maker lovs table
 *
 * Created by               Version                         Date
 * Ruhana                   1.0.0                           16 JUNE 2023
 *
 * @class ProjectMasterMakerLovs
 */
class ProjectMasterMakerLovsHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.PROJECT_MASTER_MAKER_LOVS_HISTORY;
        this.initialiseModel();
        this.fields = {
            masterId: "master_id",
            id: "id",
            name: "name",
            code: "code",
            description: "description",
            isActive: "is_active",
            recordId: "record_id",
            remarks: "remarks",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.PROJECT_MASTER_MAKERS],
                attributes: ["id", "name"]
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

module.exports = ProjectMasterMakerLovsHistory;