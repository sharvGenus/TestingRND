const { CITIES, COUNTRIES, STATES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for cities table
 *
 * created by               version                         date
 * Harish                   1.0.0                           26 May 2023
 *
 * updated by               version                         date
 * Tarun                    1.0.0                           31 May 2023
 * @class Cities
 */
class Cities extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = CITIES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            code: "code",
            stateId: "state_id",
            integrationId: "integration_id",
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
                model: this.db[STATES],
                attributes: ["id", "name", "code"],
                include: [{
                    model: this.db[COUNTRIES],
                    attributes: ["id", "name", "code"]
                }]
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

module.exports = Cities;
