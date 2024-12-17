const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const forms = sequelize.define(
        config.FORMS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            tableName: {
                type: DataTypes.STRING,
                field: "table_name"
            },
            searchColumns: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "search_columns"
            },
            selfSearchColumns: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "self_search_columns"
            },
            mappingTableId: {
                type: DataTypes.UUID,
                field: "mapping_table_id"
            },
            totalCounts: {
                type: DataTypes.INTEGER,
                field: "total_counts"
            },
            approvedCounts: {
                type: DataTypes.INTEGER,
                field: "approved_counts"
            },
            rejectedCounts: {
                type: DataTypes.INTEGER,
                field: "rejected_counts"
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            isPublished: {
                type: DataTypes.BOOLEAN,
                field: "is_published",
                defaultValue: false
            },
            sequence: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                field: "sequence"
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            formTypeId: {
                type: DataTypes.UUID,
                field: "form_type_id"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            properties: {
                type: DataTypes.JSON,
                field: "properties"
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
                forms.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                forms.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "form_type_id" });
                forms.hasMany(models[config.FORM_ATTRIBUTES], { foreignKey: "form_id" });
                forms.hasMany(models[config.FORM_VALIDATION_BLOCKS], { foreignKey: "form_id" });
                forms.hasMany(models[config.FORM_VISIBILITY_BLOCKS], { foreignKey: "form_id" });
                forms.hasMany(models[config.ATTRIBUTE_VALIDATION_BLOCKS], { foreignKey: "form_id" });
                forms.hasMany(models[config.ROLE_COLUMN_DEFAULT_PERMISSIONS], { foreignKey: "form_id" });
                forms.hasMany(models[config.ROLE_COLUMN_WISE_PERMISSIONS], { foreignKey: "form_id" });
                forms.hasMany(models[config.USER_COLUMN_DEFAULT_PERMISSIONS], { foreignKey: "form_id" });
                forms.hasMany(models[config.FORM_WISE_TICKET_MAPPINGS], { foreignKey: "form_id" });
                forms.hasMany(models[config.TICKETS], { foreignKey: "form_id" });
                forms.belongsTo(models[config.ALL_MASTERS_LIST], { foreignKey: "mapping_table_id" });
                forms.hasMany(models[config.TICKETS_HISTORY], { foreignKey: "form_id" });
                forms.hasMany(models[config.FORM_WISE_TICKET_MAPPINGS_HISTORY], { foreignKey: "form_id" });
                forms.hasMany(models[config.ATTRIBUTE_INTEGRATION_BLOCKS], { foreignKey: "form_id" });
            }
        }
    );

    return forms;
};
