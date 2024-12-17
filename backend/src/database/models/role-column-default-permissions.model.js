const { ROLE_COLUMN_DEFAULT_PERMISSIONS, ROLES, FORMS, ROLE_COLUMN_WISE_PERMISSIONS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const roleColumnDefaultPermissions = sequelize.define(
        ROLE_COLUMN_DEFAULT_PERMISSIONS,
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
            formId: {
                type: DataTypes.UUID,
                field: "form_id"
            },
            view: {
                type: DataTypes.BOOLEAN,
                field: "view",
                defaultValue: false
            },
            add: {
                type: DataTypes.BOOLEAN,
                field: "add",
                defaultValue: false
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                defaultValue: "1"
            },
            update: {
                type: DataTypes.BOOLEAN,
                field: "update",
                defaultValue: false
            },
            deleteRecord: {
                type: DataTypes.BOOLEAN,
                field: "delete_record",
                defaultValue: false
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
                roleColumnDefaultPermissions.belongsTo(models[ROLES], { foreignKey: "role_id" });
                roleColumnDefaultPermissions.belongsTo(models[FORMS], { foreignKey: "form_id" });
                roleColumnDefaultPermissions.hasMany(models[ROLE_COLUMN_WISE_PERMISSIONS], { foreignKey: "role_default_permission_id" });
            }
        }
    );

    return roleColumnDefaultPermissions;
};
