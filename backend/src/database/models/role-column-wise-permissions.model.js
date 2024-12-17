const { ROLE_COLUMN_WISE_PERMISSIONS, ROLES, FORMS, FORM_ATTRIBUTES, ROLE_COLUMN_DEFAULT_PERMISSIONS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const roleColumnWisePermissions = sequelize.define(
        ROLE_COLUMN_WISE_PERMISSIONS,
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
            columnId: {
                type: DataTypes.UUID,
                field: "column_id"
            },
            roleDefaultPermissionId: {
                type: DataTypes.UUID,
                field: "role_default_permission_id"
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
            update: {
                type: DataTypes.BOOLEAN,
                field: "update",
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
                roleColumnWisePermissions.belongsTo(models[ROLES], { foreignKey: "role_id" });
                roleColumnWisePermissions.belongsTo(models[FORMS], { foreignKey: "form_id" });
                roleColumnWisePermissions.belongsTo(models[FORM_ATTRIBUTES], { foreignKey: "column_id" });
                roleColumnWisePermissions.belongsTo(models[ROLE_COLUMN_DEFAULT_PERMISSIONS], { foreignKey: "role_default_permission_id" });
            }
        }
    );

    return roleColumnWisePermissions;
};
