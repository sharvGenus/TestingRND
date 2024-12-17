const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const projectScopeExtensionsHistory = sequelize.define(
        config.PROJECT_SCOPE_EXTENSIONS_HISTORY,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            projectScopeId: {
                type: DataTypes.UUID,
                field: "project_scope_id"
            },
            extensionQuantity: {
                type: DataTypes.FLOAT,
                field: "extension_quantity",
                allowNull: false
            },
            extensionStartDate: {
                type: DataTypes.DATE,
                field: "extension_start_date",
                allowNull: false
            },
            extensionMonth: {
                type: DataTypes.FLOAT,
                field: "extension_month",
                allowNull: false
            },
            extensionEndDate: {
                type: DataTypes.DATE,
                field: "extension_end_date",
                allowNull: false
            },
            documentNumber: {
                type: DataTypes.STRING,
                field: "document_number"
            },
            documentDate: {
                type: DataTypes.DATE,
                field: "document_date"
            },
            attachments: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "attachments"
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
            },
            recordId: {
                type: DataTypes.UUID,
                field: "record_id"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                projectScopeExtensionsHistory.belongsTo(models[config.PROJECT_SCOPES], { foreignKey: "project_scope_id" });
                projectScopeExtensionsHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                projectScopeExtensionsHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return projectScopeExtensionsHistory;
};