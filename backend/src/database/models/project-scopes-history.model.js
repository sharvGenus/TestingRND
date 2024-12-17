const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const projectScopesHistory = sequelize.define(
        config.PROJECT_SCOPES_HISTORY,
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
                field: "project_id"
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id"
            },
            materialTypeId: {
                type: DataTypes.UUID,
                field: "material_type_id"
            },
            uomId: {
                type: DataTypes.UUID,
                field: "uom_id"
            },
            orderQuantity: {
                type: DataTypes.FLOAT,
                field: "order_quantity",
                allowNull: false
            },
            totalQuantity: {
                type: DataTypes.FLOAT,
                field: "total_quantity",
                allowNull: false
            },
            satQuantity: {
                type: DataTypes.FLOAT,
                field: "sat_quantity"
            },
            installationMonth: {
                type: DataTypes.FLOAT,
                field: "installation_month"
            },
            installationEndDate: {
                type: DataTypes.DATE,
                field: "installation_end_date"
            },
            installationMonthIncentive: {
                type: DataTypes.FLOAT,
                field: "installation_month_incentive"
            },
            installationEndDateIncentive: {
                type: DataTypes.DATE,
                field: "installation_end_date_incentive"
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
                projectScopesHistory.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                projectScopesHistory.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                projectScopesHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "material_type_id", as: "material_type" });
                projectScopesHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "uom_id", as: "uom" });
                projectScopesHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                projectScopesHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return projectScopesHistory;
};