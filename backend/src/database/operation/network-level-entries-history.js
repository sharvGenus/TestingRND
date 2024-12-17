const { NETWORK_LEVEL_ENTRIES_HISTORY, NETWORK_HIERARCHIES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for NetworkLevelEntries table
 *
 * created by               version                          date
 * Tarun                    1.0.0                            19 June 2023
 *
 * @class NetworkLevelEntries
 */
class NetworkLevelEntriesHistory extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = NETWORK_LEVEL_ENTRIES_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            code: "code",
            integrationId: "integration_id",
            networkHierarchyId: "network_hierarchy_id",
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
                model: this.db[NETWORK_HIERARCHIES],
                attributes: ["id", "name", "projectId"]
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

module.exports = NetworkLevelEntriesHistory;
