const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for qa_master_maker_lovs_history table
 *
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           26 Jun 2024
 *
 * @class QaMasterMakerLovsHistory
 */
class QaMasterMakerLovsHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.QA_MASTER_MAKER_LOVS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            masterId: "master_id",
            majorContributor: "major_contributor",
            code: "code",
            priority: "priority",
            defect: "defect",
            observationTypeId: "observation_type_id",
            observationSeverityId: "observation_severity_id",
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
                model: this.db[config.QA_MASTER_MAKERS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "observation_type_id",
                as: "observation_type"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "observation_severity_id",
                as: "observation_severity"
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

module.exports = QaMasterMakerLovsHistory;