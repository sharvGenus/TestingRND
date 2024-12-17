const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const devolutionMappings = sequelize.define(
        config.DEVOLUTION_MAPPINGS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            devolutionConfigId: {
                type: DataTypes.UUID,
                field: "devolution_config_id"
            },
            formAttributeId: {
                type: DataTypes.UUID,
                field: "form_attribute_id",
                allowNull: false
            },
            newName: {
                type: DataTypes.STRING,
                field: "new_name",
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
                devolutionMappings.belongsTo(models[config.DEVOLUTION_CONFIGS], { foreignKey: "devolution_config_id" });
                devolutionMappings.belongsTo(models[config.FORM_ATTRIBUTES], { foreignKey: "form_attribute_id" });
            }
        }
    );

    return devolutionMappings;
};