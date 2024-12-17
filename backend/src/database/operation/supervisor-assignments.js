const { SUPERVISOR_ASSIGNMENTS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for supervisor assignmrnts table
 *
 * created by               version                         date
 * Ruhana                    1.0.0                      20 June 2023
 *
 * Updated by               Version                         date
 * Mohammed Sameer           1.0.0                       22 June 2023
 *
 * @class SupervisorAssignments
 */
class SupervisorAssignments extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = SUPERVISOR_ASSIGNMENTS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            userId: "user_id",
            supervisorId: "supervisor_id",
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
                attributes: ["id", "name", "code", "email", "mobileNumber"],
                foreignKey: "user_id",
                as: "user"
            },
            {
                model: this.db[USERS],
                attributes: ["id", "name", "code", "email", "mobileNumber"],
                foreignKey: "supervisor_id",
                as: "supervisor"
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

module.exports = SupervisorAssignments;
