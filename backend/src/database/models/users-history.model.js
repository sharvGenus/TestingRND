const schema = require("../../config/database-schema");
const { USERS, CITIES, ROLES, MASTER_MAKER_LOVS, ORGANIZATIONS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const usersHistory = sequelize.define(
        schema.USERS_HISTORY,
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
            oraganizationType: {
                type: DataTypes.UUID,
                field: "organization_type"
            },
            supervisorId: {
                type: DataTypes.UUID,
                field: "supervisor_id"
            },
            oraganizationId: {
                type: DataTypes.UUID,
                field: "organization_id"
            },
            organisationBranchId: {
                type: DataTypes.UUID,
                field: "organisation_branch_id"
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
            appVersion: {
                type: DataTypes.STRING,
                field: "app_version"
            },
            mobileNumber: {
                type: DataTypes.STRING,
                field: "mobile_number",
                unique: true,
                allowNull: false
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
            dateOfOnboarding: {
                type: DataTypes.DATE,
                field: "date_of_onboarding"
            },
            dateOfOffboarding: {
                type: DataTypes.STRING,
                field: "date_of_offboarding"
            },
            verifyOtp: {
                type: DataTypes.STRING,
                field: "verify_otp"
            },
            typeOfOffboarding: {
                type: DataTypes.STRING,
                field: "type_of_offboarding"
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
            deletedAt: {
                type: DataTypes.DATE,
                field: "deleted_at"
            },
            recordId: {
                type: DataTypes.UUID,
                field: "record_id"
            },
            status: {
                type: DataTypes.UUID,
                field: "status"
            },
            aadharNo: {
                type: DataTypes.UUID,
                field: "aadhar_no"
            },
            deviceId: {
                type: DataTypes.UUID,
                field: "device_id"
            },
            lastLogin: {
                type: DataTypes.DATE,
                field: "last_login"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                usersHistory.belongsTo(models[MASTER_MAKER_LOVS], { foreignKey: "status", as: "user_status" });
                usersHistory.belongsTo(models[CITIES], { foreignKey: "city_id" });
                usersHistory.belongsTo(models[ROLES], { foreignKey: "role_id" });
                usersHistory.belongsTo(models[MASTER_MAKER_LOVS], { foreignKey: "organization_type" });
                usersHistory.belongsTo(models[ORGANIZATIONS], { foreignKey: "organization_id" });
                usersHistory.belongsTo(models[USERS], { foreignKey: "supervisorId", as: "supervisor" });
                usersHistory.belongsTo(models[ORGANIZATIONS], { foreignKey: "organisation_branch_id", as: "organisationBranch" });
                usersHistory.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                usersHistory.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return usersHistory;
};