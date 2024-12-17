"use strict";

const { USERS, UESR_SESSOINS } = require("../../config/database-schema");

/**
 * A sample migration to create table and insert data from csv keep this file for future reference
 */
module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            UESR_SESSOINS,
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
                        model: USERS,
                        key: "id"
                    }
                },
                lastActiveAt: {
                    type: Sequelize.DATE,
                    field: "last_active_at",
                    allowNull: false
                },
                userAgent: {
                    type: Sequelize.TEXT,
                    field: "user_agent"
                },
                loggedInUsingOTP: {
                    type: Sequelize.BOOLEAN,
                    field: "logged_in_using_otp",
                    defaultValue: false
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
        return queryInterface.dropTable(UESR_SESSOINS);
    }
};
