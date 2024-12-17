"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.USER_MASTER_PERMISSIONS,
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
                masterId: {
                    type: Sequelize.UUID,
                    field: "master_id",
                    references: {
                        model: config.ALL_MASTERS_LIST,
                        key: "id"
                    }
                },
                view: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    field: "view"
                },
                add: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    field: "add"
                },
                edit: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    field: "edit"
                },
                delete: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    field: "delete"
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
        await queryInterface.dropTable(config.USER_MASTER_PERMISSIONS);
    }
};
