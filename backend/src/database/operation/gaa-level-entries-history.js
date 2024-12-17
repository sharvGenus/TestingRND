const { GAA_LEVEL_ENTRIES_HISTORY, GAA_LEVEL_ENTRIES, GAA_HIERARCHIES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for GaaLevelEntries table
 *
 * Created by               Version                         Date
 * Tarun                    1.0.0                           19 June 2023
 *
 * @class GaaLevelEntriesHistory
 */
class GaaLevelEntriesHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = GAA_LEVEL_ENTRIES_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            name: "name",
            code: "code",
            gaaHierarchyId: "gaa_hierarchy_id",
            parentId: "parent_id",
            approvalStatus: "approval_status",
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
                model: this.db[GAA_HIERARCHIES],
                attributes: ["id", "name", "projectId"]
            },
            {
                model: this.db[GAA_LEVEL_ENTRIES],
                attributes: ["id", "name"],
                as: "parent"
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

module.exports = GaaLevelEntriesHistory;
