const { GAA_HIERARCHIES, WORK_AREA_ASSIGNMENT_HISTORY, PROJECTS, GAA_LEVEL_ENTRIES, WORK_AREA_ASSIGNMENT, GAA_LEVEL_ENTRIES_HISTORY, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const gaaHierarchies = sequelize.define(
        GAA_HIERARCHIES,
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
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            rank: {
                type: DataTypes.INTEGER,
                field: "rank"
            },
            isMapped: {
                type: DataTypes.ENUM,
                field: "is_mapped",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "0"
            },
            levelType: {
                type: DataTypes.STRING,
                field: "level_type"
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
                gaaHierarchies.belongsTo(models[PROJECTS], { foreignKey: "project_id" });
                gaaHierarchies.hasMany(models[GAA_LEVEL_ENTRIES], { foreignKey: "gaa_hierarchy_id" });
                gaaHierarchies.hasMany(models[WORK_AREA_ASSIGNMENT], { foreignKey: "gaa_hierarchy_id" });
                gaaHierarchies.hasMany(models[GAA_LEVEL_ENTRIES_HISTORY], { foreignKey: "gaa_hierarchy_id" });
                gaaHierarchies.hasMany(models[WORK_AREA_ASSIGNMENT_HISTORY], { foreignKey: "gaa_hierarchy_id" });
                gaaHierarchies.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                gaaHierarchies.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return gaaHierarchies;
};
