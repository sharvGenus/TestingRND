const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for request_approvers table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           19 Jul 2023
 * 
 * @class RequestApprovers
 */
class RequestApprovers extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.REQUEST_APPROVERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            transactionTypeId: "transaction_type_id",
            storeId: "store_id",
            requestNumber: "requestNumber",
            approverId: "approver_id",
            rank: "rank",
            status: "status",
            approvedMaterials: "approved_materials",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "transaction_type_id"
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name"],
                foreignKey: "store_id"
            }
        ];
    }
}

module.exports = RequestApprovers;
