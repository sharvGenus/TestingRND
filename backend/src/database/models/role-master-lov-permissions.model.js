const { ROLE_MASTER_LOV_PERMISSIONS, ALL_MASTERS_LIST, ROLES } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const roleMasterRolePermissions = sequelize.define(
        ROLE_MASTER_LOV_PERMISSIONS,
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
            lovId: {
                type: DataTypes.UUID,
                field: "lov_id"
            },
            view: {
                type: DataTypes.BOOLEAN,
                field: "view"
            },
            add: {
                type: DataTypes.BOOLEAN,
                field: "add"
            },
            edit: {
                type: DataTypes.BOOLEAN,
                field: "edit"
            },
            delete: {
                type: DataTypes.BOOLEAN,
                field: "delete"
            },
            createdBy: {
                type: DataTypes.UUID,
                field: "created_by"
            },
            updatedBy: {
                type: DataTypes.UUID,
                field: "updated_by"
            },
            lovArray: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "lov_array"
            },
            isAllRowsGoverned: {
                type: DataTypes.BOOLEAN,
                field: "is_all_rows_governed"
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
                roleMasterRolePermissions.belongsTo(models[ROLES], { foreignKey: "role_id" });
                roleMasterRolePermissions.belongsTo(models[ALL_MASTERS_LIST], { foreignKey: "master_id" });
            }
        }
    );

    return roleMasterRolePermissions;
};
