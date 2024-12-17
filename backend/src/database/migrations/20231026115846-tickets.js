"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(config.TICKETS, {
            id: {
                type: Sequelize.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            projectId: {
                type: Sequelize.UUID,
                field: "project_id",
                references: {
                    model: config.PROJECTS,
                    key: "id"
                }
            },
            formId: {
                type: Sequelize.UUID,
                field: "form_id",
                references: {
                    model: config.FORMS,
                    key: "id"
                }
            },
            ticketNumber: {
                type: Sequelize.INTEGER,
                field: "ticket_number",
                primaryKey: false

            },
            responseId: {
                type: Sequelize.UUID,
                field: "response_id",
                primaryKey: false

            },
            issueId: {
                type: Sequelize.UUID,
                field: "issue_id",
                references: {
                    model: config.PROJECT_MASTER_MAKERS,
                    key: "id"
                }
            },
            subIssueId: {
                type: Sequelize.UUID,
                field: "issue_sub_id",
                references: {
                    model: config.PROJECT_MASTER_MAKER_LOVS,
                    key: "id"
                }
            },
            assigneeType: {
                type: Sequelize.ENUM,
                field: "assignee_type",
                values: ["supervisor", "installer", "nomc"],
                allowNull: false
            },
            assignBy: {
                type: Sequelize.ENUM,
                field: "assign_by",
                values: ["role", "organization"],
                allowNull: false
            },
            supervisorId: {
                type: Sequelize.UUID,
                field: "supervisor_id",
                references: {
                    model: config.USERS,
                    key: "id"
                }
            },
            assigneeId: {
                type: Sequelize.UUID,
                field: "assignee_id",
                references: {
                    model: config.USERS,
                    key: "id"
                }
            },
            description: {
                type: Sequelize.STRING,
                field: "description"
            },
            ticketStatus: {
                type: Sequelize.STRING,
                field: "ticket_status"
            },
            mobileNumber: {
                type: Sequelize.STRING,
                field: "mobile_number"
            },
            remarks: {
                type: Sequelize.STRING,
                field: "remarks"
            },
            isActive: {
                type: Sequelize.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            createdBy: {
                type: Sequelize.UUID,
                field: "created_by"
            },
            updatedBy: {
                type: Sequelize.UUID,
                field: "updated_by"
            },
            createdAt: {
                type: Sequelize.DATE,
                field: "created_at",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                field: "updated_at",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE,
                field: "deleted_at"
            }
        });
    },

    down: async function (queryInterface, Sequelize) {
        return queryInterface.dropTable(config.TICKETS);
    }
};
