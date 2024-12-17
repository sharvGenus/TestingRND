const config = require("../../config/database-schema");
const { Base } = require("./base");
/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for supplier repair centers table
 *
 * Created by               Version                         Date
 * Ruhana                   1.0.0                           01 jun 2023
 *
 * @class Supplier repair center
 */

class SupplierRepairCenters extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.SUPPLIER_REPAIR_CENTERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            integrationId: "integration_id",
            name: "name",
            supplierId: "supplier_id",
            code: "code",
            photo: "photo",
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
                model: this.db[config.SUPPLIERS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.CITIES],
                attributes: ["id", "name", "code"],
                foreignKey: "registered_office_city_id",
                as: "register_office_cities",
                include: [
                    {
                        model: this.db[config.STATES],
                        attributes: ["id", "name", "code"],
                        include: [
                            {
                                model: this.db[config.COUNTRIES],
                                attributes: ["id", "name", "code"]
                            }
                        ]
                    }
                ]
            },

            {
                model: this.db[config.CITIES],
                as: "current_office_cities",
                attributes: ["id", "name", "code"],
                foreignKey: "current_office_city_id",
                include: [
                    {
                        model: this.db[config.STATES],
                        attributes: ["id", "name", "code"],
                        include: [
                            {
                                model: this.db[config.COUNTRIES],
                                attributes: ["id", "name", "code"]
                            }
                        ]
                    }
                ]
            }
        ];
    }
}

module.exports = SupplierRepairCenters;
