const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for organization_stores table
 *
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           16 Jun 2023
 *
 * @class OrganizationStores
 */
class OrganizationStores extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.ORGANIZATION_STORES;
        this.initialiseModel();
        this.fields = {
            id: "id",
            organizationType: "organization_type",
            organizationId: "organization_id",
            name: "name",
            code: "code",
            integrationId: "integration_id",
            gstNumber: "gst_number",
            email: "email",
            mobileNumber: "mobile_number",
            telephone: "telephone",
            address: "address",
            cityId: "city_id",
            pincode: "pincode",
            attachments: "attachments",
            storePhoto: "store_photo",
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
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "created_by",
                as: "created"

            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "updated_by",
                as: "updated"

            },
            {
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "parentId", "name", "code"],
                include: [{
                    model: this.db[config.ORGANIZATIONS],
                    attributes: ["id", "name", "code"],
                    as: "parent"
                }]
            },
            {
                model: this.db[config.CITIES],
                attributes: ["id", "name", "code"],
                include: [{
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

module.exports = OrganizationStores;
