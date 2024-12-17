"use strict";

const config = require("../../config/database-schema");

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.FORMS_NOTIFICATIONS,
            {
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
                category: {
                    type: Sequelize.ENUM,
                    field: "category",
                    values: ["resurvey", "handt"],
                    allowNull: false
                },
                isRead: {
                    type: Sequelize.BOOLEAN,
                    field: "is_read",
                    defaultValue: false
                },
                formId: {
                    type: Sequelize.UUID,
                    field: "form_id",
                    references: {
                        model: config.FORMS,
                        key: "id"
                    }
                },
                userId: {
                    type: Sequelize.UUID,
                    field: "user_id",
                    references: {
                        model: config.USERS,
                        key: "id"
                    }
                },
                responseId: {
                    type: Sequelize.UUID,
                    field: "response_id"
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
                }
            }
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable(config.FORMS_NOTIFICATIONS);
    }
};