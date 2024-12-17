"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.EMAIL_TEMPLATES,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                transactionTypeId: {
                    type: Sequelize.UUID,
                    field: "transaction_type_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                displayName: {
                    type: Sequelize.STRING,
                    field: "display_name",
                    allowNull: false
                },
                subject: {
                    type: Sequelize.STRING,
                    field: "subject",
                    allowNull: false
                },
                templateName: {
                    type: Sequelize.STRING,
                    field: "template_name"
                },
                body: {
                    type: Sequelize.TEXT,
                    field: "body",
                    allowNull: false
                },
                isAttchmentAvailable: {
                    type: Sequelize.BOOLEAN,
                    field: "is_attachment_available"
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(config.EMAIL_TEMPLATES);
    }
};
