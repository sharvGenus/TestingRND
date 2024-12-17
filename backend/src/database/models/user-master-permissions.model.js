const { USER_MASTER_PERMISSIONS, USERS, ALL_MASTERS_LIST } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const userMasterPermission = sequelize.define(
        USER_MASTER_PERMISSIONS,
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
            masterId: {
                type: DataTypes.UUID,
                field: "master_id",
                allowNull: false
            },
            grandParentId: {
                type: DataTypes.UUID,
                field: "grand_parent_id"
            },
            parentId: {
                type: DataTypes.UUID,
                field: "parent_id"
            },
            masterRoute: {
                type: DataTypes.STRING,
                field: "master_route"
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
                userMasterPermission.belongsTo(models[USERS], { foreignKey: "user_id" });
                userMasterPermission.belongsTo(models[ALL_MASTERS_LIST], { foreignKey: "master_id" });
            }
        }
    );

    return userMasterPermission;
};
