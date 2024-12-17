const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const organizationLocations = sequelize.define(
        config.ORGANIZATION_LOCATIONS,
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
            organizationId: {
                type: DataTypes.UUID,
                field: "organization_id"
            },
            organizationTypeId: {
                type: DataTypes.UUID,
                field: "organization_type_id"
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
                field: "pin_code",
                allowNull: false
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
                field: "deleted_at"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                organizationLocations.belongsTo(models[config.ORGANIZATIONS], {
                    foreignKey: "organization_id"
                });
                organizationLocations.belongsTo(models[config.CITIES], {
                    foreignKey: "city_id"
                });
                organizationLocations.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "organization_type_id" });
            }
        }
    );

    return organizationLocations;
};
