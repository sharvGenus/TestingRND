const { PROJECTS, ORGANIZATIONS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for projects table
 *
 * Created by               Version                         Date
 * Divya                    1.0.0                           31 May 2023
 *
 * @class Projects
 */
class Projects extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = PROJECTS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            companyId: "company_id",
            customerId: "customer_id",
            name: "name",
            code: "code",
            schemeName: "scheme_name",
            integrationId: "integration_id",
            poWorkOrderNumber: "po_work_order_number",
            poStartDate: "po_start_date",
            poEndDate: "po_end_date",
            poExtensionDate: "po_extension_date",
            closureDate: "closure_date",
            fmsStartDate: "fms_start_date",
            fmsEndDate: "fms_end_date",
            fmsYears: "fms_years",
            eWayBillLimit: "e_way_bill_limit",
            attachments: "attachments",
            logoOne: "logo_one",
            logoTwo: "logo_two",
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
                model: this.db[ORGANIZATIONS],
                attributes: ["id", "name", "code"],
                foreignKey: "customer_id",
                as: "customer"
            },
            {
                model: this.db[ORGANIZATIONS],
                attributes: ["id", "name", "code"],
                foreignKey: "company_id",
                as: "company"
            },
            {
                model: this.db[USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "created_by",
                as: "created"

            },
            {
                model: this.db[USERS],
                attributes: ["id", "name", "code"],
                foreignKey: "updated_by",
                as: "updated"

            }
        ];
    }
}

module.exports = Projects;
