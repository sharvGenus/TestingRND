const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const allMasterColumnsList = sequelize.define(
        config.ALL_MASTER_COLUMNS_LIST,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            masterId: {
                type: DataTypes.UUID,
                field: "master_id",
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name"
            },
            visibleName: {
                type: DataTypes.STRING,
                field: "visible_name",
                allowNull: false
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
                field: "deleted_at",
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                allMasterColumnsList.belongsTo(models[config.ALL_MASTERS_LIST], { foreignKey: "master_id" });
                allMasterColumnsList.hasMany(models[config.ROLE_MASTER_COLUMN_PERMISSION], { foreignKey: "column_id" });
                allMasterColumnsList.hasMany(models[config.USER_MASTER_COLUMN_PERMISSION], { foreignKey: "master_id" });
                allMasterColumnsList.hasMany(models[config.USER_MASTER_LOV_PERMISSION], { foreignKey: "column_id" });
                allMasterColumnsList.hasMany(models[config.FORM_ATTRIBUTES], { foreignKey: "mapping_column_id" });
            }
        }
    );

    return allMasterColumnsList;
};
