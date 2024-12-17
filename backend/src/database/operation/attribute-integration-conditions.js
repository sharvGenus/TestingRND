const { ATTRIBUTE_INTEGRATION_CONDITIONS, ATTRIBUTE_INTEGRATION_BLOCKS, FORM_ATTRIBUTES } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for attribute validation conditions table
 *
 * created by               version                         date
 * Ruhana         1.0.0                        20 November 2023
 *
 * @class AttributeIntegrationConditions
 */
class AttributeIntegrationConditions extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ATTRIBUTE_INTEGRATION_CONDITIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationBlockId: "integration_block_id",
            fromAttributeId: "form_attribute_id",
            operatorKey: "operator_key",
            compareWithFormAttributeId: "compare_with_form_attribute_id",
            compareWithValue: "compare_with_value",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[ATTRIBUTE_INTEGRATION_BLOCKS],
                attributes: ["id", "name", "type", "is_active"]
            },
            {
                model: this.db[FORM_ATTRIBUTES],
                attributes: ["id", "name"]
            },
            {
                model: this.db[FORM_ATTRIBUTES],
                attributes: ["id", "name"],
                as: "compare_with_column"
            }
        ];
    }
}

module.exports = AttributeIntegrationConditions;
