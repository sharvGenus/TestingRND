const { Sequelize } = require("sequelize");
const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for material_serial_numbers table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           6 Jun 2023
 * 
 * @class MaterialSerialNumbers
 */
class MaterialSerialNumbers extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.MATERIAL_SERIAL_NUMBERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            stockLedgerId: "stock_ledger_id",
            materialId: "material_id",
            quantity: "quantity",
            rate: "rate",
            serialNumber: "serial_number",
            status: "status",
            prefix: "prefix",
            suffix: "suffix",
            rangeFrom: "range_from",
            rangeTo: "range_to",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
    }

    /**
     * Method to find data (paginated data if required) and count all material serial no in a table by filter
     * @param {Object} whereCondition
     * @param {Array} attributes 
     * @param {Boolean} distinct 
     * @param {Object} paginated
     * @returns {Promise<Object>}
     */
    async findAndCountAllByFilter(
        whereCondition,
        attributes = this.fieldsList,
        distinct = false,
        paginated = this.queryObject,
        respectBlacklist = true
    ) {
        if (paginated && Object.keys(paginated || {}).length > 0 && paginated.sort && paginated.order) {
            const [sortColumn, sortDirection] = paginated.sort;
            if (sortColumn === "serialNumber") {
                const dbSortColumn = "serial_number";
                paginated.order = [
                    [Sequelize.literal(`LENGTH(${dbSortColumn})`), sortDirection],
                    [dbSortColumn, sortDirection]
                ];
            } else paginated.order = [paginated.sort];
        }
        const [rows, count] = await Promise.all([
            this.model.findAll({
                attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
                include: [
                    {
                        model: this.db[config.STOCK_LEDGERS],
                        attributes: ["id", "referenceDocumentNumber", "materialId"]
                    }
                ],
                where: whereCondition,
                distinct,
                ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }
            }),
            this.model.count({
                include: [
                    {
                        model: this.db[config.STOCK_LEDGERS],
                        attributes: ["id", "referenceDocumentNumber", "materialId"]
                    }
                ],
                where: whereCondition,
                distinct
            })
        ]);
        return { rows, count };
    }

    /**
     * Method to find data (paginated data if required) and count all grn material serial no in a table by filter
     * @param {Object} whereCondition
     * @param {Array} attributes 
     * @param {Boolean} distinct 
     * @param {Object} paginated
     * @returns {Promise<Object>}
     */
    async findAndCountAllGrnSerialNo(
        whereCondition,
        attributes = this.fieldsList,
        distinct = false,
        paginated = this.queryObject,
        respectBlacklist = true
    ) {
        paginated.order = [
            ["created_at", "DESC"], ["stock_ledger_id", "ASC"],
            [Sequelize.literal(`LENGTH(${this.model.tableName}.serial_number)`), "ASC"], ["serial_number", "ASC"]
        ];
        const [rows, count] = await Promise.all([
            this.model.findAll({
                attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
                include: [
                    {
                        model: this.db[config.STOCK_LEDGERS],
                        attributes: ["referenceDocumentNumber", "createdAt"],
                        include: [
                            {
                                model: this.db[config.PROJECTS],
                                attributes: ["name"],
                                foreignKey: "project_id",
                                as: "project",
                                include: [
                                    {
                                        model: this.db[config.ORGANIZATIONS],
                                        attributes: ["name"],
                                        foreignKey: "customer_id",
                                        as: "customer"
                                    }
                                ]
                            },
                            {
                                model: this.db[config.MATERIALS],
                                attributes: ["name", "code", "hsnCode"],
                                include: [
                                    {
                                        model: this.db[config.MASTER_MAKER_LOVS],
                                        attributes: ["name"],
                                        foreignKey: "material_type_id",
                                        as: "material_type"
                                    }
                                ]
                            },
                            {
                                model: this.db[config.ORGANIZATION_STORES],
                                attributes: ["name"],
                                foreignKey: "store_id",
                                as: "organization_store"
                            },
                            {
                                model: this.db[config.ORGANIZATION_STORE_LOCATIONS],
                                attributes: ["name"],
                                foreignKey: "store_location_id",
                                as: "organization_store_location"
                            },
                            {
                                model: this.db[config.STOCK_LEDGER_DETAILS],
                                attributes: ["invoiceNumber", "invoiceDate", "actualReceiptDate", "transporterName", "transporterContactNumber", "vehicleNumber", "lrNumber", "eWayBillNumber", "eWayBillDate", "expiryDate"]
                            }
                        ]
                    }
                ],
                where: whereCondition,
                distinct,
                ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }
            }),
            this.model.count({
                include: [
                    {
                        model: this.db[config.STOCK_LEDGERS],
                        attributes: ["referenceDocumentNumber", "createdAt"]
                    }
                ],
                where: whereCondition,
                distinct
            })
        ]);
        return { rows, count };
    }
}

module.exports = MaterialSerialNumbers;