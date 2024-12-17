const {
    PROJECTS,
    CONTRACTOR_STORES,
    PROJECT_SITE_STORES,
    ROLES,
    CUSTOMER_STORES,
    NETWORK_HIERARCHIES,
    PROJECT_MASTER_MAKERS,
    GAA_HIERARCHIES,
    FORMS,
    REQUEST_APPROVALS,
    ORGANIZATION_STORE_LOCATIONS,
    STOCK_LEDGERS,
    ORGANIZATIONS,
    APPROVERS,
    EMAIL_TEMPLATES,
    ROLES_HISTORY,
    GAA_HIERARCHIES_HISTORY,
    NETWORK_HIERARCHIES_HISTORY,
    PROJECT_MASTER_MAKERS_HISTORY,
    WORK_AREA_ASSIGNMENT,
    WORK_AREA_ASSIGNMENT_HISTORY,
    FORM_WISE_TICKET_MAPPINGS,
    USERS,
    MATERIAL_QUANTITIES,
    TICKETS,
    PROJECT_WISE_TICKET_MAPPINGS,
    TICKETS_HISTORY,
    PROJECT_WISE_TICKET_MAPPINGS_HISTORY,
    FORM_WISE_TICKET_MAPPINGS_HISTORY,
    ESCALATION_MATRIX,
    BILLING_BASIC_DETAILS
} = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {

    const projects = sequelize.define(
        PROJECTS,
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
                field: "company_id",
                allowNull: false
            },
            customerId: {
                type: DataTypes.UUID,
                field: "customer_id",
                allowNull: false
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
            logoOne: {
                type: DataTypes.STRING,
                field: "logo_one"
            },
            logoTwo: {
                type: DataTypes.STRING,
                field: "logo_two"
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
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                projects.belongsTo(models[ORGANIZATIONS], { foreignKey: "customer_id", as: "customer" });
                projects.belongsTo(models[ORGANIZATIONS], { foreignKey: "company_id", as: "company" });
                projects.hasMany(models[CONTRACTOR_STORES], { foreignKey: "project_id" });
                projects.hasMany(models[PROJECT_SITE_STORES], { foreignKey: "project_id" });
                projects.hasMany(models[ROLES], { foreignKey: "project_id" });
                projects.hasMany(models[CUSTOMER_STORES], { foreignKey: "project_id" });
                projects.hasMany(models[NETWORK_HIERARCHIES], { foreignKey: "project_id" });
                projects.hasMany(models[PROJECT_MASTER_MAKERS], { foreignKey: "project_id" });
                projects.hasMany(models[GAA_HIERARCHIES], { foreignKey: "project_id" });
                projects.hasMany(models[FORMS], { foreignKey: "project_id" });
                projects.hasMany(models[REQUEST_APPROVALS], { foreignKey: "project_id" });
                projects.hasMany(models[REQUEST_APPROVALS], { foreignKey: "to_project_id" });
                projects.hasMany(models[ORGANIZATION_STORE_LOCATIONS], { foreignKey: "project_id" });
                projects.hasMany(models[STOCK_LEDGERS], { foreignKey: "project_id" });
                projects.hasMany(models[APPROVERS], { foreignKey: "project_id" });
                projects.hasMany(models[EMAIL_TEMPLATES], { foreignKey: "project_id" });
                projects.hasMany(models[EMAIL_TEMPLATES], { foreignKey: "project_id" });
                projects.hasMany(models[ROLES_HISTORY], { foreignKey: "project_id" });
                projects.hasMany(models[GAA_HIERARCHIES_HISTORY], { foreignKey: "project_id" });
                projects.hasMany(models[NETWORK_HIERARCHIES_HISTORY], { foreignKey: "project_id" });
                projects.hasMany(models[PROJECT_MASTER_MAKERS_HISTORY], { foreignKey: "project_id" });
                projects.hasMany(models[WORK_AREA_ASSIGNMENT], { foreignKey: "project_id" });
                projects.hasMany(models[WORK_AREA_ASSIGNMENT_HISTORY], { foreignKey: "project_id" });
                projects.hasMany(models[FORM_WISE_TICKET_MAPPINGS], { foreignKey: "project_id" });
                projects.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                projects.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
                projects.hasMany(models[MATERIAL_QUANTITIES], { foreignKey: "project_id" });
                projects.hasMany(models[TICKETS], { foreignKey: "project_id" });
                projects.hasMany(models[ESCALATION_MATRIX], { foreignKey: "project_id" });
                projects.hasMany(models[PROJECT_WISE_TICKET_MAPPINGS], { foreignKey: "project_id" });
                projects.hasMany(models[TICKETS_HISTORY], { foreignKey: "project_id" });
                projects.hasMany(models[PROJECT_WISE_TICKET_MAPPINGS_HISTORY], { foreignKey: "project_id" });
                projects.hasMany(models[FORM_WISE_TICKET_MAPPINGS_HISTORY], { foreignKey: "project_id" });
                projects.hasMany(models[BILLING_BASIC_DETAILS], { foreignKey: "project_id" });
            }
        }
    );
    return projects;
};
