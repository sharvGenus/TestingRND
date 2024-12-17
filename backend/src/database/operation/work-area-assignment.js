const { WORK_AREA_ASSIGNMENT, USERS, GAA_HIERARCHIES, NETWORK_HIERARCHIES, PROJECTS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for work area assignment table
 * 
 * created by               version                         date
 * Mohammed Sameer          1.0.0                        20 June 2023
 * 
 * @class workAreaAssignment
 */
class WorkAreaAssignment extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = WORK_AREA_ASSIGNMENT;
        this.initialiseModel();
        this.fields = {
            id: "id",
            userId: "user_id",
            gaaHierarchyId: "gaa_hierarchy_id",
            gaaLevelEntryId: "gaa_level_entry_id",
            networkHierarchyId: "network_hierarchy_id",
            networkLevelEntryId: "network_level_entry_id",
            hierarchyType: "hierarchy_type",
            projectId: "project_id",
            dateFrom: "date_from",
            dateTo: "date_to",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[USERS],
                attributes: ["id", "name", "code", "email", "mobileNumber"]
            },
            {
                model: this.db[GAA_HIERARCHIES],
                attributes: ["id", "name"]
            },
            {
                model: this.db[NETWORK_HIERARCHIES],
                attributes: ["id", "name"]
            },
            {
                model: this.db[PROJECTS],
                attributes: ["id", "name"]
            }
        ];
    }
}

module.exports = WorkAreaAssignment;