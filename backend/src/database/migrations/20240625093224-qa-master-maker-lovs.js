"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.QA_MASTER_MAKER_LOVS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                masterId: {
                    type: Sequelize.UUID,
                    field: "master_id",
                    allowNull: false,
                    references: {
                        model: config.QA_MASTER_MAKERS,
                        key: "id"
                    }
                },
                majorContributor: {
                    type: Sequelize.STRING,
                    field: "major_contributor",
                    allowNull: false
                },
                code: {
                    type: Sequelize.STRING,
                    field: "code",
                    allowNull: false
                },
                priority: {
                    type: Sequelize.INTEGER,
                    field: "priority",
                    allowNull: false
                },
                defect: {
                    type: Sequelize.STRING,
                    field: "defect",
                    allowNull: false
                },
                observationTypeId: {
                    type: Sequelize.UUID,
                    field: "observation_type_id",
                    allowNull: false,
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                observationSeverityId: {
                    type: Sequelize.UUID,
                    field: "observation_severity_id",
                    allowNull: false,
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
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
        await queryInterface.dropTable(config.QA_MASTER_MAKER_LOVS);
    }
};
