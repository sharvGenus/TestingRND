const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for organizations table
 * 
 * Created by               Version                         Date
 * Kaif                      1.0.0                           19 June 2023
 * 
 * @class organizations
 */
class Organizations extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.ORGANIZATIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            parentId: "parent_id",
            integrationId: "integration_id",
            name: "name",
            organizationTypeId: "organization_type_id",
            code: "code",
            gstNumber: "gst_number",
            email: "email",
            mobileNumber: "mobile_number",
            telephone: "telephone",
            registeredOfficeCityId: "registered_office_city_id",
            cityId: "city_id",
            registeredOfficeAddress: "registered_office_address",
            registeredOfficePinCode: "registered_office_pincode",
            check: "check",
            address: "address",
            pinCode: "pincode",
            attachments: "attachments",
            logo: "logo",
            title: "title",
            authorisedDistributor: "authorised_distributor",
            firmType: "firm_type",
            owner: "owner",
            categoryOfIndustry: "category_of_industry",
            gstStatusId: "gst_status_id",
            panNumber: "pan_number",
            panReference: "pan_reference",
            dateOfBirth: "date_of_birth",
            annualTurnoverOfFirstYear: "annual_turnover_of_first_year",
            annualTurnoverOfSecondYear: "annual_turnover_of_second_year",
            annualTurnoverOfThirdYear: "annual_turnover_of_third_year",
            bankName: "bank_name",
            branchName: "branch_name",
            accountNumber: "account_number",
            ifscCode: "ifsc_code",
            paymentTermId: "payment_term_id",
            currencyId: "currency_id",
            incotermsId: "incoterms_id",
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
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code"],
                as: "parent"
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
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                as: "organization_type",
                foreignKey: "organization_type_id"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                as: "gst_status",
                foreignKey: "gst_status_id"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                as: "payment_term",
                foreignKey: "payment_term_id"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                as: "currency",
                foreignKey: "currency_id"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                as: "incoterms",
                foreignKey: "incoterms_id"
            },
            {
                model: this.db[config.MASTER_MAKER_LOVS],
                attributes: ["id", "name"],
                as: "organization_title",
                foreignKey: "title"
            },
            {
                model: this.db[config.CITIES],
                attributes: ["id", "name", "code"],
                foreignKey: "registered_office_city_id",
                as: "register_office_cities",
                include: [
                    {
                        model: this.db[config.STATES],
                        attributes: ["id", "name", "code"],
                        include: [{
                            model: this.db[config.COUNTRIES],
                            attributes: ["id", "name", "code"]

                        }]
                    }]
            },
            {
                model: this.db[config.CITIES],
                as: "cities",
                attributes: ["id", "name", "code"],
                foreignKey: "city_id",
                include: [
                    {
                        model: this.db[config.STATES],
                        attributes: ["id", "name", "code"],
                        include: [{
                            model: this.db[config.COUNTRIES],
                            attributes: ["id", "name", "code"]
                        }]
                    }]
            }
        ];
    }
}

module.exports = Organizations;