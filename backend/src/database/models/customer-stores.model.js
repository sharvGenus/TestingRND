const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const customerStores = sequelize.define(
        config.CUSTOMER_STORES,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            photo: {
                type: DataTypes.STRING,
                field: "photo"
            },
            gstNumber: {
                type: DataTypes.STRING,
                field: "gst_number",
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                field: "email"
            },
            mobileNumber: {
                type: DataTypes.STRING,
                field: "mobile_number",
                allowNull: false
            },
            telephone: {
                type: DataTypes.STRING,
                field: "telephone"
            },
            registeredOfficeAddress: {
                type: DataTypes.STRING,
                field: "registered_office_address",
                allowNull: false
            },
            registeredOfficeCityId: {
                type: DataTypes.UUID,
                field: "registered_office_city_id"
            },
            registeredOfficePinCode: {
                type: DataTypes.STRING,
                field: "registered_office_pincode",
                allowNull: false
            },
            currentOfficeAddress: {
                type: DataTypes.STRING,
                field: "current_office_address",
                allowNull: false
            },
            currentOfficeCityId: {
                type: DataTypes.UUID,
                field: "current_office_city_id"
            },
            currentOfficePinCode: {
                type: DataTypes.STRING,
                field: "current_office_pincode",
                allowNull: false
            },
            attachments: {
                type: DataTypes.STRING,
                field: "attachments"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            createdBy: {
                type: DataTypes.UUID,
                field: "created_by"
            },
            updatedBy: {
                type: DataTypes.UUID,
                field: "updated_by"
            },
            createdAt: {
                type: DataTypes.DATE,
                field: "created_at",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: "updated_at",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE,
                field: "deleted_at",
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                customerStores.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                customerStores.belongsTo(models[config.CITIES], { foreignKey: "registered_office_city_id", as: "register_office_cities" });
                customerStores.belongsTo(models[config.CITIES], { foreignKey: "current_office_city_id", as: "current_office_cities" });
            }
        }
    );

    return customerStores;
};