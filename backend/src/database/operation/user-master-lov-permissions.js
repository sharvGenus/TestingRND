const { USER_MASTER_LOV_PERMISSION, USERS } = require("../../config/database-schema");
const { Base } = require("./base");
 
/**
* Represents a database tables object with various properties and functionalities.
*
* This class provides the methods for database create, update, delete, get count and others for user masters permissions table
*
* created by               version                         date
* Divya                    1.0.0                        22 June 2023
*
* @class UserMasterLovPermissions
*/
class UserMasterLovPermissions extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = USER_MASTER_LOV_PERMISSION;
        this.initialiseModel();
        this.fields = {
            id: "id",
            userId: "user_id",
            roleId: "role_id",
            masterId: "master_id",
            columnId: "column_id",
            lovArray: "lov_array",
            isAllRowsGoverned: "is_all_rows_governed",
            lovId: "lov_id",
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
        ];
    }
 
    async findAllNew(whereCondition, order = [], attributes = this.fieldsList, isRelated = false, distinct = false, paginated = this.queryObject, raw = false, respectBlacklist = true, paranoid = false) {
        const [rows, count] = await Promise.all([
            this.model.findAll({
                attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
                include: [{
                    model: this.db[USERS]
                }],
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                distinct,
                ...raw && { raw, nest: true },
                ...isRelated && { include: this.relations },
                ...order.length > 0 && { order },
                ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated },
                ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false }
            }),
            this.model.count({
                include: [{
                    model: this.db[USERS]
                }],
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                distinct,
                ...isRelated && { include: this.relations },
                ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false }
            })
        ]);
        return { rows, count };
    }
 
    // async findAllNew(whereCondition, attributes = this.fieldsList, isRelated = false, distinct = false, paginated = this.queryObject, raw = false, respectBlacklist = true, paranoid = false) {
    //     return this.model.findAll({
    //         attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
    //         include: [{
    //             model: this.db[USERS]
    //         }],
    //         where: { ...this.getOverRidesQueries(), ...whereCondition },
    //         distinct,
    //         ...raw && { raw, nest: true },
    //         ...isRelated && { include: this.relations },
    //         ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false },
    //         ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }
    //     });
    // }
}
 
module.exports = UserMasterLovPermissions;