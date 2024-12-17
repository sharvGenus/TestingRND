const { ATTRIBUTE_VISIBILITY_BLOCKS, ATTRIBUTE_VISIBILITY_CONDITIONS, FORM_ATTRIBUTES } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for attribute visibility block table
 * 
 * created by               version                         date
 * Mohammed Sameer           1.0.0                       17 June 2023
 * 
 * @class AttributeVisibilityBlocks
 */
class AttributeVisibilityBlocks extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = ATTRIBUTE_VISIBILITY_BLOCKS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            formId: "form_id",
            type: "type",
            visibleColumns: "visible_columns",
            nonVisibleColumns: "non_visible_columns",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[ATTRIBUTE_VISIBILITY_CONDITIONS],
                attributes: ["fromAttributeId", "operatorKey", "compareWithValue"],
                include: [
                    {
                        model: this.db[FORM_ATTRIBUTES],
                        attributes: ["id", "name", "columnName"]
                    }
                ]
            }
        ];
    }
}

module.exports = AttributeVisibilityBlocks;