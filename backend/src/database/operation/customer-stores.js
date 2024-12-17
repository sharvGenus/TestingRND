const { CITIES, COUNTRIES, STATES, PROJECTS, CUSTOMER_STORES } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for firms table
 * 
 * Created by               Version                         Date
 * Kaif                      1.0.0                           1 june 2023
 * 
 * @class CustomerStores
 */
class CustomerStores extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = CUSTOMER_STORES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            name: "name",
            projectId: "project_id",
            code: "code",
            photo: "photo",
            gstNumber: "gst_number",
            email: "email",
            mobileNumber: "mobile_number",
            telephone: "telephone",
            registeredOfficeCityId: "registered_office_city_id",
            currentOfficeCityId: "current_office_city_id",
            registeredOfficeAddress: "registered_office_address",
            registeredOfficePinCode: "registered_office_pincode",
            currentOfficeAddress: "current_office_address",
            currentOfficePinCode: "current_office_pincode",
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
                model: this.db[PROJECTS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[CITIES],
                attributes: ["id", "name", "code"],
                foreignKey: "registered_office_city_id",
                as: "register_office_cities",
                include: [
                    {
                        model: this.db[STATES],
                        attributes: ["id", "name", "code"],
                        include: [{
                            model: this.db[COUNTRIES],
                            attributes: ["id", "name", "code"]

                        }]
                    }]
            },
            {
                model: this.db[CITIES],
                as: "current_office_cities",
                attributes: ["id", "name", "code"],
                foreignKey: "current_office_city_id",
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

module.exports = CustomerStores;