const { CITIES, COUNTRIES, STATES, COMPANIES } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for firms table
 *
 * Created by               Version                         Date
 * Divya                    1.0.0                           30 May 2023
 *
 * @class Companies
 */
class Companies extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = COMPANIES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            name: "name",
            code: "code",
            gstNumber: "gst_number",
            email: "email",
            mobileNumber: "mobile_number",
            telephone: "telephone",
            parentCompanyId: "parent_company_id",
            registeredOfficeAddress: "registered_office_address",
            registeredOfficeCityId: "registered_office_city_id",
            registeredOfficePincode: "registered_office_pincode",
            currentOfficeAddress: "current_office_address",
            currentOfficeCityId: "current_office_city_id",
            currentOfficePincode: "current_office_pincode",
            attachments: "attachments",
            isActive: "is_active",
            integrationId: "integration_id",
            remarks: "remarks",
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
                foreignKey: "registered_office_city_id",
                as: "registered_office_city",
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
                attributes: ["id", "name", "code"],
                foreignKey: "current_office_city_id",
                as: "current_office_city",
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
                model: this.db[COMPANIES],
                attributes: ["id", "name"],
                foreignKey: "parent_company_id",
                as: "parent_company"
            }
        ];
    }
}

module.exports = Companies;
