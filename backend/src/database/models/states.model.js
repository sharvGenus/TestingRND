const { STATES, COUNTRIES, CITIES, PARLIAMENTARY_CONSTITUENCIES, ASSEMBLY_CONSTITUENCIES, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const states = sequelize.define(
        STATES,
        {
            countryId: {
                type: DataTypes.STRING,
                field: "country_id"
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
                states.belongsTo(models[COUNTRIES], { foreignKey: "country_id" });
                states.hasMany(models[CITIES], { foreignKey: "state_id" });
                states.hasMany(models[PARLIAMENTARY_CONSTITUENCIES], { foreignKey: "state_id" });
                states.hasMany(models[ASSEMBLY_CONSTITUENCIES], { foreignKey: "state_id" });
                states.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                states.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return states;
};
