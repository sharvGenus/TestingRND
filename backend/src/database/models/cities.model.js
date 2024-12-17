const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const cities = sequelize.define(
        config.CITIES,
        {
            stateId: {
                type: DataTypes.UUID,
                field: "state_id"
            },
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
                cities.belongsTo(models[config.STATES], { foreignKey: "state_id" });
                cities.hasMany(models[config.FIRMS], { foreignKey: "registered_office_city_id" });
                cities.hasMany(models[config.CONTRACTOR_STORES], { foreignKey: "registered_office_city_id" });
                cities.hasMany(models[config.CONTRACTOR_STORES], { foreignKey: "current_office_city_id" });
                cities.hasMany(models[config.PROJECT_SITE_STORES], { foreignKey: "registered_office_city_id" });
                cities.hasMany(models[config.PROJECT_SITE_STORES], { foreignKey: "current_office_city_id" });
                cities.hasMany(models[config.FIRM_LOCATIONS], { foreignKey: "city_id" });
                cities.hasMany(models[config.SUPPLIERS], { foreignKey: "city_id" });
                cities.hasMany(models[config.LOCATION_SITE_STORE], { foreignKey: "city_id" });
                cities.hasMany(models[config.PARLIAMENTARY_CONSTITUENCIES], { foreignKey: "city_id" });
                cities.hasMany(models[config.ASSEMBLY_CONSTITUENCIES], { foreignKey: "city_id" });
                cities.hasMany(models[config.USERS], { foreignKey: "city_id" });
                cities.hasMany(models[config.CUSTOMER_STORES], { foreignKey: "registered_office_city_id" });
                cities.hasMany(models[config.CUSTOMER_STORES], { foreignKey: "current_office_city_id" });
                cities.hasMany(models[config.COMPANIES], { foreignKey: "registered_office_city_id" });
                cities.hasMany(models[config.COMPANIES], { foreignKey: "current_office_city_id" });
                cities.hasMany(models[config.ORGANIZATION_STORES], { foreignKey: "city_id" });
                cities.hasMany(models[config.USERS_HISTORY], { foreignKey: "city_id" });
                cities.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                cities.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return cities;
};
