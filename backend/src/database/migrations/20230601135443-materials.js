"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.MATERIALS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                integrationId: {
                    type: Sequelize.STRING,
                    field: "integration_id"
                },
                materialTypeId: {
                    type: Sequelize.UUID,
                    field: "material_type_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    field: "name"
                },
                code: {
                    type: Sequelize.STRING,
                    field: "code",
                    allowNull: false
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    field: "description"
                },
                longDescription: {
                    type: Sequelize.STRING,
                    field: "long_description"
                },
                uomId: {
                    type: Sequelize.UUID,
                    field: "uom_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                hsnCode: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    field: "hsn_code"
                },
                attachments: {
                    type: Sequelize.STRING
                },
                isSerialNumber: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    field: "is_serial_number"
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
        await queryInterface.dropTable(config.MATERIALS);
    }
};
