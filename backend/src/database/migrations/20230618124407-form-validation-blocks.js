"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.FORM_VALIDATION_BLOCKS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                formId: {
                    type: Sequelize.UUID,
                    field: "form_id",
                    references: {
                        model: config.FORMS,
                        key: "id"
                    }
                },
                attributeValidationBlockId: {
                    type: Sequelize.UUID,
                    field: "attribute_validation_block_id",
                    references: {
                        model: config.ATTRIBUTE_VALIDATION_BLOCKS,
                        key: "id"
                    }
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
        await queryInterface.dropTable(config.FORM_VALIDATION_BLOCKS);
    }
};
