"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            config.REQUEST_APPROVALS,
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
                fromStoreId: {
                    type: Sequelize.UUID,
                    field: "from_store_id",
                    references: {
                        model: config.ORGANIZATION_STORES,
                        key: "id"
                    }
                },
                fromStoreLocationId: {
                    type: Sequelize.UUID,
                    field: "from_store_location_id",
                    references: {
                        model: config.ORGANIZATION_STORE_LOCATIONS,
                        key: "id"
                    }
                },
                toStoreId: {
                    type: Sequelize.UUID,
                    field: "to_store_id",
                    references: {
                        model: config.ORGANIZATION_STORES,
                        key: "id"
                    }
                },
                toStoreLocationId: {
                    type: Sequelize.UUID,
                    field: "to_store_location_id",
                    references: {
                        model: config.ORGANIZATION_STORE_LOCATIONS,
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
                requestedQuantity: {
                    type: Sequelize.INTEGER,
                    field: "requested_quantity",
                    allowNull: false
                },
                approvedQuantity: {
                    type: Sequelize.INTEGER,
                    field: "approved_quantity"
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
                serialNumbers: {
                    type: Sequelize.STRING,
                    field: "serial_numbers"
                },
                vehicleNumber: {
                    type: Sequelize.STRING,
                    field: "vehicle_number"
                },
                requestNumber: {
                    type: Sequelize.STRING,
                    field: "request_number"
                },
                status: {
                    type: Sequelize.ENUM,
                    field: "status",
                    values: ["0", "1"],
                    allowNull: false,
                    defaultValue: "1"
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
        return queryInterface.dropTable(config.REQUEST_APPROVALS);
    }
};