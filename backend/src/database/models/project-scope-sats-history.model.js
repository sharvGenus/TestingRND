const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const projectScopeSatsHistory = sequelize.define(
        config.PROJECT_SCOPE_SATS_HISTORY,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            projectScopeId: {
                type: DataTypes.UUID,
                field: "project_scope_id"
            },
            satExecutionQuantity: {
                type: DataTypes.FLOAT,
                field: "sat_execution_quantity",
                allowNull: false
            },
            satExecutionDate: {
                type: DataTypes.DATE,
                field: "sat_execution_date",
                allowNull: false
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
                projectScopeSatsHistory.belongsTo(models[config.PROJECT_SCOPES], { foreignKey: "project_scope_id" });
                projectScopeSatsHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                projectScopeSatsHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return projectScopeSatsHistory;
};