const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for stock_ledgers table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           20 Jun 2023
 * 
 * @class StockLedgers
 */
class StockLedgers extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.STOCK_LEDGERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            stockLedgerDetailId: "stock_ledger_detail_id",
            transactionTypeId: "transaction_type_id",
            organizationId: "organization_id",
            projectId: "project_id",
            referenceDocumentNumber: "reference_document_number",
            requestNumber: "request_number",
            storeId: "store_id",
            storeLocationId: "store_location_id",
            installerId: "installer_id",
            materialId: "material_id",
            uomId: "uom_id",
            quantity: "quantity",
            rate: "rate",
            value: "value",
            willReturn: "will_return",
            otherStoreId: "other_store_id",
            otherStoreLocationId: "other_store_location_id",
            tax: "tax",
            approverId: "approver_id",
            requestApprovalId: "request_approval_id",
            attachments: "attachments",
            remarks: "remarks",
            cancelRefDocNo: "cancel_ref_doc_no",
            isCancelled: "is_cancelled",
            isProcessed: "is_processed",
            otherProjectId: "other_project_id",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.STOCK_LEDGER_DETAILS],
                include: [
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
                    }
                ]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "transaction_type_id",
                as: "transaction_type"
            },
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code", "address", "pincode"],
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
                as: "project"
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
                    },
                    {
                        model: this.db[config.ORGANIZATIONS],
                        attributes: ["id", "name", "code"]
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
        ];
    }

    updateRelations() {
        this.relations = [
            {
                model: this.db[config.STOCK_LEDGER_DETAILS],
                include: [
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
                    }
                ]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "transaction_type_id",
                as: "transaction_type"
            },
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code", "address", "pincode"],
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
                as: "project"
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
                    },
                    {
                        model: this.db[config.ORGANIZATIONS],
                        attributes: ["id", "name", "code"]
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
            },
            {
                model: this.db[config.MATERIAL_SERIAL_NUMBERS],
                attributes: ["serialNumber"]
            }
        ];
    }

    updateRelationForReport() {
        this.relations = [
            {
                model: this.db[config.STOCK_LEDGER_DETAILS],
                attributes: ["toStoreId"]
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name"],
                foreignKey: "project_id",
                as: "project"
            },
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "organizationType"],
                foreignKey: "store_id",
                as: "organization_store"
            },
            {
                model: this.db[config.MATERIALS],
                attributes: ["id", "name", "isSerialNumber", "materialTypeId"],
                include: {
                    model: this.db[config.MASTER_MAKER_LOVS],
                    attributes: ["id", "name"],
                    foreignKey: "material_type_id",
                    as: "material_type"
                }
            }
        ];
    }

    updateRelationForStockReport() {
        this.relations = [
            {
                model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                attributes: ["id", "name", "code"],
                foreignKey: "store_location_id",
                as: "organization_store_location"
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
            }
        ];
    }

    updateRelationForLocationStock() {
        this.relations = [
            {
                model: this.db[config.STOCK_LEDGER_DETAILS],
                attributes: ["supplierId"]
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
                as: "installer"
            },
            {
                model: this.db[config.MATERIALS],
                attributes: ["id", "name", "code", "isSerialNumber"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "uom_id",
                as: "uom"
            },
            {
                model: this.db[config.MATERIAL_SERIAL_NUMBERS],
                attributes: ["serialNumber", "status"]
            }
        ];
    }

    updateRelationForStockLedgerMaterial() {
        this.relations = [
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name"],
                foreignKey: "store_id",
                as: "organization_store"
            },
            {
                model: this.db[config.MATERIALS],
                attributes: ["id", "name", "code", "isSerialNumber"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "uom_id",
                as: "uom"
            }
        ];
    }

    updateRelationForStockLedgerLocation() {
        this.relations = [
            {
                model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                attributes: ["id", "name"],
                foreignKey: "store_location_id",
                as: "organization_store_location"
            },
            {
                model: this.db[config.MATERIALS],
                attributes: ["id", "name", "code", "isSerialNumber"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "uom_id",
                as: "uom"
            }
        ];
    }

    updateRelationForStockLedgerInstaller() {
        this.relations = [
            {
                model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                attributes: ["id", "name"],
                foreignKey: "store_location_id",
                as: "organization_store_location"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "installer_id",
                as: "installer"
            },
            {
                model: this.db[config.MATERIALS],
                attributes: ["id", "name", "code", "isSerialNumber"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "uom_id",
                as: "uom"
            }
        ];
    }

    updateRelationForAllStocks() {
        this.relations = [
            {
                model: this.db[config.STOCK_LEDGER_DETAILS],
                attributes: ["id", "serialNumber", "toStoreId"],
                include: [
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
                    }
                ]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "transaction_type_id",
                as: "transaction_type"
            },
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                attributes: ["id", "name"],
                foreignKey: "store_location_id",
                as: "organization_store_location"
            },
            {
                model: this.db[config.MATERIALS],
                attributes: ["id", "name", "code", "isSerialNumber"]
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
                foreignKey: "created_by",
                as: "created"
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "code"],
                foreignKey: "other_store_id",
                as: "other_store",
                include: [
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
            }
        ];
    }

    /**
     * Method to find data (paginated data if required) and count all records in a table by association filter
     * @param {Object} whereCondition 
     * @param {Object} associationWhere 
     * @param {Array} attributes 
     * @param {Boolean} isRelated 
     * @param {Boolean} distinct 
     * @param {Object} paginated 
     * @param {Boolean} raw 
     * @param {Boolean} paranoid
     * @returns {Promise<Object>}
     */
    async findAndCountAllByAssociationFilter(
        whereCondition,
        associationWhere,
        attributes = this.fieldsList,
        isRelated = false,
        distinct = false,
        paginated = this.queryObject,
        raw = false,
        respectBlacklist = true,
        paranoid = false
    ) {
        if (paginated && Object.keys(paginated || {}).length > 0 && paginated.sort && paginated.order) {
            paginated.order = [paginated.sort];
        }
        const [rows, count] = await Promise.all([
            this.model.findAll({
                attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
                include: [{
                    model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                    attributes: [],
                    foreignKey: "store_location_id",
                    as: "organization_store_location",
                    where: { ...associationWhere }
                }],
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                distinct,
                ...raw && { raw, nest: true },
                ...isRelated && { include: this.relations },
                ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated },
                ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false }
            }),
            this.model.count({
                include: [{
                    model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                    attributes: [],
                    foreignKey: "store_location_id",
                    as: "organization_store_location",
                    where: { ...associationWhere }
                }],
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                distinct,
                ...isRelated && { include: this.relations },
                ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false }
            })
        ]);
        return { rows, count };
    }
}

module.exports = StockLedgers;