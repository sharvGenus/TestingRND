const { CUSTOMER_DEPARTMENTS, ORGANIZATIONS, CUSTOMER_DESIGNATIONS, CUSTOMER_DESIGNATIONS_HISTORY, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const customerDepartments = sequelize.define(
        CUSTOMER_DEPARTMENTS,
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
            customerId: {
                type: DataTypes.UUID,
                field: "customer_id"
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,
                field: "code"
            },
            attachments: {
                type: DataTypes.STRING,
                field: "attachments"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
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
                customerDepartments.belongsTo(models[ORGANIZATIONS], { foreignKey: "customer_id" });
                customerDepartments.hasMany(models[CUSTOMER_DESIGNATIONS], { foreignKey: "customer_department_id" });
                customerDepartments.hasMany(models[CUSTOMER_DESIGNATIONS_HISTORY], { foreignKey: "customer_department_id" });
                customerDepartments.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                customerDepartments.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );
    return customerDepartments;
};
