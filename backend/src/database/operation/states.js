const { STATES, COUNTRIES, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for states table
 * 
 * created by               version                         date
 * Tarun                   1.0.0                           31 May 2023
 * 
 * @class States
 */
class States extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = STATES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            code: "code",
            countryId: "country_id",
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
                model: this.db[COUNTRIES],
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

module.exports = States;