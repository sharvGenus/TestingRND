const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const projectMasterMakers = sequelize.define(
        config.PROJECT_MASTER_MAKERS,
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
                field: "project_id"
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                field: "name"
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
                projectMasterMakers.hasMany(models[config.PROJECT_MASTER_MAKER_LOVS], { foreignKey: "master_id" });
                projectMasterMakers.hasMany(models[config.PROJECT_MASTER_MAKER_LOVS_HISTORY], { foreignKey: "master_id" });
                projectMasterMakers.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                projectMasterMakers.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                projectMasterMakers.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                projectMasterMakers.hasMany(models[config.TICKETS], { foreignKey: "issue_id", as: "issue" });
                projectMasterMakers.hasMany(models[config.TICKETS_HISTORY], { foreignKey: "issue_id", as: "issue_obj" });
            }
        }
    );

    return projectMasterMakers;
};
