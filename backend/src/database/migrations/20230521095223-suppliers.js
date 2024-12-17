"use strict";

const config = require("../../config/database-schema");

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            config.SUPPLIERS,
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
                type: {
                    type: Sequelize.ENUM,
                    field: "type",
                    values: ["Genus", "Vendor", "Customer"],
                    defaultValue: "Genus"
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
                website: {
                    type: Sequelize.STRING,
                    field: "website"
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
                aadharNumber: {
                    type: Sequelize.STRING,
                    field: "aadhar_number"
                },
                panNumber: {
                    type: Sequelize.STRING,
                    field: "pan_number"
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

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable(config.SUPPLIERS);
    }
};
