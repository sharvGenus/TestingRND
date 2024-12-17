const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const formValidationBlocks = sequelize.define(
        config.FORM_VALIDATION_BLOCKS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id"
            },
            attibuteValidationBlockId: {
                type: DataTypes.UUID,
                field: "attribute_validation_block_id"
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
                formValidationBlocks.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                formValidationBlocks.belongsTo(models[config.ATTRIBUTE_VALIDATION_BLOCKS], { foreignKey: "attribute_validation_block_id" });
                
            }
        }
    );

    return formValidationBlocks;
};
