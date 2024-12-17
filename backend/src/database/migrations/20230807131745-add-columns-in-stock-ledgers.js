"use strict";
 
const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.STOCK_LEDGERS,
                "is_cancelled",
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGERS,
                "is_processed",
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGERS_HISTORY,
                "is_cancelled",
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGERS_HISTORY,
                "is_processed",
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.STOCK_LEDGERS, "is_cancelled"),
            queryInterface.removeColumn(config.STOCK_LEDGERS, "is_processed"),
            queryInterface.removeColumn(config.STOCK_LEDGERS_HISTORY, "is_cancelled"),
            queryInterface.removeColumn(config.STOCK_LEDGERS_HISTORY, "is_processed")
        ]);
    }
};