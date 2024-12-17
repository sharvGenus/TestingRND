const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for daily_execution_plans_history table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           02 May 2024
 * 
 * @class DailyExecutionPlansHistory
 */
class DailyExecutionPlansHistory extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.DAILY_EXECUTION_PLANS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            materialTypeId: "material_type_id",
            month: "month",
            year: "year",
            q1: "q1",
            q2: "q2",
            q3: "q3",
            q4: "q4",
            q5: "q5",
            q6: "q6",
            q7: "q7",
            q8: "q8",
            q9: "q9",
            q10: "q10",
            q11: "q11",
            q12: "q12",
            q13: "q13",
            q14: "q14",
            q15: "q15",
            q16: "q16",
            q17: "q17",
            q18: "q18",
            q19: "q19",
            q20: "q20",
            q21: "q21",
            q22: "q22",
            q23: "q23",
            q24: "q24",
            q25: "q25",
            q26: "q26",
            q27: "q27",
            q28: "q28",
            q29: "q29",
            q30: "q30",
            q31: "q31",
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
                attributes: ["id", "name"]
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

module.exports = DailyExecutionPlansHistory;