const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const masterMakerLovsHistory = sequelize.define(
        config.MASTER_MAKER_LOVS_HISTORY,
        {
            masterId: {
                type: DataTypes.UUID,
                field: "master_id"
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
                masterMakerLovsHistory.belongsTo(models[config.MASTER_MAKERS], { foreignKey: "master_id" });
                masterMakerLovsHistory.hasMany(models[config.MATERIALS], { foreignKey: "uom_id" });
                masterMakerLovsHistory.hasMany(models[config.MATERIALS], { foreignKey: "material_type_id" });
                masterMakerLovsHistory.hasMany(models[config.ORGANIZATIONS], { foreignKey: "organization_type_id" });
                masterMakerLovsHistory.hasMany(models[config.ORGANIZATIONS], { foreignKey: "gst_status_id" });
                masterMakerLovsHistory.hasMany(models[config.ORGANIZATIONS], { foreignKey: "payment_term_id" });
                masterMakerLovsHistory.hasMany(models[config.ORGANIZATIONS], { foreignKey: "currency_id" });
                masterMakerLovsHistory.hasMany(models[config.ORGANIZATIONS], { foreignKey: "incoterms_id" });
                masterMakerLovsHistory.hasMany(models[config.FORMS], { foreignKey: "form_type_id" });
                masterMakerLovsHistory.hasMany(models[config.ORGANIZATION_STORES], { foreignKey: "organization_type" });
                masterMakerLovsHistory.hasMany(models[config.ORGANIZATION_STORE_LOCATIONS], { foreignKey: "organization_type" });
                masterMakerLovsHistory.hasMany(models[config.STOCK_LEDGER_DETAILS], { foreignKey: "transaction_type_id" });
                masterMakerLovsHistory.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "transaction_type_id" });
                masterMakerLovsHistory.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "uom_id" });
                masterMakerLovsHistory.hasMany(models[config.USERS], { foreignKey: "organization_type" });
                masterMakerLovsHistory.hasMany(models[config.REQUEST_APPROVALS], { foreignKey: "transaction_type_id" });
                masterMakerLovsHistory.hasMany(models[config.REQUEST_APPROVALS], { foreignKey: "uom_id" });
                masterMakerLovsHistory.hasMany(models[config.APPROVERS], { foreignKey: "transaction_type_id" });
                masterMakerLovsHistory.hasMany(models[config.APPROVERS], { foreignKey: "organization_type_id" });
                masterMakerLovsHistory.hasMany(models[config.EMAIL_TEMPLATES], { foreignKey: "transaction_type_id" });
                masterMakerLovsHistory.hasMany(models[config.ORGANIZATIONS], { foreignKey: "title" });
                masterMakerLovsHistory.hasMany(models[config.USERS_HISTORY], { foreignKey: "organization_type" });
                masterMakerLovsHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                masterMakerLovsHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return masterMakerLovsHistory;
};
