const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const allMastersList = sequelize.define(
        config.ALL_MASTERS_LIST,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                field: "name"
            },
            visibleName: {
                type: DataTypes.STRING,
                field: "visible_name",
                allowNull: false
            },
            accessFlag: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                field: "access_flag"
            },
            lovAccess: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                field: "lov_access"
            },
            masterRoute: {
                type: DataTypes.STRING,
                field: "master_route"
            },
            isMaster: {
                type: DataTypes.BOOLEAN,
                field: "is_master"
            },
            parent: {
                type: DataTypes.STRING,
                field: "parent"
            },
            grandParent: {
                type: DataTypes.STRING,
                field: "grand_parent"
            },
            parentRank: {
                type: DataTypes.INTEGER,
                field: "parent_rank"
            },
            grandParentRank: {
                type: DataTypes.INTEGER,
                field: "grand_parent_rank"
            },
            rank: {
                type: DataTypes.INTEGER,
                field: "rank"
            },
            grandParentId: {
                type: DataTypes.UUID,
                field: "grand_parent_id"
            },
            parentId: {
                type: DataTypes.UUID,
                field: "parent_id"
            },
            tableType: {
                type: DataTypes.STRING,
                field: "table_type"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
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
                allMastersList.hasMany(models[config.USER_MASTER_PERMISSIONS], { foreignKey: "master_id" });
                allMastersList.hasMany(models[config.ALL_MASTER_COLUMNS_LIST], { foreignKey: "master_id" });
                allMastersList.hasMany(models[config.ROLE_MASTER_COLUMN_PERMISSION], { foreignKey: "master_id" });
                allMastersList.hasMany(models[config.USER_MASTER_COLUMN_PERMISSION], { foreignKey: "master_id" });
                allMastersList.hasMany(models[config.USER_MASTER_LOV_PERMISSION], { foreignKey: "master_id" });
                allMastersList.hasMany(models[config.ROLE_MASTER_LOV_PERMISSIONS], { foreignKey: "master_id" });
                allMastersList.hasMany(models[config.FORMS], { foreignKey: "mapping_table_id" });
                allMastersList.belongsTo(models[config.ALL_MASTERS_LIST], { foreignKey: "parent_id", as: "parent_info" });
                allMastersList.belongsTo(models[config.ALL_MASTERS_LIST], { foreignKey: "grand_parent_id", as: "grand_parent_info" });
            }
        }
    );

    return allMastersList;
};
