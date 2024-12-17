"use strict";

const config = require("../../config/database-schema");

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.FIRM_LOCATIONS,
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
                        model: config.FIRMS,
                        key: "id"
                    }
                },
                code: {
                    type: Sequelize.STRING,
                    field: "code",
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
                gstNumber: {
                    type: Sequelize.STRING,
                    field: "gst_number",
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
                    field: "pin_code"
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

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable(config.FIRM_LOCATIONS);
    }
};
