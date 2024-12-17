"use strict";

const { ATTRIBUTE_INTEGRATION_BLOCKS, FORMS } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(ATTRIBUTE_INTEGRATION_BLOCKS, {
            id: {
                type: Sequelize.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: Sequelize.STRING,
                field: "name",
                allowNull: false
            },
            formId: {
                type: Sequelize.UUID,
                field: "form_id",
                references: {
                    model: FORMS,
                    key: "id"
                }
            },
            endpoint: {
                type: Sequelize.TEXT,
                field: "endpoint",
                allowNull: false
            },
            isActive: {
                type: Sequelize.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            type: {
                type: Sequelize.ENUM,
                field: "type",
                values: ["and", "or"],
                allowNull: false,
                defaultValue: "and"
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
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(ATTRIBUTE_INTEGRATION_BLOCKS);
    }
};
