const { CUSTOMER_DESIGNATIONS_HISTORY, CUSTOMER_DEPARTMENTS, ORGANIZATIONS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database update, and others for customer designation history table
 *
 * Created by               Version                         Date
 * Ruhana                    1.0.0                           14 JUNE 2023
 *
 * @class CustomerDesignationHistory
 */
class CustomerDesignationsHistory extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = CUSTOMER_DESIGNATIONS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            customerDepartmentId: "customer_department_id",
            name: "name",
            code: "code",
            attachments: "attachments",
            integrationId: "integration_id",
            isActive: "is_active",
            remarks: "remarks",
            recordId: "record_id",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[CUSTOMER_DEPARTMENTS],
                attributes: ["id", "name", "code"],
                include: [
                    {
                        model: this.db[ORGANIZATIONS],
                        attributes: ["id", "name"]
                    }
                ]
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

module.exports = CustomerDesignationsHistory;
