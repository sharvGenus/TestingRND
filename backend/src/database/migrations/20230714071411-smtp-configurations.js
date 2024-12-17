"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.SMTP_CONFIGURATIONS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                server: {
                    type: Sequelize.STRING,
                    field: "server",
                    allowNull: false
                },
                port: {
                    type: Sequelize.INTEGER,
                    field: "port",
                    allowNull: false
                },
                encryption: {
                    type: Sequelize.STRING,
                    field: "encryption",
                    allowNull: false
                },
                username: {
                    type: Sequelize.STRING,
                    field: "usermane",
                    allowNull: false
                },
                password: {
                    type: Sequelize.STRING,
                    field: "password",
                    allowNull: false
                },
                salt: {
                    type: Sequelize.STRING,
                    field: "salt",
                    allowNull: false
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
        return queryInterface.dropTable(config.SMTP_CONFIGURATIONS);
    }
};