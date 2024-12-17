const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const billingBasicDetails = sequelize.define(
        config.BILLING_BASIC_DETAILS,
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
            billNumber: {
                type: DataTypes.STRING,
                field: "bill_number"
            },
            isApproved: {
                type: DataTypes.BOOLEAN,
                field: "is_approved"
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            invoiceNumber: {
                type: DataTypes.STRING,
                field: "invoice_number"
            },
            invoiceDate: {
                type: DataTypes.DATE,
                field: "invoice_date"
            },
            workOrder: {
                type: DataTypes.STRING,
                field: "work_order"
            },
            bankName: {
                type: DataTypes.STRING,
                field: "bank_name"
            },
            ifscCode: {
                type: DataTypes.STRING,
                field: "ifsc_code"
            },
            accountNumber: {
                type: DataTypes.BIGINT,
                field: "account_number"
            },
            totalAmount: {
                type: DataTypes.STRING,
                field: "total_amount"
            },
            sapNumber: {
                type: DataTypes.STRING,
                field: "sap_number"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            attachments: {
                type: DataTypes.TEXT,
                field: "attachments"
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
                billingBasicDetails.hasMany(models[config.BILLING_MATERIAL_DETAILS], { foreignKey: "billing_basic_detail_id" });
                billingBasicDetails.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
            }
        }
    );
    return billingBasicDetails;
};
