const { USER_COLUMN_DEFAULT_PERMISSIONS, USER_COLUMN_WISE_PERMISSIONS, FORM_ATTRIBUTES, FORMS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database update and others for roles column permission table
 *
 * created by               version                         date
 * Mohammed Sameer           1.0.0                       25 August 2023
 *
 * @class RoleColumnDefaultPermissions
 */
class UserColumnDefaultPermissions extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = USER_COLUMN_DEFAULT_PERMISSIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            roleId: "role_id",
            formId: "form_id",
            userId: "user_id",
            view: "view",
            add: "add",
            update: "update",
            deleteRecord: "delete_record",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[USER_COLUMN_WISE_PERMISSIONS],
                attributes: ["id", "view", "add", "update"],
                include: [
                    {
                        model: this.db[FORM_ATTRIBUTES],
                        attributes: ["id", "name", "columnName"],
                        paranoid: false
                    }
                ]
            },
            {
                model: this.db[FORMS],
                attributes: ["id", "name"],
                foreignKey: "form_id"
            },
            {
                model: this.db[USERS],
                attributes: ["id", "name"],
                foreignKey: "user_id"
            }
        ];
    }
}

module.exports = UserColumnDefaultPermissions;
