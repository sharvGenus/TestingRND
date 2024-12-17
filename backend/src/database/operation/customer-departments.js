const { CUSTOMER_DEPARTMENTS, ORGANIZATIONS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for customer department history table
 *
 * Created by               Version                         Date
 * Divya                    1.0.0                        01 JUNE 2023
 * 
 * Updated by               Version                         Date
 * Mohammed Sameer          1.0.0                        22 JUNE 2023
 *
 * @class CustomerDepartment
 */
class CustomerDepartment extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = CUSTOMER_DEPARTMENTS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            customerId: "customer_id",
            name: "name",
            code: "code",
            attachments: "attachments",
            remarks: "remarks",
            integrationId: "integration_id",
            isActive: "is_active",
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

module.exports = CustomerDepartment;
