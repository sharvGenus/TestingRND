"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.SUPPLIER_REPAIR_CENTERS,
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
                supplierId: {
                    type: Sequelize.UUID,
                    field: "supplier_id",
                    references: {
                        model: config.SUPPLIERS,
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
                photo: {
                    type: Sequelize.STRING,
                    field: "photo"
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
                registeredOfficeAddress: {
                    type: Sequelize.STRING,
                    field: "registered_office_address",
                    allowNull: false
                },
                registeredOfficeCityId: {
                    type: Sequelize.UUID,
                    field: "registered_office_city_id",
                    references: {
                        model: config.CITIES,
                        key: "id"
                    }
                },
                registeredOfficePinCode: {
                    type: Sequelize.STRING,
                    field: "registered_office_pincode",
                    allowNull: false
                },
                currentOfficeAddress: {
                    type: Sequelize.STRING,
                    field: "current_office_address",
                    allowNull: false
                },
                currentOfficeCityId: {
                    type: Sequelize.UUID,
                    field: "current_office_city_id",
                    references: {
                        model: config.CITIES,
                        key: "id"
                    }
                },
                currentOfficePinCode: {
                    type: Sequelize.STRING,
                    field: "current_office_pincode",
                    allowNull: false
                },
                attachments: {
                    type: Sequelize.STRING,
                    field: "attachments"
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
        await queryInterface.dropTable(config.SUPPLIER_REPAIR_CENTERS);
    }
};
