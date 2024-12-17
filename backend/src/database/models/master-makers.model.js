const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const masterMakers = sequelize.define(
        config.MASTER_MAKERS,
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
                allowNull: false,
                unique: true,
                field: "name"
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
                masterMakers.hasMany(models[config.MASTER_MAKER_LOVS], { foreignKey: "master_id" });
                masterMakers.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                masterMakers.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return masterMakers;
};
