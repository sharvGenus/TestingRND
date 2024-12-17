"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.SUPERVISOR_ASSIGNMENTS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                userId: {
                    type: Sequelize.UUID,
                    field: "user_id",
                    references: {
                        model: config.USERS,
                        key: "id"
                    }
                },
                supervisorId: {
                    type: Sequelize.UUID,
                    field: "supervisor_id",
                    references: {
                        model: config.USERS,
                        key: "id"
                    }
                },
                dateFrom: {
                    type: Sequelize.DATE,
                    field: "date_from",
                    allowNull: false
                },
                dateTo: {
                    type: Sequelize.DATE,
                    field: "date_to"
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
        return queryInterface.dropTable(config.SUPERVISOR_ASSIGNMENTS);
    }
};
