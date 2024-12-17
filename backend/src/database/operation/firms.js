const { CITIES, COUNTRIES, STATES, FIRMS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for firms table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           29 May 2023
 * 
 * @class Firms
 */
class Firms extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = FIRMS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            name: "name",
            code: "code",
            gstNumber: "gst_number",
            email: "email",
            mobileNumber: "mobile_number",
            telephone: "telephone",
            registeredOfficeAddress: "registered_office_address",
            registeredOfficeCityId: "registered_office_city_id",
            registeredOfficePincode: "registered_office_pincode",
            attachments: "attachments",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[CITIES],
                attributes: ["id", "name", "code"],
                include: [
                    {
                        model: this.db[STATES],
                        attributes: ["id", "name", "code"],
                        include: [{
                            model: this.db[COUNTRIES],
                            attributes: ["id", "name", "code"]
                        }]
                    }]
            }
        ];
    }
}

module.exports = Firms;