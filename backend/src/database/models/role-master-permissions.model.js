const { ROLE_MASTER_PERMISSIONS, ROLES, ALL_MASTERS_LIST } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const roleMasterPermissions = sequelize.define(
        ROLE_MASTER_PERMISSIONS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            roleId: {
                type: DataTypes.UUID,
                field: "role_id",
                allowNull: false
            },
            masterId: {
                type: DataTypes.UUID,
                field: "master_id",
                allowNull: false
            },
            masterRoute: {
                type: DataTypes.STRING,
                field: "master_route"
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
            // paranoid: true,
            associate: (models) => {
                roleMasterPermissions.belongsTo(models[ROLES], { foreignKey: "role_id" });
                roleMasterPermissions.belongsTo(models[ALL_MASTERS_LIST], { foreignKey: "master_id" });
            }
        }
    );

    return roleMasterPermissions;
};
