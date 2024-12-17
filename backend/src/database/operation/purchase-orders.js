const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for purchase_orders table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           12 Jul 2023
 * 
 * @class PurchaseOrders
 */
class PurchaseOrders extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.PURCHASE_ORDERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            poNumber: "po_number",
            poDate: "po_date",
            revisionReference: "revision_reference",
            revisionDate: "revision_date",
            plantCode: "plant_code",
            organizationIntegrationId: "organization_integration_id",
            billingAddress: "billing_address",
            deliveryAddress: "delivery_address",
            materialIntegrationId: "material_integration_id",
            longDescription: "longDescription",
            quantity: "quantity",
            unitPrice: "unit_price",
            priceUnit: "price_unit",
            totalPrice: "total_price",
            tax: "tax",
            deliverySchedule: "delivery_schedule",
            status: "status",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
    }

    /**
     * Method to return group data by groupColumn with count
     * @param {Object} groupColumn
     * @param {Object} whereCondition
     * @returns {Promise<Object>}
     */
    async groupWithCount(
        groupColumn,
        whereCondition
    ) {
        const [rows] = await Promise.all([
            this.model.findAll({
                attributes: [groupColumn],
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                group: [groupColumn]
            })
        ]);
        return { rows, count: rows.length };
    }

}

module.exports = PurchaseOrders;