const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const masterMakerLovs = sequelize.define(
        config.MASTER_MAKER_LOVS,
        {
            masterId: {
                type: DataTypes.UUID,
                field: "master_id",
                allowNull: false
            },
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name"
            },
            code: {
                type: DataTypes.STRING,
                field: "code"
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
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                masterMakerLovs.belongsTo(models[config.MASTER_MAKERS], { foreignKey: "master_id" });
                masterMakerLovs.hasMany(models[config.MATERIALS], { foreignKey: "uom_id" });
                masterMakerLovs.hasMany(models[config.MATERIALS], { foreignKey: "material_type_id" });
                masterMakerLovs.hasMany(models[config.ORGANIZATIONS], { foreignKey: "organization_type_id" });
                masterMakerLovs.hasMany(models[config.ORGANIZATIONS], { foreignKey: "gst_status_id" });
                masterMakerLovs.hasMany(models[config.ORGANIZATIONS], { foreignKey: "payment_term_id" });
                masterMakerLovs.hasMany(models[config.ORGANIZATIONS], { foreignKey: "currency_id" });
                masterMakerLovs.hasMany(models[config.ORGANIZATIONS], { foreignKey: "incoterms_id" });
                masterMakerLovs.hasMany(models[config.FORMS], { foreignKey: "form_type_id" });
                masterMakerLovs.hasMany(models[config.ORGANIZATION_STORES], { foreignKey: "organization_type" });
                masterMakerLovs.hasMany(models[config.ORGANIZATION_STORE_LOCATIONS], { foreignKey: "organization_type" });
                masterMakerLovs.hasMany(models[config.STOCK_LEDGER_DETAILS], { foreignKey: "transaction_type_id" });
                masterMakerLovs.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "transaction_type_id" });
                masterMakerLovs.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "uom_id" });
                masterMakerLovs.hasMany(models[config.USERS], { foreignKey: "organization_type" });
                masterMakerLovs.hasMany(models[config.REQUEST_APPROVALS], { foreignKey: "transaction_type_id" });
                masterMakerLovs.hasMany(models[config.REQUEST_APPROVALS], { foreignKey: "uom_id" });
                masterMakerLovs.hasMany(models[config.APPROVERS], { foreignKey: "transaction_type_id" });
                masterMakerLovs.hasMany(models[config.APPROVERS], { foreignKey: "organization_type_id" });
                masterMakerLovs.hasMany(models[config.EMAIL_TEMPLATES], { foreignKey: "transaction_type_id" });
                masterMakerLovs.hasMany(models[config.ORGANIZATIONS], { foreignKey: "title" });
                masterMakerLovs.hasMany(models[config.USERS_HISTORY], { foreignKey: "organization_type" });
                masterMakerLovs.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                masterMakerLovs.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                masterMakerLovs.hasMany(models[config.REQUEST_APPROVERS], { foreignKey: "transaction_type_id" });
                masterMakerLovs.hasMany(models[config.MATERIAL_QUANTITIES], { foreignKey: "uom_id", as: "uom" });
                masterMakerLovs.hasMany(models[config.FORM_WISE_TICKET_MAPPINGS], { foreignKey: "form_type_id" });
                masterMakerLovs.hasMany(models[config.FORM_WISE_TICKET_MAPPINGS_HISTORY], { foreignKey: "form_type_id", as: "form_type_obj" });
                masterMakerLovs.hasMany(models[config.BILLING_MATERIAL_DETAILS], { foreignKey: "uom_id" });
            }
        }
    );

    return masterMakerLovs;
};
