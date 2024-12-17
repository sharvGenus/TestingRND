const schema = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const networkHierarchiesHistory = sequelize.define(
        schema.NETWORK_HIERARCHIES_HISTORY,
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
                networkHierarchiesHistory.belongsTo(models[schema.PROJECTS], { foreignKey: "project_id" });
                networkHierarchiesHistory.hasMany(models[schema.NETWORK_LEVEL_ENTRIES], { foreignKey: "network_hierarchy_id" });
                networkHierarchiesHistory.belongsTo(models[schema.USERS], { foreignKey: "created_by", as: "created" });
                networkHierarchiesHistory.belongsTo(models[schema.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return networkHierarchiesHistory;
};
