const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const devolutionConfigs = sequelize.define(
        config.DEVOLUTION_CONFIGS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id",
                allowNull: false
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id",
                allowNull: false
            },
            prefix: {
                type: DataTypes.STRING,
                field: "prefix",
                allowNull: false
            },
            index: {
                type: DataTypes.INTEGER,
                field: "index",
                allowNull: false
            },
            oldSerialNoId: {
                type: DataTypes.UUID,
                field: "old_serial_no_id",
                allowNull: false
            },
            oldMakeId: {
                type: DataTypes.UUID,
                field: "old_make_id",
                allowNull: false
            },
            newSerialNoId: {
                type: DataTypes.UUID,
                field: "new_serial_no_id",
                allowNull: false
            },
            newMakeId: {
                type: DataTypes.UUID,
                field: "new_make_id"
            },
            isLocked: {
                type: DataTypes.BOOLEAN,
                field: "is_locked",
                defaultValue: false,
                allowNull: false
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                defaultValue: "1",
                allowNull: false
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
                devolutionConfigs.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                devolutionConfigs.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                devolutionConfigs.belongsTo(models[config.FORM_ATTRIBUTES], { foreignKey: "old_serial_no_id", as: "old_serial_no" });
                devolutionConfigs.belongsTo(models[config.FORM_ATTRIBUTES], { foreignKey: "old_make_id", as: "old_make" });
                devolutionConfigs.belongsTo(models[config.FORM_ATTRIBUTES], { foreignKey: "new_serial_no_id", as: "new_serial_no" });
                devolutionConfigs.belongsTo(models[config.FORM_ATTRIBUTES], { foreignKey: "new_make_id", as: "new_make" });
                devolutionConfigs.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                devolutionConfigs.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                devolutionConfigs.hasMany(models[config.DEVOLUTION_MAPPINGS], { foreignKey: "devolution_config_id" });
            }
        }
    );

    return devolutionConfigs;
};