const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const organizationStores = sequelize.define(
        config.ORGANIZATION_STORES,
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
                field: "organization_type",
                allowNull: false
            },
            organizationId: {
                type: DataTypes.UUID,
                field: "organization_id",
                allowNull: false
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
                field: "city_id",
                allowNull: false
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
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                organizationStores.belongsTo(models[config.MASTER_MAKER_LOVS], {
                    foreignKey: "organization_type"
                });
                organizationStores.belongsTo(models[config.ORGANIZATIONS], {
                    foreignKey: "organization_id"
                });
                organizationStores.hasMany(
                    models[config.ORGANIZATION_STORE_LOCATIONS],
                    { foreignKey: "organization_store_id" }
                );
                organizationStores.belongsTo(models[config.CITIES], {
                    foreignKey: "city_id"
                });
                organizationStores.hasMany(models[config.STOCK_LEDGERS], {
                    foreignKey: "store_id"
                });
                organizationStores.hasMany(models[config.REQUEST_APPROVALS], {
                    foreignKey: "from_store_id"
                });
                organizationStores.hasMany(models[config.REQUEST_APPROVALS], {
                    foreignKey: "to_store_id"
                });
                organizationStores.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                organizationStores.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                organizationStores.hasMany(models[config.APPROVERS], {
                    foreignKey: "store_id"
                });
                organizationStores.hasMany(models[config.REQUEST_APPROVERS], {
                    foreignKey: "store_id"
                });
            }
        }
    );

    return organizationStores;
};
