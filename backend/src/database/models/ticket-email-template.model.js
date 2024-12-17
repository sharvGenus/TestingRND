const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const ticketEmailTemplates = sequelize.define(
        config.TICKET_EMAIL_TEMPLATES,
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
                field: "project_id",
                allowNull: false
            },
            issueIds: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "issue_ids"
            },
            subIssueIds: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "sub_issue_ids"
            },
            from: {
                type: DataTypes.STRING,
                field: "from",
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
                ticketEmailTemplates.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
            }
        }
    );

    return ticketEmailTemplates;
};