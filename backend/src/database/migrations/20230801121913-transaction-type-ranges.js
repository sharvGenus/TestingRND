"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.TRANSACTION_TYPE_RANGES,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                organizationId: {
                    type: Sequelize.UUID,
                    field: "organization_id",
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                },
                storeId: {
                    type: Sequelize.UUID,
                    field: "store_id",
                    references: {
                        model: config.ORGANIZATION_STORES,
                        key: "id"
                    }
                },
                transactionTypeId: {
                    type: Sequelize.UUID,
                    field: "transaction_type_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                prefix: {
                    type: Sequelize.STRING,
                    field: "prefix",
                    allowNull: false
                },
                startRange: {
                    type: Sequelize.INTEGER,
                    field: "start_range",
                    allowNull: false
                },
                endRange: {
                    type: Sequelize.INTEGER,
                    field: "end_range",
                    allowNull: false
                },
                effectiveDate: {
                    type: Sequelize.DATE,
                    field: "effective_date",
                    allowNull: false
                },
                endDate: {
                    type: Sequelize.DATE,
                    field: "end_date"
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
        await queryInterface.dropTable(config.TRANSACTION_TYPE_RANGES);
    }
};