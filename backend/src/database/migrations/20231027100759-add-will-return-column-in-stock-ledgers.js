"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.STOCK_LEDGERS,
                "will_return",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGERS_HISTORY,
                "will_return",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            )]);
    },
    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.STOCK_LEDGERS, "will_return"),
            queryInterface.removeColumn(config.STOCK_LEDGERS_HISTORY, "will_return")
        ]);
    }
};
