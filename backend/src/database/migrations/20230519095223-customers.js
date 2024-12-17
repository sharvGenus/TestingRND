const { CUSTOMERS, CITIES } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            CUSTOMERS,
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
                gstNumber: {
                    type: Sequelize.STRING,
                    field: "gst_number"
                },
                email: {
                    type: Sequelize.STRING,
                    field: "email"
                },
                mobileNumber: {
                    type: Sequelize.STRING,
                    field: "mobile_number"
                },
                telephone: {
                    type: Sequelize.STRING,
                    field: "telephone"
                },
                registeredOfficeAddress: {
                    type: Sequelize.STRING,
                    field: "registered_office_address"
                },
                registeredOfficeCityId: {
                    type: Sequelize.UUID,
                    field: "registered_office_city_id",
                    references: {
                        model: CITIES,
                        key: "id"
                    }
                },
                registeredOfficePincode: {
                    type: Sequelize.STRING,
                    field: "registered_office_pincode"
                },
                currentOfficeAddress: {
                    type: Sequelize.STRING,
                    field: "current_office_address"
                },
                currentOfficeCityId: {
                    type: Sequelize.UUID,
                    field: "current_office_city_id",
                    references: {
                        model: CITIES,
                        key: "id"
                    }
                },
                currentOfficePincode: {
                    type: Sequelize.STRING,
                    field: "current_office_pincode"
                },
                attachments: {
                    type: Sequelize.STRING,
                    field: "attachments"
                },
                isActive: {
                    type: Sequelize.ENUM,
                    field: "is_active",
                    values: ["0", "1"],
                    allowNull: false,
                    defaultValue: "1"
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
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
        return queryInterface.dropTable(CUSTOMERS);
    }
};
