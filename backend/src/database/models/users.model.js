const { USERS, WORK_AREA_ASSIGNMENT_HISTORY, SUPERVISOR_ASSIGNMENTS_HISTORY, CITIES, USERS_HISTORY, ROLES, UESR_SESSOINS, SUPERVISOR_ASSIGNMENTS, STOCK_LEDGERS, WORK_AREA_ASSIGNMENT, MASTER_MAKER_LOVS, ORGANIZATIONS, APPROVERS, REQUEST_APPROVALS, USER_COLUMN_DEFAULT_PERMISSIONS, TICKETS, TICKETS_HISTORY, ESCALATION_LEVELS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const users = sequelize.define(
        USERS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            roleId: {
                type: DataTypes.UUID,
                field: "role_id"
            },
            wfmCode: {
                type: DataTypes.INTEGER,
                field: "wfm_code"
            },
            source: {
                type: DataTypes.STRING,
                field: "source",
                allowNull: true
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                field: "email",
                unique: true
            },
            tempToken: {
                type: DataTypes.TEXT,
                field: "temp_token"
            },
            lastLogin: {
                type: DataTypes.DATE,
                field: "last_login"
            },
            mobileNumber: {
                type: DataTypes.STRING,
                field: "mobile_number",
                unique: true,
                allowNull: false
            },
            supervisorId: {
                type: DataTypes.UUID,
                field: "supervisor_id"
            },
            authorizedUser: {
                type: DataTypes.BOOLEAN,
                field: "authorized_user",
                defaultValue: false
            },
            address: {
                type: DataTypes.STRING,
                field: "address",
                allowNull: false
            },
            cityId: {
                type: DataTypes.UUID,
                field: "city_id"
            },
            oraganizationType: {
                type: DataTypes.UUID,
                field: "organization_type"
            },
            oraganizationId: {
                type: DataTypes.UUID,
                field: "organization_id"
            },
            organisationBranchId: {
                type: DataTypes.UUID,
                field: "organisation_branch_id"
            },
            pinCode: {
                type: DataTypes.STRING,
                field: "pin_code"
            },
            imeiNumber: {
                type: DataTypes.STRING,
                field: "imei_number"
            },
            imeiNumber2: {
                type: DataTypes.STRING,
                field: "imei_number2"
            },
            verifyOtp: {
                type: DataTypes.STRING,
                field: "verify_otp"
            },
            password: {
                type: DataTypes.STRING,
                field: "password"
            },
            mPin: {
                type: DataTypes.STRING,
                field: "mpin"
            },
            panNumber: {
                type: DataTypes.STRING,
                field: "pan_number"
            },
            aadharNumber: {
                type: DataTypes.STRING,
                field: "aadhar_number"
            },
            is2faEnable: {
                type: DataTypes.STRING,
                field: "is_2fa_enable"
            },
            userSalt: {
                type: DataTypes.STRING,
                field: "user_salt"
            },
            mpinSalt: {
                type: DataTypes.STRING,
                field: "mpin_salt"
            },
            dateOfOnboarding: {
                type: DataTypes.DATE,
                field: "date_of_onboarding"
            },
            dateOfOffboarding: {
                type: DataTypes.STRING,
                field: "date_of_offboarding"
            },
            typeOfOffboarding: {
                type: DataTypes.STRING,
                field: "type_of_offboarding"
            },
            isLocked: {
                type: DataTypes.BOOLEAN,
                field: "is_locked",
                defaultValue: false
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            reactiveApprovalAttachment: {
                type: DataTypes.STRING,
                field: "reactive_approval_attachment"
            },
            attachments: {
                type: DataTypes.STRING,
                field: "attachments"
            },
            appVersion: {
                type: DataTypes.STRING,
                field: "app_version"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            createdBy: {
                type: DataTypes.UUID,
                field: "created_by"
            },
            updatedBy: {
                type: DataTypes.UUID,
                field: "updated_by"
            },
            createdAt: {
                type: DataTypes.DATE,
                field: "created_at",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: "updated_at",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            status: {
                type: DataTypes.UUID,
                field: "status"
            },
            deletedAt: {
                type: DataTypes.DATE,
                field: "deleted_at"
            },
            aadharNo: {
                type: DataTypes.UUID,
                field: "aadhar_no"
            },
            deviceId: {
                type: DataTypes.UUID,
                field: "device_id"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                users.belongsTo(models[MASTER_MAKER_LOVS], { foreignKey: "status", as: "user_status" });
                users.belongsTo(models[CITIES], { foreignKey: "city_id" });
                users.belongsTo(models[ROLES], { foreignKey: "role_id" });
                users.hasMany(models[SUPERVISOR_ASSIGNMENTS], { foreignKey: "user_id" });
                users.hasMany(models[UESR_SESSOINS], { foreignKey: "user_id" });
                users.hasMany(models[SUPERVISOR_ASSIGNMENTS], { foreignKey: "supervisor_id" });
                users.hasMany(models[WORK_AREA_ASSIGNMENT], { foreignKey: "user_id" });
                users.hasMany(models[STOCK_LEDGERS], { foreignKey: "approver_id" });
                // users.hasMany(models[USER_MASTER_COLUMN_PERMISSION], { foreignKey: "user_master_column_permission_id" });
                // users.hasMany(models[USER_MASTER_LOV_PERMISSION], { foreignKey: "user_master_lov_permission_id" });
                users.belongsTo(models[MASTER_MAKER_LOVS], { foreignKey: "organization_type" });
                users.belongsTo(models[ORGANIZATIONS], { foreignKey: "organization_id" });
                users.hasMany(models[STOCK_LEDGERS], { foreignKey: "installer_id" });
                users.hasMany(models[APPROVERS], { foreignKey: "user_id" });
                users.belongsTo(models[USERS], { foreignKey: "supervisorId", as: "supervisor" });
                users.hasMany(models[USERS_HISTORY], { foreignKey: "supervisorId" });
                users.hasMany(models[WORK_AREA_ASSIGNMENT_HISTORY], { foreignKey: "user_id" });
                users.hasMany(models[SUPERVISOR_ASSIGNMENTS_HISTORY], { foreignKey: "user_id" });
                users.hasMany(models[SUPERVISOR_ASSIGNMENTS_HISTORY], { foreignKey: "supervisor_id" });
                users.hasMany(models[REQUEST_APPROVALS], { foreignKey: "contractor_employee_id" });
                users.hasMany(models[USER_COLUMN_DEFAULT_PERMISSIONS], { foreignKey: "user_id" });
                users.belongsTo(models[ORGANIZATIONS], { foreignKey: "organisation_branch_id", as: "organisationBranch" });
                users.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                users.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
                users.hasMany(models[TICKETS], { foreignKey: "supervisor_id", as: "supervisor_obj" });
                users.hasMany(models[TICKETS], { foreignKey: "assignee_id", as: "assignee" });
                users.hasMany(models[TICKETS], { foreignKey: "created_by" });
                users.hasMany(models[TICKETS], { foreignKey: "updated_by" });
                users.hasMany(models[TICKETS_HISTORY], { foreignKey: "supervisor_id", as: "supervisor_object" });
                users.hasMany(models[TICKETS_HISTORY], { foreignKey: "assignee_id", as: "assignee_obj" });
            }
        }
    );

    return users;
};
