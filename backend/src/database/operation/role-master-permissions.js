const { ROLE_MASTER_PERMISSIONS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for role masters permissions table
 * 
 * created by               version                         date
 * Mohammed Sameer          1.0.0                        23 August 2023
 * 
 * @class roleMasterPermissions
 */
class roleMasterPermissions extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ROLE_MASTER_PERMISSIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            roleId: "role_id",
            masterId: "master_id",
            masterRoute: "master_route",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        // this.relations = [
        //     {
        //         model: this.db[ROLES],
        //         attributes: ["id", "name"]
        //     }
        //     // ,
        //     // {
        //     //     model: this.db[ALL_MASTERS_LIST],
        //     //     attributes: ["id", "name", "visible_name"]
        //     // }
        // ];
    }
}

module.exports = roleMasterPermissions;