const { USER_MASTER_COLUMN_PERMISSION, USERS, ALL_MASTERS_LIST, ROLES } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for user masters permissions table
 * 
 * created by               version                         date
 * Divya                    1.0.0                        22 June 2023
 * 
 * @class userMasterColumnPermissions
 */
class UserMasterColumnPermissions extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = USER_MASTER_COLUMN_PERMISSION;
        this.initialiseModel();
        this.fields = {
            id: "id",
            userId: "user_id",
            roleId: "role_id",
            masterId: "master_id",
            columnId: "column_id",
            columnsArray: "columns_array",
            view: "view",
            edit: "edit",
            add: "add",
            delete: "delete",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[USERS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[ROLES],
                attributes: ["id", "name"]
            },
            {
                model: this.db[ALL_MASTERS_LIST],
                attributes: ["id", "name"]
            }
            // {
            //     model: this.db[ALL_MASTER_COLUMNS_LIST],
            //     attributes: ["id", "name"]
            // }
        ];
    }
}

module.exports = UserMasterColumnPermissions;