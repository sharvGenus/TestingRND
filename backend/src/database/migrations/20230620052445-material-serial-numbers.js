"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.MATERIAL_SERIAL_NUMBERS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                stockLedgerId: {
                    type: Sequelize.UUID,
                    field: "stock_ledger_id",
                    references: {
                        model: config.STOCK_LEDGERS,
                        key: "id"
                    }
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    field: "quantity",
                    allowNull: false
                },
                rate: {
                    type: Sequelize.FLOAT,
                    field: "rate",
                    allowNull: false
                },
                serialNumber: {
                    type: Sequelize.STRING,
                    field: "serial_number",
                    allowNull: false
                },
                status: {
                    type: Sequelize.ENUM,
                    field: "status",
                    values: ["0", "1"],
                    allowNull: false,
                    defaultValue: "1"
                },
                prefix: {
                    type: Sequelize.STRING,
                    field: "prefix"
                },
                suffix: {
                    type: Sequelize.STRING,
                    field: "suffix"
                },
                rangeFrom: {
                    type: Sequelize.INTEGER,
                    field: "range_from"
                },
                rangeTo: {
                    type: Sequelize.INTEGER,
                    field: "range_to"
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
        await queryInterface.dropTable(config.MATERIAL_SERIAL_NUMBERS);
    }
};
