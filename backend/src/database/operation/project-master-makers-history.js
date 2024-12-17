const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for master maker table
 *
 * Created by               Version                         Date
 * Ruhana                   1.0.0                           16 June 2023
 *
 * @class ProjectMasterMakersHistory
 */
class ProjectMasterMakersHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.PROJECT_MASTER_MAKERS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            name: "name",
            isActive: "is_active",
            remarks: "remarks",
            recordId: "record_id",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.PROJECTS],
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

module.exports = ProjectMasterMakersHistory;
