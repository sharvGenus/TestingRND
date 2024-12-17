const { CITIES, STATES, COUNTRIES, PARLIAMENTARY_CONSTITUENCIES, ASSEMBLY_CONSTITUENCIES } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const parliamentaries = sequelize.define(
        PARLIAMENTARY_CONSTITUENCIES,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: true
            },
            countryId: {
                type: DataTypes.STRING,
                field: "country_id"
            },
            stateId: {
                type: DataTypes.UUID,
                field: "state_id"
            },
            cityId: {
                type: DataTypes.UUID,
                field: "city_id"
            },
            status: {
                type: DataTypes.ENUM,
                field: "status",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                field: "is_deleted"
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
                parliamentaries.belongsTo(models[ASSEMBLY_CONSTITUENCIES], { foreignKey: "parliamentary_id" });
                parliamentaries.belongsTo(models[COUNTRIES], { foreignKey: "country_id" });
                parliamentaries.belongsTo(models[STATES], { foreignKey: "state_id" });
                parliamentaries.belongsTo(models[CITIES], { foreignKey: "city_id" });
            }
        }
    );
  
    return parliamentaries;
};