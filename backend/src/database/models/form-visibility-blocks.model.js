const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const formVisibilityBlocks = sequelize.define(
        config.FORM_VISIBILITY_BLOCKS,
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
            attributeVisibilityBlockId: {
                type: DataTypes.UUID,
                field: "attribute_visibility_block_id"
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
                formVisibilityBlocks.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                formVisibilityBlocks.belongsTo(models[config.ATTRIBUTE_VISIBILITY_BLOCKS], { foreignKey: "attribute_visibility_block_id" });
                
            }
        }
    );

    return formVisibilityBlocks;
};
