const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const materials = sequelize.define(
        config.MATERIALS,
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
            materialTypeId: {
                type: DataTypes.UUID,
                field: "material_type_id",
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name"
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            sapDescription: {
                type: DataTypes.STRING,
                field: "sap_description"
            },
            description: {
                type: DataTypes.STRING,
                field: "description",
                allowNull: false
            },
            longDescription: {
                type: DataTypes.STRING,
                field: "long_description"
            },
            uomId: {
                type: DataTypes.UUID,
                field: "uom_id",
                allowNull: false
            },
            hsnCode: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "hsn_code"
            },
            attachments: {
                type: DataTypes.STRING,
                field: "attachments"
            },
            isSerialNumber: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                field: "is_serial_number"
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
                materials.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "material_type_id", as: "material_type" });
                materials.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "uom_id", as: "material_uom" });
                materials.hasMany(models[config.REQUEST_APPROVALS], { foreignKey: "material_id" });
                materials.hasMany(models[config.STOCK_LEDGERS], { foreignKey: "material_id" });
                materials.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                materials.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                materials.hasMany(models[config.MATERIAL_QUANTITIES], { foreignKey: "material_id" });
                materials.hasMany(models[config.MATERIAL_QUANTITIES], { foreignKey: "grouped_material_id", as: "groupMaterial" });
            }
        }
    );

    return materials;
};
