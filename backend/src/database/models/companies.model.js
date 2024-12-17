const { COMPANIES, CITIES } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const companies = sequelize.define(
        COMPANIES,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            parentCompanyId: {
                type: DataTypes.UUID,
                field: "parent_company_id"
            },
            gstNumber: {
                type: DataTypes.STRING,
                field: "gst_number"
            },
            email: {
                type: DataTypes.STRING,
                field: "email"
            },
            mobileNumber: {
                type: DataTypes.STRING,
                field: "mobile_number"
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
            registeredOfficePincode: {
                type: DataTypes.STRING,
                field: "registered_office_pincode"
            },
            currentOfficeAddress: {
                type: DataTypes.STRING,
                field: "current_office_address"
            },
            currentOfficeCityId: {
                type: DataTypes.UUID,
                field: "current_office_city_id"
            },
            currentOfficePincode: {
                type: DataTypes.STRING,
                field: "current_office_pincode"
            },
            attachments: {
                type: DataTypes.STRING,
                field: "attachments"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
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
                field: "deleted_at",
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                companies.belongsTo(models[CITIES], { foreignKey: "registered_office_city_id", as: "registered_office_city" });
                companies.belongsTo(models[CITIES], { foreignKey: "current_office_city_id", as: "current_office_city" });
                companies.hasMany(models[COMPANIES], { foreignKey: "parent_company_id" });
                companies.belongsTo(models[COMPANIES], { foreignKey: "parent_company_id", as: "parent_company" });
            }
        }
    );
    return companies;
};
