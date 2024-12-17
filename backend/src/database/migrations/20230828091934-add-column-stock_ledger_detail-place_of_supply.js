"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS,
                "place_of_supply",
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "place_of_supply",
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "alternate_uom_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "alternate_quantity"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "alternate_rate"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "alternate_uom_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "alternate_quantity"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "alternate_rate"
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "place_of_supply"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "place_of_supply"
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS,
                "alternate_uom_id",
                {
                    type: Sequelize.UUID,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS,
                "alternate_quantity",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS,
                "alternate_rate",
                {
                    type: Sequelize.DOUBLE,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "alternate_uom_id",
                {
                    type: Sequelize.UUID,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "alternate_quantity",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "alternate_rate",
                {
                    type: Sequelize.DOUBLE,
                    allowNull: true
                }
            )
        ]);
    }
};
