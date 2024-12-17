const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const devolutions = sequelize.define(
        config.DEVOLUTIONS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            devolutionDocNo: {
                type: DataTypes.STRING,
                field: "devolution_doc_no",
                allowNull: false
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id",
                allowNull: false
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id",
                allowNull: false
            },
            customerId: {
                type: DataTypes.UUID,
                field: "customer_id",
                allowNull: false
            },
            customerStoreId: {
                type: DataTypes.UUID,
                field: "customer_store_id",
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                field: "quantity",
                allowNull: false
            },
            devolutionConfigId: {
                type: DataTypes.UUID,
                field: "devolution_config_id",
                allowNull: false
            },
            gaaHierarchy: {
                type: DataTypes.JSON,
                field: "gaa_hierarchy"
            },
            attachments: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "attachments"
            },
            approvalStatus: {
                type: DataTypes.ENUM,
                field: "approval_status",
                values: ["0", "1", "2"],
                defaultValue: "2",
                allowNull: false
            },
            approverId: {
                type: DataTypes.UUID,
                field: "approver_id"
            },
            approvalDate: {
                type: DataTypes.DATE,
                field: "approval_date"
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
                devolutions.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                devolutions.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                devolutions.belongsTo(models[config.ORGANIZATIONS], { foreignKey: "customer_id" });
                devolutions.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "customer_store_id" });
                devolutions.belongsTo(models[config.DEVOLUTION_CONFIGS], { foreignKey: "devolution_config_id" });
                devolutions.belongsTo(models[config.USERS], { foreignKey: "approver_id", as: "approver" });
                devolutions.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                devolutions.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                devolutions.hasMany(models[config.DEVOLUTION_MATERIALS], { foreignKey: "devolution_id" });
            }
        }
    );

    return devolutions;
};