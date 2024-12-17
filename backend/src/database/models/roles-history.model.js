const schema = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const rolesHistory = sequelize.define(
        schema.ROLES_HISTORY,
        {
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                field: "description"
            },
            forTicket: {
                type: DataTypes.BOOLEAN,
                field: "for_ticket",
                defaultValue: false
            },
            addTicket: {
                type: DataTypes.BOOLEAN,
                field: "add_ticket",
                defaultValue: false
            },
            isImport: {
                type: DataTypes.BOOLEAN,
                field: "is_import",
                defaultValue: false
            },
            isExport: {
                type: DataTypes.BOOLEAN,
                field: "is_export",
                defaultValue: false
            },
            isUpdate: {
                type: DataTypes.BOOLEAN,
                field: "is_update",
                defaultValue: false
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
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
                field: "deleted_at",
            },
            recordId: {
                type: DataTypes.UUID,
                field: "record_id"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                rolesHistory.belongsTo(models[schema.PROJECTS], { foreignKey: "project_id" });
                rolesHistory.belongsTo(models[schema.USERS], { foreignKey: "created_by", as: "created" });
                rolesHistory.belongsTo(models[schema.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return rolesHistory;
};
