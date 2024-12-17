const { USER_MASTER_LOV_PERMISSION, USERS, ROLES, ALL_MASTERS_LIST, ALL_MASTER_COLUMNS_LIST } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const userMasterLovPermission = sequelize.define(
        USER_MASTER_LOV_PERMISSION,
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
                field: "role_id",
                allowNull: false
            },
            masterId: {
                type: DataTypes.UUID,
                field: "master_id",
                allowNull: false
            },
            lovId: {
                type: DataTypes.UUID,
                field: "lov_id",
                allowNull: false
            },
            columnId: {
                type: DataTypes.UUID,
                field: "column_id",
                allowNull: false
            },
            lovArray: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "lov_array"
            },
            isAllRowsGoverned: {
                type: DataTypes.BOOLEAN,
                field: "is_all_rows_governed"
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
                userMasterLovPermission.belongsTo(models[USERS], { foreignKey: "user_id" });
                userMasterLovPermission.belongsTo(models[ROLES], { foreignKey: "role_id" });
                userMasterLovPermission.belongsTo(models[ALL_MASTERS_LIST], { foreignKey: "master_id" });
                userMasterLovPermission.belongsTo(models[ALL_MASTER_COLUMNS_LIST], { foreignKey: "column_id" });
            }
        }
    );

    return userMasterLovPermission;
};
