const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for qa_master_makers_history table
 *
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           26 Jun 2024
 *
 * @class QaMasterMakersHistory
 */
class QaMasterMakersHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.QA_MASTER_MAKERS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            meterTypeId: "meter_type_id",
            name: "name",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            recordId: "record_id"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "meter_type_id",
                as: "meter_type"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "created_by",
                as: "created"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "updated_by",
                as: "updated"
            }
        ];
    }
}

module.exports = QaMasterMakersHistory;