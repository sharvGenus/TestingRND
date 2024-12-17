const { PROJECTS_HISTORY, ORGANIZATIONS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database update and others for projects history table
 *
 * Created by               Version                         Date
 * Ruhana                    1.0.0                           14 jun 2023
 *
 * @class Projects History
 */
class ProjectsHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = PROJECTS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            company_id: "companyId",
            customer_id: "customerId",
            integrationId: "integration_id",
            name: "name",
            code: "code",
            schemeName: "scheme_name",
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
            isActive: "is_active",
            remarks: "remarks",
            recordId: "record_id",
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

module.exports = ProjectsHistory;
