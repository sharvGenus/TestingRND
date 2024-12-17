"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.DEVOLUTIONS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                devolutionDocNo: {
                    type: Sequelize.STRING,
                    field: "devolution_doc_no",
                    allowNull: false
                },
                projectId: {
                    type: Sequelize.UUID,
                    field: "project_id",
                    allowNull: false,
                    references: {
                        model: config.PROJECTS,
                        key: "id"
                    }
                },
                formId: {
                    type: Sequelize.UUID,
                    field: "form_id",
                    allowNull: false,
                    references: {
                        model: config.FORMS,
                        key: "id"
                    }
                },
                customerId: {
                    type: Sequelize.UUID,
                    field: "customer_id",
                    allowNull: false,
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                },
                customerStoreId: {
                    type: Sequelize.UUID,
                    field: "customer_store_id",
                    allowNull: false,
                    references: {
                        model: config.ORGANIZATION_STORES,
                        key: "id"
                    }
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    field: "quantity",
                    allowNull: false
                },
                devolutionConfigId: {
                    type: Sequelize.UUID,
                    field: "devolution_config_id",
                    allowNull: false,
                    references: {
                        model: config.DEVOLUTION_CONFIGS,
                        key: "id"
                    }
                },
                gaaHierarchy: {
                    type: Sequelize.JSON,
                    field: "gaa_hierarchy"
                },
                attachments: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                    field: "attachments"
                },
                approvalStatus: {
                    type: Sequelize.ENUM,
                    field: "approval_status",
                    values: ["0", "1", "2"],
                    defaultValue: "2",
                    allowNull: false
                },
                approverId: {
                    type: Sequelize.UUID,
                    field: "approver_id",
                    references: {
                        model: config.USERS,
                        key: "id"
                    }
                },
                approvalDate: {
                    type: Sequelize.DATE,
                    field: "approval_date"
                },
                remarks: {
                    type: Sequelize.STRING,
                    field: "remarks"
                },
                isActive: {
                    type: Sequelize.ENUM,
                    field: "is_active",
                    values: ["0", "1"],
                    defaultValue: "1",
                    allowNull: false
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
            }
        );
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(config.DEVOLUTIONS);
    }
};
