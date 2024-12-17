"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.LOCATION_SITE_STORE,
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
                projectSiteStoreId: {
                    type: Sequelize.UUID,
                    field: "project_site_store_id",
                    references: {
                        model: config.PROJECT_SITE_STORES,
                        key: "id"
                    }
                },
                name: {
                    type: Sequelize.STRING,
                    field: "name",
                    allowNull: false
                },
                code: {
                    type: Sequelize.STRING,
                    field: "code",
                    allowNull: false
                },
                address: {
                    type: Sequelize.STRING,
                    field: "address",
                    allowNull: false
                },
                cityId: {
                    type: Sequelize.UUID,
                    field: "city_id",
                    references: {
                        model: config.CITIES,
                        key: "id"
                    }
                },
                pinCode: {
                    type: Sequelize.STRING,
                    field: "pin_code",
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
        return queryInterface.dropTable(config.LOCATION_SITE_STORE);
    }
};