const { ALL_MASTER_COLUMNS_LIST, ALL_MASTERS_LIST } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for all master  columns list table
 *
 * Created by               Version                         Date
 * Ruhana                     1.0.0                           22 june 2023
 *
 * @class CustomerStores
 */
class AllMasterColumnsList extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ALL_MASTER_COLUMNS_LIST;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            masterId: "master_id",
            visibleName: "visible_name",
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
                attributes: ["id"]
            }
        ];
    }
}

module.exports = AllMasterColumnsList;
