"use strict";

const { USERS, ROLES, CITIES, MASTER_MAKER_LOVS, ORGANIZATIONS } = require("../../config/database-schema");

/**
 * A sample migration to create table and insert data from csv keep this file for future reference
 */
module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            USERS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                roleId: {
                    type: Sequelize.UUID,
                    field: "role_id",
                    references: {
                        model: ROLES,
                        key: "id"
                    }
                },
                oraganizationType: {
                    type: Sequelize.UUID,
                    field: "organization_type",
                    references: {
                        model: MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                oraganizationId: {
                    type: Sequelize.UUID,
                    field: "organization_id",
                    references: {
                        model: ORGANIZATIONS,
                        key: "id"
                    }
                },
                name: {
                    type: Sequelize.STRING,
                    field: "name",
                    allowNull: false
                },
                code: {
                    type: Sequelize.STRING,
                    field: "code",
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING,
                    field: "email"
                },
                mobileNumber: {
                    type: Sequelize.STRING,
                    field: "mobile_number",
                    allowNull: false
                },
                address: {
                    type: Sequelize.STRING,
                    field: "address",
                    allowNull: false
                },
                tempToken: {
                    type: Sequelize.TEXT,
                    field: "temp_token"
                },
                lastLogin: {
                    type: Sequelize.DATE,
                    field: "last_login"
                },
                cityId: {
                    type: Sequelize.UUID,
                    field: "city_id",
                    references: {
                        model: CITIES,
                        key: "id"
                    }
                },
                pinCode: {
                    type: Sequelize.STRING,
                    field: "pin_code"
                },
                imeiNumber: {
                    type: Sequelize.STRING,
                    field: "imei_number"
                },
                imeiNumber2: {
                    type: Sequelize.STRING,
                    field: "imei_number2"
                },
                password: {
                    type: Sequelize.STRING,
                    field: "password"
                },
                mPin: {
                    type: Sequelize.STRING,
                    field: "mpin"
                },
                panNumber: {
                    type: Sequelize.STRING,
                    field: "pan_number"
                },
                aadharNumber: {
                    type: Sequelize.STRING,
                    field: "aadhar_number"
                },
                is2faEnable: {
                    type: Sequelize.STRING,
                    field: "is_2fa_enable"
                },
                userSalt: {
                    type: Sequelize.STRING,
                    field: "user_salt"
                },
                mpinSalt: {
                    type: Sequelize.STRING,
                    field: "mpin_salt"
                },
                dateOfOnboarding: {
                    type: Sequelize.STRING,
                    field: "date_of_onboarding"
                },
                dateOfOffboarding: {
                    type: Sequelize.STRING,
                    field: "date_of_offboarding"
                },
                typeOfOffboarding: {
                    type: Sequelize.STRING,
                    field: "type_of_offboarding"
                },
                isActive: {
                    type: Sequelize.ENUM,
                    field: "is_active",
                    values: ["0", "1"],
                    allowNull: false,
                    defaultValue: "1"
                },
                reactiveApprovalAttachment: {
                    type: Sequelize.STRING,
                    field: "reactive_approval_attachment"
                },
                attachments: {
                    type: Sequelize.STRING,
                    field: "attachments"
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
                },
                createdBy: {
                    type: Sequelize.UUID,
                    field: "created_by"
                },
                updatedBy: {
                    type: Sequelize.UUID,
                    field: "updated_by"
                },
                createdAt: {
                    type: Sequelize.DATE,
                    field: "created_at",
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    field: "updated_at",
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                    allowNull: false
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    field: "deleted_at"
                }
            }
        );
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(USERS);
    }
};
