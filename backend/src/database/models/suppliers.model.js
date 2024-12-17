const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const suppliers = sequelize.define(
        config.SUPPLIERS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            type: {
                type: DataTypes.ENUM,
                field: "type",
                values: ["Genus", "Vendor", "Customer"],
                defaultValue: "Genus"
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
            website: {
                type: DataTypes.STRING,
                field: "website"
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
            gstNumber: {
                type: DataTypes.STRING,
                field: "gst_number",
                allowNull: false
            },
            aadharNumber: {
                type: DataTypes.STRING,
                field: "aadhar_number"
            },
            panNumber: {
                type: DataTypes.STRING,
                field: "pan_number"
            },
            address: {
                type: DataTypes.STRING,
                field: "address",
                allowNull: false
            },
            cityId: {
                type: DataTypes.UUID,
                field: "city_id"
            },
            pinCode: {
                type: DataTypes.STRING,
                field: "pin_code"
            },
            attachments: {
                type: DataTypes.STRING,
                field: "attachments"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
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
            associate: function (models) {
                suppliers.belongsTo(models[config.CITIES], { foreignKey: "city_id" });
                suppliers.hasMany(models[config.SUPPLIER_REPAIR_CENTERS], { foreignKey: "supplier_id" });
            }
        }
    );

    return suppliers;
};
