"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.STOCK_LEDGER_DETAILS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                transactionTypeId: {
                    type: Sequelize.UUID,
                    field: "transaction_type_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                referenceDocumentNumber: {
                    type: Sequelize.STRING,
                    field: "reference_document_number",
                    allowNull: false
                },
                sapNumber: {
                    type: Sequelize.STRING,
                    field: "sap_number"
                },
                challanNumber: {
                    type: Sequelize.STRING,
                    field: "challan_number"
                },
                challanDate: {
                    type: Sequelize.DATE,
                    field: "challan_date"
                },
                poNumber: {
                    type: Sequelize.STRING,
                    field: "po_number"
                },
                poDate: {
                    type: Sequelize.DATE,
                    field: "po_date"
                },
                lrNumber: {
                    type: Sequelize.STRING,
                    field: "lr_number"
                },
                transporterName: {
                    type: Sequelize.STRING,
                    field: "transporter_name"
                },
                transporterContactNumber: {
                    type: Sequelize.STRING,
                    field: "transporter_contact_number"
                },
                vehicleNumber: {
                    type: Sequelize.STRING,
                    field: "vehicle_number"
                },
                alternateUomId: {
                    type: Sequelize.UUID,
                    field: "alternate_uom_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                alternateQuantity: {
                    type: Sequelize.INTEGER,
                    field: "alternate_quantity"
                },
                alternateRate: {
                    type: Sequelize.FLOAT,
                    field: "alternate_rate"
                },
                invoiceNumber: {
                    type: Sequelize.STRING,
                    field: "invoice_number"
                },
                invoiceDate: {
                    type: Sequelize.DATE,
                    field: "invoice_date"
                },
                eWayBillNumber: {
                    type: Sequelize.STRING,
                    field: "e_way_bill_number"
                },
                eWayBillDate: {
                    type: Sequelize.DATE,
                    field: "e_way_bill_date"
                },
                actualReceiptDate: {
                    type: Sequelize.DATE,
                    field: "actual_receipt_date"
                },
                toStoreId: {
                    type: Sequelize.UUID,
                    field: "to_store_id"
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
                },
                isActive: {
                    type: Sequelize.ENUM,
                    field: "is_active",
                    values: ["0", "1"],
                    allowNull: false,
                    defaultValue: "1"
                },
                createdBy: {
                    type: Sequelize.UUID,
                    field: "created_by"
                },
                updatedBy: {
                    type: Sequelize.UUID,
                    field: "updated_by"
                },
                createdAt: {
                    type: Sequelize.DATE,
                    field: "created_at",
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    field: "updated_at",
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                    allowNull: false
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    field: "deleted_at"
                }
            }
        );
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(config.STOCK_LEDGER_DETAILS);
    }
};