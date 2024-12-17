const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const devolutionMaterials = sequelize.define(
        config.DEVOLUTION_MATERIALS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            devolutionId: {
                type: DataTypes.UUID,
                field: "devolution_id"
            },
            responseId: {
                type: DataTypes.UUID,
                field: "response_id",
                allowNull: false
            },
            oldSerialNo: {
                type: DataTypes.STRING,
                field: "old_serial_no",
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
                defaultValue: "1",
                allowNull: false
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
                devolutionMaterials.belongsTo(models[config.DEVOLUTIONS], { foreignKey: "devolution_id" });
            }
        }
    );

    return devolutionMaterials;
};