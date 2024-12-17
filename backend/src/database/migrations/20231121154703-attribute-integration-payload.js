"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.ATTRIBUTE_INTEGRATION_PAYLOAD,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                integrationBlockId: {
                    type: Sequelize.UUID,
                    field: "integration_block_id",
                    reference: {
                        model: config.ATTRIBUTE_INTEGRATION_BLOCKS,
                        key: "id"
                    }
                },
                value: {
                    type: Sequelize.UUID,
                    field: "value",
                    reference: {
                        model: config.FORM_ATTRIBUTES,
                        key: "id"
                    }
                },
                name: {
                    type: Sequelize.STRING,
                    field: "name",
                    allowNull: false
                },
                parent: {
                    type: Sequelize.UUID,
                    field: "parent",
                    reference: {
                        model: config.ATTRIBUTE_INTEGRATION_PAYLOAD,
                        key: "id"
                    }
                },
                type: {
                    type: Sequelize.ENUM,
                    field: "type",
                    values: ["key", "array", "object"],
                    defaultValue: "key"
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
        await queryInterface.dropTable(config.ATTRIBUTE_INTEGRATION_PAYLOAD);
    }
};
