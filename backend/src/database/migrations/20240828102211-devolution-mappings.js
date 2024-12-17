"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.DEVOLUTION_MAPPINGS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                devolutionConfigId: {
                    type: Sequelize.UUID,
                    field: "devolution_config_id",
                    references: {
                        model: config.DEVOLUTION_CONFIGS,
                        key: "id"
                    }
                },
                formAttributeId: {
                    type: Sequelize.UUID,
                    field: "form_attribute_id",
                    allowNull: false,
                    references: {
                        model: config.FORM_ATTRIBUTES,
                        key: "id"
                    }
                },
                newName: {
                    type: Sequelize.STRING,
                    field: "new_name",
                    allowNull: false
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
                },
                isActive: {
                    type: Sequelize.ENUM,
                    field: "is_active",
                    values: ["0", "1"],
                    defaultValue: "1",
                    allowNull: false
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
        await queryInterface.dropTable(config.DEVOLUTION_MAPPINGS);
    }
};
