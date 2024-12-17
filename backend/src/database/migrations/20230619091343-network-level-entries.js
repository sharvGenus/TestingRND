"use strict";

const { NETWORK_LEVEL_ENTRIES, NETWORK_HIERARCHIES } = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(NETWORK_LEVEL_ENTRIES, {
            id: {
                type: Sequelize.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: Sequelize.STRING,
                field: "name",
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                field: "code",
                allowNull: false
            },
            integrationId: {
                type: Sequelize.STRING,
                field: "integration_id"
            },
            networkHierarchyId: {
                type: Sequelize.UUID,
                field: "network_hierarchy_id",
                references: {
                    model: NETWORK_HIERARCHIES,
                    key: "id"
                }
            },
            isActive: {
                type: Sequelize.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            remarks: {
                type: Sequelize.STRING,
                field: "remarks"
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
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(NETWORK_LEVEL_ENTRIES);
    }
};