const { GAA_HIERARCHIES_HISTORY, PROJECTS, GAA_LEVEL_ENTRIES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for GaaHierarchiesHistory table
 *
 * created by               version                         date
 * Ruhana                    1.0.0                           16 June 2023
 *
 * @class GaaHierarchiesHistory
 */
class GaaHierarchiesHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = GAA_HIERARCHIES_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            projectId: "project_id",
            code: "code",
            rank: "rank",
            isMapped: "is_mapped",
            remarks: "remarks",
            levelType: "level_type",
            recordId: "record_id",
            isActive: "is_active",
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
                model: this.db[GAA_LEVEL_ENTRIES],
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

module.exports = GaaHierarchiesHistory;
