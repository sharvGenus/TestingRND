const { CITIES_HISTORY, STATES, COUNTRIES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database  update, count and others for cities history table
 *
 * created by               version                         date
 * Ruhana                 1.0.0                           15 june 2023
 *
 * @class citiesHistory
 */
class CitiesHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = CITIES_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            code: "code",
            stateId: "state_id",
            integrationId: "integration_id",
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

module.exports = CitiesHistory;
