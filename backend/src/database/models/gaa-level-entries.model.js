const { GAA_LEVEL_ENTRIES, GAA_HIERARCHIES, GAA_HIERARCHIES_HISTORY, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const gaaLevelEntries = sequelize.define(
        GAA_LEVEL_ENTRIES,
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
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            gaaHierarchyId: {
                type: DataTypes.UUID,
                field: "gaa_hierarchy_id"
            },
            parentId: {
                type: DataTypes.UUID,
                field: "parent_id"
            },
            approvalStatus: {
                type: DataTypes.ENUM,
                field: "approval_status",
                allowNull: true, // Allow NULL values
                defaultValue: "Unapproved", // Set default value
                values: ["Approved", "Unapproved"]
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
                gaaLevelEntries.belongsTo(models[GAA_HIERARCHIES], { foreignKey: "gaa_hierarchy_id" });
                gaaLevelEntries.belongsTo(models[GAA_HIERARCHIES_HISTORY], { foreignKey: "gaa_hierarchy_id" });
                gaaLevelEntries.belongsTo(models[GAA_LEVEL_ENTRIES], { foreignKey: "parentId", as: "parent" });
                gaaLevelEntries.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                gaaLevelEntries.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );
    return gaaLevelEntries;
};
