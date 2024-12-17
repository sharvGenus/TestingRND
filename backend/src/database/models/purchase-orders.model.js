const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const purchaseOrders = sequelize.define(
        config.PURCHASE_ORDERS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            poNumber: {
                type: DataTypes.STRING,
                field: "po_number",
                allowNull: false
            },
            poDate: {
                type: DataTypes.DATE,
                field: "po_date",
                allowNull: false
            },
            revisionReference: {
                type: DataTypes.STRING,
                field: "revision_reference",
                allowNull: false
            },
            revisionDate: {
                type: DataTypes.DATE,
                field: "revision_date",
                allowNull: false
            },
            plantCode: {
                type: DataTypes.STRING,
                field: "plant_code",
                allowNull: false
            },
            organizationIntegrationId: {
                type: DataTypes.STRING,
                field: "organization_integration_id",
                allowNull: false
            },
            billingAddress: {
                type: DataTypes.STRING,
                field: "billing_address",
                allowNull: false
            },
            deliveryAddress: {
                type: DataTypes.STRING,
                field: "delivery_address",
                allowNull: false
            },
            materialIntegrationId: {
                type: DataTypes.STRING,
                field: "material_integration_id",
                allowNull: false
            },
            longDescription: {
                type: DataTypes.STRING,
                field: "longDescription",
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                field: "quantity",
                allowNull: false
            },
            unitPrice: {
                type: DataTypes.FLOAT,
                field: "unit_price",
                allowNull: false
            },
            priceUnit: {
                type: DataTypes.INTEGER,
                field: "price_unit",
                allowNull: false
            },
            totalPrice: {
                type: DataTypes.FLOAT,
                field: "total_price",
                allowNull: false
            },
            tax: {
                type: DataTypes.FLOAT,
                field: "tax",
                allowNull: false
            },
            deliverySchedule: {
                type: DataTypes.STRING,
                field: "delivery_schedule",
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM,
                field: "status",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            createdBy: {
                type: DataTypes.UUID,
                field: "created_by"
            },
            updatedBy: {
                type: DataTypes.UUID,
                field: "updated_by"
            },
            createdAt: {
                type: DataTypes.DATE,
                field: "created_at",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: "updated_at",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE,
                field: "deleted_at",
            }
        },
        {
            freezeTableName: true,
            paranoid: true
        }
    );

    return purchaseOrders;
};