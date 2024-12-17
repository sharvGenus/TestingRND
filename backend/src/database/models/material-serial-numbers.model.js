const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const materialSerialNumbers = sequelize.define(
        config.MATERIAL_SERIAL_NUMBERS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            stockLedgerId: {
                type: DataTypes.UUID,
                field: "stock_ledger_id"
            },
            materialId: {
                type: DataTypes.UUID,
                field: "material_id"
            },
            quantity: {
                type: DataTypes.INTEGER,
                field: "quantity",
                allowNull: false
            },
            rate: {
                type: DataTypes.FLOAT,
                field: "rate",
                allowNull: false
            },
            serialNumber: {
                type: DataTypes.STRING,
                field: "serial_number",
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM,
                field: "status",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            prefix: {
                type: DataTypes.STRING,
                field: "prefix"
            },
            suffix: {
                type: DataTypes.STRING,
                field: "suffix"
            },
            rangeFrom: {
                type: DataTypes.INTEGER,
                field: "range_from"
            },
            rangeTo: {
                type: DataTypes.INTEGER,
                field: "range_to"
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
                materialSerialNumbers.belongsTo(models[config.STOCK_LEDGERS], { foreignKey: "stock_ledger_id" });
            }
        }
    );

    return materialSerialNumbers;
};
