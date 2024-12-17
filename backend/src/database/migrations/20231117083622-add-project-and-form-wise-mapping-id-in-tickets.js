"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.TICKETS,
                "project_wise_mapping_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.PROJECT_WISE_TICKET_MAPPINGS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.TICKETS_HISTORY,
                "project_wise_mapping_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.PROJECT_WISE_TICKET_MAPPINGS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.TICKETS,
                "assignee_remarks",
                {
                    type: Sequelize.STRING,
                    field: "assignee_remarks"
                }
            ),
            queryInterface.addColumn(
                config.TICKETS_HISTORY,
                "assignee_remarks",
                {
                    type: Sequelize.STRING,
                    field: "assignee_remarks"
                }
            ),
            queryInterface.addColumn(
                config.TICKETS,
                "form_wise_mapping_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.FORM_WISE_TICKET_MAPPINGS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.TICKETS_HISTORY,
                "form_wise_mapping_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.FORM_WISE_TICKET_MAPPINGS,
                        key: "id"
                    }
                }
            )
        ]);
    },
    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.TICKETS, "project_wise_mapping_id"),
            queryInterface.removeColumn(config.TICKETS, "form_wise_mapping_id"),
            queryInterface.removeColumn(config.TICKETS, "assignee_remarks"),
            queryInterface.removeColumn(config.TICKETS_HISTORY, "project_wise_mapping_id"),
            queryInterface.removeColumn(config.TICKETS_HISTORY, "form_wise_mapping_id"),
            queryInterface.removeColumn(config.TICKETS_HISTORY, "assignee_remarks")
        ]);
    }
};
