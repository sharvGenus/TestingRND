const config = require("../../config/database-schema");
const { ESCALATION_LEVELS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for Escalation Levels table
 *
 * created by               version                         date
 * Ruhana                   1.0.0                           16 Nov 2023
 *
 * updated by               version                         date
 *
 * @class EscalationLevels
 */

class EscalationLevels extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ESCALATION_LEVELS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            to: "to",
            cc: "cc",
            escalationId: "escalation_id",
            time: "time",
            level: "level",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "created_by",
                as: "created"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "updated_by",
                as: "updated"
            },
            {
                model: this.db[config.ESCALATION_MATRIX],
                attributes: ["id", "name"],
                foreignKey: "escalation_id"
            }
        ];
    }
}

module.exports = EscalationLevels;
