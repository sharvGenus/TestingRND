const { ROLES_HISTORY, PROJECTS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database update and others for roles history table
 *
 * created by               version                         date
 * Ruhana                   1.0.0                           16 June 2023
 *
 * @class RolesHistory
 */
class RolesHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ROLES_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            description: "description",
            code: "code",
            projectId: "project_id",
            forTicket: "for_ticket",
            addTicket: "add_ticket",
            isImport: "is_import",
            isExport: "is_export",
            isUpdate: "is_update",
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
                attributes: ["id", "name"]
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

module.exports = RolesHistory;
