"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.ORGANIZATIONS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                integrationId: {
                    type: Sequelize.STRING,
                    field: "integration_id"
                },
                organizationTypeId: {
                    type: Sequelize.UUID,
                    field: "organization_type_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
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
                gstNumber: {
                    type: Sequelize.STRING,
                    field: "gst_number"
                },
                mobileNumber: {
                    type: Sequelize.STRING,
                    field: "mobile_number",
                    allowNull: false
                },
                telephone: {
                    type: Sequelize.STRING,
                    field: "telephone"
                },
                registeredOfficeAddress: {
                    type: Sequelize.STRING,
                    field: "registered_office_address",
                    allowNull: false
                },
                registeredOfficeCityId: {
                    type: Sequelize.UUID,
                    field: "registered_office_city_id",
                    references: {
                        model: config.CITIES,
                        key: "id"
                    }
                },
                registeredOfficePinCode: {
                    type: Sequelize.STRING,
                    field: "registered_office_pincode",
                    allowNull: false
                },
                check: {
                    type: Sequelize.BOOLEAN,
                    field: "check"
                },
                address: {
                    type: Sequelize.STRING,
                    field: "address",
                    allowNull: false
                },
                cityId: {
                    type: Sequelize.UUID,
                    field: "city_id",
                    references: {
                        model: config.CITIES,
                        key: "id"
                    }
                },
                pinCode: {
                    type: Sequelize.STRING,
                    field: "pincode",
                    allowNull: false
                },
                attachments: {
                    type: Sequelize.STRING,
                    field: "attachments"
                },
                title: {
                    type: Sequelize.ENUM,
                    field: "title",
                    values: ["mr", "ms", "mrs"],
                    defaultValue: "mr"
                },
                authorisedDistributor: {
                    type: Sequelize.STRING,
                    field: "authorised_distributor"
                },
                firmType: {
                    type: Sequelize.STRING,
                    field: "firm_type"
                },
                owner: {
                    type: Sequelize.STRING,
                    field: "owner"
                },
                categoryOfIndustry: {
                    type: Sequelize.STRING,
                    field: "category_of_industry"
                },
                gstStatusId: {
                    type: Sequelize.UUID,
                    field: "gst_status_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                panNumber: {
                    type: Sequelize.STRING,
                    field: "pan_number"
                },
                panReference: {
                    type: Sequelize.STRING,
                    field: "pan_reference"
                },
                dateOfBirth: {
                    type: Sequelize.DATE,
                    field: "date_of_birth"
                },
                annualTurnoverOfFirstYear: {
                    type: Sequelize.INTEGER,
                    field: "annual_turnover_of_first_year"
                },
                annualTurnoverOfSecondYear: {
                    type: Sequelize.INTEGER,
                    field: "annual_turnover_of_second_year"
                },
                annualTurnoverOfThirdYear: {
                    type: Sequelize.INTEGER,
                    field: "annual_turnover_of_third_year"
                },
                bankName: {
                    type: Sequelize.STRING,
                    field: "bank_name"
                },
                branchName: {
                    type: Sequelize.STRING,
                    field: "branch_name"
                },
                accountNumber: {
                    type: Sequelize.INTEGER,
                    field: "account_number"
                },
                ifscCode: {
                    type: Sequelize.STRING,
                    field: "ifsc_code"
                },
                paymentTermId: {
                    type: Sequelize.UUID,
                    field: "payment_term_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                currencyId: {
                    type: Sequelize.UUID,
                    field: "currency_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                incotermsId: {
                    type: Sequelize.UUID,
                    field: "incoterms_id",
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
                },
                isActive: {
                    type: Sequelize.ENUM,
                    field: "is_active",
                    values: ["0", "1"],
                    allowNull: false,
                    defaultValue: "1"
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(config.ORGANIZATIONS);
    }
};
