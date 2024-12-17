const { ALL_MASTERS_LIST } = require("../../config/database-schema");
const { includes } = require("../../middlewares/helmet");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for all master list table
 *
 * Created by               Version                         Date
 * Ruhana                     1.0.0                           22 june 2023
 *
 * @class CustomerStores
 */
class AllMastersList extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ALL_MASTERS_LIST;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            visibleName: "visible_name",
            accessFlag: "access_flag",
            isMaster: "is_master",
            lovAccess: "lov_access",
            masterRoute: "master_route",
            parent: "parent",
            grandParent: "grand_parent",
            parentRank: "parent_rank",
            grandParentRank: "grand_parent_rank",
            rank: "rank",
            grandParentId: "grand_parent_id",
            parentId: "parent_id",
            tableType: "table_type",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[ALL_MASTERS_LIST],
                attributes: ["id", "name", "visible_name", "rank"],
                as: "parent_info"
            },
            {
                model: this.db[ALL_MASTERS_LIST],
                attributes: ["id", "name", "visible_name", "rank"],
                as: "grand_parent_info"
            }
        ];
    }

    // async findAll(...args) {
    //     this.relations = [
    //         {
    //             model: this.db[ALL_MASTERS_LIST],
    //             attributes: ["id", "name", "visibleName", "rank", "parentId", "grandParentId", "masterRoute"],
    //             as: "child",
    //             includes: [{
    //                 model: this.db[ALL_MASTERS_LIST],
    //                 attributes: ["id", "name", "visibleName", "rank", "parentId", "grandParentId", "masterRoute"],
    //                 as: "subChild"
    //             }]
    //         }
    //     ];
    //     return super.findAll(...args);
    // }
}

module.exports = AllMastersList;
