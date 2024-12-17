"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.ORGANIZATION_STORES,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                organizationType: {
                    type: Sequelize.UUID,
                    field: "organization_type",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                organizationId: {
                    type: Sequelize.UUID,
                    field: "organization_id",
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                },
                organizationLocationId: {
                    type: Sequelize.UUID,
                    field: "organization_location_id",
                    references: {
                        model: config.ORGANIZATION_LOCATIONS,
                        key: "id"
                    }
                },
                name: {
                    type: Sequelize.STRING,
                    field: "name",
                    allowNull: false
                },
                code: {
                    type: Sequelize.INTEGER,
                    field: "code",
                    allowNull: false
                },
                integrationId: {
                    type: Sequelize.STRING,
                    field: "integration_id"
                },
                gstNumber: {
                    type: Sequelize.STRING,
                    field: "gst_number",
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING,
                    field: "email"
                },
                mobileNumber: {
                    type: Sequelize.STRING,
                    field: "mobile_number",
                    allowNull: false
                },
                telephone: {
                    type: Sequelize.STRING,
                    field: "telephone"
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
                pincode: {
                    type: Sequelize.STRING,
                    field: "pincode",
                    allowNull: false
                },
                attachments: {
                    type: Sequelize.STRING,
                    field: "attachments"
                },
                storePhoto: {
                    type: Sequelize.STRING,
                    field: "store_photo"
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
        return queryInterface.dropTable(config.ORGANIZATION_STORES);
    }
};