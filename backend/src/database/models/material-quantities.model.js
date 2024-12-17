const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const materialQuantities = sequelize.define(
        config.MATERIAL_QUANTITIES,
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
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            materialId: {
                type: DataTypes.UUID,
                field: "material_id"
            },
            groupedMaterialId: {
                type: DataTypes.UUID,
                field: "grouped_material_id"
                
            },
            uomId: {
                type: DataTypes.UUID,
                field: "uom_id"
            },
            materialQuantity: {
                type: DataTypes.STRING,
                field: "material_quantity",
                defaultValue: "1",
                allowNull: false
            },
            quantity: {
                type: DataTypes.STRING,
                field: "quantity",
                allowNull: false
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
                materialQuantities.belongsTo(models[config.MATERIALS], { foreignKey: "material_id" });
                materialQuantities.belongsTo(models[config.MATERIALS], { foreignKey: "grouped_material_id", as: "groupMaterial" });
                materialQuantities.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "uom_id", as: "uom" });
                materialQuantities.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                materialQuantities.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                materialQuantities.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return materialQuantities;
};
