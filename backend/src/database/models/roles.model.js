const { ROLES, USERS_HISTORY, PROJECTS, USERS, USER_MASTER_COLUMN_PERMISSION, USER_MASTER_LOV_PERMISSION, ROLE_MASTER_COLUMN_PERMISSION, ROLE_MASTER_LOV_PERMISSIONS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const roles = sequelize.define(
        ROLES,
        {
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
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
            description: {
                type: DataTypes.STRING,
                field: "description"
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            forTicket: {
                type: DataTypes.BOOLEAN,
                field: 'for_ticket',
                defaultValue: false
            },
            addTicket: {
                type: DataTypes.BOOLEAN,
                field: "add_ticket",
                defaultValue: false
            },
            isImport: {
                type: DataTypes.BOOLEAN,
                field: "is_import",
                defaultValue: false
            },
            isExport: {
                type: DataTypes.BOOLEAN,
                field: "is_export",
                defaultValue: false
            },
            isUpdate: {
                type: DataTypes.BOOLEAN,
                field: "is_update",
                defaultValue: false
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
                field: "deleted_at",
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                roles.belongsTo(models[PROJECTS], { foreignKey: "project_id" });
                roles.hasMany(models[USERS], { foreignKey: "role_id" });
                // roles.hasMany(models[USER_MASTER_COLUMN_PERMISSION], { foreignKey: "user_master_column_permission_id" });
                // roles.hasMany(models[USER_MASTER_LOV_PERMISSION], { foreignKey: "user_master_lov_permission_id" });
                roles.hasMany(models[ROLE_MASTER_COLUMN_PERMISSION], { foreignKey: "role_id" });
                roles.hasMany(models[ROLE_MASTER_LOV_PERMISSIONS], { foreignKey: "role_id" });
                roles.hasMany(models[USERS_HISTORY], { foreignKey: "role_id" });
                roles.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                roles.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );
    return roles;
};
