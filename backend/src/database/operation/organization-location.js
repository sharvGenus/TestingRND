const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for firms table
 * 
 * Created by               Version                         Date
 *    Shefali                   1.0.0                           19 June 2023
 * 
 * @class OrganizationLocations
 */
class OrganizationLocations extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.ORGANIZATION_LOCATIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            name: "name",
            code: "code",
            organizationTypeId: "organization_type_id",
            organizationId: "organization_id",
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
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "organization_type_id",
                include: [
                    {
                        model: this.db[config.MASTER_MAKERS],
                        attributes: ["id", "name"]
                    }
                ]
            },
            {
                model: this.db[config.CITIES],
                attributes: ["id", "name", "code"],
                include: [
                    {
                        model: this.db[config.STATES],
                        attributes: ["id", "name", "code"],
                        include: [{
                            model: this.db[config.COUNTRIES],
                            attributes: ["id", "name", "code"]
                        }]
                    }]
            }
        ];
    }
}

module.exports = OrganizationLocations;