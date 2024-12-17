const { COUNTRIES, STATES, PARLIAMENTARY_CONSTITUENCIES, ASSEMBLY_CONSTITUENCIES, STATES_HISTORY, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const countries = sequelize.define(
        COUNTRIES,
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
                field: "deleted_at"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                countries.hasMany(models[STATES], {
                    foreignKey: "country_id"
                });
                countries.hasMany(models[PARLIAMENTARY_CONSTITUENCIES], { foreignKey: "country_id" });
                countries.hasMany(models[ASSEMBLY_CONSTITUENCIES], { foreignKey: "country_id" });
                countries.hasMany(models[STATES_HISTORY], { foreignKey: "country_id" });
                countries.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                countries.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return countries;
};
