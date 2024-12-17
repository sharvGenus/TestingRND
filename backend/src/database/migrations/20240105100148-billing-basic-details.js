"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.BILLING_BASIC_DETAILS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                integrationId: {
                    type: Sequelize.STRING,
                    field: "integration_id"
                },
                billNumber: {
                    type: Sequelize.STRING,
                    field: "bill_number"
                },
                isApproved: {
                    type: Sequelize.BOOLEAN,
                    field: "is_approved"
                },
                projectId: {
                    type: Sequelize.UUID,
                    field: "project_id",
                    references: {
                        model: config.PROJECTS,
                        key: "id"
                    }
                },
                invoiceNumber: {
                    type: Sequelize.STRING,
                    field: "invoice_number"
                },
                invoiceDate: {
                    type: Sequelize.DATE,
                    field: "invoice_date"
                },
                workOrder: {
                    type: Sequelize.STRING,
                    field: "work_order"
                },
                totalAmount: {
                    type: Sequelize.STRING,
                    field: "total_amount"
                },
                sapNumber: {
                    type: Sequelize.STRING,
                    field: "sap_number"
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
                },
                attachments: {
                    type: Sequelize.TEXT,
                    field: "attachments"
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(config.BILLING_BASIC_DETAILS);
    }
};
