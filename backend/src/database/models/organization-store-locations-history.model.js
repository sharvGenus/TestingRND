const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const organizationStoreLocationsHistory = sequelize.define(
        config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
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
            organizationStoreId: {
                type: DataTypes.UUID,
                field: "organization_store_id"
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
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
            isRestricted: {
                type: DataTypes.BOOLEAN,
                field: "is_restricted",
                allowNull: false,
                defaultValue: false
            },
            isFaulty: {
                type: DataTypes.BOOLEAN,
                field: "is_faulty",
                allowNull: false,
                defaultValue: false
            },
            isScrap: {
                type: DataTypes.BOOLEAN,
                field: "is_scrap",
                allowNull: false,
                defaultValue: false
            },
            isInstalled: {
                type: DataTypes.BOOLEAN,
                field: "is_installed",
                allowNull: false,
                defaultValue: false
            },
            forInstaller: {
                type: DataTypes.BOOLEAN,
                field: "for_installer",
                allowNull: false,
                defaultValue: false
            },
            isOld: {
                type: DataTypes.BOOLEAN,
                field: "is_old",
                allowNull: false,
                defaultValue: false
            },
            attachments: {
                type: DataTypes.STRING,
                field: "attachments"
            },
            storePhoto: {
                type: DataTypes.STRING,
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
                organizationStoreLocationsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "organization_type" });
                organizationStoreLocationsHistory.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "organization_store_id" });
                organizationStoreLocationsHistory.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                organizationStoreLocationsHistory.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "store_location_id" });
                organizationStoreLocationsHistory.hasMany(models[config.REQUEST_APPROVALS], { foreignKey: "from_store_location_id" });
                organizationStoreLocationsHistory.hasMany(models[config.REQUEST_APPROVALS], { foreignKey: "to_store_location_id" });
                organizationStoreLocationsHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                organizationStoreLocationsHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return organizationStoreLocationsHistory;
};