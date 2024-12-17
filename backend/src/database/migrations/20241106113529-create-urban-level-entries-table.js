"use strict";

const { URBAN_LEVEL_ENTRIES } = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(URBAN_LEVEL_ENTRIES, {
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
            integrationId: {
                type: Sequelize.STRING,
                field: "integration_id"
            },
            code: {
                type: Sequelize.STRING,
                field: "code",
                allowNull: false
            },
            urbanHierarchyId: {
                type: Sequelize.UUID,
                field: "urban_hierarchy_id"
            },
            approvalStatus: {
                type: Sequelize.ENUM("Approved", "Unapproved"), // ENUM type with values
                field: "approval_status",
                allowNull: true, // Allow NULL values
                defaultValue: "Unapproved" // Set default value
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

        // Add the `parent_id` column with the self-referencing foreign key constraint
        await queryInterface.addColumn(URBAN_LEVEL_ENTRIES, "parent_id", {
            type: Sequelize.UUID,
            references: {
                model: URBAN_LEVEL_ENTRIES,
                key: "id"
            }
        });
        await queryInterface.sequelize.query(`CALL create_history_table('public', '${URBAN_LEVEL_ENTRIES}')`);
        await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS index_urbanid_parentid ON ${URBAN_LEVEL_ENTRIES} (parent_id);
            CREATE INDEX IF NOT EXISTS index_urbanid_name ON ${URBAN_LEVEL_ENTRIES} (name);
            CREATE INDEX IF NOT EXISTS index_urbanid_urban_hierarchy_id ON ${URBAN_LEVEL_ENTRIES} (urban_hierarchy_id);`);

    },
    down: async function (queryInterface, Sequelize) {
        await queryInterface.removeIndex(URBAN_LEVEL_ENTRIES, "index_urbanid_parentid");
        await queryInterface.removeIndex(URBAN_LEVEL_ENTRIES, "index_urbanid_name");
        await queryInterface.removeIndex(URBAN_LEVEL_ENTRIES, "index_urbanid_urban_hierarchy_id");
        await queryInterface.sequelize.query(`TRUNCATE TABLE ${URBAN_LEVEL_ENTRIES};`);
        await queryInterface.dropTable(URBAN_LEVEL_ENTRIES);
    }
};
