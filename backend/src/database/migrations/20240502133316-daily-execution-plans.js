"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.DAILY_EXECUTION_PLANS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                projectId: {
                    type: Sequelize.UUID,
                    field: "project_id",
                    references: {
                        model: config.PROJECTS,
                        key: "id"
                    }
                },
                materialTypeId: {
                    type: Sequelize.UUID,
                    field: "material_type_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                month: {
                    type: Sequelize.INTEGER,
                    field: "month",
                    allowNull: false
                },
                year: {
                    type: Sequelize.INTEGER,
                    field: "year",
                    allowNull: false
                },
                q1: {
                    type: Sequelize.FLOAT,
                    field: "q1"
                },
                q2: {
                    type: Sequelize.FLOAT,
                    field: "q2"
                },
                q3: {
                    type: Sequelize.FLOAT,
                    field: "q3"
                },
                q4: {
                    type: Sequelize.FLOAT,
                    field: "q4"
                },
                q5: {
                    type: Sequelize.FLOAT,
                    field: "q5"
                },
                q6: {
                    type: Sequelize.FLOAT,
                    field: "q6"
                },
                q7: {
                    type: Sequelize.FLOAT,
                    field: "q7"
                },
                q8: {
                    type: Sequelize.FLOAT,
                    field: "q8"
                },
                q9: {
                    type: Sequelize.FLOAT,
                    field: "q9"
                },
                q10: {
                    type: Sequelize.FLOAT,
                    field: "q10"
                },
                q11: {
                    type: Sequelize.FLOAT,
                    field: "q11"
                },
                q12: {
                    type: Sequelize.FLOAT,
                    field: "q12"
                },
                q13: {
                    type: Sequelize.FLOAT,
                    field: "q13"
                },
                q14: {
                    type: Sequelize.FLOAT,
                    field: "q14"
                },
                q15: {
                    type: Sequelize.FLOAT,
                    field: "q15"
                },
                q16: {
                    type: Sequelize.FLOAT,
                    field: "q16"
                },
                q17: {
                    type: Sequelize.FLOAT,
                    field: "q17"
                },
                q18: {
                    type: Sequelize.FLOAT,
                    field: "q18"
                },
                q19: {
                    type: Sequelize.FLOAT,
                    field: "q19"
                },
                q20: {
                    type: Sequelize.FLOAT,
                    field: "q20"
                },
                q21: {
                    type: Sequelize.FLOAT,
                    field: "q21"
                },
                q22: {
                    type: Sequelize.FLOAT,
                    field: "q22"
                },
                q23: {
                    type: Sequelize.FLOAT,
                    field: "q23"
                },
                q24: {
                    type: Sequelize.FLOAT,
                    field: "q24"
                },
                q25: {
                    type: Sequelize.FLOAT,
                    field: "q25"
                },
                q26: {
                    type: Sequelize.FLOAT,
                    field: "q26"
                },
                q27: {
                    type: Sequelize.FLOAT,
                    field: "q27"
                },
                q28: {
                    type: Sequelize.FLOAT,
                    field: "q28"
                },
                q29: {
                    type: Sequelize.FLOAT,
                    field: "q29"
                },
                q30: {
                    type: Sequelize.FLOAT,
                    field: "q30"
                },
                q31: {
                    type: Sequelize.FLOAT,
                    field: "q31"
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
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(config.DAILY_EXECUTION_PLANS);
    }
};