const { ATTRIBUTE_INTEGRATION_PAYLOAD, ATTRIBUTE_INTEGRATION_BLOCKS, FORM_ATTRIBUTES, FORMS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for attribute validation conditions table
 *
 * created by               version                         date
 * Ruhana         1.0.0                        22 November 2023
 *
 * @class AttributeIntegrationPayload
 */
class AttributeIntegrationPayload extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ATTRIBUTE_INTEGRATION_PAYLOAD;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationBlockId: "integration_block_id",
            value: "value",
            name: "name",
            parent: "parent",
            type: "type",
            properties: "properties",
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
                include: [
                    {
                        model: this.db[FORMS],
                        attributes: ["is_published"]
                    }
                ],
                attributes: ["id", "name", "type", "is_active", "form_id"]
            },
            {
                model: this.db[FORM_ATTRIBUTES],
                attributes: ["id", "name"],
                foreignKey: "value",
                as: "valueName"
            },
            {
                model: this.db[ATTRIBUTE_INTEGRATION_PAYLOAD],
                attributes: ["id", "name"],
                foreignKey: "parent",
                as: "parentName"
            }
        ];
    }
}

module.exports = AttributeIntegrationPayload;
