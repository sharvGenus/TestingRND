const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const organizationsHistory = sequelize.define(
        config.ORGANIZATIONS_HISTORY,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            parentId: {
                type: DataTypes.UUID,
                field: "parent_id"
            },
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            organizationTypeId: {
                type: DataTypes.UUID,
                field: "organization_type_id"
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
                field: "email"
            },
            gstNumber: {
                type: DataTypes.STRING,
                field: "gst_number"
            },
            mobileNumber: {
                type: DataTypes.STRING,
                field: "mobile_number",
                allowNull: false
            },
            telephone: {
                type: DataTypes.STRING,
                field: "telephone"
            },
            registeredOfficeAddress: {
                type: DataTypes.STRING,
                field: "registered_office_address"
            },
            registeredOfficeCityId: {
                type: DataTypes.UUID,
                field: "registered_office_city_id"
            },
            registeredOfficePinCode: {
                type: DataTypes.STRING,
                field: "registered_office_pincode"
            },
            check: {
                type: DataTypes.BOOLEAN,
                field: "check"
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
                field: "pincode",
                allowNull: false
            },
            logo: {
                type: DataTypes.TEXT,
                field: "logo"
            },
            attachments: {
                type: DataTypes.TEXT,
                field: "attachments"
            },
            title: {
                type: DataTypes.UUID,
                field: "title"
            },
            authorisedDistributor: {
                type: DataTypes.STRING,
                field: "authorised_distributor"
            },
            firmType: {
                type: DataTypes.STRING,
                field: "firm_type"
            },
            owner: {
                type: DataTypes.STRING,
                field: "owner"
            },
            categoryOfIndustry: {
                type: DataTypes.STRING,
                field: "category_of_industry"
            },
            gstStatusId: {
                type: DataTypes.UUID,
                field: "gst_status_id"
            },
            panNumber: {
                type: DataTypes.STRING,
                field: "pan_number"
            },
            panReference: {
                type: DataTypes.STRING,
                field: "pan_reference"
            },
            dateOfBirth: {
                type: DataTypes.DATE,
                field: "date_of_birth"
            },
            annualTurnoverOfFirstYear: {
                type: DataTypes.INTEGER,
                field: "annual_turnover_of_first_year"
            },
            annualTurnoverOfSecondYear: {
                type: DataTypes.INTEGER,
                field: "annual_turnover_of_second_year"
            },
            annualTurnoverOfThirdYear: {
                type: DataTypes.INTEGER,
                field: "annual_turnover_of_third_year"
            },
            bankName: {
                type: DataTypes.STRING,
                field: "bank_name"
            },
            branchName: {
                type: DataTypes.STRING,
                field: "branch_name"
            },
            accountNumber: {
                type: DataTypes.INTEGER,
                field: "account_number"
            },
            ifscCode: {
                type: DataTypes.STRING,
                field: "ifsc_code"
            },
            paymentTermId: {
                type: DataTypes.UUID,
                field: "payment_term_id"
            },
            currencyId: {
                type: DataTypes.UUID,
                field: "currency_id"
            },
            incotermsId: {
                type: DataTypes.UUID,
                field: "incoterms_id"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
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
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                organizationsHistory.belongsTo(models[config.CITIES], { foreignKey: "registered_office_city_id", as: "register_office_cities" });
                organizationsHistory.belongsTo(models[config.CITIES], { foreignKey: "city_id", as: "cities" });
                organizationsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "organization_type_id", as: "organization_type" });
                organizationsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "gst_status_id", as: "gst_status" });
                organizationsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "payment_term_id", as: "payment_term" });
                organizationsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "currency_id", as: "currency" });
                organizationsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "incoterms_id", as: "incoterms" });
                organizationsHistory.hasMany(models[config.ORGANIZATION_STORES], { foreignKey: "organization_id" });
                organizationsHistory.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "organization_id" });
                organizationsHistory.hasMany(models[config.PROJECTS], { foreignKey: "customer_id" });
                organizationsHistory.hasMany(models[config.PROJECTS], { foreignKey: "company_id" });
                organizationsHistory.hasMany(models[config.USERS], { foreignKey: "organization_id" });
                organizationsHistory.hasMany(models[config.CUSTOMER_DEPARTMENTS], { foreignKey: "customer_id" });
                organizationsHistory.hasMany(models[config.APPROVERS], { foreignKey: "organization_name_id" });
                organizationsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "title", as: "organization_title" });
                organizationsHistory.hasMany(models[config.EMAIL_TEMPLATES], { foreignKey: "organization_id" });
                organizationsHistory.hasMany(models[config.USERS_HISTORY], { foreignKey: "organization_id" });
                organizationsHistory.hasMany(models[config.PROJECTS_HISTORY], { foreignKey: "customer_id" });
                organizationsHistory.hasMany(models[config.PROJECTS_HISTORY], { foreignKey: "company_id" });
                organizationsHistory.belongsTo(models[config.ORGANIZATIONS], { foreignKey: "parentId", as: "parent" });
                organizationsHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                organizationsHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return organizationsHistory;
};
