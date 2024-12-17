const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const attributeIntegrationPayload = sequelize.define(
        config.ATTRIBUTE_INTEGRATION_PAYLOAD,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            integrationBlockId: {
                type: DataTypes.UUID,
                field: "integration_block_id"
            },
            value: {
                type: DataTypes.UUID,
                field: "value"
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            parent: {
                type: DataTypes.UUID,
                field: "parent"
            },
            properties: {
                type: DataTypes.JSON,
                field: "properties"
            },
            type: {
                type: DataTypes.ENUM,
                field: "type",
                values: ["key", "array", "object"],
                defaultValue: "key"
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
                attributeIntegrationPayload.belongsTo(models[config.ATTRIBUTE_INTEGRATION_BLOCKS], { foreignKey: "integration_block_id" });
                attributeIntegrationPayload.belongsTo(models[config.FORM_ATTRIBUTES], { foreignKey: "value", as: "valueName" });
                attributeIntegrationPayload.belongsTo(models[config.ATTRIBUTE_INTEGRATION_PAYLOAD], { foreignKey: "parent", as: "parentName" });
            }
        }
    );

    return attributeIntegrationPayload;
};
