"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.TICKETS,
                "priority",
                {
                    type: Sequelize.STRING,
                    field: "priority"
                }
            ),
            queryInterface.addColumn(
                config.TICKETS_HISTORY,
                "priority",
                {
                    type: Sequelize.STRING,
                    field: "priority"
                }
            )
        ]);
    },
    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.TICKETS, "priority"),
            queryInterface.removeColumn(config.TICKETS_HISTORY, "priority")
        ]);
    }
};
