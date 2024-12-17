const { NETWORK_LEVEL_ENTRIES, NETWORK_HIERARCHIES, NETWORK_HIERARCHIES_HISTORY, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const networkLevelEntries = sequelize.define(
        NETWORK_LEVEL_ENTRIES,
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
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            networkHierarchyId: {
                type: DataTypes.UUID,
                field: "network_hierarchy_id"
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
                networkLevelEntries.belongsTo(models[NETWORK_HIERARCHIES], { foreignKey: "network_hierarchy_id" });
                networkLevelEntries.belongsTo(models[NETWORK_HIERARCHIES_HISTORY], { foreignKey: "network_hierarchy_id" });
                networkLevelEntries.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                networkLevelEntries.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return networkLevelEntries;
};
