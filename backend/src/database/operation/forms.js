/* eslint-disable max-len */
const { MASTER_MAKER_LOVS, PROJECTS, FORMS, FORM_ATTRIBUTES, DEFAULT_ATTRIBUTES } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for forms table
 *
 * created by               version                         date
 * Tarun                   1.0.0                           16 June 2023
 *
 * @class Forms
 */
class Forms extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = FORMS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            integrationId: "integration_id",
            tableName: "table_name",
            searchColumns: "search_columns",
            selfSearchColumns: "self_search_columns",
            mappingTableId: "mapping_table_id",
            totalCounts: "total_counts",
            approvedCounts: "approved_counts",
            rejectedCounts: "rejected_counts",
            isPublished: "is_published",
            sequence: "sequence",
            projectId: "project_id",
            formTypeId: "form_type_id",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at",
            properties: "properties"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[PROJECTS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[MASTER_MAKER_LOVS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[FORM_ATTRIBUTES],
                include: [{
                    model: this.db[DEFAULT_ATTRIBUTES]
                }]
            }
        ];
    }

    async findAndCountAllDistinctRows(whereCondition, attributes = this.fieldsList, isRelated = false, distinctColumn = null, paginated = this.queryObject, raw = false, respectBlacklist = true) {
        if (paginated && Object.keys(paginated || {}).length > 0) {
            paginated.order = [paginated.sort];
        }
        const queryOptions = {
            attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
            where: { ...this.getOverRidesQueries(), ...whereCondition },
            ...raw && { raw, nest: true },
            ...isRelated && { include: this.relations },
            ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }
        };

        if (distinctColumn) {
            queryOptions.group = [distinctColumn];
        }

        const rows = this.model.findAll(queryOptions);

        return rows;
    }
        
}

module.exports = Forms;
