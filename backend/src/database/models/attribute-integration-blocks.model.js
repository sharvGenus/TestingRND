const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const attributeIntegrationBlocks = sequelize.define(
        config.ATTRIBUTE_INTEGRATION_BLOCKS,
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
            endpoint: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            auth: {
                type: DataTypes.TEXT,
                field: "auth",
                allowNull: true
            },
            method: {
                type: DataTypes.TEXT
            },
            type: {
                type: DataTypes.ENUM,
                field: "type",
                values: ["and", "or"],
                defaultValue: "and"
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
                attributeIntegrationBlocks.hasMany(models[config.ATTRIBUTE_INTEGRATION_CONDITIONS], { foreignKey: "integration_block_id" });
                attributeIntegrationBlocks.hasMany(models[config.ATTRIBUTE_INTEGRATION_PAYLOAD], { foreignKey: "integration_block_id" });
                attributeIntegrationBlocks.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
            }
        }
    );

    return attributeIntegrationBlocks;
};
