const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const qaMasterMakers = sequelize.define(
        config.QA_MASTER_MAKERS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id",
                allowNull: false
            },
            meterTypeId: {
                type: DataTypes.UUID,
                field: "meter_type_id",
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
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
                qaMasterMakers.hasMany(models[config.QA_MASTER_MAKER_LOVS], { foreignKey: "master_id" });
                qaMasterMakers.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                qaMasterMakers.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "meter_type_id", as: "meter_type" });
                qaMasterMakers.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                qaMasterMakers.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return qaMasterMakers;
};