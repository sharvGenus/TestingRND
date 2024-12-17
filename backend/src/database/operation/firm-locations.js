const { CITIES, COUNTRIES, STATES, FIRMS, FIRM_LOCATIONS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for firms table
 * 
 * Created by               Version                         Date
 *    Kaif                   1.0.0                           29 May 2023
 * 
 * @class FirmLocations
 */
class FirmLocations extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = FIRM_LOCATIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            code: "code",
            firmId: "firm_id",
            gstNumber: "gst_number",
            email: "email",
            mobileNumber: "mobile_number",
            telephone: "telephone",
            address: "address",
            pinCode: "pin_code",
            cityId: "city_id",
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
                model: this.db[FIRMS],
                attributes: ["id", "name", "code"]
            },
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

module.exports = FirmLocations;