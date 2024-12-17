/* eslint-disable object-curly-newline */
const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for stock_ledger_details table
 *
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           20 Jun 2023
 *
 * @class StockLedgerDetails
 */
class StockLedgerDetails extends Base {

    constructor(requestQuery, cWhere) {
        super(requestQuery);
        this.modelName = config.STOCK_LEDGER_DETAILS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            transactionTypeId: "transaction_type_id",
            referenceDocumentNumber: "reference_document_number",
            sapNumber: "sap_number",
            challanNumber: "challan_number",
            challanDate: "challan_date",
            poNumber: "po_number",
            poDate: "po_date",
            lrNumber: "lr_number",
            transporterName: "transporter_name",
            transporterContactNumber: "transporter_contact_number",
            vehicleNumber: "vehicle_number",
            invoiceNumber: "invoice_number",
            invoiceDate: "invoice_date",
            placeOfSupply: "place_of_supply",
            eWayBillNumber: "e_way_bill_number",
            eWayBillDate: "e_way_bill_date",
            actualReceiptDate: "actual_receipt_date",
            toStoreId: "to_store_id",
            remarks: "remarks",
            attachments: "attachments",
            expiryDate: "expiry_date",
            transactionTypeRangeId: "transaction_type_range_id",
            consumerName: "consumer_name",
            kNumber: "k_number",
            responseId: "response_id",
            serialNumber: "serial_number",
            brandMasterId: "brand_master_id",
            supplierId: "supplier_id",
            projectId: "project_id",
            installerId: "installed_id",
            serialNumberId: "serial_number_id",
            capitalize: "capitalize",
            brandName: "brand_name",
            nonSerializeMaterialId: "non_serialize_material_id",
            quantity: "quantity",
            counter: "counter",
            cancelRefDocNo: "cancel_ref_doc_no",
            isCancelled: "is_cancelled",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "code"],
                foreignKey: "to_store_id",
                as: "other_party_store",
                include: [{
                    model: this.db[config.ORGANIZATIONS],
                    attributes: ["id", "parentId", "name", "code"],
                    include: [{
                        model: this.db[config.ORGANIZATIONS],
                        attributes: ["id", "name", "code"],
                        as: "parent"
                    }]
                }]
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
            },
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code", "address", "pincode", "gst_number"],
                foreignKey: "supplier_id",
                as: "supplier",
                include: [{
                    model: this.db[config.CITIES],
                    attributes: ["id", "name", "code"],
                    foreignKey: "city_id",
                    as: "cities",
                    include: [
                        {
                            model: this.db[config.STATES],
                            attributes: ["id", "name", "code"],
                            include: [{
                                model: this.db[config.COUNTRIES],
                                attributes: ["id", "name", "code"]

                            }]
                        }]
                }]
            },
            {
                model: this.db[config.STOCK_LEDGERS],
                ...cWhere && Object.prototype.toString.call(cWhere) === "[object Object]" && Object.keys(cWhere)?.length > 0 && { where: cWhere, require: true },
                include: [
                    {
                        model: this.db[config.MASTER_MAKER_LOVS],
                        attributes: ["id", "name"],
                        foreignKey: "transaction_type_id",
                        as: "transaction_type"
                    },
                    {
                        model: this.db[config.ORGANIZATIONS],
                        attributes: ["id", "name", "code", "address", "pincode", "gst_number"],
                        include: [{
                            model: this.db[config.CITIES],
                            attributes: ["id", "name", "code"],
                            foreignKey: "city_id",
                            as: "cities",
                            include: [
                                {
                                    model: this.db[config.STATES],
                                    attributes: ["id", "name", "code"],
                                    include: [{
                                        model: this.db[config.COUNTRIES],
                                        attributes: ["id", "name", "code"]

                                    }]
                                }]
                        }]
                    },
                    {
                        model: this.db[config.PROJECTS],
                        attributes: ["id", "name", "code", "eWayBillLimit"],
                        foreignKey: "project_id",
                        as: "project",
                        include: [{
                            model: this.db[config.ORGANIZATIONS],
                            attributes: ["name"],
                            foreignKey: "customer_id",
                            as: "customer"
                        }]
                    },
                    {
                        model: this.db[config.ORGANIZATION_STORES],
                        attributes: ["id", "name", "code", "address", "pincode", "gst_number", "organizationType"],
                        foreignKey: "store_id",
                        as: "organization_store",
                        include: [
                            {
                                model: this.db[config.MASTER_MAKER_LOVS],
                                attributes: ["id", "name"]
                            },
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
                                attributes: ["id", "parentId", "logo", "name", "code", "email", "gstNumber", "mobileNumber", "address", "pinCode"],
                                include: [
                                    {
                                        model: this.db[config.ORGANIZATIONS],
                                        attributes: ["id", "logo", "name", "code", "email", "gstNumber", "mobileNumber", "address", "pinCode"],
                                        as: "parent"
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
                        foreignKey: "store_location_id",
                        as: "organization_store_location"
                    },
                    {
                        model: this.db[config.USERS],
                        attributes: ["id", "name", "code"],
                        foreignKey: "installer_id",
                        as: "installer",
                        include: [{
                            model: this.db[config.ROLES],
                            attributes: ["id", "name"]
                        }]
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
                        attributes: ["id", "name", "code"],
                        foreignKey: "approver_id",
                        as: "approver"
                    },
                    {
                        model: this.db[config.REQUEST_APPROVALS]
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
                    },
                    {
                        model: this.db[config.ORGANIZATION_STORES],
                        attributes: ["id", "name", "code", "address", "pincode", "gstNumber", "organizationType"],
                        foreignKey: "other_store_id",
                        as: "other_store",
                        include: [
                            {
                                model: this.db[config.MASTER_MAKER_LOVS],
                                attributes: ["id", "name"]
                            },
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
                                attributes: ["id", "parentId", "name", "code"],
                                include: [{
                                    model: this.db[config.ORGANIZATIONS],
                                    attributes: ["id", "name", "code"],
                                    as: "parent"
                                }]
                            }
                        ]
                    },
                    {
                        model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                        attributes: ["id", "name", "code"],
                        foreignKey: "other_store_location_id",
                        as: "other_store_location"
                    },
                    {
                        model: this.db[config.PROJECTS],
                        attributes: ["id", "name", "code"],
                        foreignKey: "other_project_id",
                        as: "other_project"
                    }
                    // {
                    //     model: this.db[config.MATERIAL_SERIAL_NUMBERS]
                    // }
                ]
            }
            
        ];
    }

    updateRelations() {
        this.relations = [
            {
                model: this.db[config.STOCK_LEDGERS],
                attributes: ["id", "transactionTypeId", "referenceDocumentNumber", "organizationId", "storeId", "storeLocationId", "installerId", "materialId", "uomId", "quantity", "rate", "value", "tax", "otherStoreId", "otherStoreLocationId"],
                include: [{
                    model: this.db[config.MATERIAL_SERIAL_NUMBERS],
                    attributes: ["id", "serialNumber", "status"]
                }]
            }
        ];
    }

    /**
     * Method to create new records in database with association
     * @param {Object} payLoad
     * @param {Object} transaction
     * @returns {Promise<Object>}
     */
    async createWithAssociation(payLoad, transaction) {
        if (payLoad && this.userData?.userId) {
            const setUserId = (obj) => {
                if (!obj.createdBy) {
                    obj.createdBy = this.userData.userId;
                }
                if (!obj.updatedBy) {
                    obj.updatedBy = this.userData.userId;
                }
            };
            setUserId(payLoad);
            if (payLoad.stock_ledgers) {
                payLoad.stock_ledgers.forEach((stockLedger) => {
                    setUserId(stockLedger);
                });
            }
        }
        return this.model.create(
            payLoad,
            {
                include: [{
                    association: config.STOCK_LEDGERS,
                    include: [config.MATERIAL_SERIAL_NUMBERS]
                }]
            },
            {
                transaction,
                individualHooks: true,
                returning: true
            }
        );
    }

    /**
     * Method to find data (paginated data if required) and count all records in a table
     * @param {Object} associationWhere
     * @param {Object} whereCondition
     * @param {Array} attributes
     * @param {Boolean} isRelated
     * @param {Boolean} distinct
     * @param {Object} paginated
     * @param {Boolean} raw
     * @returns {Promise<Object>}
     */
    async findAndCountAllWithAssociation(
        associationWhere,
        whereCondition,
        attributes = this.fieldsList,
        distinct = false,
        paginated = this.queryObject,
        raw = false,
        respectBlacklist = true
    ) {
        if (paginated && Object.keys(paginated || {}).length > 0 && paginated.sort && paginated.order) {
            paginated.order = [paginated.sort];
        }
        const [rows, count] = await Promise.all([
            this.model.findAll({
                attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                include: [
                    {
                        association: config.STOCK_LEDGERS,
                        where: { ...associationWhere },
                        include: [
                            {
                                model: this.db[config.MASTER_MAKER_LOVS],
                                attributes: ["id", "name"],
                                foreignKey: "transaction_type_id",
                                as: "transaction_type"
                            },
                            {
                                model: this.db[config.MATERIALS],
                                attributes: ["id", "name", "code"]
                            },
                            {
                                model: this.db[config.ORGANIZATIONS],
                                attributes: ["id", "name", "code"]
                            },
                            {
                                model: this.db[config.ORGANIZATION_STORES],
                                attributes: ["id", "name", "code", "address", "pincode", "organizationType"],
                                foreignKey: "store_id",
                                as: "organization_store",
                                include: [
                                    {
                                        model: this.db[config.MASTER_MAKER_LOVS],
                                        attributes: ["id", "name"]
                                    },
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
                                    }
                                ]
                            },
                            {
                                model: this.db[config.MASTER_MAKER_LOVS],
                                attributes: ["id", "name"],
                                foreignKey: "uom_id",
                                as: "uom"
                            },
                            {
                                model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                                attributes: ["id", "name", "code"],
                                foreignKey: "store_location_id",
                                as: "organization_store_location"
                            },
                            {
                                model: this.db[config.PROJECTS],
                                attributes: ["id", "name", "code"],
                                foreignKey: "project_id",
                                as: "project"
                            }
                        ]
                    }
                ],
                distinct,
                ...raw && { raw, nest: true },
                ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }
            }),
            this.model.count({
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                include:
                    [
                        {
                            association: config.STOCK_LEDGERS,
                            where: { ...associationWhere }
                        }
                    ],
                distinct
            })
        ]);
        return { rows, count };
    }

}

module.exports = StockLedgerDetails;
