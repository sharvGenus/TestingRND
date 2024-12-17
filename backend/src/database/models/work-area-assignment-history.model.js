const schema = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const workAreaAssignmentHistory = sequelize.define(
        schema.WORK_AREA_ASSIGNMENT_HISTORY,
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
            gaaHierarchyId: {
                type: DataTypes.UUID,
                field: "gaa_hierarchy_id"
            },
            gaaLevelEntryId: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "gaa_level_entry_id"
            },
            networkHierarchyId: {
                type: DataTypes.UUID,
                field: "network_hierarchy_id"
            },
            networkLevelEntryId: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "network_level_entry_id"
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            dateFrom: {
                type: DataTypes.DATE,
                field: "date_from"
            },
            dateTo: {
                type: DataTypes.DATE,
                field: "date_from"
            },
            hierarchyType: {
                type: DataTypes.ENUM,
                field: "hierarchy_type",
                values: ["gaa", "network"],
                defaultValue: "gaa"
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
                workAreaAssignmentHistory.belongsTo(models[schema.USERS], { foreignKey: "user_id" });
                workAreaAssignmentHistory.belongsTo(models[schema.GAA_HIERARCHIES], { foreignKey: "gaa_hierarchy_id" });
                workAreaAssignmentHistory.belongsTo(models[schema.NETWORK_HIERARCHIES], { foreignKey: "network_hierarchy_id" });
                workAreaAssignmentHistory.belongsTo(models[schema.PROJECTS], { foreignKey: "project_id" });
            }
        }
    );

    return workAreaAssignmentHistory;
};
