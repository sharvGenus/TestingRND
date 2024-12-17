const { CUSTOMER_DEPARTMENTS_HISTORY, ORGANIZATIONS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database update, get count and others for customer department history table
 *
 * Created by               Version                         Date
 * Ruhana                   1.0.0                           15 JUNE 2023
 *
 * @class CustomerDepartmentHistory
 */
class CustomerDepartmentHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = CUSTOMER_DEPARTMENTS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            customerId: "customer_id",
            name: "name",
            code: "code",
            integrationId: "integration_id",
            attachments: "attachments",
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
                model: this.db[ORGANIZATIONS],
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

module.exports = CustomerDepartmentHistory;
