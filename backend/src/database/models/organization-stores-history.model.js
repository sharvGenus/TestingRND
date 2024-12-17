const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const organizationStoresHistory = sequelize.define(
        config.ORGANIZATION_STORES_HISTORY,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            organizationType: {
                type: DataTypes.UUID,
                field: "organization_type"
            },
            organizationId: {
                type: DataTypes.UUID,
                field: "organization_id"
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
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
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
            address: {
                type: DataTypes.STRING,
                field: "address",
                allowNull: false
            },
            cityId: {
                type: DataTypes.UUID,
                field: "city_id"
            },
            pincode: {
                type: DataTypes.STRING,
                field: "pincode",
                allowNull: false
            },
            attachments: {
                type: DataTypes.TEXT,
                field: "attachments"
            },
            storePhoto: {
                type: DataTypes.TEXT,
                field: "store_photo"
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
            },
            recordId: {
                type: DataTypes.UUID,
                field: "record_id"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                organizationStoresHistory.belongsTo(models[config.MASTER_MAKER_LOVS], {
                    foreignKey: "organization_type"
                });
                organizationStoresHistory.belongsTo(models[config.ORGANIZATIONS], {
                    foreignKey: "organization_id"
                });
                organizationStoresHistory.hasMany(
                    models[config.ORGANIZATION_STORE_LOCATIONS],
                    { foreignKey: "organization_store_id" }
                );
                organizationStoresHistory.belongsTo(models[config.CITIES], {
                    foreignKey: "city_id"
                });
                organizationStoresHistory.hasMany(models[config.STOCK_LEDGERS], {
                    foreignKey: "store_id"
                });
                organizationStoresHistory.hasMany(models[config.REQUEST_APPROVALS], {
                    foreignKey: "from_store_id"
                });
                organizationStoresHistory.hasMany(models[config.REQUEST_APPROVALS], {
                    foreignKey: "to_store_id"
                });
                organizationStoresHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                organizationStoresHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return organizationStoresHistory;
};
