const { ROLE_MASTER_COLUMN_PERMISSION, ALL_MASTERS_LIST, ALL_MASTER_COLUMNS_LIST, ROLES } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const roleMasterColumnPermissions = sequelize.define(
        ROLE_MASTER_COLUMN_PERMISSION,
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
                field: "role_id"
            },
            masterId: {
                type: DataTypes.UUID,
                field: "master_id"
            },
            columnId: {
                type: DataTypes.UUID,
                field: "column_id"
            },
            view: {
                type: DataTypes.BOOLEAN,
                field: "view",
                allowNull: false
            },
            add: {
                type: DataTypes.BOOLEAN,
                field: "add",
                allowNull: false
            },
            edit: {
                type: DataTypes.BOOLEAN,
                field: "edit",
                allowNull: false
            },
            delete: {
                type: DataTypes.BOOLEAN,
                field: "delete",
                allowNull: false
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
                field: "deleted_at",
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                roleMasterColumnPermissions.belongsTo(models[ROLES], { foreignKey: "role_id" });
                roleMasterColumnPermissions.belongsTo(models[ALL_MASTERS_LIST], { foreignKey: "master_id" });
                roleMasterColumnPermissions.belongsTo(models[ALL_MASTER_COLUMNS_LIST], { foreignKey: "column_id" });
            }
        }
    );

    return roleMasterColumnPermissions;
};
