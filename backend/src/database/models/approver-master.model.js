const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const approvers = sequelize.define(
        config.APPROVERS,
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
            transactionTypeId: {
                type: DataTypes.UUID,
                field: "transaction_type_id",
                allowNull: false
            },
            storeId: {
                type: DataTypes.UUID,
                field: "store_id"
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id",
                allowNull: false
            },
            userId: {
                type: DataTypes.UUID,
                field: "user_id",
                allowNull: false
            },
            organizationNameId: {
                type: DataTypes.UUID,
                field: "organization_name_id",
                allowNull: false
            },
            organizationTypeId: {
                type: DataTypes.UUID,
                field: "organization_type_id",
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                field: "email",
                allowNull: false
            },
            mobileNumber: {
                type: DataTypes.STRING,
                field: "mobile_number",
                allowNull: false
            },
            rank: {
                type: DataTypes.INTEGER,
                field: "rank",
                defaultValue: "1"
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
                approvers.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                approvers.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "transaction_type_id", as: "transaction_type" });
                approvers.belongsTo(models[config.ORGANIZATIONS], { foreignKey: "organization_name_id" });
                approvers.belongsTo(models[config.USERS], { foreignKey: "user_id" });
                approvers.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "organization_type_id", as: "organization_type" });
                approvers.belongsTo(models[config.ORGANIZATION_STORES], { foreignKey: "store_id" });
            }
        }
    );

    return approvers;
};