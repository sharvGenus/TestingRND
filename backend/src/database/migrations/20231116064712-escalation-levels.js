"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(config.ESCALATION_LEVELS, {
            id: {
                type: Sequelize.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            to: {
                type: Sequelize.ARRAY(Sequelize.UUID),
                field: "to",
                allowNull: false
            },
            cc: {
                type: Sequelize.ARRAY(Sequelize.UUID),
                field: "cc",
                allowNull: false
            },
            escalationId: {
                type: Sequelize.UUID,
                field: "escalation_id",
                references: {
                    model: config.ESCALATION_MATRIX,
                    key: "id"
                }
            },
            level: {
                type: Sequelize.INTEGER,
                field: "level"
            },
            time: {
                type: Sequelize.STRING,
                field: "time"
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
        return queryInterface.dropTable(config.ESCALATION_LEVELS);
    }
};
