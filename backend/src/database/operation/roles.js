const { ROLES, PROJECTS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for roles table
 *
 * created by               version                         date
 * Tarun                   1.0.0                           01 June 2023
 *
 * @class Roles
 */
class Roles extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ROLES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            description: "description",
            code: "code",
            forTicket: "for_ticket",
            addTicket: "add_ticket",
            isImport: "is_import",
            isExport: "is_export",
            isUpdate: "is_update",
            projectId: "project_id",
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

module.exports = Roles;
