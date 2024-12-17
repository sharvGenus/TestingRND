const { ATTRIBUTE_VALIDATION_BLOCKS, FORM_ATTRIBUTES, ATTRIBUTE_VALIDATION_CONDITIONS, DEFAULT_ATTRIBUTES } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for attribute validation block table
 * 
 * created by               version                         date
 * Mohammed Sameer           1.0.0                       17 June 2023
 * 
 * @class AttributeValidationBlocks
 */
class AttributeValidationBlocks extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ATTRIBUTE_VALIDATION_BLOCKS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            formId: "form_id",
            type: "type",
            message: "message",
            primaryColumn: "primary_column",
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
                model: this.db[FORM_ATTRIBUTES],
                attributes: ["id", "name", "rank"],
                include: [
                    {
                        model: this.db[DEFAULT_ATTRIBUTES],
                        attributes: ["id", "name"]
                    }
                ]
            }
        ];
    }

    updateRelations() {
        this.relations = [
            {
                model: this.db[ATTRIBUTE_VALIDATION_CONDITIONS],
                attributes: ["id", "fromAttributeId", "operatorKey", "compareWithFormAttributeId", "compareWithValue"],
                include: [
                    {
                        model: this.db[FORM_ATTRIBUTES],
                        attributes: ["id", "name", "columnName"]
                    },
                    {
                        model: this.db[FORM_ATTRIBUTES],
                        attributes: ["id", "name", "columnName"],
                        as: "compare_with_column"
                    }
                ]
            }
        ];
    }
}

module.exports = AttributeValidationBlocks;