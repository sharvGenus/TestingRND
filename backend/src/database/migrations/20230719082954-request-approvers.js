"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            config.REQUEST_APPROVERS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                requestNumber: {
                    type: Sequelize.STRING,
                    field: "requestNumber",
                    allowNull: false
                },
                approverId: {
                    type: Sequelize.STRING,
                    field: "approver_id",
                    allowNull: false
                },
                rank: {
                    type: Sequelize.INTEGER,
                    field: "rank",
                    allowNull: false
                },
                status: {
                    type: Sequelize.ENUM,
                    field: "status",
                    values: ["0", "1"],
                    allowNull: false
                },
                approvedMaterials: {
                    type: Sequelize.ARRAY(Sequelize.JSONB),
                    field: "approved_materials"
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
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(config.REQUEST_APPROVERS);
    }
};