const { USERS_HISTORY, ROLES, CITIES, STATES, COUNTRIES, MASTER_MAKER_LOVS, ORGANIZATIONS, USERS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for users history table
 *
 * created by               version                         date
 * Ruhana                    1.0.0                           16 June 2023
 *
 * @class UsersHistory
 */
class UsersHistory extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = USERS_HISTORY;
        this.initialiseModel();
        this.fields = {
            id: "id",
            roleId: "role_id",
            oraganizationType: "organization_type",
            oraganizationId: "organization_id",
            organisationBranchId: "organisation_branch_id",
            name: "name",
            code: "code",
            email: "email",
            mobileNumber: "mobileNumber",
            address: "address",
            authorizedUser: "authorized_user",
            cityId: "city_id",
            pinCode: "pin_code",
            imeiNumber: "imei_number",
            imeiNumber2: "imei_number2",
            wfmCode: "wfm_code",
            source: "source",
            password: "__password",
            mPin: "mpin",
            panNumber: "panNumber",
            aadharNumber: "aadhar_number",
            is2faEnable: "is_2fa_enable",
            userSalt: "__user_salt",
            dateOfOnboarding: "date_of_onboarding",
            dateOfOffboarding: "date_of_offboarding",
            typeOfOffboarding: "type_of_offboarding",
            reactiveApprovalAttachment: "reactive_approval_attachment",
            status: "status",
            attachments: "attachments",
            recordId: "record_id",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            verifyOtp: "verify_otp",
            createdAt: "created_at",
            updatedAt: "updated_at",
            appVersion: "app_version",
            aadharNo: "aadhar_no",
            deviceId: "device_id",
            lastLogin: "last_login"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[ROLES],
                attributes: ["id", "name"]
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
            },
            {
                model: this.db[MASTER_MAKER_LOVS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[ORGANIZATIONS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[USERS],
                attributes: ["id", "name"],
                foreignKey: "supervisorId",
                as: "supervisor"
            },
            {
                model: this.db[ORGANIZATIONS],
                attributes: ["id", "name", "code"],
                as: "organisationBranch"
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

            },
            {
                model: this.db[MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                foreignKey: "status",
                as: "user_status"
            }

        ];
    }
}

module.exports = UsersHistory;
