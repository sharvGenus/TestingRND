const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for Billing Material Details table
 * 
 * Created by               Version                         Date
 * Kaif                     1.0.0                           20 OCT 2023
 * 
 * @class BillingMaterialDetails
 */
class BillingMaterialDetails extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.BILLING_MATERIAL_DETAILS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            billingBasicDetailId: "billing_basic_detail_id",
            integrationId: "integration_id",
            particulars: "particulars",
            uomId: "uom_id",
            quantity: "quantity",
            rate: "rate",
            tax: "tax",
            amount: "amount",
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
                model: this.db[config.BILLING_BASIC_DETAILS],
                attributes: ["billNumber", "isApproved"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "uom_id"
            }
        ];
    }
}

module.exports = BillingMaterialDetails;