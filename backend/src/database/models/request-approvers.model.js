const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const requestApprovers = sequelize.define(
        config.REQUEST_APPROVERS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            transactionTypeId: {
                type: DataTypes.UUID,
                field: "transaction_type_id"
            },
            storeId: {
                type: DataTypes.UUID,
                field: "store_id"
            },
            requestNumber: {
                type: DataTypes.STRING,
                field: "requestNumber",
                allowNull: false
            },
            approverId: {
                type: DataTypes.STRING,
                field: "approver_id",
                allowNull: false
            },
            rank: {
                type: DataTypes.INTEGER,
                field: "rank",
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM,
                field: "status",
                values: ["0", "1"],
                allowNull: false
            },
            approvedMaterials: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
                field: "approved_materials"
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
                requestApprovers.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "transaction_type_id" });
                requestApprovers.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "store_id" });
            }
        }
    );

    return requestApprovers;
};