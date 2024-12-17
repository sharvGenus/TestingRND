const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const billingMaterialDetails = sequelize.define(
        config.BILLING_MATERIAL_DETAILS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            integrationId: {
                type: DataTypes.STRING,
                field: "integration_id"
            },
            billingBasicDetailId: {
                type: DataTypes.UUID,
                field: "billing_basic_detail_id"
            },
            particulars: {
                type: DataTypes.STRING,
                field: "particulars"
            },
            uomId: {
                type: DataTypes.UUID,
                field: "uom_id"
            },
            quantity: {
                type: DataTypes.STRING,
                field: "quantity"
            },
            rate: {
                type: DataTypes.STRING,
                field: "rate"
            },
            tax: {
                type: DataTypes.STRING,
                field: "tax"
            },
            amount: {
                type: DataTypes.STRING,
                field: "amount"
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
                billingMaterialDetails.belongsTo(models[config.BILLING_BASIC_DETAILS], { foreignKey: "billing_basic_detail_id" });
                billingMaterialDetails.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "uom_id" });
            }
        }
    );
    return billingMaterialDetails;
};
