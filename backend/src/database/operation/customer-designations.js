const { CUSTOMER_DESIGNATIONS, CUSTOMER_DEPARTMENTS, ORGANIZATIONS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for firms table
 *
 * Created by               Version                         Date
 * Divya                    1.0.0                           01 JUNE 2023
 *
 * @class CustomerDesignation
 */
class CustomerDesignation extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = CUSTOMER_DESIGNATIONS;
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

module.exports = CustomerDesignation;
