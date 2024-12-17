const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for Approvers table
 * 
 * Created by               Version                         Date
 * Shefali Jain                      1.0.0                           05 July 2023
 * 
 * @class Approvers
 */
class Approvers extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.APPROVERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            userId: "user_id",
            transactionTypeId: "transaction_type_id",
            storeId: "store_id",
            organizationTypeId: "organization_type_id",
            organizationNameId: "organization_name_id",
            projectId: "project_id",
            email: "email",
            mobileNumber: "mobile_number",
            rank: "rank",
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
                foreignKey: "transaction_type_id",
                as: "transaction_type"
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name"],
                foreignKey: "store_id"
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name", "code"],
                foreignKey: "project_id"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "organization_type_id",
                as: "organization_type"
            },
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code", "organizationTypeId"],
                foreignKey: "organization_name_id"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "user_id"
            }
        ];
    }
}

module.exports = Approvers;