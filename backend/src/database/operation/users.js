const { Op } = require("sequelize");
const { USERS, STATES, COUNTRIES, CITIES, ROLES, ORGANIZATIONS, MASTER_MAKER_LOVS, SUPERVISOR_ASSIGNMENTS } = require("../../config/database-schema");
const { Base } = require("./base");
const { throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for users table
 *
 * created by               version                         date
 * Tarun                    1.0.0                           05 June 2023
 *
 * updated by               version                         date
 * Mohammed Sameer          1.0.0                        22 June 2023
 *
 * @class Roles
 */
class Users extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = USERS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            roleId: "role_id",
            oraganizationType: "organization_type",
            oraganizationId: "organization_id",
            organisationBranchId: "organisation_branch_id",
            name: "name",
            code: "code",
            wfmCode: "wfm_code",
            source: "source",
            email: "email",
            mobileNumber: "mobileNumber",
            supervisorId: "supervisor_id",
            authorizedUser: "authorized_user",
            address: "address",
            cityId: "city_id",
            pinCode: "pin_code",
            imeiNumber: "imei_number",
            imeiNumber2: "imei_number2",
            password: "__password",
            mPin: "__mpin",
            panNumber: "panNumber",
            aadharNumber: "aadhar_number",
            is2faEnable: "is_2fa_enable",
            userSalt: "__user_salt",
            mpinSalt: "__mpin_salt",
            dateOfOnboarding: "date_of_onboarding",
            dateOfOffboarding: "date_of_offboarding",
            typeOfOffboarding: "type_of_offboarding",
            reactiveApprovalAttachment: "reactive_approval_attachment",
            attachments: "attachments",
            tempToken: "__temp_token",
            lastLogin: "last_login",
            remarks: "remarks",
            status: "status",
            isLocked: "is_locked",
            isActive: "is_active",
            createdBy: "created_by",
            verifyOtp: "verify_otp",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at",
            aadharNo: "aadhar_no",
            deviceId: "device_id",
            appVersion: "app_version"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[ROLES],
                attributes: ["id", "name", ["is_import", "isImport"], ["is_export", "isExport"], ["for_ticket", "forTicket"], ["add_ticket", "addTicket"], ["is_update", "isUpdate"]]
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
        this.whereClauseOverRide = { ...this.whereClauseOverRide, email: { [Op.or]: { [Op.notIn]: ["admin@admin.com", "inventoryadmin@admin.com"], [Op.eq]: null } } };
    }

    async lockInaciveUsers() {
        return this.db.sequelize.query(`
            update users set is_locked = true, status = '40e66f7e-4088-4bd1-a555-c5b867b101c9' where last_login::date < CURRENT_DATE - interval '7 days'
        `);
    }

    async findOneWithCache(...args) {
        const [{ id }] = args;
        const redisKey = `user_${id}`;
        
        let userData = await this.redisDb.getObject(redisKey);
        if (userData) return userData;
        userData = await super.findOne(...args);
        await this.redisDb.set(redisKey, userData, 30 * 60);
        return userData;
    }

    async update(...args) {
        const [, { id, ...where }] = args;
        let key = `user_${id}`;
        if (!id) {
            const { id: userId } = await this.findOne(where, ["id"], false, undefined, true);
            key = `user_${userId}`;
        }
        await this.redisDb.del(key);
        return super.update(...args);
    }

    updateRelationsForSupervisor() {
        this.relations.push(
            {
                model: this.db[SUPERVISOR_ASSIGNMENTS],
                attributes: ["id"],
                foreignKey: "id"
            }
        );
    }

    // eslint-disable-next-line max-len
    async findAndCountAllDistinctRows(whereCondition, attributes = this.fieldsList, isRelated = false, distinctColumn = null, paginated = this.queryObject, raw = false, respectBlacklist = true) {
        if (paginated && Object.keys(paginated || {}).length > 0) {
            paginated.order = [paginated.sort];
        }
        const queryOptions = {
            attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
            where: { ...this.getOverRidesQueries(), ...whereCondition },
            ...raw && { raw, nest: true },
            ...isRelated && { include: this.relations },
            ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }
        };

        if (distinctColumn) {
            queryOptions.group = [distinctColumn];
        }

        const rows = this.model.findAll(queryOptions);

        return rows;
    }

    /**
     * Method to delete any record from database, deleted return number of rows
     * @param {Object} body 
     * @param {Object} whereClause 
     * @param {Object} transaction 
     * @returns {Promise<Number>}
     */
    async deleteWithStatusUpdate(body, whereClause, transaction, deleteData = true) {
        this.testWhereClause(whereClause);
        if (whereClause.id && typeof whereClause.id === "string" && !Array.isArray(whereClause.id)) {
            const data = await this.db.sequelize.query(`select check_for_associations('public', '${this.modelName}', '${whereClause.id}')`);
            throwIf(data[0][0].check_for_associations, statusCodes.BAD_REQUEST, data[0][0].check_for_associations);
        }
        
        const { status } = body;
        if (status && this.fields.isActive && deleteData) {
            return this.update({ isActive: "0", status }, whereClause, transaction);
        }
        return this.forceDelete(whereClause, transaction, true);
    }
}

module.exports = Users;
