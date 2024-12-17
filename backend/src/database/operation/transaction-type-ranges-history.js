const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for transaction_type_ranges_history table
 *
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           02 Aug 2023
 *
 * @class TransactionTypeRangesHistory
 */
class TransactionTypeRangesHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.TRANSACTION_TYPE_RANGES_HISTORY;
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
            recordId: "record_id",
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
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "code"]
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

module.exports = TransactionTypeRangesHistory;
