const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const stockLedgerDetails = sequelize.define(
        config.STOCK_LEDGER_DETAILS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            transactionTypeId: {
                type: DataTypes.UUID,
                field: "transaction_type_id"
            },
            referenceDocumentNumber: {
                type: DataTypes.STRING,
                field: "reference_document_number",
                allowNull: false
            },
            sapNumber: {
                type: DataTypes.STRING,
                field: "sap_number"
            },
            challanNumber: {
                type: DataTypes.STRING,
                field: "challan_number"
            },
            challanDate: {
                type: DataTypes.DATE,
                field: "challan_date"
            },
            poNumber: {
                type: DataTypes.STRING,
                field: "po_number"
            },
            poDate: {
                type: DataTypes.DATE,
                field: "po_date"
            },
            lrNumber: {
                type: DataTypes.STRING,
                field: "lr_number"
            },
            transporterName: {
                type: DataTypes.STRING,
                field: "transporter_name"
            },
            transporterContactNumber: {
                type: DataTypes.STRING,
                field: "transporter_contact_number"
            },
            vehicleNumber: {
                type: DataTypes.STRING,
                field: "vehicle_number"
            },
            invoiceNumber: {
                type: DataTypes.STRING,
                field: "invoice_number"
            },
            invoiceDate: {
                type: DataTypes.DATE,
                field: "invoice_date"
            },
            placeOfSupply: {
                type: DataTypes.TEXT,
                field: "place_of_supply"
            },
            eWayBillNumber: {
                type: DataTypes.STRING,
                field: "e_way_bill_number"
            },
            eWayBillDate: {
                type: DataTypes.DATE,
                field: "e_way_bill_date"
            },
            actualReceiptDate: {
                type: DataTypes.DATE,
                field: "actual_receipt_date"
            },
            supplierId: {
                type: DataTypes.UUID,
                field: "supplier_id"
            },
            toStoreId: {
                type: DataTypes.UUID,
                field: "to_store_id"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            attachments: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "attachments"
            },
            expiryDate: {
                type: DataTypes.DATE,
                field: "expiry_date"
            },
            transactionTypeRangeId: {
                type: DataTypes.UUID,
                field: "transaction_type_range_id"
            },
            consumerName: {
                type: DataTypes.STRING,
                field: "consumer_name"
            },
            kNumber: {
                type: DataTypes.STRING,
                field: "k_number"
            },
            responseId: {
                type: DataTypes.UUID,
                field: "response_id"
            },
            serialNumber: {
                type: DataTypes.STRING,
                field: "serial_number"
            },
            brandMasterId: {
                type: DataTypes.UUID,
                field: "brand_master_id"
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            installerId: {
                type: DataTypes.UUID,
                field: "installer_id"
            },
            serialNumberId: {
                type: DataTypes.STRING,
                field: "serial_number_id"
            },
            capitalize: {
                type: DataTypes.BOOLEAN,
                field: "capitalize"
            },
            brandName: {
                type: DataTypes.UUID,
                field: "brand_name"
            },
            nonSerializeMaterialId: {
                type: DataTypes.UUID,
                field: "non_serialize_material_id"
            },
            quantity: {
                type: DataTypes.STRING,
                field: "quantity"
            },
            counter: {
                type: DataTypes.INTEGER,
                field: "counter"
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
                stockLedgerDetails.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "transaction_type_id" });
                stockLedgerDetails.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "stock_ledger_detail_id" });
                stockLedgerDetails.belongsTo(models[config.TRANSACTION_TYPE_RANGES], { foreignKey: "transaction_type_range_id" });
                stockLedgerDetails.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                stockLedgerDetails.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                stockLedgerDetails.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "to_store_id", as: "other_party_store" });
                stockLedgerDetails.belongsTo(models[config.ORGANIZATIONS], { foreignKey: "supplier_id", as: "supplier" });
            }
        }
    );

    return stockLedgerDetails;
};
