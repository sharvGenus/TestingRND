const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for transaction_type_ranges table
 *
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           01 Aug 2023
 *
 * @class TransactionTypeRanges
 */
class TransactionTypeRanges extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.TRANSACTION_TYPE_RANGES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            organizationId: "organization_id",
            storeId: "store_id",
            prefix: "prefix",
            name: "name",
            transactionTypeIds: "transaction_type_ids",
            startRange: "start_range",
            endRange: "end_range",
            effectiveDate: "effective_date",
            endDate: "end_date",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code", "organizationTypeId"],
                include: [
                    {
                        model: this.db[config.MASTER_MAKER_LOVS],
                        attributes: ["id", "name"],
                        as: "organization_type",
                        foreignKey: "organization_type_id"
                    }
                ]
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "code", "organizationType"],
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

    /**
     * Method to find data (paginated data if required) and count all records in a table
     * @param {Object} whereCondition 
     * @param {Array} attributes 
     * @param {Boolean} isRelated 
     * @param {Boolean} distinct 
     * @param {Object} paginated 
     * @param {Boolean} raw 
     * @param {Boolean} paranoid
     * @returns {Promise<Object>}
     */
    async findAndCount(
        whereCondition,
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
                where: { ...whereCondition },
                distinct,
                ...raw && { raw, nest: true },
                ...isRelated && { include: this.relations },
                ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated },
                paranoid
            }),
            this.model.count({
                where: { ...whereCondition },
                distinct,
                ...isRelated && { include: this.relations },
                paranoid
            })
        ]);
        return { rows, count };
    }
}

module.exports = TransactionTypeRanges;
