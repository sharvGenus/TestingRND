const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const escalationMatrix = sequelize.define(
        config.ESCALATION_MATRIX,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            emailTemplateId: {
                type: DataTypes.UUID,
                field: "email_template_id"
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
                escalationMatrix.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                escalationMatrix.belongsTo(models[config.TICKET_EMAIL_TEMPLATES], { foreignKey: "email_template_id" });
                escalationMatrix.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                escalationMatrix.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                escalationMatrix.hasMany(models[config.ESCALATION_LEVELS], { foreignKey: "escalation_id" });
            }
        }
    );

    return escalationMatrix;
};
