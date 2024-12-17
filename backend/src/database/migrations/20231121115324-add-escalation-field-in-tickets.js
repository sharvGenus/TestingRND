"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.TICKETS,
                "escalation",
                {
                    type: Sequelize.INTEGER,
                    field: "escalation"
                }
            ),
            queryInterface.addColumn(
                config.TICKETS_HISTORY,
                "escalation",
                {
                    type: Sequelize.INTEGER,
                    field: "escalation"
                }
            )
        ]);
    },
    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.TICKETS, "escalation"),
            queryInterface.removeColumn(config.TICKETS_HISTORY, "escalation")
        ]);
    }
};
