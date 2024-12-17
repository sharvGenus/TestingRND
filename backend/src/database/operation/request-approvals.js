const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for request_approvals table
 *
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           17 Jun 2023
 *
 * @class RequestApprovals
 */
class RequestApprovals extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.REQUEST_APPROVALS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            transactionTypeId: "transaction_type_id",
            projectId: "project_id",
            referenceDocumentNumber: "reference_document_number",
            fromStoreId: "from_store_id",
            fromStoreLocationId: "from_store_location_id",
            toProjectId: "to_project_id",
            toStoreId: "to_store_id",
            toStoreLocationId: "to_store_location_id",
            materialId: "material_id",
            uomId: "uom_id",
            requestedQuantity: "requested_quantity",
            approvedQuantity: "approved_quantity",
            rate: "rate",
            value: "value",
            tax: "tax",
            serialNumbers: "serial_numbers",
            vehicleNumber: "vehicle_number",
            requestNumber: "request_number",
            status: "status",
            approvalStatus: "approval_status",
            poNumber: "po_number",
            contractorEmployeeId: "contractor_employee_id",
            remarks: "remarks",
            isProcessed: "is_processed",
            cancelRequestDocNo: "cancel_request_doc_no",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name", "code"],
                foreignKey: "project_id",
                as: "project"
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name", "code"],
                foreignKey: "to_project_id",
                as: "to_project"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "transaction_type_id",
                as: "transaction_type"
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "code", "address", "pincode", "gstNumber"],
                foreignKey: "from_store_id",
                as: "from_store",
                include: [
                    {
                        model: this.db[config.CITIES],
                        attributes: ["id", "name", "code"],
                        include: [{
                            model: this.db[config.STATES],
                            attributes: ["id", "name", "code"],
                            include: [{
                                model: this.db[config.COUNTRIES],
                                attributes: ["id", "name", "code"]
                            }]
                        }]
                    },
                    {
                        model: this.db[config.ORGANIZATIONS],
                        attributes: ["id", "parentId", "name", "code", "email", "gstNumber", "mobileNumber", "address", "pinCode", "logo"],
                        include: [
                            {
                                model: this.db[config.ORGANIZATIONS],
                                attributes: ["id", "name", "code", "email", "gstNumber", "mobileNumber", "address", "pinCode", "logo"],
                                as: "parent",
                                include: [
                                    {
                                        model: this.db[config.CITIES],
                                        as: "cities",
                                        attributes: ["id", "name", "code"],
                                        foreignKey: "city_id",
                                        include: [
                                            {
                                                model: this.db[config.STATES],
                                                attributes: ["id", "name", "code"],
                                                include: [{
                                                    model: this.db[config.COUNTRIES],
                                                    attributes: ["id", "name", "code"]
                                                }]
                                            }]
                                    }
                                ]
                            },
                            {
                                model: this.db[config.CITIES],
                                attributes: ["id", "name", "code"],
                                foreignKey: "city_id",
                                as: "cities",
                                include: [{
                                    model: this.db[config.STATES],
                                    attributes: ["id", "name", "code"],
                                    include: [{
                                        model: this.db[config.COUNTRIES],
                                        attributes: ["id", "name", "code"]
                                    }]
                                }]
                            }
                        ]
                    }
                ]
            },
            {
                model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                attributes: ["id", "name", "code"],
                foreignKey: "from_store_location_id",
                as: "from_store_location"
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "code", "address", "pincode", "gstNumber"],
                foreignKey: "to_store_id",
                as: "to_store",
                include: [
                    {
                        model: this.db[config.CITIES],
                        attributes: ["id", "name", "code"],
                        include: [{
                            model: this.db[config.STATES],
                            attributes: ["id", "name", "code"],
                            include: [{
                                model: this.db[config.COUNTRIES],
                                attributes: ["id", "name", "code"]
                            }]
                        }]
                    },
                    {
                        model: this.db[config.ORGANIZATIONS],
                        attributes: ["id", "parentId", "name", "code", "email", "gstNumber", "mobileNumber", "address", "logo", "pinCode"],
                        include: [
                            {
                                model: this.db[config.ORGANIZATIONS],
                                attributes: ["id", "name", "code", "address", "pinCode", "gstNumber", "logo"],
                                as: "parent",
                                include: [
                                    {
                                        model: this.db[config.CITIES],
                                        attributes: ["id", "name", "code"],
                                        foreignKey: "registered_office_city_id",
                                        as: "register_office_cities",
                                        include: [
                                            {
                                                model: this.db[config.STATES],
                                                attributes: ["id", "name", "code"],
                                                include: [{
                                                    model: this.db[config.COUNTRIES],
                                                    attributes: ["id", "name", "code"]
                                                }]
                                            }]
                                    },
                                    {
                                        model: this.db[config.CITIES],
                                        as: "cities",
                                        attributes: ["id", "name", "code"],
                                        foreignKey: "city_id",
                                        include: [
                                            {
                                                model: this.db[config.STATES],
                                                attributes: ["id", "name", "code"],
                                                include: [{
                                                    model: this.db[config.COUNTRIES],
                                                    attributes: ["id", "name", "code"]
                                                }]
                                            }]
                                    }
                                ]
                            },
                            {
                                model: this.db[config.CITIES],
                                attributes: ["id", "name", "code"],
                                foreignKey: "city_id",
                                as: "cities",
                                include: [{
                                    model: this.db[config.STATES],
                                    attributes: ["id", "name", "code"],
                                    include: [{
                                        model: this.db[config.COUNTRIES],
                                        attributes: ["id", "name", "code"]
                                    }]
                                }]
                            }
                        ]
                    }
                ]
            },
            {
                model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                attributes: ["id", "name", "code"],
                foreignKey: "to_store_location_id",
                as: "to_store_location"
            },
            {
                model: this.db[config.MATERIALS],
                attributes: ["id", "name", "code", "hsnCode", "isSerialNumber"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "uom_id",
                as: "uom"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code", "email"],
                foreignKey: "contractor_employee_id",
                as: "contractor_employee"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "created_by",
                as: "created"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "updated_by",
                as: "updated"
            }
        ];
    }
}

module.exports = RequestApprovals;
