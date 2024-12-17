const { CUSTOMER_DESIGNATIONS,
    CUSTOMER_DEPARTMENTS, CUSTOMER_DEPARTMENTS_HISTORY, USERS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const customerDesignations = sequelize.define(
        CUSTOMER_DESIGNATIONS,
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
            customerDepartmentId: {
                type: DataTypes.UUID,
                field: "customer_department_id"
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
                customerDesignations.belongsTo(models[CUSTOMER_DEPARTMENTS], { foreignKey: "customer_department_id" });
                customerDesignations.belongsTo(models[CUSTOMER_DEPARTMENTS_HISTORY], { foreignKey: "customer_department_id" });
                customerDesignations.belongsTo(models[USERS], { foreignKey: "created_by", as: "created" });
                customerDesignations.belongsTo(models[USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );
    return customerDesignations;
};
