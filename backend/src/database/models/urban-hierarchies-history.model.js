const schema = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const urbanHierarchiesHistory = sequelize.define(
        schema.URBAN_HIERARCHIES_HISTORY,
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
                defaultValue: "1"
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
                urbanHierarchiesHistory.belongsTo(models[schema.PROJECTS], { foreignKey: "project_id" });
                urbanHierarchiesHistory.hasMany(models[schema.URBAN_LEVEL_ENTRIES], { foreignKey: "urban_hierarchy_id" });
                urbanHierarchiesHistory.belongsTo(models[schema.USERS], { foreignKey: "created_by", as: "created" });
                urbanHierarchiesHistory.belongsTo(models[schema.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return urbanHierarchiesHistory;
};
