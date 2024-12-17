const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const supervisorAssignmentsHistory = sequelize.define(
        config.SUPERVISOR_ASSIGNMENTS_HISTORY,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.UUID,
                field: "user_id"
            },
            supervisorId: {
                type: DataTypes.UUID,
                field: "supervisor_id"
            },
            dateFrom: {
                type: DataTypes.DATE,
                field: "date_from",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            dateTo: {
                type: DataTypes.DATE,
                field: "date_to",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
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
                supervisorAssignmentsHistory.belongsTo(models[config.USERS], { foreignKey: "user_id", as: "user" });
                supervisorAssignmentsHistory.belongsTo(models[config.USERS], { foreignKey: "supervisor_id", as: "supervisor" });
                supervisorAssignmentsHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                supervisorAssignmentsHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return supervisorAssignmentsHistory;
};
