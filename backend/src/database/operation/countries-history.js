const { COUNTRIES_HISTORY, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for cities table
 * 
 * created by               version                         date
 * Tarun                   1.0.0                           30 May 2023
 * 
 * @class Cities
 */
class CountriesHistory extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = COUNTRIES_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            code: "code",
            integrationId: "integration_id",
            remarks: "remarks",
            isActive: "is_active",
            recordId: "record_id",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
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

module.exports = CountriesHistory;