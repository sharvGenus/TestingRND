const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for organization_store_locations history table
 * 
 * Created by               Version                         Date
 * Kaif                     1.0.0                           28 July 2023
 * 
 * @class OrganizationStoreLocationsHistory
 */
class OrganizationStoreLocationsHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.ORGANIZATION_STORE_LOCATIONS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            organizationType: "organization_type",
            organizationStoreId: "organization_store_id",
            projectId: "project_id",
            recordId: "record_id",
            name: "name",
            code: "code",
            integrationId: "integration_id",
            isRestricted: "is_restricted",
            isFaulty: "is_faulty",
            isScrap: "is_scrap",
            isInstalled: "is_installed",
            forInstaller: "for_installer",
            isOld: "is_old",
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
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name", "code"]
            }
        ];
    }
}

module.exports = OrganizationStoreLocationsHistory;
