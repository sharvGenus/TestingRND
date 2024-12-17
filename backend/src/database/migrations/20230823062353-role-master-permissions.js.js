"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.ROLE_MASTER_PERMISSIONS,
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
                masterRoute: {
                    type: Sequelize.STRING,
                    field: "master_route"
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
        await queryInterface.dropTable(config.ROLE_MASTER_PERMISSIONS);
    }
};
