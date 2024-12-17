"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.WORK_AREA_ASSIGNMENT,
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
                gaaHierarchyId: {
                    type: Sequelize.UUID,
                    field: "gaa_hierarchy_id",
                    references: {
                        model: config.GAA_HIERARCHIES,
                        key: "id"
                    }
                },
                gaaLevelEntryId: {
                    type: Sequelize.UUID,
                    field: "gaa_level_entry_id",
                    references: {
                        model: config.GAA_LEVEL_ENTRIES,
                        key: "id"
                    }
                },
                networkHierarchyId: {
                    type: Sequelize.UUID,
                    field: "network_hierarchy_id",
                    references: {
                        model: config.NETWORK_HIERARCHIES,
                        key: "id"
                    }
                },
                networkLevelEntryId: {
                    type: Sequelize.UUID,
                    field: "network_level_entry_id",
                    references: {
                        model: config.NETWORK_LEVEL_ENTRIES,
                        key: "id"
                    }
                },
                dateFrom: {
                    type: Sequelize.DATE,
                    field: "date_from"
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
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(config.WORK_AREA_ASSIGNMENT);
    }
};