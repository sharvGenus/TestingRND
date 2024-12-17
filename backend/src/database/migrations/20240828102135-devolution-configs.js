"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.DEVOLUTION_CONFIGS,
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
                    allowNull: false,
                    references: {
                        model: config.PROJECTS,
                        key: "id"
                    }
                },
                formId: {
                    type: Sequelize.UUID,
                    field: "form_id",
                    allowNull: false,
                    references: {
                        model: config.FORMS,
                        key: "id"
                    }
                },
                prefix: {
                    type: Sequelize.STRING,
                    field: "prefix",
                    allowNull: false
                },
                index: {
                    type: Sequelize.INTEGER,
                    field: "index",
                    allowNull: false
                },
                oldSerialNoId: {
                    type: Sequelize.UUID,
                    field: "old_serial_no_id",
                    allowNull: false,
                    references: {
                        model: config.FORM_ATTRIBUTES,
                        key: "id"
                    }
                },
                oldMakeId: {
                    type: Sequelize.UUID,
                    field: "old_make_id",
                    allowNull: false,
                    references: {
                        model: config.FORM_ATTRIBUTES,
                        key: "id"
                    }
                },
                newSerialNoId: {
                    type: Sequelize.UUID,
                    field: "new_serial_no_id",
                    allowNull: false,
                    references: {
                        model: config.FORM_ATTRIBUTES,
                        key: "id"
                    }
                },
                newMakeId: {
                    type: Sequelize.UUID,
                    field: "new_make_id",
                    references: {
                        model: config.FORM_ATTRIBUTES,
                        key: "id"
                    }
                },
                isLocked: {
                    type: Sequelize.BOOLEAN,
                    field: "is_locked",
                    defaultValue: false,
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
        await queryInterface.dropTable(config.DEVOLUTION_CONFIGS);
    }
};
