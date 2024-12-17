"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(config.ESCALATION_MATRIX, {
            id: {
                type: Sequelize.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            projectId: {
                type: Sequelize.UUID,
                field: "project_id",
                references: {
                    model: config.PROJECTS,
                    key: "id"
                }
            },
            emailTemplateId: {
                type: Sequelize.UUID,
                field: "email_template_id"
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
        });
    },

    down: async function (queryInterface, Sequelize) {
        return queryInterface.dropTable(config.ESCALATION_MATRIX);
    }
};
