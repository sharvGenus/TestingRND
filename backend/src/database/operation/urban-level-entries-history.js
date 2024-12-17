const { URBAN_LEVEL_ENTRIES_HISTORY, URBAN_LEVEL_ENTRIES, URBAN_HIERARCHIES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for UrbanLevelEntries table
 *
 * Created by               Version                         Date
 * Nipun                    1.0.0                           07 November 2024
 *
 * @class UrbanLevelEntriesHistory
 */
class UrbanLevelEntriesHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = URBAN_LEVEL_ENTRIES_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            name: "name",
            code: "code",
            urbanHierarchyId: "urban_hierarchy_id",
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
                model: this.db[URBAN_HIERARCHIES],
                attributes: ["id", "name", "projectId"]
            },
            {
                model: this.db[URBAN_LEVEL_ENTRIES],
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

module.exports = UrbanLevelEntriesHistory;
