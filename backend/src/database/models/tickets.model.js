const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const tickets = sequelize.define(
        config.TICKETS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            ticketSource: {
                type: DataTypes.STRING,
                field: 'ticket_source'
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id"
            },
            ticketNumber: {
                type: DataTypes.INTEGER,
                field: "ticket_number",
                primaryKey: false

            },
            responseId: {
                type: DataTypes.UUID,
                field: "response_id",
                primaryKey: false

            },
            issueId: {
                type: DataTypes.UUID,
                field: "issue_id"
            },
            subIssueId: {
                type: DataTypes.UUID,
                field: "issue_sub_id"
            },
            assigneeType: {
                type: DataTypes.ENUM,
                field: "assignee_type",
                values: ["supervisor", "installer", "nomc"],
                allowNull: false
            },
            assignBy: {
                type: DataTypes.ENUM,
                field: "assign_by",
                values: ["role", "organization", "gaa"],
                allowNull: false
            },
            supervisorId: {
                type: DataTypes.UUID,
                field: "supervisor_id"
            },
            attachments: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                field: "attachments"
            },
            assigneeId: {
                type: DataTypes.UUID,
                field: "assignee_id"
            },
            description: {
                type: DataTypes.STRING,
                field: "description"
            },
            ticketStatus: {
                type: DataTypes.STRING,
                field: "ticket_status"
            },
            mobileNumber: {
                type: DataTypes.STRING,
                field: "mobile_number"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            assigneeRemarks: {
                type: DataTypes.STRING,
                field: "assignee_remarks"
            },
            projectWiseMappingId: {
                type: DataTypes.UUID,
                field: "project_wise_mapping_id"
            },
            formWiseMappingId: {
                type: DataTypes.UUID,
                field: "form_wise_mapping_id"
            },
            escalation: {
                type: DataTypes.INTEGER,
                field: "escalation"
            },
            priority: {
                type: DataTypes.STRING,
                field: "priority"
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
                tickets.belongsTo(models[config.USERS], { foreignKey: "supervisor_id", as: "supervisor_obj" });
                tickets.belongsTo(models[config.USERS], { foreignKey: "assignee_id", as: "assignee" });
                tickets.belongsTo(models[config.PROJECT_MASTER_MAKERS], { foreignKey: "issue_id", as: "issue" });
                tickets.belongsTo(models[config.PROJECT_MASTER_MAKER_LOVS], { foreignKey: "issue_sub_id", as: "sub_issue" });
                tickets.belongsTo(models[config.PROJECT_WISE_TICKET_MAPPINGS], { foreignKey: "projectWiseMappingId" });
                tickets.belongsTo(models[config.FORM_WISE_TICKET_MAPPINGS], { foreignKey: "formWiseMappingId" });
                tickets.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                tickets.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                tickets.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                tickets.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
                tickets.hasMany(models[config.FORMS_NOTIFICATIONS], { foreignKey: "ticket_id" });
            }
        }
    );

    return tickets;
};
