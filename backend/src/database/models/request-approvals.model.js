const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const requestApprovals = sequelize.define(
        config.REQUEST_APPROVALS,
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
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            referenceDocumentNumber: {
                type: DataTypes.STRING,
                field: "reference_document_number",
                allowNull: false
            },
            fromStoreId: {
                type: DataTypes.UUID,
                field: "from_store_id"
            },
            fromStoreLocationId: {
                type: DataTypes.UUID,
                field: "from_store_location_id"
            },
            toProjectId: {
                type: DataTypes.UUID,
                field: "to_project_id"
            },
            toStoreId: {
                type: DataTypes.UUID,
                field: "to_store_id"
            },
            toStoreLocationId: {
                type: DataTypes.UUID,
                field: "to_store_location_id"
            },
            materialId: {
                type: DataTypes.UUID,
                field: "material_id"
            },
            uomId: {
                type: DataTypes.UUID,
                field: "uom_id"
            },
            requestedQuantity: {
                type: DataTypes.FLOAT,
                field: "requested_quantity",
                allowNull: false
            },
            approvedQuantity: {
                type: DataTypes.FLOAT,
                field: "approved_quantity"
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
            serialNumbers: {
                type: DataTypes.TEXT,
                field: "serial_numbers"
            },
            vehicleNumber: {
                type: DataTypes.STRING,
                field: "vehicle_number"
            },
            requestNumber: {
                type: DataTypes.STRING,
                field: "request_number"
            },
            status: {
                type: DataTypes.ENUM,
                field: "status",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            approvalStatus: {
                type: DataTypes.ENUM,
                field: "approval_status",
                values: ["0", "1", "2"],
                allowNull: false,
                defaultValue: "2"
            },
            poNumber: {
                type: DataTypes.STRING,
                field: "po_number"
            },
            contractorEmployeeId: {
                type: DataTypes.UUID,
                field: "contractor_employee_id"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            isProcessed: {
                type: DataTypes.BOOLEAN,
                field: "is_processed",
                allowNull: false,
                defaultValue: false
            },
            cancelRequestDocNo: {
                type: DataTypes.STRING,
                field: "cancel_request_doc_no"
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
                requestApprovals.belongsTo(models[config.PROJECTS], { foreignKey: "project_id", as: "project" });
                requestApprovals.belongsTo(models[config.PROJECTS], { foreignKey: "to_project_id", as: "to_project" });
                requestApprovals.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "transaction_type_id", as: "transaction_type" });
                requestApprovals.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "from_store_id", as: "from_store" });
                requestApprovals.belongsTo(models[config.ORGANIZATION_STORE_LOCATIONS], { foreignKey: "from_store_location_id", as: "from_store_location" });
                requestApprovals.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "to_store_id", as: "to_store" });
                requestApprovals.belongsTo(models[config.ORGANIZATION_STORE_LOCATIONS], { foreignKey: "to_store_location_id", as: "to_store_location" });
                requestApprovals.belongsTo(models[config.MATERIALS], { foreignKey: "material_id" });
                requestApprovals.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "uom_id", as: "uom" });
                requestApprovals.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "request_approval_id" });
                requestApprovals.belongsTo(models[config.USERS], { foreignKey: "contractor_employee_id", as: "contractor_employee" });
                requestApprovals.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                requestApprovals.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return requestApprovals;
};