const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const formAttributes = sequelize.define(
        config.FORM_ATTRIBUTES,
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
            columnName: {
                type: DataTypes.STRING,
                field: "column_name"
            },
            mappingColumnId: {
                type: DataTypes.UUID,
                field: "mapping_column_id"
            },
            rank: {
                type: DataTypes.INTEGER,
                field: "rank"
            },
            screenType: {
                type: DataTypes.ENUM,
                field: "screen_type",
                values: ["0", "1", "2"],
                defaultValue: "0"
            },
            properties: {
                type: DataTypes.JSON,
                field: "properties"
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id"
            },
            defaultAttributeId: {
                type: DataTypes.UUID,
                field: "default_attribute_id"
            },
            isRequired: {
                type: DataTypes.BOOLEAN,
                field: "is_required"
            },
            isUnique: {
                type: DataTypes.BOOLEAN,
                field: "is_unique"
            },
            isNull: {
                type: DataTypes.BOOLEAN,
                field: "is_null"
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
                formAttributes.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                formAttributes.belongsTo(models[config.DEFAULT_ATTRIBUTES], { foreignKey: "default_attribute_id" });
                formAttributes.hasMany(models[config.ATTRIBUTE_VALIDATION_CONDITIONS], { foreignKey: "form_attribute_id" });
                formAttributes.hasMany(models[config.ATTRIBUTE_VALIDATION_CONDITIONS], { foreignKey: "compare_with_form_attribute_id" });
                formAttributes.hasMany(models[config.ATTRIBUTE_INTEGRATION_CONDITIONS], { foreignKey: "compare_with_form_attribute_id" });
                formAttributes.hasMany(models[config.ATTRIBUTE_VISIBILITY_CONDITIONS], { foreignKey: "form_attribute_id" });
                formAttributes.hasMany(models[config.ATTRIBUTE_INTEGRATION_PAYLOAD], { foreignKey: "value" });
                formAttributes.hasMany(models[config.ATTRIBUTE_VALIDATION_BLOCKS], { foreignKey: "primary_column" });
                formAttributes.hasMany(models[config.ATTRIBUTE_INTEGRATION_CONDITIONS], { foreignKey: "form_attribute_id" });
                formAttributes.hasMany(models[config.ROLE_COLUMN_WISE_PERMISSIONS], { foreignKey: "column_id" });
                formAttributes.hasMany(models[config.USER_COLUMN_WISE_PERMISSIONS], { foreignKey: "column_id" });
                formAttributes.belongsTo(models[config.ALL_MASTER_COLUMNS_LIST], { foreignKey: "mapping_column_id" });
            }
        }
    );

    return formAttributes;
};
