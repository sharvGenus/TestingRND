"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.STOCK_LEDGERS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                stockLedgerDetailId: {
                    type: Sequelize.UUID,
                    field: "stock_ledger_detail_id",
                    references: {
                        model: config.STOCK_LEDGER_DETAILS,
                        key: "id"
                    }
                },
                transactionTypeId: {
                    type: Sequelize.UUID,
                    field: "transaction_type_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                organizationId: {
                    type: Sequelize.UUID,
                    field: "organization_id",
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                },
                projectId: {
                    type: Sequelize.UUID,
                    field: "project_id",
                    references: {
                        model: config.PROJECTS,
                        key: "id"
                    }
                },
                referenceDocumentNumber: {
                    type: Sequelize.STRING,
                    field: "reference_document_number",
                    allowNull: false
                },
                requestNumber: {
                    type: Sequelize.STRING,
                    field: "request_number"
                },
                storeId: {
                    type: Sequelize.UUID,
                    field: "store_id",
                    references: {
                        model: config.ORGANIZATION_STORES,
                        key: "id"
                    }
                },
                storeLocationId: {
                    type: Sequelize.UUID,
                    field: "store_location_id",
                    references: {
                        model: config.ORGANIZATION_STORE_LOCATIONS,
                        key: "id"
                    }
                },
                installerId: {
                    type: Sequelize.UUID,
                    field: "installer_id",
                    references: {
                        model: config.USERS,
                        key: "id"
                    }
                },
                materialId: {
                    type: Sequelize.UUID,
                    field: "material_id",
                    references: {
                        model: config.MATERIALS,
                        key: "id"
                    }
                },
                uomId: {
                    type: Sequelize.UUID,
                    field: "uom_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    field: "quantity",
                    allowNull: false
                },
                rate: {
                    type: Sequelize.FLOAT,
                    field: "rate",
                    allowNull: false
                },
                value: {
                    type: Sequelize.FLOAT,
                    field: "value",
                    allowNull: false
                },
                tax: {
                    type: Sequelize.FLOAT,
                    field: "tax",
                    allowNull: false
                },
                approverId: {
                    type: Sequelize.UUID,
                    field: "approver_id",
                    references: {
                        model: config.USERS,
                        key: "id"
                    }
                },
                requestApprovalId: {
                    type: Sequelize.UUID,
                    field: "request_approval_id",
                    references: {
                        model: config.REQUEST_APPROVALS,
                        key: "id"
                    }
                },
                attachments: {
                    type: Sequelize.STRING,
                    field: "attachments"
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
        return queryInterface.dropTable(config.STOCK_LEDGERS);
    }
};