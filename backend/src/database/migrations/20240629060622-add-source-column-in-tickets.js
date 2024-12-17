"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.TICKETS,
                "ticket_source",
                {
                    type: Sequelize.STRING,
                    defaultValue: 'WFM'
                }
            ),
            queryInterface.addColumn(
                config.TICKETS_HISTORY,
                "ticket_source",
                {
                    type: Sequelize.STRING,
                    defaultValue: 'WFM'
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.TICKETS, "ticket_source"),
            queryInterface.removeColumn(config.TICKETS_HISTORY, "ticket_source")
        ]);
    }
};