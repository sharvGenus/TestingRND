"use strict";

const { URBAN_HIERARCHIES, PROJECTS } = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(URBAN_HIERARCHIES, {
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
            projectId: {
                type: Sequelize.UUID,
                field: "project_id",
                references: {
                    model: PROJECTS,
                    key: "id"
                }
            },
            code: {
                type: Sequelize.STRING,
                field: "code",
                allowNull: false
            },
            rank: {
                type: Sequelize.INTEGER,
                field: "rank"
            },
            isMapped: {
                type: Sequelize.ENUM,
                field: "is_mapped",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "0"
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
            levelType: {
                type: Sequelize.STRING,
                field: "level_type"
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
        await queryInterface.sequelize.query(`CALL create_history_table('public', '${URBAN_HIERARCHIES}')`);
    },
    down: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`TRUNCATE TABLE ${URBAN_HIERARCHIES};`);
        await queryInterface.dropTable(URBAN_HIERARCHIES);
    }
};
