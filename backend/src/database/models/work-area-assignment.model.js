const { WORK_AREA_ASSIGNMENT, USERS, GAA_HIERARCHIES, NETWORK_HIERARCHIES, PROJECTS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const workAreaAssignment = sequelize.define(
        WORK_AREA_ASSIGNMENT,
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
                field: "date_to"
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
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                workAreaAssignment.belongsTo(models[USERS], { foreignKey: "user_id" });
                workAreaAssignment.belongsTo(models[GAA_HIERARCHIES], { foreignKey: "gaa_hierarchy_id" });
                workAreaAssignment.belongsTo(models[NETWORK_HIERARCHIES], { foreignKey: "network_hierarchy_id" });
                workAreaAssignment.belongsTo(models[PROJECTS], { foreignKey: "project_id" });
            }
        }
    );

    return workAreaAssignment;
};
