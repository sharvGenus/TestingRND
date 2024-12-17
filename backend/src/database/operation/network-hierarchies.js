const { NETWORK_HIERARCHIES, PROJECTS, NETWORK_LEVEL_ENTRIES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for NetworkHierarchies table
 *
 * created by               version                         date
 * Tarun                   1.0.0                            02 June 2023
 *
 * @class NetworkHierarchies
 */
class NetworkHierarchies extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = NETWORK_HIERARCHIES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            projectId: "project_id",
            code: "code",
            rank: "rank",
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
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[NETWORK_LEVEL_ENTRIES],
                attributes: ["id", "name", "code", "parentId"]
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

module.exports = NetworkHierarchies;
