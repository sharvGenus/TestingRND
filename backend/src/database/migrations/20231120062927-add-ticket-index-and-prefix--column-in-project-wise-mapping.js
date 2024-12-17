"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.PROJECT_WISE_TICKET_MAPPINGS,
                "ticket_index",
                {
                    type: Sequelize.INTEGER,
                    field: "ticket_index"
                }
            ),
            queryInterface.addColumn(
                config.PROJECT_WISE_TICKET_MAPPINGS_HISTORY,
                "ticket_index",
                {
                    type: Sequelize.INTEGER,
                    field: "ticket_index"
                }
            ),
            queryInterface.addColumn(
                config.PROJECT_WISE_TICKET_MAPPINGS,
                "prefix",
                {
                    type: Sequelize.STRING,
                    field: "prefix"
                }
            ),
            queryInterface.addColumn(
                config.PROJECT_WISE_TICKET_MAPPINGS_HISTORY,
                "prefix",
                {
                    type: Sequelize.STRING,
                    field: "prefix"
                }
            )
        ]);
    },
    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.PROJECT_WISE_TICKET_MAPPINGS, "ticket_index"),
            queryInterface.removeColumn(config.PROJECT_WISE_TICKET_MAPPINGS_HISTORY, "ticket_index"),
            queryInterface.removeColumn(config.PROJECT_WISE_TICKET_MAPPINGS, "prefix"),
            queryInterface.removeColumn(config.PROJECT_WISE_TICKET_MAPPINGS_HISTORY, "prefix")
        ]);
    }
};
