const { USER_MASTER_PERMISSIONS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for user masters permissions table
 * 
 * created by               version                         date
 * Mohammed Sameer          1.0.0                        22 June 2023
 * 
 * @class userMasterPermissions
 */
class UserMasterPermissions extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = USER_MASTER_PERMISSIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            userId: "user_id",
            masterId: "master_id",
            grandParentId: "grand_parent_id",
            parentId: "parent_id",
            masterRoute: "master_route",
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
            }
            // ,
            // {
            //     model: this.db[ALL_MASTERS_LIST],
            //     attributes: ["id", "name", "visible_name"]
            // }
        ];
    }
}

module.exports = UserMasterPermissions;