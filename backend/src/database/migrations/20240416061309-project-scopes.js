"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.PROJECT_SCOPES,
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
                formId: {
                    type: Sequelize.UUID,
                    field: "form_id",
                    references: {
                        model: config.FORMS,
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
                uomId: {
                    type: Sequelize.UUID,
                    field: "uom_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                orderQuantity: {
                    type: Sequelize.FLOAT,
                    field: "order_quantity",
                    allowNull: false
                },
                totalQuantity: {
                    type: Sequelize.FLOAT,
                    field: "total_quantity",
                    allowNull: false
                },
                satQuantity: {
                    type: Sequelize.FLOAT,
                    field: "sat_quantity"
                },
                installationMonth: {
                    type: Sequelize.FLOAT,
                    field: "installation_month"
                },
                installationEndDate: {
                    type: Sequelize.DATE,
                    field: "installation_end_date"
                },
                installationMonthIncentive: {
                    type: Sequelize.FLOAT,
                    field: "installation_month_incentive"
                },
                installationEndDateIncentive: {
                    type: Sequelize.DATE,
                    field: "installation_end_date_incentive"
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
        return queryInterface.dropTable(config.PROJECT_SCOPES);
    }
};