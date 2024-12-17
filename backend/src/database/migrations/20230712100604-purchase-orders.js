"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.PURCHASE_ORDERS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                poNumber: {
                    type: Sequelize.STRING,
                    field: "po_number",
                    allowNull: false
                },
                poDate: {
                    type: Sequelize.DATE,
                    field: "po_date",
                    allowNull: false
                },
                revisionReference: {
                    type: Sequelize.STRING,
                    field: "revision_reference",
                    allowNull: false
                },
                revisionDate: {
                    type: Sequelize.DATE,
                    field: "revision_date",
                    allowNull: false
                },
                plantCode: {
                    type: Sequelize.STRING,
                    field: "plant_code",
                    allowNull: false
                },
                organizationIntegrationId: {
                    type: Sequelize.STRING,
                    field: "organization_integration_id",
                    allowNull: false
                },
                billingAddress: {
                    type: Sequelize.STRING,
                    field: "billing_address",
                    allowNull: false
                },
                deliveryAddress: {
                    type: Sequelize.STRING,
                    field: "delivery_address",
                    allowNull: false
                },
                materialIntegrationId: {
                    type: Sequelize.STRING,
                    field: "material_integration_id",
                    allowNull: false
                },
                longDescription: {
                    type: Sequelize.STRING,
                    field: "longDescription",
                    allowNull: false
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    field: "quantity",
                    allowNull: false
                },
                unitPrice: {
                    type: Sequelize.FLOAT,
                    field: "unit_price",
                    allowNull: false
                },
                priceUnit: {
                    type: Sequelize.INTEGER,
                    field: "price_unit",
                    allowNull: false
                },
                totalPrice: {
                    type: Sequelize.FLOAT,
                    field: "total_price",
                    allowNull: false
                },
                tax: {
                    type: Sequelize.FLOAT,
                    field: "tax",
                    allowNull: false
                },
                deliverySchedule: {
                    type: Sequelize.STRING,
                    field: "delivery_schedule",
                    allowNull: false
                },
                status: {
                    type: Sequelize.ENUM,
                    field: "status",
                    values: ["0", "1"],
                    allowNull: false,
                    defaultValue: "1"
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
                },
                isActive: {
                    type: Sequelize.ENUM,
                    field: "is_active",
                    values: ["0", "1"],
                    allowNull: false,
                    defaultValue: "1"
                },
                createdBy: {
                    type: Sequelize.UUID,
                    field: "created_by"
                },
                updatedBy: {
                    type: Sequelize.UUID,
                    field: "updated_by"
                },
                createdAt: {
                    type: Sequelize.DATE,
                    field: "created_at",
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    field: "updated_at",
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                    allowNull: false
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    field: "deleted_at"
                }
            }
        );
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(config.PURCHASE_ORDERS);
    }
};