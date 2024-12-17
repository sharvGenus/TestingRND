"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.USER_MASTER_LOV_PERMISSION,
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
                        model: config.ALL_MASTER_COLUMNS_LIST,
                        key: "id"
                    }
                },
                lovId: {
                    type: Sequelize.UUID,
                    field: "lov_id"
                },
                view: {
                    type: Sequelize.STRING,
                    field: "view"
                },
                add: {
                    type: Sequelize.STRING,
                    field: "add"
                },
                edit: {
                    type: Sequelize.STRING,
                    field: "edit"
                },
                delete: {
                    type: Sequelize.STRING,
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
        await queryInterface.dropTable(config.USER_MASTER_LOV_PERMISSION);
    }
};
