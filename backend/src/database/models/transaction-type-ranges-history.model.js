const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const transactionTypeRangesHistory = sequelize.define(
        config.TRANSACTION_TYPE_RANGES_HISTORY,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            organizationId: {
                type: DataTypes.UUID,
                field: "organization_id",
                references: {
                    model: config.ORGANIZATIONS,
                    key: "id"
                }
            },
            storeId: {
                type: DataTypes.UUID,
                field: "store_id",
                references: {
                    model: config.ORGANIZATION_STORES,
                    key: "id"
                }
            },
            prefix: {
                type: DataTypes.STRING,
                field: "prefix",
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                field: "name"
            },
            transactionTypeIds: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "transaction_type_ids"
            },
            startRange: {
                type: DataTypes.INTEGER,
                field: "start_range",
                allowNull: false
            },
            endRange: {
                type: DataTypes.INTEGER,
                field: "end_range",
                allowNull: false
            },
            effectiveDate: {
                type: DataTypes.DATE,
                field: "effective_date",
                allowNull: false
            },
            endDate: {
                type: DataTypes.DATE,
                field: "end_date"
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
            recordId: {
                type: DataTypes.UUID,
                field: "record_id"
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
                transactionTypeRangesHistory.belongsTo(models[config.ORGANIZATIONS], { foreignKey: "organization_id" });
                transactionTypeRangesHistory.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "store_id" });
                transactionTypeRangesHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                transactionTypeRangesHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return transactionTypeRangesHistory;
};
