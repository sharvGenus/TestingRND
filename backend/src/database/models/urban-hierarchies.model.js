const { URBAN_HIERARCHIES, PROJECTS, URBAN_LEVEL_ENTRIES, URBAN_LEVEL_ENTRIES_HISTORY, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const urbanHierarchies = sequelize.define(
        URBAN_HIERARCHIES,
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
                urbanHierarchies.belongsTo(models[PROJECTS], { foreignKey: "project_id" });
                urbanHierarchies.hasMany(models[URBAN_LEVEL_ENTRIES], { foreignKey: "urban_hierarchy_id" });
                urbanHierarchies.hasMany(models[URBAN_LEVEL_ENTRIES_HISTORY], { foreignKey: "urban_hierarchy_id" });
                urbanHierarchies.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                urbanHierarchies.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return urbanHierarchies;
};
