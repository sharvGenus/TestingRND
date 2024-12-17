const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const stockLedgers = sequelize.define(
        config.STOCK_LEDGERS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            stockLedgerDetailId: {
                type: DataTypes.UUID,
                field: "stock_ledger_detail_id"
            },
            transactionTypeId: {
                type: DataTypes.UUID,
                field: "transaction_type_id"
            },
            organizationId: {
                type: DataTypes.UUID,
                field: "organization_id"
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            referenceDocumentNumber: {
                type: DataTypes.STRING,
                field: "reference_document_number",
                allowNull: false
            },
            requestNumber: {
                type: DataTypes.STRING,
                field: "request_number"
            },
            storeId: {
                type: DataTypes.UUID,
                field: "store_id"
            },
            storeLocationId: {
                type: DataTypes.UUID,
                field: "store_location_id"
            },
            installerId: {
                type: DataTypes.UUID,
                field: "installer_id"
            },
            materialId: {
                type: DataTypes.UUID,
                field: "material_id"
            },
            uomId: {
                type: DataTypes.UUID,
                field: "uom_id"
            },
            quantity: {
                type: DataTypes.FLOAT,
                field: "quantity",
                allowNull: false
            },
            rate: {
                type: DataTypes.FLOAT,
                field: "rate",
                allowNull: false
            },
            value: {
                type: DataTypes.FLOAT,
                field: "value",
                allowNull: false
            },
            tax: {
                type: DataTypes.FLOAT,
                field: "tax",
                allowNull: false
            },
            approverId: {
                type: DataTypes.UUID,
                field: "approver_id"
            },
            requestApprovalId: {
                type: DataTypes.UUID,
                field: "request_approval_id"
            },
            attachments: {
                type: DataTypes.STRING,
                field: "attachments"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            cancelRefDocNo: {
                type: DataTypes.STRING,
                field: "cancel_ref_doc_no"
            },
            isCancelled: {
                type: DataTypes.BOOLEAN,
                field: "is_cancelled",
                allowNull: false,
                defaultValue: false
            },
            isProcessed: {
                type: DataTypes.BOOLEAN,
                field: "is_processed",
                allowNull: false,
                defaultValue: false
            },
            willReturn: {
                type: DataTypes.BOOLEAN,
                field: "will_return",
                defaultValue: false
            },
            otherStoreId: {
                type: DataTypes.UUID,
                field: "other_store_id"
            },
            otherStoreLocationId: {
                type: DataTypes.UUID,
                field: "other_store_location_id"
            },
            otherProjectId: {
                type: DataTypes.UUID,
                field: "other_project_id"
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
                stockLedgers.belongsTo(models[config.STOCK_LEDGER_DETAILS], { foreignKey: "stock_ledger_detail_id" });
                stockLedgers.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "transaction_type_id", as: "transaction_type" });
                stockLedgers.belongsTo(models[config.ORGANIZATIONS], { foreignKey: "organization_id" });
                stockLedgers.belongsTo(models[config.PROJECTS], { foreignKey: "project_id", as: "project" });
                stockLedgers.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "store_id", as: "organization_store" });
                stockLedgers.belongsTo(models[config.ORGANIZATION_STORE_LOCATIONS], { foreignKey: "store_location_id", as: "organization_store_location" });
                stockLedgers.belongsTo(models[config.MATERIALS], { foreignKey: "material_id" });
                stockLedgers.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "uom_id", as: "uom" });
                stockLedgers.belongsTo(models[config.USERS], { foreignKey: "approver_id", as: "approver" });
                stockLedgers.belongsTo(models[config.REQUEST_APPROVALS], { foreignKey: "request_approval_id" });
                stockLedgers.hasMany(models[config.MATERIAL_SERIAL_NUMBERS], { foreignKey: "stock_ledger_id" });
                stockLedgers.belongsTo(models[config.USERS], { foreignKey: "installer_id", as: "installer" });
                stockLedgers.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                stockLedgers.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                stockLedgers.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "other_store_id", as: "other_store" });
                stockLedgers.belongsTo(models[config.ORGANIZATION_STORE_LOCATIONS], { foreignKey: "other_store_location_id", as: "other_store_location" });
                stockLedgers.belongsTo(models[config.PROJECTS], { foreignKey: "other_project_id", as: "other_project" });
            }
        }
    );

    return stockLedgers;
};