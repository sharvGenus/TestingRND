const { NETWORK_HIERARCHIES, WORK_AREA_ASSIGNMENT_HISTORY, PROJECTS, NETWORK_LEVEL_ENTRIES, WORK_AREA_ASSIGNMENT, NETWORK_LEVEL_ENTRIES_HISTORY, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const networkHierarchies = sequelize.define(
        NETWORK_HIERARCHIES,
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
                networkHierarchies.belongsTo(models[PROJECTS], { foreignKey: "project_id" });
                networkHierarchies.hasMany(models[NETWORK_LEVEL_ENTRIES], { foreignKey: "network_hierarchy_id" });
                networkHierarchies.hasMany(models[WORK_AREA_ASSIGNMENT], { foreignKey: "network_hierarchy_id" });
                networkHierarchies.hasMany(models[NETWORK_LEVEL_ENTRIES_HISTORY], { foreignKey: "network_hierarchy_id" });
                networkHierarchies.hasMany(models[WORK_AREA_ASSIGNMENT_HISTORY], { foreignKey: "network_hierarchy_id" });
                networkHierarchies.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                networkHierarchies.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return networkHierarchies;
};
