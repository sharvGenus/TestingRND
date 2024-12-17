const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const attributeValidationBlocks = sequelize.define(
        config.ATTRIBUTE_VALIDATION_BLOCKS,
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
                field: "name",
                allowNull: false
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id"
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM,
                field: "type",
                values: ["and", "or"],
                defaultValue: "and"
            },
            primaryColumn: {
                type: DataTypes.UUID,
                field: "primary_column"
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
                attributeValidationBlocks.hasMany(models[config.ATTRIBUTE_VALIDATION_CONDITIONS], { foreignKey: "validation_block_id" });
                attributeValidationBlocks.hasMany(models[config.FORM_VALIDATION_BLOCKS], { foreignKey: "attribute_validation_block_id" });
                attributeValidationBlocks.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                attributeValidationBlocks.belongsTo(models[config.FORM_ATTRIBUTES], { foreignKey: "primary_column" });
            }
        }
    );

    return attributeValidationBlocks;
};
