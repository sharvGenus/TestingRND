const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const emailTemplates = sequelize.define(
        config.EMAIL_TEMPLATES,
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
                field: "transaction_type_id",
                allowNull: false
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id",
                allowNull: false
            },
            organizationId: {
                type: DataTypes.UUID,
                field: "organization_id",
                allowNull: false
            },
            forApprover: {
                type: DataTypes.BOOLEAN,
                field: "for_approver",
                allowNull: false,
                defaultValue: false
            },
            from: {
                type: DataTypes.STRING,
                field: "from",
                allowNull: false
            },
            to: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "to",
                allowNull: false
            },
            cc: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "cc",
                allowNull: false
            },
            bcc: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "bcc",
                allowNull: false
            },
            subject: {
                type: DataTypes.STRING,
                field: "subject",
                allowNull: false
            },
            displayName: {
                type: DataTypes.STRING,
                field: "display_name",
                allowNull: false
            },
            templateName: {
                type: DataTypes.STRING,
                field: "template_name",
                allowNull: false
            },
            body: {
                type: DataTypes.TEXT,
                field: "body",
                allowNull: false
            },
            isAttchmentAvailable: {
                type: DataTypes.BOOLEAN,
                field: "is_attachment_available"
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
                emailTemplates.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "transaction_type_id", as: "transaction_type" });
                emailTemplates.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                emailTemplates.belongsTo(models[config.ORGANIZATIONS], { foreignKey: "organization_id" });
            }
        }
    );

    return emailTemplates;
};