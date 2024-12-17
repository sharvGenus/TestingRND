const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for attribute validation block table
 *
 * created by               version                         date
 * Ruhana           1.0.0                       20 Number 2023
 *
 * @class AttributeIntegrationBlocks
 */
class AttributeIntegrationBlocks extends Base {

    constructor(requestQuery, paranoid = false) {
        super(requestQuery);
        this.modelName = config.ATTRIBUTE_INTEGRATION_BLOCKS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            formId: "form_id",
            type: "type",
            endpoint: "endpoint",
            auth: "auth",
            method: "method",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.fieldsList = Object.keys(this.fields);

        this.relations = [
            {
                model: this.db[config.ATTRIBUTE_INTEGRATION_CONDITIONS],
                attributes: ["id", "fromAttributeId", "operatorKey", "compareWithValue"],
                ...paranoid && { where: { isActive: "1" } },
                include: [
                    {
                        model: this.db[config.FORM_ATTRIBUTES],
                        attributes: ["id", "columnName", "name"]
                    },
                    {
                        model: this.db[config.FORM_ATTRIBUTES],
                        as: "compare_with_column",
                        attributes: ["id", "columnName", "name"]
                    }
                ]
            },
            {
                model: this.db[config.ATTRIBUTE_INTEGRATION_PAYLOAD],
                attributes: ["id", "name", "parent", "type", "isActive", "properties"],
                ...paranoid && { where: { isActive: "1" } },
                include: [
                    {
                        model: this.db[config.FORM_ATTRIBUTES],
                        as: "valueName",
                        attributes: ["id", "columnName", "name"]
                    },
                    {
                        model: this.db[config.ATTRIBUTE_INTEGRATION_PAYLOAD],
                        as: "parentName",
                        attributes: ["id", "name", "type"]
                    }
                ]
            }
        ];
    }
}

module.exports = AttributeIntegrationBlocks;
