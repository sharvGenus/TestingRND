const { USER_MASTER_COLUMN_PERMISSION, USERS, ROLES, ALL_MASTERS_LIST, ALL_MASTER_COLUMNS_LIST } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const userMasterColumnPermission = sequelize.define(
        USER_MASTER_COLUMN_PERMISSION,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.UUID,
                field: "user_id",
                allowNull: false
            },
            roleId: {
                type: DataTypes.UUID,
                field: "role_id"
            },
            masterId: {
                type: DataTypes.UUID,
                field: "master_id",
                allowNull: false
            },
            columnId: {
                type: DataTypes.UUID,
                field: "column_id"
            },
            columnsArray: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "columns_array"
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
                userMasterColumnPermission.belongsTo(models[USERS], { foreignKey: "user_id" });
                userMasterColumnPermission.belongsTo(models[ROLES], { foreignKey: "role_id" });
                userMasterColumnPermission.belongsTo(models[ALL_MASTERS_LIST], { foreignKey: "master_id" });
                userMasterColumnPermission.belongsTo(models[ALL_MASTER_COLUMNS_LIST], { foreignKey: "column_id" });
            }
        }
    );

    return userMasterColumnPermission;
};
