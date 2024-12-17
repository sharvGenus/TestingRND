const { CITIES, COUNTRIES, STATES, SUPPLIERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for firms table
 * 
 * Created by               Version                         Date
 *    Kaif                   1.0.0                           29 May 2023
 * 
 * @class Supplier
 */
class Suppliers extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = SUPPLIERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            type: "type",
            name: "name",
            code: "code",
            website: "website",
            gstNumber: "gst_number",
            email: "email",
            mobileNumber: "mobile_number",
            telephone: "telephone",
            address: "address",
            cityId: "city_id",
            pinCode: "pin_code",
            panNumber: "pan_number",
            aadharNumber: "aadhar_number",
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

module.exports = Suppliers;