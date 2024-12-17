const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for Billing Basic Details table
 * 
 * Created by               Version                         Date
 * Kaif                     1.0.0                           20 OCT 2023
 * 
 * @class BillingBasicDetails
 */
class BillingBasicDetails extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.BILLING_BASIC_DETAILS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            billNumber: "bill_number",
            integrationId: "integration_id",
            isApproved: "is_approved",
            projectId: "project_id",
            invoiceNumber: "invoice_number",
            invoiceDate: "invoice_date",
            workOrder: "work_order",
            bankName: "bank_name",
            ifscCode: "ifsc_code",
            accountNumber: "account_number",
            totalAmount: "total_amount",
            sapNumber: "sap_number",
            attachments: "attachments",
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
                model: this.db[config.PROJECTS],
                attributes: ["id", "name", "code"]
            }
        ];
          
    }

    /*
     *
     * Method to add userId value in created and updated by
     */
    setUserId = (obj) => {
        if (!obj.createdBy) {
            obj.createdBy = this.userData.userId;
        }
        if (!obj.updatedBy) {
            obj.updatedBy = this.userData.userId;
        }
    };

    /**
     * Method to create new records in database with association
     * @param {Object} payLoad
     * @param {Object} transaction
     * @returns {Promise<Object>}
     */
    async createWithAssociation(payLoad, transaction) {
        if (payLoad && this.userData?.userId) {
            this.setUserId(payLoad);
            if (payLoad.billing_material_details) {
                payLoad.billing_material_details.forEach((x) => {
                    this.setUserId(x);
                });
            }
        }
        return this.model.create(
            payLoad,
            {
                include: [config.BILLING_MATERIAL_DETAILS]
            },
            {
                transaction,
                individualHooks: true,
                returning: true
            }
        );
    }
}

module.exports = BillingBasicDetails;