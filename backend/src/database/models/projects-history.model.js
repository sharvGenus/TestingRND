const schema = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {

    const projectsHistory = sequelize.define(
        schema.PROJECTS_HISTORY,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            companyId: {
                type: DataTypes.UUID,
                field: "company_id"
            },
            customerId: {
                type: DataTypes.UUID,
                field: "customer_id"
            },
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            schemeName: {
                type: DataTypes.STRING,
                field: "scheme_name"
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            poWorkOrderNumber: {
                type: DataTypes.STRING,
                field: "po_work_order_number",
                allowNull: false
            },
            poStartDate: {
                type: DataTypes.DATE,
                field: "po_start_date",
                allowNull: false
            },
            poEndDate: {
                type: DataTypes.DATE,
                field: "po_end_date",
                allowNull: false
            },
            poExtensionDate: {
                type: DataTypes.DATE,
                field: "po_extension_date"
            },
            closureDate: {
                type: DataTypes.DATE,
                field: "closure_date"
            },
            fmsStartDate: {
                type: DataTypes.DATE,
                field: "fms_start_date"
            },
            fmsEndDate: {
                type: DataTypes.DATE,
                field: "fms_end_date"
            },
            fmsYears: {
                type: DataTypes.STRING,
                field: "fms_years",
                allowNull: false
            },
            eWayBillLimit: {
                type: DataTypes.FLOAT,
                field: "e_way_bill_limit"
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
                projectsHistory.belongsTo(models[schema.ORGANIZATIONS], { foreignKey: "customer_id", as: "customer" });
                projectsHistory.belongsTo(models[schema.ORGANIZATIONS], { foreignKey: "company_id", as: "company" });
                projectsHistory.belongsTo(models[schema.USERS], { foreignKey: "created_by", as: "created" });
                projectsHistory.belongsTo(models[schema.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );
    return projectsHistory;
};
