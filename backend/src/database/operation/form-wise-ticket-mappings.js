const config = require("../../config/database-schema");
const { FORM_WISE_TICKET_MAPPINGS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for form-wise-ticket-mappings table
 *
 * created by               version                         date
 * Ruhana                  1.0.0                           05 Oct 2023
 *
 * updated by               version                         date
 *
 * @class Tickets
 */
class formWiseTicketMappings extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = FORM_WISE_TICKET_MAPPINGS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            formId: "form_id",
            formTypeId: "form_type_id",
            searchFields: "search_fields",
            mobileFields: "mobile_fields",
            geoLocationField: "geo_location_field",
            displayFields: "display_fields",
            isActive: "is_active",
            remarks: "remarks",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.FORMS],
                attributes: ["id", "name"],
                foreignKey: "form_id"
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name"],
                foreignKey: "project_id"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "form_type_id",
                as: "form_type"
            }
        ];
    }
}

module.exports = formWiseTicketMappings;
