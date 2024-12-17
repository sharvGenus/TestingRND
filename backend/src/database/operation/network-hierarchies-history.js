const { NETWORK_HIERARCHIES_HISTORY, PROJECTS, NETWORK_LEVEL_ENTRIES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for NetworkHierarchies history table
 *
 * created by               version                         date
 * Ruhana                    1.0.0                           16 June 2023
 *
 * @class NetworkHierarchiesHistory
 */
class NetworkHierarchiesHistory extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = NETWORK_HIERARCHIES_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            code: "code",
            rank: "rank",
            projectId: "project_id",
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
                model: this.db[PROJECTS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[NETWORK_LEVEL_ENTRIES],
                attributes: ["id", "name", "code"]
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

module.exports = NetworkHierarchiesHistory;
