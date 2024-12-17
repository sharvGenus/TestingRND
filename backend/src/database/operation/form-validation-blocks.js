const { FORM_VALIDATION_BLOCKS, FORMS, ATTRIBUTE_VALIDATION_BLOCKS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for forms table
 * 
 * created by               version                         date
 * Divya                    1.0.0                           19 June 2023
 * 
 * @class FORM_VALIDATION_BLOCKS
 */
class FormsValidationBlocks extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = FORM_VALIDATION_BLOCKS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            formId: "form_id",
            attibuteValidationBlockId: "attribute_validation_block_id",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[FORMS],
                attributes: ["id"]
            },
            {
                model: this.db[ATTRIBUTE_VALIDATION_BLOCKS],
                attributes: ["id", "name"]
            }
        ];
    }
}

module.exports = FormsValidationBlocks;