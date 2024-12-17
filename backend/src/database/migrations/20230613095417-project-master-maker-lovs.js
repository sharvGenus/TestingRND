"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.PROJECT_MASTER_MAKER_LOVS,
            {
                masterId: {
                    type: Sequelize.UUID,
                    field: "master_id",
                    references: {
                        model: config.PROJECT_MASTER_MAKERS,
                        key: "id"
                    }
                },
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
                code: {
                    type: Sequelize.STRING,
                    field: "code",
                    allowNull: false,
                    defaultValue: "NA"
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
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(config.PROJECT_MASTER_MAKER_LOVS);
    }
};
