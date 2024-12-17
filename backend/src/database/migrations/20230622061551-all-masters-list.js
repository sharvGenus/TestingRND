"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.ALL_MASTERS_LIST,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    field: "name"
                },
                visibleName: {
                    type: Sequelize.STRING,
                    field: "visible_name",
                    allowNull: false
                },
                accessFlag: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    field: "access_flag"
                },
                parent: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    field: "parent"
                },
                grandParent: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    field: "grand_parent"
                },
                parentRank: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    field: "parent_rank"
                },
                grandParentRank: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    field: "grand_parent_rank"
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(config.ALL_MASTERS_LIST);
    }
};
