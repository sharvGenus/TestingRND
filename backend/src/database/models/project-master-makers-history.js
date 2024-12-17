const schema = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const projectMasterMakersHistory = sequelize.define(
        schema.PROJECT_MASTER_MAKERS_HISTORY,
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
                projectMasterMakersHistory.belongsTo(models[schema.PROJECTS], { foreignKey: "project_id" });
                projectMasterMakersHistory.belongsTo(models[schema.USERS], { foreignKey: "created_by", as: "created" });
                projectMasterMakersHistory.belongsTo(models[schema.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return projectMasterMakersHistory;
};
