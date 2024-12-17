"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.ROLE_COLUMN_DEFAULT_PERMISSIONS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                roleId: {
                    type: Sequelize.UUID,
                    field: "role_id",
                    allowNull: false,
                    references: {
                        model: config.ROLES,
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
                add: {
                    type: Sequelize.BOOLEAN,
                    field: "add",
                    defaultValue: false
                },
                view: {
                    type: Sequelize.BOOLEAN,
                    field: "view",
                    defaultValue: false
                },
                update: {
                    type: Sequelize.BOOLEAN,
                    field: "update",
                    defaultValue: false
                },
                deleteRecord: {
                    type: Sequelize.BOOLEAN,
                    field: "delete_record",
                    defaultValue: false
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
        return queryInterface.dropTable(config.ROLE_COLUMN_DEFAULT_PERMISSIONS);
    }
};