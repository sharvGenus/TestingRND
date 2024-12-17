"use strict";
 
const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS,
                "counter",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "counter",
                {
                    type: Sequelize.INTEGER
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.STOCK_LEDGER_DETAILS, "counter"),
            queryInterface.removeColumn(config.STOCK_LEDGER_DETAILS_HISTORY, "counter")
        ]);
    }
};