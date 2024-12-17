const { USER_COLUMN_DEFAULT_PERMISSIONS, USER_COLUMN_WISE_PERMISSIONS, FORMS, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const userColumnDefaultPermissions = sequelize.define(
        USER_COLUMN_DEFAULT_PERMISSIONS,
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
            userId: {
                type: DataTypes.UUID,
                field: "user_id"
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
                userColumnDefaultPermissions.hasMany(models[USER_COLUMN_WISE_PERMISSIONS], { foreignKey: "user_default_permission_id" });
                userColumnDefaultPermissions.belongsTo(models[FORMS], { foreignKey: "form_id" });
                userColumnDefaultPermissions.belongsTo(models[USERS], { foreignKey: "user_id" });
            }
        }
    );

    return userColumnDefaultPermissions;
};
