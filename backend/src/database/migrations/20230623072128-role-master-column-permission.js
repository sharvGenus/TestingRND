"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.ROLE_MASTER_COLUMN_PERMISSION,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                roleId: {
                    type: Sequelize.UUID,
                    field: "role_id",
                    references: {
                        model: config.ROLES,
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
                columnId: {
                    type: Sequelize.UUID,
                    field: "column_id",
                    references: {
                        model: config.USER_MASTER_COLUMN_PERMISSION,
                        key: "id"
                    }
                },
                view: {
                    type: Sequelize.BOOLEAN,
                    field: "view",
                    allowNull: false
                },
                add: {
                    type: Sequelize.BOOLEAN,
                    field: "add",
                    allowNull: false
                },
                edit: {
                    type: Sequelize.BOOLEAN,
                    field: "edit",
                    allowNull: false
                },
                delete: {
                    type: Sequelize.BOOLEAN,
                    field: "delete",
                    allowNull: false
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
        await queryInterface.dropTable(config.ROLE_MASTER_COLUMN_PERMISSION);
    }
};
