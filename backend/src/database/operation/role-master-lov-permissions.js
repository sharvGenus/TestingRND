const { ROLE_MASTER_LOV_PERMISSIONS, ROLES, ALL_MASTERS_LIST } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database update and others for roles master column permission table.
 *
 * created by               version                         date
 * Tarun                    1.0.0                           26 June 2023
 *
 * @class RoleMasterRolePermissions
 */
class RoleMasterRolePermissions extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ROLE_MASTER_LOV_PERMISSIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            roleId: "role_id",
            masterId: "master_id",
            lovId: "lov_id",
            lovArray: "lov_array",
            isAllRowsGoverned: "is_all_rows_governed",
            view: "view",
            add: "add",
            edit: "edit",
            delete: "delete",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[ROLES],
                attributes: ["id", "name"],
                foreignKey: "role_id"
            },
            {
                model: this.db[ALL_MASTERS_LIST],
                attributes: ["id", "name"],
                foreignKey: "master_id"
            }
        ];
    }
}

module.exports = RoleMasterRolePermissions;
