"use strict";

const { CONTRACTOR_STORES, PROJECTS, CITIES, FIRMS } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            CONTRACTOR_STORES,
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
                firmId: {
                    type: Sequelize.UUID,
                    field: "firm_id",
                    references: {
                        model: FIRMS,
                        key: "id"
                    }
                },
                projectId: {
                    type: Sequelize.UUID,
                    field: "project_id",
                    references: {
                        model: PROJECTS,
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
                registeredOfficeAddress: {
                    type: Sequelize.STRING,
                    field: "registered_office_address",
                    allowNull: false
                },
                registeredOfficeCityId: {
                    type: Sequelize.UUID,
                    field: "registered_office_city_id",
                    references: {
                        model: CITIES,
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
                        model: CITIES,
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
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(CONTRACTOR_STORES);
    }
};