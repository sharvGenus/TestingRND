"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.PROJECT_SCOPE_EXTENSIONS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                projectScopeId: {
                    type: Sequelize.UUID,
                    field: "project_scope_id",
                    references: {
                        model: config.PROJECT_SCOPES,
                        key: "id"
                    }
                },
                extensionQuantity: {
                    type: Sequelize.FLOAT,
                    field: "extension_quantity",
                    allowNull: false
                },
                extensionStartDate: {
                    type: Sequelize.DATE,
                    field: "extension_start_date",
                    allowNull: false
                },
                extensionMonth: {
                    type: Sequelize.FLOAT,
                    field: "extension_month",
                    allowNull: false
                },
                extensionEndDate: {
                    type: Sequelize.DATE,
                    field: "extension_end_date",
                    allowNull: false
                },
                documentNumber: {
                    type: Sequelize.STRING,
                    field: "document_number"
                },
                documentDate: {
                    type: Sequelize.DATE,
                    field: "document_date"
                },
                attachments: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                    field: "attachments"
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
        return queryInterface.dropTable(config.PROJECT_SCOPE_EXTENSIONS);
    }
};